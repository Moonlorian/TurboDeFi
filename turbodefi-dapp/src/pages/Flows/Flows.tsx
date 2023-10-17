import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { Card } from 'components';
import { API_URL, turbodefiAddress } from 'config';
import { Flow, FlowType } from 'pages/Flow/Flow';
import { useEffect, useState } from 'react';
import TurbodefiContractService from 'services/TurbodefiContractService';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Flows = () => {
  const { address } = useGetAccount();

  const [systemFlows, setSystemFlows] = useState<FlowType[]>();
  const [userFlows, setUserFlows] = useState<FlowType[]>();
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

  if (selectedFlow) {
    return <Flow flow={selectedFlow} />;
  }
  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      {userFlows && (
        <div className='flex flex-col gap-6 max-w-7xl w-full mb-3'>
          <Card
            className='flex-2 w-100'
            key={'flow'}
            title={'User Flows'}
            description={'Flows created by the user'}
            reference={''}
          >
            {userFlows.map((flow, index) => {
              return <h4 key={`userFlow_${index}`}>{flow.label}</h4>;
            })}
          </Card>
        </div>
      )}
      {systemFlows && (
        <div className='flex flex-col gap-6 max-w-7xl w-full'>
          <Card
            className='flex-2 w-100'
            key={'flow'}
            title={'TurboDeFi Flows'}
            description={'Flows created by TurboDeFi team'}
            reference={''}
          >
            <div className='ml-4'>
              {systemFlows.map((flow, index) => {
                return (
                  <div key={`systemFlow_${index}`}>
                    <div
                      className='flex items-center pointer'
                      onClick={() => {
                        selectSystemFlow(index);
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
      )}
    </div>
  );
};
