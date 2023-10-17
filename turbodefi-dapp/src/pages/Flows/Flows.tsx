import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { Card } from 'components';
import { API_URL, turbodefiAddress } from 'config';
import { Flow, FlowType } from 'pages/Flow/Flow';
import { useEffect, useState } from 'react';
import TurbodefiContractService from 'services/TurbodefiContractService';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlowsList } from './FlowsList';

export const Flows = () => {
  const { address } = useGetAccount();

  const [systemFlows, setSystemFlows] = useState<FlowType[]>([]);
  const [userFlows, setUserFlows] = useState<FlowType[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<FlowType>();

  const turbodefiContractService = new TurbodefiContractService(API_URL);

  const selectSystemFlow = (index: number) => {
    if (systemFlows) {
      setSelectedFlow(systemFlows[index]);
    }
  };
  useEffect(() => {
    turbodefiContractService
      .getAddressFlows(turbodefiAddress)
      .then((flows) => setSystemFlows(flows));
    turbodefiContractService
      .getAddressFlows(address)
      .then((flows) => setUserFlows(flows));
  }, []);

  console.log('user flows: ', userFlows);
  console.log('system flows: ', systemFlows);

  if (selectedFlow) {
    return <Flow flow={selectedFlow} />;
  }
  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <FlowsList flowsList={userFlows} listType='user' />
      {systemFlows && systemFlows.length > 0 && (
        <FlowsList flowsList={systemFlows} listType='system' />
      )}
    </div>
  );
};
