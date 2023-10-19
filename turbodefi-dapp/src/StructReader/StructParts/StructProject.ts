import { ProjectType } from '../types';
import StructBase from './StructBase';

class StructProject extends StructBase {
  private _url: ProjectType['url'] = '';
  /**
   * Constructor
   *
   * @remarks
   * Crete an object where store project data
   *
   * @param projectData - (ProjectType) Proyect data info.
   *
   */
  constructor(projectData: ProjectType) {
    super(projectData);
    this._url = projectData.url ?? this._url;
    this._checkFields();
  }
  /**
   * Get project URL
   */
  get url() {
    return this._url;
  }
}

export default StructProject;
