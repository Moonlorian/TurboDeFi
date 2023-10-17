import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useEffect, useState } from 'react';
import { CreateFlow, CreateFlowStep } from 'services';
import { contractAddress } from 'config';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';

type creationStatusType = 'idle' | 'creating' | 'saving';

export const FLowNewStepForm = ({
  onCancel,
  onFinish,
  flowId
}: {
  onCancel: any;
  onFinish: any;
  flowId: number;
}) => {
  const [creationStatus, setFlowCreationStatus] =
    useState<creationStatusType>('idle');
  const [stepDescription, setFlowDescription] = useState('');
  const [error, setError] = useState('');

  const { address } = useGetAccount();

  const saveFlow = () => {
    if (stepDescription == '') {
      setError('Step description is required');
      return;
    }
    CreateFlowStep(contractAddress, address, flowId, stepDescription);
    //TODO. Make a transaction wathcer and set the 'creating' status to show spinner and wait

    //setFlowCreationStatus('creating');
    setFlowCreationStatus('saving');
  };

  useEffect(() => {
    if (creationStatus == 'saving') {
      onFinish();
      //This function can be not neccesary
      setFlowCreationStatus('idle');
    }
  }, [creationStatus]);

  return (
    <div className='ml-4 mb-6 relative'>
      <ActionButtonList>
        {creationStatus == 'creating' ? (
          <p>please wait</p>
        ) : (
          <>
            <ActionButton action={saveFlow}>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </ActionButton>
            <ActionButton action={onCancel}>
              <FontAwesomeIcon icon={faBan} />
            </ActionButton>
          </>
        )}
      </ActionButtonList>
      <h2 className='flex text-xl font-medium group text-uppercase'>
        Create new Step
      </h2>
      <div className='pt-1'>
        <div className='mt-1 flex items-center pointer'>
          <input
            className='p-2 m-0 w-full border'
            placeholder='Insert here step description'
            value={stepDescription}
            onChange={(e: any) => setFlowDescription(e.target.value)}
            required
          />
        </div>
        <p className='text-red-500'>{error}</p>
      </div>
    </div>
  );
};
