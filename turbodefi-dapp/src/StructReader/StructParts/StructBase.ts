import { BaseStructType, EndpointType } from '../types';

class StructBase {
  private _name: BaseStructType['name'];
  private _description: BaseStructType['description'];
  private _label: BaseStructType['label'];
  private _token: BaseStructType['token'];
  private _address: BaseStructType['address'];
  /**
   * Constructor
   *
   * @remarks
   * This is the base data necesary in each structure types. If the mandatory ones are emtpy, it throw an error
   *
   * @param endpointData - (StructBase) Minimal base data of each struct nodes.
   *
   */
  constructor(baseData: BaseStructType) {
    this._name = baseData.name;
    this._description = baseData.description || baseData.docs?.join("\n") || '';
    this._label = baseData.label;
    this._token = baseData.token;
    this._address = baseData.address;
  }

  /**
   * Get name
   */
  get name(): string {
    return this._name;
  }

  /**
   * Get description
   */
  get description(): string {
    return this._description;
  }

  /**
   * Get label
   */
  get label(): string {
    return this._label;
  }

  /**
   * Get token
   */
  get token(): string | undefined {
    return this._token;
  }

  /**
   * Get address
   */
  get address(): string | undefined {
    return this._address;
  }

  /**
   * Converts this struct into json object
   */
  toJson(): any {
    const fieldsList = Object.keys(this);
    const values = Object.values(this);
    const jsonObject: { [key: string]: any } = {};
    fieldsList.map((field: string, index: number) => {
      if (values[index] != undefined)
        jsonObject[field.replace(/^_/, '')] = values[index];
    });
    return jsonObject;
  }
  _checkFields() {
    if (!this._name) {
      throw new Error('Name field is empty');
    }
    if (!this._description) {
      throw new Error('Description field is empty');
    }
    if (!this._label) {
      throw new Error('Label field is empty');
    }
  }
}

export default StructBase;
