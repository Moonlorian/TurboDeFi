import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { Card } from 'components';
import { API_URL, turbodefiAddress } from 'config';
import { Flow, FlowType } from 'pages/Flow/Flow';
import { useCallback, useEffect, useState } from 'react';
import TurbodefiContractService from 'services/TurbodefiContractService';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { ActionButton, ActionButtonList } from 'components/ActionButton';
import { FLowNewForm } from './FLowNewForm';

export const FlowsList = ({
  flowsList,
  listType,
  selectionFLowCallback,
}: {
  flowsList: FlowType[];
  listType: 'user' | 'system';
  selectionFLowCallback: any;
}) => {
  const [creatingFlow, setCreatingFlow] = useState(false);
  const { address } = useGetAccount();

  const initCreatingFlow = () => setCreatingFlow(true);
  const closeCratingFlow = () => setCreatingFlow(false);

  const canShowCreateButton = () => {
    if (listType === 'system') return false;
    if (address == turbodefiAddress) return true;

    return !creatingFlow;
  };
  //TODO ==> Add tool tip to "add" button

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <Card
        className='flex-2 w-100 position-relative'
        key={'flow'}
        title={
          listType == 'user' || address == turbodefiAddress
            ? 'User Flows'
            : 'TurboDeFi Flows'
        }
        description={
          listType == 'user' || address == turbodefiAddress
            ? 'Flows created by the user'
            : 'Flows created by TurboDeFi team'
        }
        reference={''}
      >
        {canShowCreateButton() && (
          <ActionButtonList>
            <ActionButton action={initCreatingFlow}>
              <FontAwesomeIcon icon={faPlusSquare} />
            </ActionButton>
          </ActionButtonList>
        )}
        {creatingFlow && (
          <FLowNewForm
            onCancel={closeCratingFlow}
            onFinish={closeCratingFlow}
          />
        )}
        <div className='ml-4'>
          {flowsList.map((flow, index) => {
            return (
              <div key={`${listType}Flow_${index}`}>
                <div
                  className='flex items-center pointer'
                  onClick={() => {
                    selectionFLowCallback(flow);
                  }}
                >
                  <FontAwesomeIcon
                    title={flow.name}
                    icon={faArrowRight}
                    className={`mr-2 text-main-color fa-lg`}
                  />
                  <h5 key={index} className='m-0'>
                    {flow.label}
                  </h5>
                </div>
                <p className='text-gray-400 mb-6'>{flow.description}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
