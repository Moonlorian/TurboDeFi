import { ActionButton, ActionButtonList, Card, Loader } from 'components';
import { FlowStep } from './FlowStep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { API_URL, turbodefiAddress } from 'config';
import { useEffect, useState } from 'react';
import { FLowNewStepForm } from './FLowNewStepForm';
import { FlowType } from 'types';
import { useLocation, useNavigate } from 'react-router-dom';
import TurbodefiContractService from 'services/TurbodefiContractService';

export const Flow = () => {
  const [creatingStep, setCreatingStep] = useState(false);
  const [flowId, setFlowId] = useState(0);
  const [flow, setFlow] = useState<FlowType>();

  const { address } = useGetAccount();
  const location = useLocation();
  const navigate = useNavigate();

  const canShowCreateButton = () => {
    if (!address) return false;
    if (flow?.type === 'system') return false;
    if (address == turbodefiAddress) return true;

    return !creatingStep;
  };

  const setCreatigStepAction = () => setCreatingStep(true);
  const onCLoseCreatingStep = () => setCreatingStep(false);

  useEffect(() => {
    const path = location.pathname.replace(/^\/|\/$/g, '').split('/');
    const currentFlowId = path.slice(-1)[0];
    setFlowId(
      Number.isNaN(parseInt(currentFlowId)) ? 0 : parseInt(currentFlowId)
    );
  }, [location]);

  useEffect(() => {
    if (flowId == 0) return;
    new TurbodefiContractService(API_URL)
      .getFlowById(address, flowId)
      .then((data: any) => {
        setFlow(data);
      });
  }, [flowId]);

  return (
    <>
      <div className='flex flex-col gap-6 max-w-7xl w-full relative'>
        <Card
          className='flex-2'
          key={'flow'}
          title={flow?.label || ''}
          description={flow?.description}
          reference={''}
        >
          {flow && (
            <ActionButtonList>
              <ActionButton
                action={() => {
                  navigate('/Flows');
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </ActionButton>
              {canShowCreateButton() && (
                <ActionButton action={setCreatigStepAction}>
                  <FontAwesomeIcon icon={faPlusSquare} />
                </ActionButton>
              )}
            </ActionButtonList>
          )}
          {creatingStep && (
            <FLowNewStepForm
              onCancel={onCLoseCreatingStep}
              onFinish={onCLoseCreatingStep}
              flowId={flow?.id || 0}
            />
          )}
          <div>
            {flow?.steps.map((step, index) => {
              return (
                <FlowStep
                  step={{
                    ...step,
                    type: flow.type || 'system',
                    index,
                    flowId: flow.id
                  }}
                  key={index}
                  index={index + 1}
                />
              );
            })}
            {!flow && (
              <Loader />
            )}
          </div>
        </Card>
      </div>
    </>
  );
};
