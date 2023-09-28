import fs from "fs";
import StructCustomField from "./StructParts/StructCustomField";
import StructProject from "./StructParts/StructProject";
import StructModule from "./StructParts/StructModule";
import StructEndPoint from "./StructParts/StructEndpoint";

class StructReader {
  private _fileName: string = "";
  private _fullStructFilePath: string = "";
  private _project: StructProject | undefined;
  private _customFields: { [key: string]: StructCustomField } = {};
  private _modules: StructModule[] = [];

  private _asterisk = "*****************************************";
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
    this._fileName = fileName.endsWith(".json") ? fileName : fileName + ".json";
    this._fullStructFilePath =
      __dirname + "/../../contractStructFiles/" + this._fileName;
    if (!fs.existsSync(this._fullStructFilePath)) {
      throw new Error("Struct file not found");
    }
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
    this.getProject();

    console.log(this._asterisk);
    if (!this._project) throw new Error("Empty project");

    if (this._project.name) this._prettyPrint("Name : " + this._project.name);
    if (this._project.label)
      this._prettyPrint("Label : " + this._project.label);
    if (this._project.token)
      this._prettyPrint("Token : " + this._project.token);
    if (this._project.address)
      this._prettyPrint("Address : " + this._project.address);

    console.log(this._asterisk);
    if (this._project.description)
      console.log("\n" + this._project.description + "\n");
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
    console.log(this._asterisk);
    this._prettyPrint("Modules found: " + this._modules.length);

    this._modules.map((module) => {
      this._prettyPrint(
        module.name + " -endpoints (" + module.endpoints.length + "):"
      );
      module.endpoints.map((endpoint) => {
        this._prettyPrint("--->" + endpoint.name);
      });
    });
    console.log(this._asterisk);
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
    const asterisk = "*****************************************";
    console.log(asterisk);
    const fieldNames = Object.keys(this._customFields);
    this._prettyPrint("Custom types found: " + fieldNames.length);

    fieldNames.map((fieldName) => {
      this._prettyPrint(
        fieldName + " is " + this._customFields[fieldName].type + " type"
      );
    });

    console.log(asterisk);
  }

  /**
   * Get all endpoints from a module
   *
   * @remarks
   * Retuns all module's endpoints
   *
   */
  getModuleEndpoints(moduleName: string): StructEndPoint[] {
    this.getProject();
    this.getModules();
    this.getCustomFields();
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
    this.getProject();
    this.getModules();
    this.getCustomFields();
    const module = this._getModule(moduleName);
    if (module.endpoints) {
      for (let i = 0; i < module.endpoints.length; i++) {
        if (module.endpoints[i].name == endpointName) {
          const currentEndPoint = module.endpoints[i];
          const sc = this._getSC(this.getProject(), module, currentEndPoint);
          const token = this._getToken(
            this.getProject(),
            module,
            currentEndPoint
          );
          return new StructEndPoint({
            name: currentEndPoint.name,
            description: currentEndPoint.description,
            label: currentEndPoint.label,
            token: token,
            address: sc,
            inputs: currentEndPoint.inputs,
            outputs: currentEndPoint.outputs,
            readOnly: currentEndPoint.readonly,
            balance: currentEndPoint.balance,
          });
        }
      }
    }
    throw new Error("Endpoint not found");
  }

  /**
   * Get project information
   *
   * @remarks
   * Retuns project information
   *
   */
  getProject(): any {
    if (!this._project) {
      this._project = new StructProject(this._readFile()?.project);
    }

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
    if (Object.keys(this._customFields).length == 0) {
      const typesList = this._readFile()?.types;

      const typeNames = Object.keys(typesList);
      typeNames.map((typeName) => {
        this._customFields[typeName] = new StructCustomField(
          typesList[typeName]
        );
      });
    }

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
    if (!this._modules.length) {
      const modulesList = this._readFile()?.modules;
      this._modules = modulesList.map(
        (module: any) => new StructModule(module)
      );
    }
    return this._modules;
  }

  //private methods
  private _getSC(
    project: StructProject,
    module: StructModule,
    endpoint: StructEndPoint
  ): string {
    if (endpoint.address) return endpoint.address;
    if (module.address) return module.address;
    return project.address || "";
  }

  private _getToken(
    project: StructProject,
    module: StructModule,
    endpoint: StructEndPoint
  ): string {
    if (endpoint.token) return endpoint.token;
    if (module.token) return module.token;
    return project.token || "";
  }

  private _getModule(moduleName: string): StructModule {
    this.getModules();
    for (let i = 0; i < this._modules.length; i++) {
      if (this._modules[i].name == moduleName) {
        return this._modules[i];
      }
    }
    throw new Error("Module not found");
  }
  private _readFile(): any {
    return JSON.parse(fs.readFileSync(this._fullStructFilePath, "utf8"));
  }

  private _prettyPrint(msg: string) {
    console.log("** " + msg.padEnd(this._asterisk.length - 5, " ") + "**");
  }
}

export default StructReader;
