import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';
import { useState } from 'react';

type flowStatusType = 'idle' | 'creating' | 'saving';

export const FLowNewForm = ({
  onCancel,
  onFinish
}: {
  onCancel: any;
  onFinish: any;
}) => {
  const [flowName, setFlowName] = useState('');
  const [flowLabel, setFlowLabel] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const saveFlow = () => {
    onFinish();
  };
  return (
    <div className='ml-4 relative'>
      <ActionButtonList>
        <ActionButton action={onCancel}>
          <FontAwesomeIcon icon={faFloppyDisk} />
        </ActionButton>
        <ActionButton action={saveFlow}>
          <FontAwesomeIcon icon={faBan} />
        </ActionButton>
      </ActionButtonList>
      <div className='pt-5'>
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
          />
        </div>
        <div className='mt-1 flex items-center pointer'>
          <input
            className='p-2 m-0 w-full border'
            placeholder='Insert here flow name'
            value={flowName}
            onChange={(e: any) => setFlowName(e.target.value)}
          />
        </div>
        <div className='mt-1 flex items-center pointer'>
          <input
            className='p-2 m-0 w-full border'
            placeholder='Insert here flow description'
            value={flowDescription}
            onChange={(e: any) => setFlowDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
