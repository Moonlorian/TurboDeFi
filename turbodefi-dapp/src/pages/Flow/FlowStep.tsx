import { EndpointStep } from './EndpointStep';
import { ComponentStep } from './ComponentStep';
import { ActionButton, ActionButtonList, Card } from 'components';
import { FlowStepType } from 'types';
import { useState } from 'react';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { turbodefiAddress } from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { FLowNewStepEndpointForm } from './FlowAddStepEndpointForm/FLowNewStepEndpointForm';

export const FlowStep = ({
  step,
  index
}: {
  step: FlowStepType;
  index: number;
}) => {
  const [creatingEndpointStep, setCreatingEndpointStep] = useState(false);
  const { address } = useGetAccount();

  const canShowCreateButton = () => {
    if (step.type === 'system') return false;
    if (address == turbodefiAddress) return true;

    return !creatingEndpointStep;
  };

  const setCreatigEndpointStepAction = () => setCreatingEndpointStep(true);
  const onCLoseCreatingEdpointStep = () => setCreatingEndpointStep(false);

  return (
    <span className='flex flex-col rounded-xl p-6 border mb-2'>
      <h5 className='flex items-center'>
        <span className='rounded-full bg-main-color text-white w-[35px] h-[35px] flex items-center justify-center m-3'>
          {index}
        </span>
        <p className='text-gray-400 m-0'>{step.description}</p>
      </h5>
      <Card
        className='flex-2 p-1'
        key={'flow'}
        title={step.label || ''}
        description={''}
        reference={''}
      >
        {canShowCreateButton() && (
          <ActionButtonList>
            <ActionButton action={setCreatigEndpointStepAction}>
              <FontAwesomeIcon icon={faPlusSquare} />
            </ActionButton>
          </ActionButtonList>
        )}
        {creatingEndpointStep && (
          <FLowNewStepEndpointForm
            onCancel={onCLoseCreatingEdpointStep}
            onFinish={onCLoseCreatingEdpointStep}
            flowId={step.flowId}
          />
        )}
        {step.endpoints ? (
          <EndpointStep step={step} />
        ) : (
          <ComponentStep step={step} props={step.componentProps} />
        )}
      </Card>
    </span>
  );
};
