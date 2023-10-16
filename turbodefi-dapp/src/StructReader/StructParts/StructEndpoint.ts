import StructBase from './StructBase';
import { DataType, EndpointType } from '../types';

class StructEndpoint extends StructBase {
  private _inputs: EndpointType['inputs'] = [];
  private _outputs: EndpointType['outputs'] = [];
  private _balance: EndpointType['balance'] = false;
  private _readOnly: EndpointType['readOnly'] = false;
  private _endpoint: EndpointType['endpoint'] = '';
  private _notImplemented: EndpointType['notImplemented'] = false;
  private _payableInTokens: EndpointType['payableInTokens'] = [];
  private _buttonLabel: EndpointType['buttonLabel'] = '';
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
    this._readOnly =
      endpointData.readOnly ||
      endpointData.mutability == 'readonly' ||
      this._readOnly;
    this._endpoint = endpointData.endpoint ?? this._endpoint;
    this._notImplemented = endpointData.notImplemented ?? this._notImplemented;
    this._payableInTokens =
      endpointData.payableInTokens ?? this._payableInTokens;
    this._buttonLabel = endpointData.buttonLabel ?? this._buttonLabel;

    this._checkFields();
  }

  /**
   * Get endpoint inpput data
   */
  get inputs() {
    //Be carefull, array must be colned to avoid reference
    const currentInputs = [...(this._inputs || [])];
    if (
      currentInputs &&
      this._payableInTokens &&
      this._payableInTokens.length > 0
    ) {
      currentInputs.unshift({
        name: 'paymentToken_0',
        label: 'Token',
        type: 'TokenIdentifier',
        value: undefined,
        token: this._payableInTokens.filter((tokenId) => tokenId != '*' )
      });
      currentInputs.unshift({
        name: 'paymentAmount_0',
        label: 'Amount',
        type: 'BigUint',
        value: undefined,
        balance: true,
        token:"paymentToken_0",
      });
    }
    return currentInputs;
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
  /**
   * Get if this endpoint is not implemented
   */
  get notImplemented() {
    return this._notImplemented;
  }

  /**
   * Is this endpoint a payable endpoint?
   */
  get payableInTokens() {
    return this._payableInTokens;
  }

  /**
   * Get the label to show in the button to execute the endpoint
   */
  get buttonLabel() {
    return this._buttonLabel;
  }

  _checkFields(): void {
    if (!this.name) {
      throw new Error('Every endpoint needs a function name');
    }
  }
}

export default StructEndpoint;
