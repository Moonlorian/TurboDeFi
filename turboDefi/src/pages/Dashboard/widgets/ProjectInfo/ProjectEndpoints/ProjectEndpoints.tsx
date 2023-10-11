import StructModule from 'StructReader/StructParts/StructModule';
import { Accordion } from 'react-bootstrap';
import { ProjectEndpoint } from './ProjectEndpoint';
import { useContext } from 'react';
import { DashBorardStructReaderContext } from 'pages/Dashboard/Dashboard';

export const ProjectEndpoints = ({
  selectedModule
}: {
  selectedModule: StructModule;
}) => {
  const dashBorardStructReaderContext = useContext(
    DashBorardStructReaderContext
  );

  return (
    <Accordion>
      {selectedModule.endpoints.map((endpoint, index) => (
        <ProjectEndpoint
          module={selectedModule}
          endpoint={dashBorardStructReaderContext.structReader.getModuleEndpoint(
            selectedModule.name,
            endpoint.name
          )}
          key={index}
        />
      ))}
    </Accordion>
  );
};
