import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useEffect, useState } from 'react';
import { createFlow } from 'services';
import { contractAddress } from 'config';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';

type flowStatusType = 'idle' | 'creating' | 'saving';

export const FLowsNewForm = ({
  onCancel,
  onFinish
}: {
  onCancel: any;
  onFinish: any;
}) => {
  const [flowCreationStatus, setFlowCreationStatus] =
    useState<flowStatusType>('idle');
  const [flowLabel, setFlowLabel] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [error, setError] = useState('');

  const { address } = useGetAccount();

  const saveFlow = () => {
    if (flowLabel == '') {
      setError('Flow label is required');
      return;
    }
    if (flowDescription == '') {
      setError('Flow description is required');
      return;
    }
    createFlow(
      contractAddress,
      address,
      flowLabel.replace(/\s+/g, '-').toLowerCase(),
      flowLabel,
      flowDescription
    );
    //TODO. Make a transaction wathcer and set the 'creating' status to show spinner and wait

    //setFlowCreationStatus('creating');
    setFlowCreationStatus('saving');
  };

  useEffect(() => {
    if (flowCreationStatus == 'saving') {
      onFinish();
      //This function can be not neccesary
      setFlowCreationStatus('idle');
    }
  }, [flowCreationStatus]);

  return (
    <div className='ml-4 mb-6 relative bg-cards-bg-color rounded-xl p-3 mt-2'>
      <ActionButtonList>
        {flowCreationStatus == 'creating' ? (
          <p>please wait</p>
        ) : (
          <>
            <ActionButton action={saveFlow} bgColor='secondary-color'>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </ActionButton>
            <ActionButton action={onCancel} bgColor='secondary-color'>
              <FontAwesomeIcon icon={faBan} />
            </ActionButton>
          </>
        )}
      </ActionButtonList>
      <h2 className='flex text-xl font-medium group text-uppercase'>
        Create new Flow
      </h2>
      <div className='pt-1'>
        <div className='mt-1 flex items-center pointer'>
          <FontAwesomeIcon
            icon={faArrowRight}
            className={`mr-2 text-main-color fa-lg`}
          />
          <input
            className='p-2 m-0 w-full border text-main-color text-lg'
            value={flowLabel}
            onChange={(e: any) => setFlowLabel(e.target.value)}
            placeholder='Insert Here flow Label'
            required
          />
        </div>
        <div className='mt-1 flex items-center pointer'>
          <input
            className='p-2 m-0 w-full border'
            placeholder='Insert here flow description'
            value={flowDescription}
            onChange={(e: any) => setFlowDescription(e.target.value)}
            required
          />
        </div>
        <p className='text-red-500'>{error}</p>
      </div>
    </div>
  );
};
