import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButton, ActionButtonList } from 'components';

type flowStatusType = 'idle' | 'creating' | 'saving';

export const FLowNewForm = ({
  onCancel,
  onFinish
}: {
  onCancel: any;
  onFinish: any;
}) => {
  return (
    <div className='ml-4 relative'>
      <ActionButtonList>
        <ActionButton action={onCancel}>
          <FontAwesomeIcon icon={faFloppyDisk}/>
        </ActionButton>
        <ActionButton action={onFinish}>
          <FontAwesomeIcon icon={faBan}/>
        </ActionButton>
      </ActionButtonList>
    </div>
  );
};
