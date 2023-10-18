import { ModuleType } from '../types';
import StructBase from './StructBase';
import StructEndpoint from './StructEndpoint';
import StructGroup from './StructGroup';

class StructModule extends StructBase {
  _endpoints: StructEndpoint[] = [];
  _groups: StructGroup[] = [];
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

    const moduleGroups = moduleData?.groups;
    if (moduleGroups) {
      this._groups = moduleGroups.map(
        (groupData) => new StructGroup(groupData)
      );
    }
  }

  /**
   * Get all module endpoints
   */
  get endpoints(): StructEndpoint[] {
    return this._endpoints;
  }

  /**
   * Get all module groups
   */
  get groups(): StructGroup[] {
    return this._groups;
  }

  /**
   * Get all group endpoints
   */
  public getGroupEndpoints(groupName: string): StructEndpoint[] {
    const endpointList: StructEndpoint[] = [];
    this._endpoints.map((endpoint) => {
      if (endpoint.group == groupName) endpointList.push(endpoint);
    });

    return endpointList;
  }
}

export default StructModule;
