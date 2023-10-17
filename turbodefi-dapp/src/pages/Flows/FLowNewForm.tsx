import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useEffect, useState } from 'react';
import { CreateFlow } from 'services';
import { contractAddress } from 'config';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';

type flowStatusType = 'idle' | 'creating' | 'saving';

export const FLowNewForm = ({
  onCancel,
  onFinish
}: {
  onCancel: any;
  onFinish: any;
}) => {
  const [flowCreationStatus, setFlowCreationStatus] =
    useState<flowStatusType>('idle');
  const [flowName, setFlowName] = useState('');
  const [flowLabel, setFlowLabel] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [error, setError] = useState('');

  const { address } = useGetAccount();

  const saveFlow = () => {
    if (flowName == '') {
      setError('You must speciy a flow name');
      return;
    }
    if (flowLabel == '') {
      setError('You must speciy a flow label');
      return;
    }
    if (flowDescription == '') {
      setError('You must speciy a flow description');
      return;
    }
    CreateFlow(
      contractAddress,
      address,
      flowName,
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
    <div className='ml-4 mb-6 relative'>
      <ActionButtonList>
        {flowCreationStatus == 'creating' ? (
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
      <h2 className="flex text-xl font-medium group text-uppercase">Create new Flow</h2>
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
            placeholder='Insert here flow name'
            value={flowName}
            onChange={(e: any) => setFlowName(e.target.value)}
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
