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
  | "Address"
  | "BigUint"
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "usize"
  | "number"
  | "bytes";

type VariantType = {
  /**
   * Name of the variant
   */
  name: string;
  /**
   * Numeric representation of the variant, is the value that comes from SC
   */
  discriminant: string;
};

type CustomType = BaseStructType & {
  /**
   * Type of data
   */
  type: "struct" | "enum";
  /**
   * For structs
   */
  fields?: DataType[];
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
  /**
   * Is this field a balance?
   */
  balance?: boolean;
  /**
   * Token to use
   */
  token?: string;
  /**
   * Value of this data
   */
  value:any;
};

type EndpointType = BaseStructType & {
  /**
   * Input data
   */
  inputs?: DataType[];
  /**
   * Output data
   */
  outputs?: DataType[];
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

export type {
  BaseStructType,
  ProjectType,
  ModuleType,
  EndpointType,
  CustomType,
  DataType
};
