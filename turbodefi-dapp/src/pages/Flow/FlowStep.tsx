import { EndpointStep } from './EndpointStep';
import { ComponentStep } from './ComponentStep';
import { ActionButton, ActionButtonList, Card } from 'components';
import { FlowStepType } from 'types';
import { useState } from 'react';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { turbodefiAddress } from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { FLowNewStepEndpointForm } from './FLowNewStepEndpointForm';
import { FLowNewStepComponentForm } from './FLowNewStepComponentForm';

export const FlowStep = ({
  step,
  index
}: {
  step: FlowStepType;
  index: number;
}) => {
  const [creatingEndpointStep, setCreatingEndpointStep] = useState(false);
  const [creatingComponentStep, setCreatingComponentStep] = useState(false);
  const { address } = useGetAccount();

  const canShowCreateButton = () => {
    if (!address) return false;
    if (step.type === 'system') return false;
    if (address == turbodefiAddress) return true;
    if (step.component) return false;
    return !creatingEndpointStep && !creatingComponentStep;
  };

  const setCreatigEndpointStepAction = () => setCreatingEndpointStep(true);
  const onCLoseCreatingEdpointStep = () => setCreatingEndpointStep(false);

  const setCreatigComponentStepAction = () => setCreatingComponentStep(true);
  const onCLoseCreatingComponentStep = () => setCreatingComponentStep(false);

  return (
    <span className='flex flex-col rounded-xl p-6 border mb-2 relative'>
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
          <ActionButtonList className='top-[3%] right-[1%]'>
            <ActionButton action={setCreatigEndpointStepAction}>
              <FontAwesomeIcon icon={faPlusSquare} />
              <span className='ms-2 font-bold'>Add endpoint</span>
            </ActionButton>
            {step.endpoints?.length == 0 && (
              <ActionButton action={setCreatigComponentStepAction}>
                <FontAwesomeIcon icon={faPlusSquare} />
                <span className='ms-2 font-bold'>Add component</span>
              </ActionButton>
            )}
          </ActionButtonList>
        )}
        {creatingEndpointStep && (
          <FLowNewStepEndpointForm
            onCancel={onCLoseCreatingEdpointStep}
            onFinish={onCLoseCreatingEdpointStep}
            flowId={step.flowId || 0}
            stepIndex={step.index || 0}
          />
        )}
        {creatingComponentStep && (
          <FLowNewStepComponentForm
            onCancel={onCLoseCreatingComponentStep}
            onFinish={onCLoseCreatingComponentStep}
            flowId={step.flowId || 0}
            stepIndex={step.index || 0}
          />
        )}
        {step.endpoints && step.endpoints?.length > 0 ? (
          <EndpointStep step={step} />
        ) : (
          <>
            {step.component && (
              <ComponentStep step={step} props={step.componentProps} />
            )}
          </>
        )}
      </Card>
    </span>
  );
};
