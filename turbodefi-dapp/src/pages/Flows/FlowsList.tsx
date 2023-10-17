import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { Card } from 'components';
import { API_URL, turbodefiAddress } from 'config';
import { Flow, FlowType } from 'pages/Flow/Flow';
import { useEffect, useState } from 'react';
import TurbodefiContractService from 'services/TurbodefiContractService';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionButtonList } from 'components/Card/ActionButton';

export const FlowsList = ({
  flowsList,
  listType
}: {
  flowsList: FlowType[];
  listType: 'user' | 'system';
}) => {
  const { address } = useGetAccount();

  const turbodefiContractService = new TurbodefiContractService(API_URL);

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <Card
        className='flex-2 w-100 position-relative'
        key={'flow'}
        title={listType == 'user' ? 'User Flows' : 'TurboDeFi Flows'}
        description={listType == 'user' ? 'Flows created by the user' : 'Flows created by TurboDeFi team'}
        reference={''}
      >
        <ActionButtonList />
        <div className='ml-4'>
          {flowsList.map((flow, index) => {
            return (
              <div key={`systemFlow_${index}`}>
                <div
                  className='flex items-center pointer'
                  onClick={() => {
                    //selectSystemFlow(index);
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
