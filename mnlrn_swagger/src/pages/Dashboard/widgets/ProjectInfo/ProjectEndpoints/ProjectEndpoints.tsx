import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import StructProject from 'StructReader/StructParts/StructProject';
import StructReader from 'StructReader/StructReader';
import { Card, Label, OutputContainer } from 'components';
import { useMemo } from 'react';
import { Accordion } from 'react-bootstrap';
import { ProjectEndpoint } from './ProjectEndpoint';

export const ProjectEndpoints = ({
  selectedFileName,
  structReader,
  selectedModule
}: {
  selectedFileName: string;
  structReader: StructReader;
  selectedModule: StructModule
}) => {
  return (
    <Accordion>
      {selectedModule.endpoints.map((endpoint, index) => (
        <ProjectEndpoint
          selectedFileName={selectedFileName}
          structReader={structReader}
          module={selectedModule}
          endpoint={endpoint}
          key={index}
        />
      ))}
    </Accordion>
  );
};
