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
  /**
   * Docs can contain info
   */
  docs?: string[];
};

type ProjectType = BaseStructType & {
  url: string
};

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
  /**
   * For bools
   */
  isNFT?: boolean;
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
  /**
   * This is the endpoint to call. if is empty, the name will be used
   */
  endpoint?: string;
  /**
   * Acts equal to readOnly:
   */
  mutability?: string;
  /**
   * Indicates that this endpoint is not implemented
   */
  notImplemented?: boolean;
};

type ModuleType = BaseStructType & {
  /**
   * List of endpoints to execute
   */
  endpoints?: EndpointType[];
};

type TxInfo = {
  address?: string,
  nonce?: number,
  gasLimit?: number
}

export type {
  BaseStructType,
  ProjectType,
  ModuleType,
  EndpointType,
  CustomType,
  DataType,
  TxInfo
};
