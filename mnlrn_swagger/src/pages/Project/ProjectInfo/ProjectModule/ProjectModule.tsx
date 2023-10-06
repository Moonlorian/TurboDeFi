import StructModule from 'StructReader/StructParts/StructModule';
import { Card } from 'components';
import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from '../ProjectEndpoint/ProjectEndpointForm';

export const ProjectModule = ({
  module,
  structReader
}: {
  module: StructModule;
  structReader: StructReader;
}) => {
  return (
    <Card
      className='flex-2'
      key={'projectModule_' + module.name}
      title={module.label || module.name}
      description={module.description}
      reference={''}
    >
      {module.endpoints.map((endpoint, index) => (
        <ProjectEndpointForm
          module={module}
          endpoint={structReader.getModuleEndpoint(module.name, endpoint.name)}
          structReader={structReader}
          key={index}
        />
      ))}
    </Card>
  );
};
