import {
  Address,
  AddressValue,
  BigUIntValue,
  PrimitiveValue,
  StringValue,
  U16Value,
  U32Value,
  U64Value,
  U8Value,
} from "@multiversx/sdk-core/out";
import StructCustomField from "./StructParts/StructCustomField";
import { DataType } from "./types";

class DataTypeConverter {
  private _customFields: { [key: string]: StructCustomField } = {};
  private _customFieldsIndex: string[] = [];

  /**
   * Create a data type converter
   *
   * @remarks
   * Create a converter that belongs to a whole json file
   *
   * @params
   * customFields (optional) Custum fields struct used to convert complex structures
   *
   */
  constructor(customFields?: { [key: string]: StructCustomField }) {
    if (customFields) {
      this._customFields = customFields;
      this._customFieldsIndex = Object.keys(customFields);
    }
  }

  /**
   * Generates an array with args converted to endpoint input types
   *
   * @remarks
   * Can receive a variable number of params
   *
   * @params
   * endpointInput: list of endpoint inputs
   * args: input data
   *
   */
  argsToEndpointInput(endpointInput: DataType[], ...args: any) {
    const receivedArgs = args;
    const returnList: any[] = [];
    endpointInput.map((inputParam, index) => {
      if (index > endpointInput.length)
        throw new Error("Incorrect number or args");
      returnList.push(...this._convertDataIn(receivedArgs, inputParam));
    });

    return returnList;
  }

  private _convertDataIn(dataIn: any[], type: DataType): PrimitiveValue[] {
    if (this._customFieldsIndex.includes(type.type)) {
      //TODO ==>  if data type is in custom fields is necessary to iterate over fields and convert them.
      return [new StringValue("TODO")];
    } else {
      const inputParam = dataIn[0];
      dataIn.splice(0, 1);
      switch (type.type) {
        case "Address":
          return [new AddressValue(new Address(inputParam))];
        case "BigUit":
          return [new BigUIntValue(inputParam)];
        case "u8":
          return [new U8Value(inputParam)];
        case "u16":
          return [new U16Value(inputParam)];
        case "u32":
          return [new U32Value(inputParam)];
        case "u64":
          return [new U64Value(inputParam)];
        default:
          return [new StringValue(inputParam)];
      }
    }
  }

  generateFlatParameterList(originalList: DataType[]): DataType[] {
    const newList: DataType[] = [];
    originalList.map((dataElement) => {
      if (
        this._customFieldsIndex.includes(dataElement.type) &&
        this._customFields[dataElement.type].type == "struct"
      ) {
        newList.push(
          ...this.generateFlatParameterList(
            this._customFields[dataElement.type].fields || []
          )
        );
      } else {
        newList.push(dataElement);
      }
    });
    return newList;
  }
  
  private _generateStructuredData(data: DataType): DataType[] {
    if (this._customFieldsIndex.includes(data.type)) {
      const complexData = this._customFields[data.type];
      if (complexData.type == "struct") {
        return complexData.fields || [];
      }
    }
    return [];
  }
}

export default DataTypeConverter;
