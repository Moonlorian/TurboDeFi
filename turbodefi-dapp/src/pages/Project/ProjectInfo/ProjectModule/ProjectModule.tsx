import StructModule from 'StructReader/StructParts/StructModule';
import { Card } from 'components';
import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from '../ProjectEndpoint/ProjectEndpointForm';
import { Fragment } from 'react';

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
      <div className='grid md:gap-5 gap-[0.5rem] grid-cols-1 sm:grid-cols-2 auto-rows-min sm:auto-rows-fr'>
        {module.groups.map((group, index) => (
          <div className='w-full border rounded-lg' key={index}>
            {module.getGroupEndpoints(group.name).map((endpoint, index) => (
              <ProjectEndpointForm
                module={module}
                endpoint={structReader.getModuleEndpoint(
                  module.name,
                  endpoint.name
                )}
                structReader={structReader}
                key={index}
                className='w-full'
              />
            ))}
          </div>
        ))}
        {module.endpoints
          .filter((endpoint) => !endpoint.group)
          .map((endpoint, index) => (
            <div className='w-full' key={index}>
              <ProjectEndpointForm
                module={module}
                endpoint={structReader.getModuleEndpoint(
                  module.name,
                  endpoint.name
                )}
                structReader={structReader}
                key={index}
                className='border h-full'
              />
            </div>
          ))}
      </div>
    </Card>
  );
};
