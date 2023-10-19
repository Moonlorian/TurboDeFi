import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useEffect, useState } from 'react';
import { createFlowStep } from 'services';
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
  const [creationStatus, setFlowStepCreationStatus] =
    useState<creationStatusType>('idle');
  const [stepDescription, setStepDescription] = useState('');
  const [error, setError] = useState('');

  const { address } = useGetAccount();

  const saveFlowStep = () => {
    if (stepDescription == '') {
      setError('Step description is required');
      return;
    }
    createFlowStep(contractAddress, address, flowId, stepDescription);
    //TODO. Make a transaction wathcer and set the 'creating' status to show spinner and wait

    //setFlowStepCreationStatus('creating');
    setFlowStepCreationStatus('saving');
  };

  useEffect(() => {
    if (creationStatus == 'saving') {
      onFinish();
      //This function can be not neccesary
      setFlowStepCreationStatus('idle');
    }
  }, [creationStatus]);

  return (
    <div className='ml-4 mb-6 relative'>
      <ActionButtonList>
        {creationStatus == 'creating' ? (
          <p>please wait</p>
        ) : (
          <>
            <ActionButton action={saveFlowStep}>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </ActionButton>
            <ActionButton action={onCancel}>
              <FontAwesomeIcon icon={faBan} />
            </ActionButton>
          </>
        )}
      </ActionButtonList>
      <h2 className='flex text-xl font-medium group text-uppercase'>
        Add Step
      </h2>
      <div className='pt-1'>
        <div className='mt-1 flex items-center pointer'>
          <input
            className='p-2 m-0 w-full border'
            placeholder='Insert here step description'
            value={stepDescription}
            onChange={(e: any) => setStepDescription(e.target.value)}
            required
          />
        </div>
        <p className='text-red-500'>{error}</p>
      </div>
    </div>
  );
};
