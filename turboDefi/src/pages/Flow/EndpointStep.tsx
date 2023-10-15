import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from 'pages/Project/ProjectInfo';
import { FlowStepType } from './Flow';
import { useEffect, useState } from 'react';
import { environment } from 'config';

export const EndpointStep = ({ step }: { step: FlowStepType }) => {
  const [structReader, setStructReader] = useState<StructReader>();

  const selectProject = async (selectedProject: string) => {
    const newStructReader = new StructReader(
      '/projects/' + environment + '/' + selectedProject.toLowerCase()
    );
    await newStructReader.load();
    return newStructReader;
  };

  useEffect(() => {
    if (step.endpoints) {
      selectProject(step.endpoints[0]?.project || '').then(
        (newStructReader: StructReader) => {
          setStructReader(newStructReader);
        }
      );
    }
    return;
  }, []);

  if (!structReader) return;
  return structReader?.isLoaded() ? (
    <div className='d-flex container'>
      <div className='row w-100'>
        {step.endpoints?.map((endpoint, index) => (
          <div className='col-lg-6' key={index}>
            <ProjectEndpointForm
              module={structReader.getModule(endpoint.module || '')}
              endpoint={structReader.getModuleEndpoint(
                endpoint.module || '',
                endpoint.endpoint || ''
              )}
              structReader={structReader}
              key={`endpoint_${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};
