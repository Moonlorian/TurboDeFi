import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from 'pages/Project/ProjectInfo';
import { useEffect, useState } from 'react';
import { environment } from 'config';
import { FlowEndpointType, FlowStepType } from 'types';

export const EndpointStep = ({ endpoint }: { endpoint: FlowEndpointType }) => {
  const [structReader, setStructReader] = useState<StructReader>();

  const selectProject = async (selectedProject: string) => {
    const newStructReader = new StructReader(
      '/projects/' + environment + '/' + selectedProject
    );
    await newStructReader.load();
    return newStructReader;
  };

  useEffect(() => {
      selectProject(endpoint.project || '').then(
        (newStructReader: StructReader) => {
          setStructReader(newStructReader);
        }
      );
    return;
  }, []);

  if (!structReader) return;
  return structReader?.isLoaded() ? (
    <div className='w-full border rounded-lg bg-cards-bg-color'>
      <ProjectEndpointForm
        module={structReader.getModule(endpoint.module || '')}
        endpoint={structReader.getModuleEndpoint(
          endpoint.module || '',
          endpoint.endpoint || ''
        )}
        structReader={structReader}
        key={`endpoint_${endpoint.id}`}
        fullTitle={true}
      />
    </div>
  ) : (
    <></>
  );
};
