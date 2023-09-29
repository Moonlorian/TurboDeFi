import StructModule from 'StructReader/StructParts/StructModule';
import { Accordion } from 'react-bootstrap';
import { ProjectEndpoint } from './ProjectEndpoint';

export const ProjectEndpoints = ({
  selectedModule
}: {
  selectedModule: StructModule
}) => {
  return (
    <Accordion>
      {selectedModule.endpoints.map((endpoint, index) => (
        <ProjectEndpoint
          module={selectedModule}
          endpoint={endpoint}
          key={index}
        />
      ))}
    </Accordion>
  );
};
