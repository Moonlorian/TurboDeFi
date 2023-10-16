import { ModuleType } from '../types';
import StructBase from './StructBase';
import StructEndpoint from './StructEndpoint';

class StructModule extends StructBase {
  _endpoints: StructEndpoint[] = [];
  /**
   * Constructor
   *
   * @remarks
   * This method belongs to StructReader class
   *
   * @param fileName - (string) the contract structure file name. No need to include extension. File must be stored in contractStructureFiles folder.
   *
   */
  constructor(moduleData: ModuleType) {
    super(moduleData);
    this._checkFields();

    const endpointsList = moduleData?.endpoints;
    if (endpointsList) {
      this._endpoints = endpointsList.map(
        (endpotintData) => new StructEndpoint(endpotintData)
      );
    }
  }

  /**
   * Get all module endpoints
   */
  get endpoints(): StructEndpoint[] {
    return this._endpoints;
  }
}

export default StructModule;
