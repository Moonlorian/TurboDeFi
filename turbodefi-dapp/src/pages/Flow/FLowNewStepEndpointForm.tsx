import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useEffect, useState } from 'react';
import { createFlowStep, addEndpoint } from 'services';
import { API_URL, ProjectList, contractAddress, environment } from 'config';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import StructReader from 'StructReader/StructReader';
import TurbodefiContractService from 'services/TurbodefiContractService';

type creationStatusType = 'idle' | 'creating' | 'saving';

export const FLowNewStepEndpointForm = ({
  onCancel,
  onFinish,
  flowId,
  stepIndex
}: {
  onCancel: any;
  onFinish: any;
  flowId: number;
  stepIndex: number;
}) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [structReader, setStructReader] = useState<StructReader>();
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedModuleEndpoints, setSelectedModuleEndpoints] = useState<any[]>(
    []
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [selectedEnpointId, setSelectedEndpointId] = useState(0);
  const [creationStatus, setStepEndpointCreationStatus] =
    useState<creationStatusType>('idle');

  const { address } = useGetAccount();

  const saveEndpoint = () => {
    addEndpoint(contractAddress, address, flowId, stepIndex, selectedEnpointId);
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
    setSelectedModule('');
    setSelectedEndpoint('');
    setSelectedModuleEndpoints([]);
    if (selectedProject === '') {
      setStructReader(undefined);
    } else {
      if (!selectedProject.includes(selectedProject)) return;
      selectProject(selectedProject).then((newStructReader: StructReader) =>
        setStructReader(newStructReader)
      );
    }
  }, [selectedProject]);

  useEffect(() => {
    setSelectedEndpoint('');
    if (selectedModule === '') {
      setSelectedModuleEndpoints([]);
      return;
    } else {
      const endpointList = structReader?.getModuleEndpoints(selectedModule);
      setSelectedModuleEndpoints(endpointList || []);
    }
  }, [selectedModule]);

  useEffect(() => {
    if (
      selectedProject != '' &&
      selectedModule != '' &&
      selectedEndpoint != ''
    ) {
      setSelectedEndpointId(0);
      new TurbodefiContractService(API_URL)
        .getEndpointId(selectedProject.toLocaleLowerCase(), selectedModule, selectedEndpoint)
        .then((data: any) => {
          setSelectedEndpointId(data);
        });
    } else if (selectedEnpointId > 0) {
      setSelectedEndpointId(0);
    }
  }, [selectedProject, selectedModule, selectedEndpoint]);

  return (
    <div className='ml-4 mb-6 relative min-h-[20px]'>
      <ActionButtonList>
        {creationStatus == 'creating' ? (
          <p>please wait</p>
        ) : (
          <>
            <ActionButton
              disabled={selectedEnpointId <= 0}
              action={saveEndpoint}
            >
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
        <div className='mt-2 flex items-center pointer'>
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
          <div className='mt-2 flex items-center pointer'>
            <select
              className='form-select p-1 rounded-lg'
              onChange={(e: any) => {
                setSelectedModule(e.target.value);
              }}
              defaultValue={selectedModule}
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
        {selectedModuleEndpoints.length > 0 && (
          <div className='mt-2 flex items-center pointer'>
            <select
              className='form-select p-1 rounded-lg'
              onChange={(e: any) => {
                setSelectedEndpoint(e.target.value);
              }}
              defaultValue={selectedEndpoint}
            >
              <option value=''>Select module</option>
              {selectedModuleEndpoints.map((endpoint, index) => (
                <option key={index} value={endpoint.name}>
                  {endpoint.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
