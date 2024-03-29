import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { Card, Loader, Spinner } from 'components';
import { turbodefiAddress } from 'config';
import { useState } from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { ActionButton, ActionButtonList } from 'components/ActionButton';
import { FLowsNewForm } from './FLowsNewForm';
import { FlowType } from 'types';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks';
import TransactionWatcher from 'components/TransactionWatcher/TransactionWatcher';


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
  const { hasPendingTransactions } = useGetPendingTransactions();

  const initCreatingFlow = () => setCreatingFlow(true);
  const closeCratingFlow = () => setCreatingFlow(false);

  const canShowCreateButton = () => {
    if (!address) return false;
    if (listType === 'system') return false;
    //if (address == turbodefiAddress) return true;

    return !creatingFlow;
  };
  //TODO ==> Add tool tip to "add" button

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <Card
        className='flex-2 w-full position-relative bg-bg-color'
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
            <ActionButton disabled={hasPendingTransactions} action={initCreatingFlow} bgColor='secondary-color'>
              <FontAwesomeIcon icon={faPlusSquare} />
            </ActionButton>
          </ActionButtonList>
        )}
        {creatingFlow && (
          <FLowsNewForm
            onCancel={closeCratingFlow}
            onFinish={closeCratingFlow}
          />
        )}
        {hasPendingTransactions && listType !== 'system' &&  (
            <TransactionWatcher functionName='addFlow'>
              <Spinner color={'main-color'} msg="Creating flow..."/>
            </TransactionWatcher>
          )}
        <div>
          {flowsList.map((flow, index) => {
            return (
              <div key={`${listType}Flow_${index}`} className='bg-cards-bg-color rounded-xl p-3 mt-2'>
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
                  <h5 key={index} className='m-0 text-secondary-color'>
                    {flow.label}
                  </h5>
                </div>
                <p className='text-gray-400 mb-0'>{flow.description}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
