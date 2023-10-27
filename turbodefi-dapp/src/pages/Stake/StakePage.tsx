import { Card, StakeAmount, StakeList } from 'components';
import React from 'react';
import { UsdValueContainer, UsdValueProvider } from 'services';

export const StakePage = () => {
  return (
    <UsdValueProvider>
      <div className='flex flex-col gap-6 max-w-7xl w-full'>
        <div className='flex flex-col rounded-xl bg-white py-6 px-[4%] md:px-6 flex-2'>
          <Card
            className='flex-2 w-full position-relative'
            title='Staking providers'
            description='Manage your staked tokens'
            reference={''}
            subtitle={<UsdValueContainer />}
          >
            <div className='grid md:gap-5 gap-[0.5rem] grid-cols-1 sm:grid-cols-2 auto-rows-min'>
              <StakeAmount />
              <StakeList />
            </div>
          </Card>
        </div>
      </div>
    </UsdValueProvider>
  );
};
