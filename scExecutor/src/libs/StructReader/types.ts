type BaseStructType = {
  /**
   * Name, will be used as ID
   */
  name: string;
  /**
   * Short description
   */
  description: string;
  /**
   * Label: Human friendly name
   */
  label: string;
  /**
   * Token to use. is optional
   */
  token?: string;
  /**
   * Address of the contract. Is optional
   */
  address?: string;
};

type ProjectType = BaseStructType;

type BaseRustType =
  | "ManagedAddress"
  | "ManagedBuffer"
  | "BigUint"
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "usize"
  | "number"
  | "string";

type FieldType = {
  /**
   * Field's ID
   */
  name: string;
  /**
   * field's type
   */
  type: BaseRustType;
  /**
   * Is this field a balance?
   */
  balance?: boolean;
  /**
   * Token to use
   */
  token?: string;
};

type VariantType = {
  /**
   * Name of the variant
   */
  name: string;
  /**
   * Numeric representatio of the variant, is the value that comes from SC
   */
  discriminant: string;
};

type CustomType = {
  /**
   * Type of data
   */
  type: "struct" | "enum";
  /**
   * For structs
   */
  fields?: FieldType[];
  /**
   * For enum
   */
  variants?: VariantType[];
};

type DataType = {
  /**
   * ID of field.
   */
  name?: string;
  /**
   * Name in human readable format
   */
  label?: string;
  /**
   * type of data
   */
  type: BaseRustType | string;
};

type EndpointType = BaseStructType & {
  /**
   * Input data
   */
  input?: DataType[];
  /**
   * Output data
   */
  output?: DataType[];
  /**
   * readonly: true = view | false = endpoint
   */
  readOnly?: boolean;
  /**
   * function returns a balance
   */
  balance?: boolean;
};

type ModuleType = BaseStructType & {
  /**
   * List of endpoints to execute
   */
  endpoints?: EndpointType[];
};

export { BaseStructType, ProjectType, ModuleType, EndpointType, CustomType, DataType };
