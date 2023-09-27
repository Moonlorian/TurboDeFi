import StructCustomField from "./StructParts/StructCustomField";
import { DataType, ModuleType, ProjectType } from "./types";

class DataTypeConverter {
  private _customFields: { [key: string]: StructCustomField } = {};
  private _customFieldsIndex: string[] = [];

  constructor(customFields?: { [key: string]: StructCustomField }) {
    if (customFields){
        this._customFields = customFields;
        this._customFieldsIndex = Object.keys(customFields);
    }
  }

  convertDataIn(dataIn: any[], type: DataType): any {
    if (this._customFieldsIndex.includes(type.type)){

    }
  }
}
