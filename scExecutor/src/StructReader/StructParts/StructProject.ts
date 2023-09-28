import { ProjectType } from "../types";
import StructBase from "./StructBase";

class StructProject extends StructBase{
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
    this._checkFields();
  }
}

export default StructProject;
