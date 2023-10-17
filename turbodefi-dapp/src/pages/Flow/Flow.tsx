import { ActionButton, ActionButtonList, Card } from 'components';
import { FlowStep } from './FlowStep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { turbodefiAddress } from 'config';
import { useState } from 'react';
import { FLowNewStepForm } from './FLowNewStepForm';
import { FlowType } from 'types';

export const Flow = ({
  flow,
  backAction
}: {
  flow: FlowType;
  backAction: any;
}) => {
  const [creatingStep, setCreatingStep] = useState(false);
  const { address } = useGetAccount();

  const canShowCreateButton = () => {
    if (flow.type === 'system') return false;
    if (address == turbodefiAddress) return true;

    return !creatingStep;
  };

  const setCreatigStepAction = () => setCreatingStep(true);
  const onCLoseCreatingStep = () => setCreatingStep(false);

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full relative'>
      <Card
        className='flex-2'
        key={'flow'}
        title={flow.label}
        description={flow.description}
        reference={''}
      >
        <ActionButtonList>
          <ActionButton action={backAction}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </ActionButton>
          {canShowCreateButton() && (
            <ActionButton action={setCreatigStepAction}>
              <FontAwesomeIcon icon={faPlusSquare} />
            </ActionButton>
          )}
        </ActionButtonList>

        {creatingStep && (
          <FLowNewStepForm
            onCancel={onCLoseCreatingStep}
            onFinish={onCLoseCreatingStep}
            flowId={flow.id}
          />
        )}
        <div className='ml-4'>
          {flow.steps.map((step, index) => {
            return (
              <FlowStep
                step={{ ...step, type: flow.type || 'system', index, flowId: flow.id }}
                key={index}
                index={index + 1}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
};
