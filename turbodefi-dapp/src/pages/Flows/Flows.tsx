import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { API_URL, turbodefiAddress } from 'config';
import { Flow } from 'pages/Flow/Flow';
import { useEffect, useState } from 'react';
import TurbodefiContractService from 'services/TurbodefiContractService';
import { FlowsList } from './FlowsList';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks/transactions/useGetPendingTransactions';
import { FlowType } from 'types';

export const Flows = () => {
  const [systemFlows, setSystemFlows] = useState<FlowType[]>([]);
  const [userFlows, setUserFlows] = useState<FlowType[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<FlowType>();

  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const turbodefiContractService = new TurbodefiContractService(API_URL);

  const backAction = () => setSelectedFlow(undefined);

  const selectSystemFlow = (userSelectedFlow: FlowType) =>
    setSelectedFlow(userSelectedFlow);

  useEffect(() => {
    turbodefiContractService
      .getAddressFlows(turbodefiAddress)
      .then((flows) =>
        setSystemFlows(flows.map((flow) => ({ ...flow, type: 'system' })))
      );
    turbodefiContractService.getAddressFlows(address).then((flows) => {
      setUserFlows(flows.map((flow) => ({ ...flow, type: 'user' })));
    });
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (selectedFlow) {
      setSelectedFlow(
        [...systemFlows, ...userFlows].find(
          (flow) => flow.id == selectedFlow.id
        )
      );
    }
  }, [systemFlows, userFlows]);

  if (selectedFlow) {
    return <Flow flow={selectedFlow} backAction={backAction} />;
  }
  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <FlowsList
        flowsList={userFlows}
        listType='user'
        selectionFLowCallback={selectSystemFlow}
      />
      {address != turbodefiAddress && systemFlows && systemFlows.length > 0 && (
        <FlowsList
          flowsList={systemFlows}
          listType='system'
          selectionFLowCallback={selectSystemFlow}
        />
      )}
    </div>
  );
};
