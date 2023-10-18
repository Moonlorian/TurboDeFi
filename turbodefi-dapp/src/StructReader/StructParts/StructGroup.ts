import StructBase from './StructBase';
import { DataType, EndpointType } from '../types';

class StructGroup extends StructBase {
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
    
    this._checkFields();
  }

  
  _checkFields(): void {
    if (!this.name) {
      throw new Error('Every group needs a group name');
    }
  }
}

export default StructGroup;
