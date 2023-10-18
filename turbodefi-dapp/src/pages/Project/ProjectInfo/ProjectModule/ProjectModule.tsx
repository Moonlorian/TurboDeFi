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
      <div className='d-flex container'>
        <div className='row w-100 justify-center'>
          {module.groups.map((group, index) => (
            <div className='col-xs-12 my-2' key={index}>
              <div className='border rounded-xl flex'>
                {module.getGroupEndpoints(group.name).map((endpoint, index) => (
                  <ProjectEndpointForm
                    module={module}
                    endpoint={structReader.getModuleEndpoint(
                      module.name,
                      endpoint.name
                    )}
                    structReader={structReader}
                    key={index}
                    className='col-sm-12 col-lg-6'
                  />
                ))}
              </div>
            </div>
          ))}
          {module.endpoints
            .filter((endpoint) => !endpoint.group)
            .map((endpoint, index) => (
              <div className='col-lg-6 col-md-12 my-2' key={index}>
                <ProjectEndpointForm
                  module={module}
                  endpoint={structReader.getModuleEndpoint(
                    module.name,
                    endpoint.name
                  )}
                  structReader={structReader}
                  key={index}
                  className='border h-100'
                />
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};
