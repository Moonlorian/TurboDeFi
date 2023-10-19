import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useEffect, useState } from 'react';
import { COMPONENTS, CreateFlowStep, addComponent, addEndpoint } from 'services';
import { API_URL, ProjectList, contractAddress, environment } from 'config';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import StructReader from 'StructReader/StructReader';
import TurbodefiContractService from 'services/TurbodefiContractService';

type creationStatusType = 'idle' | 'creating' | 'saving';

export const FLowNewStepComponentForm = ({
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
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedComponentId, setSelecteComponentId] = useState(0);
  const [creationStatus, setStepEndpointCreationStatus] =
    useState<creationStatusType>('idle');

  const { address } = useGetAccount();

  const saveComponent = () => {
    addComponent(contractAddress, address, flowId, stepIndex, selectedComponentId);
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
    setSelecteComponentId(0);
    if (selectedComponent != '') {
      new TurbodefiContractService(API_URL)
        .getComponentId(selectedComponent)
        .then((data: any) => {
          setSelecteComponentId(data);
        });
    }
  }, [selectedComponent]);

  return (
    <div className='ml-4 mb-6 relative min-h-[20px]'>
      <ActionButtonList>
        {creationStatus == 'creating' ? (
          <p>please wait</p>
        ) : (
          <>
            <ActionButton
              disabled={selectedComponentId <= 0}
              action={saveComponent}
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
        Add Component
      </h2>
      <div className='pt-1'>
        <div className='mt-2 flex items-center pointer'>
          <select
            className='form-select p-1 rounded-lg'
            onChange={(e: any) => {
              setSelectedComponent(e.target.value);
            }}
          >
            <option value=''>Select component</option>
            {Object.keys(COMPONENTS).map((componentId: string, index) => (
              <option key={index} value={componentId}>
                {COMPONENTS[componentId].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
