import { CustomType } from "../types";
import StructBase from "./StructBase";

class StructCustomField extends StructBase{
  private _type: CustomType["type"];
  private _fields: CustomType["fields"];
  private _variants: CustomType["variants"];
  /**
   * Constructor
   *
   * @remarks
   * Create a new Custom field for the struct reader
   *
   * @param typeInfo - (CustomType) The type of field that this object represents.
   *
   */
  constructor(typeInfo: CustomType) {
    super(typeInfo);
    this._type = typeInfo.type;
    this._fields = typeInfo.fields;
    this._variants = typeInfo.variants;
  }

  /**
   * Get field type
   */
  get type() {
    return this._type;
  }

  /**
   * Get get struct fields
   */
  get fields() {
    return this._fields;
  }

  /**
   * Get get enum variants
   */
  get variants() {
    return this._variants;
  }
}

export default StructCustomField;
