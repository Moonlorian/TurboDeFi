import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useEffect, useState } from 'react';
import { CreateFlowStep } from 'services';
import { ProjectList, contractAddress, environment } from 'config';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import StructReader from 'StructReader/StructReader';

type creationStatusType = 'idle' | 'creating' | 'saving';

export const FLowNewStepEndpointForm = ({
  onCancel,
  onFinish,
  flowId
}: {
  onCancel: any;
  onFinish: any;
  flowId: number;
}) => {
  const [structReader, setStructReader] = useState<StructReader>();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [selectedEnpointId, setSelectedEndpointId] = useState(0);
  const [creationStatus, setStepEndpointCreationStatus] =
    useState<creationStatusType>('idle');
  const [error, setError] = useState('');

  const { address } = useGetAccount();

  const saveEndpoint = () => {
    //CreateFlowStep(contractAddress, address, flowId, endpointDescription);
    //TODO. Make a transaction wathcer and set the 'creating' status to show spinner and wait

    //setStepEndpointCreationStatus('creating');
    setStepEndpointCreationStatus('saving');
  };
  const selectProject = async (selectedProject: string) => {
    const newStructReader = new StructReader(
      '/projects/' + environment + '/' + selectedProject
    );
    await newStructReader.load();
    return newStructReader;
  };
  useEffect(() => {
    if (creationStatus == 'saving') {
      onFinish();
      //This function can be not neccesary
      setStepEndpointCreationStatus('idle');
    }
  }, [creationStatus]);

  useEffect(() => {
    if (selectedProject === '') return;
    if (!selectedProject.includes(selectedProject)) return;
    selectProject(selectedProject).then((newStructReader: StructReader) =>
      setStructReader(newStructReader)
    );
  }, [selectedProject]);

  return (
    <div className='ml-4 mb-6 relative min-h-[20px]'>
      <ActionButtonList>
        {creationStatus == 'creating' ? (
          <p>please wait</p>
        ) : (
          <>
            <ActionButton action={saveEndpoint}>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </ActionButton>
            <ActionButton action={onCancel}>
              <FontAwesomeIcon icon={faBan} />
            </ActionButton>
          </>
        )}
      </ActionButtonList>
      <h2 className='flex text-xl font-medium group text-uppercase'>
        Add Endpoint
      </h2>
      <div className='pt-1'>
        <div className='mt-1 flex items-center pointer'>
          <select
            className='form-select p-1 rounded-lg'
            onChange={(e: any) => {
              setSelectedProject(e.target.value);
            }}
          >
            <option value=''>Select project</option>
            {ProjectList.map((projectId: string, index) => (
              <option key={index} value={projectId}>
                {projectId}
              </option>
            ))}
          </select>
        </div>
        {structReader && (
        <div className='mt-1 flex items-center pointer'>
          <select
            className='form-select p-1 rounded-lg'
            onChange={(e: any) => {
              console.log(e.target.value);
            }}
          >
            <option value=''>Select module</option>
          {structReader.getModules().map((module, index) => (
            <option key={index} value={module.name}>
                {module.label || module.name}
              </option>
          ))}
          </select>
        </div>
        )}
      </div>
    </div>
  );
};
