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
      <div className='d-flex container'>
        <div className='row w-100'>
          {module.endpoints.map((endpoint, index) => (
            <div className='col-lg-6 col-md-12 my-2'>
              <ProjectEndpointForm
                module={module}
                endpoint={structReader.getModuleEndpoint(module.name, endpoint.name)}
                structReader={structReader}
                key={index}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
