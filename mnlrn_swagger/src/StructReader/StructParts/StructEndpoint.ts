import StructBase from './StructBase';
import { EndpointType } from '../types';

class StructEndpoint extends StructBase {
  private _inputs: EndpointType['inputs'] = [];
  private _outputs: EndpointType['outputs'] = [];
  private _balance: EndpointType['balance'] = false;
  private _readOnly: EndpointType['readOnly'] = true;
  private _endpoint: EndpointType['endpoint'] = '';
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
    this._inputs = endpointData.inputs ?? this._inputs;
    this._outputs = endpointData.outputs ?? this._outputs;
    this._balance = endpointData.balance ?? this._balance;
    this._readOnly = endpointData.readOnly || endpointData.mutability== "readonly" || this._readOnly;
    this._endpoint = endpointData.endpoint ?? this._endpoint;

    this._checkFields();
  }

  /**
   * Get endpoint inpput data
   */
  get inputs() {
    return this._inputs;
  }
  /**
   * Get endpoint output data
   */
  get outputs() {
    return this._outputs;
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

  /**
   * Get the function name (endpoint name)
   */
  get endpoint() {
    return this._endpoint;
  }

  _checkFields(): void {
    if (!this.name) {
      throw new Error('Every endpoint needs a function name');
    }
  }
}

export default StructEndpoint;
