import fs from "fs";
import StructCustomField from "./StructParts/StructCustomField";
import { DataType, ModuleType, ProjectType } from "./types";
import StructProject from "./StructParts/StructProject";
import StructModule from "./StructParts/StructModule";
import StructEndPoint from "./StructParts/StructEndpoint";

class StructReader {
  private _fileName: string = "";
  private _fullStructFilePath: string = "";
  private _project: StructProject;
  private _customFields: { [key: string]: StructCustomField } = {};
  private _modules: StructModule[];

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
    this._loadProject();
    console.log(this._asterisk);
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
    this._loadModules();
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
    this._loadCustomFields();
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

  executeModule(moduleName: string, ...args: any) {
    this._loadProject();
    this._loadModules();
    const module = this._getModule(moduleName);
    const results = [];
    module.endpoints.map((endpoint) => {});
  }

  //private methods
  private argsToEndpointInput(endpointInput: DataType[], ...args: any){
    const returnList:any[] = [];
    endpointInput.map((inputParam, index) => {
      if (index > args.length) throw new Error("Incorrect number or args");
      const argument = args[index];
      
    });

    return returnList;
  }
  private _getModule(moduleName: string): StructModule {
    this._loadModules();
    this._modules.map((module) => {
      if (module.name == moduleName) {
        return module;
      }
    });
    throw new Error("Module not found");
  }
  private _readFile(): any {
    return JSON.parse(fs.readFileSync(this._fullStructFilePath, "utf8"));
  }

  private _loadProject(): any {
    if (!this._project) {
      this._project = new StructProject(this._readFile()?.project);
    }

    return this._project;
  }

  private _loadCustomFields(): { [key: string]: StructCustomField } {
    if (Object.keys(this._customFields).length == 0) {
      const typesList = this._readFile()?.types;

      const typeNames = Object.keys(typesList);
      typeNames.map((typeName) => {
        this._customFields[typeName] = new StructCustomField(
          typesList[typeName]
        );
      });
    }

    return this._customFields;
  }

  private _loadModules(): StructModule[] {
    if (!this._modules) {
      const modulesList = this._readFile()?.modules;
      this._modules = modulesList.map((module) => new StructModule(module));
    }
    return this._modules;
  }

  private _prettyPrint(msg: string) {
    console.log("** " + msg.padEnd(this._asterisk.length - 5, " ") + "**");
  }
}

export default StructReader;
