import StructBase from "./StructBase";
import { EndpointType } from "../types";

class StructEndpoint extends StructBase {
  private _input: EndpointType["input"];
  private _output: EndpointType["output"];
  private _balance: EndpointType["balance"];
  private _readOnly: EndpointType["readOnly"];
  /**
   * Constructor
   *
   * @remarks
   * Constructor for endpoint object
   *
   * @param endpointData - (EndpointType) Endpoint data necesary to instantiate this class .
   *
   */
  constructor(endpointData: EndpointType) {
    super(endpointData);
    
    this._input = endpointData.input;
    this._output = endpointData.output;
    this._balance = endpointData.balance;
    this._readOnly = endpointData.readOnly;

    this._checkFields()
  }

  /**
   * Get endpoint inpput data
   */
  get input() {
    return this._input;
  }
  /**
   * Get endpoint output data
   */
  get output() {
    return this._output;
  }
  /**
   * Get endpoint balance data
   */
  get balance() {
    return this._balance;
  }
  /**
   * Get if endpoint is readonly or not
   */
  get readonly() {
    return this._readOnly;
  }

  _checkFields(): void {
    if (!this.name){
      throw new Error("Every endpoint needs a function name");
    }
  }
}

export default StructEndpoint;
