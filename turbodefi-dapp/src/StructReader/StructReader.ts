import StructCustomField from './StructParts/StructCustomField';
import StructProject from './StructParts/StructProject';
import StructModule from './StructParts/StructModule';
import StructEndPoint from './StructParts/StructEndpoint';
import axios from 'axios';
import PrettyPrinter from './PrettyPrinter';
import { EndpointDefinition } from '@multiversx/sdk-core/out';

class StructReader {
  private _fileName: string;
  //private _fullStructFilePath: string;
  private _project: StructProject | undefined = undefined;
  private _customFields: { [key: string]: StructCustomField } = {};
  private _modules: StructModule[] = [];
  private _loaded: boolean = false;

  /**
   * Constructor
   *
   * @remarks
   * This method belongs to StructReader class
   *
   * @param fileName - (string) the contract structure file name. No need to include extension. File must be stored in contractStructureFiles folder.
   *
   */
  constructor(fileName: string) {
    this._fileName = fileName.endsWith('.json') ? fileName : fileName + '.json';
  }

  /**
   * Load the json name asynchronously
   *
   * @remarks
   * load Json
   *
   */
  async load() {
    return axios
      .get(this._fileName.toLowerCase())
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        this._loadProject(json);
        this._loadModules(json);
        this._loadCustomFields(json);
        this._loaded = true;
        return this;
      });
  }

  /**
   * Indicates if a file has beel loaded
   *
   * @remarks
   * check if is loaded
   *
   */
  isLoaded() {
    return this._loaded;
  }

  /**
   * get file name
   *
   * @remarks
   * Get struct file name
   *
   */
  get fileName(): string {
    return this._fileName;
  }

  /**
   * info
   *
   * @remarks
   * Show struct info
   *
   */
  info(): void {
    PrettyPrinter.printAsterisk();
    PrettyPrinter.printAsterisk();
    if (!this._project) throw new Error('Empty project');

    if (this._project.name)
      PrettyPrinter.prettyLog('Name : ' + this._project.name);
    if (this._project.label)
      PrettyPrinter.prettyLog('Label : ' + this._project.label);
    if (this._project.token)
      PrettyPrinter.prettyLog('Token : ' + this._project.token);
    if (this._project.address)
      PrettyPrinter.prettyLog('Address : ' + this._project.address);

    PrettyPrinter.printAsterisk();
    if (this._project.description)
      console.log('\n' + this._project.description + '\n');
  }

  /**
   * modules info
   *
   * @remarks
   * Show modules information
   *
   */
  modulesInfo(): void {
    this.getModules();
    PrettyPrinter.printAsterisk();
    PrettyPrinter.prettyLog('Modules found: ' + this._modules.length);

    this._modules.map((module) => {
      PrettyPrinter.prettyLog(
        module.name + ' -endpoints (' + module.endpoints.length + '):'
      );
      module.endpoints.map((endpoint) => {
        PrettyPrinter.prettyLog('--->' + endpoint.name);
      });
    });
    PrettyPrinter.printAsterisk();
  }

  /**
   * Custom fields info
   *
   * @remarks
   * Show information about the custom fields declarated in the file
   *
   */
  customFieldsInfo(): void {
    this.getCustomFields();
    PrettyPrinter.printAsterisk();
    const fieldNames = Object.keys(this._customFields);
    PrettyPrinter.prettyLog('Custom types found: ' + fieldNames.length);

    fieldNames.map((fieldName) => {
      PrettyPrinter.prettyLog(
        fieldName + ' is ' + this._customFields[fieldName].type + ' type'
      );
    });

    PrettyPrinter.printAsterisk();
  }

  /**
   * Get all endpoints from a module
   *
   * @remarks
   * Retuns all module's endpoints
   *
   */
  getModuleEndpoints(moduleName: string): StructEndPoint[] {
    const module = this._getModule(moduleName);
    return module.endpoints;
  }

  /**
   * Get a specific endpoint
   *
   * @remarks
   * Retuns a module endpoint
   *
   */
  getModuleEndpoint(moduleName: string, endpointName: string): StructEndPoint {
    if (!this._project) throw new Error('Project is not defined');
    const module = this._getModule(moduleName);
    if (module.endpoints) {
      for (let i = 0; i < module.endpoints.length; i++) {
        if (module.endpoints[i].name == endpointName) {
          const currentEndPoint = module.endpoints[i];
          const sc = this._getSC(this._project, module, currentEndPoint);
          const token = this._getToken(this._project, module, currentEndPoint);
          return new StructEndPoint({
            ...currentEndPoint.toJson(),
            token: token,
            address: sc
          });
        }
      }
    }
    throw new Error('Endpoint not found');
  }

  /**
   * Get project information
   *
   * @remarks
   * Retuns project information
   *
   */
  getProject(): any {
    return this._project;
  }

  /**
   * Get custom fields
   *
   * @remarks
   * Retuns all the custom fields
   *
   */
  getCustomFields(json = false): { [key: string]: StructCustomField } {
    if (json) {
      const jsonObject: { [key: string]: any } = {};
      const fieldsList = Object.keys(this._customFields);
      fieldsList.map(
        (fieldName: string) =>
          (jsonObject[fieldName] = this._customFields[fieldName].toJson())
      );
      return jsonObject;
    }
    return this._customFields;
  }

  /**
   * Get all modules
   *
   * @remarks
   * Retuns all modules
   *
   */
  getModules(): StructModule[] {
    return this._modules;
  }

  /**
   * Get all modules
   *
   * @remarks
   * Retuns a module with the name given
   *
   */
  getModule(moduleName: string): StructModule {
    return this._getModule(moduleName);
  }

  //private methods
  private _loadProject(json: any) {
    this._project = new StructProject(json?.project);
  }
  private _loadModules(json: any) {
    const modulesList = json?.modules;
    //Let's check if there is duplicated modules:
    const uniqueModulesObject: { [key: string]: string } = {};
    modulesList.map((module: any) => {
      uniqueModulesObject[module.name] = module.name;
    });

    if (modulesList.length != Object.keys(uniqueModulesObject).length) {
      throw new Error('Duplicated module names');
    }
    //Let's check if there is duplicated endpoints:
    modulesList.map((module: any) => {
      const uniqueEndpointObject: { [key: string]: string } = {};
      module?.endpoints.map((endpoint: any) => {
        uniqueEndpointObject[endpoint.name] = endpoint.name;
      });
      if (module.endpoints.length != Object.keys(uniqueEndpointObject).length) {
        throw new Error('Duplicated endpoint names');
      }
    });

    this._modules = modulesList.map((module: any) => new StructModule(module));
  }
  private _loadCustomFields(json: any) {
    const typesList = json?.types;

    if (typesList) {
      const typeNames = Object.keys(typesList);
      typeNames.map((typeName) => {
        this._customFields[typeName] = new StructCustomField(
          typesList[typeName]
        );
      });
    }
  }

  private _getSC(
    project: StructProject,
    module: StructModule,
    endpoint: StructEndPoint
  ): string {
    if (endpoint.address) return endpoint.address;
    if (module.address) return module.address;
    return project.address || '';
  }

  private _getToken(
    project: StructProject,
    module: StructModule,
    endpoint: StructEndPoint
  ): string {
    if (endpoint.token) return endpoint.token;
    if (module.token) return module.token;
    return project.token || '';
  }

  private _getModule(moduleName: string): StructModule {
    this.getModules();
    for (let i = 0; i < this._modules.length; i++) {
      if (this._modules[i].name == moduleName) {
        return this._modules[i];
      }
    }
    throw new Error(`Module ${moduleName} not found`);
  }

  //TODO Load file from a folder
  private _readFile(): any {
    //return JSON.parse(fs.readFileSync(this._fullStructFilePath, 'utf8'));
  }
}

export default StructReader;
