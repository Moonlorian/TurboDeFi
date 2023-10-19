import React, { Fragment, useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { getDelegated, stakingProvidersLoadService } from 'services';
import { useGetPendingTransactions, useGetTokenInfo } from 'hooks';
import { StakeInfo } from './StakeInfo';
import { Card } from 'components/Card';

export type stakedInfoType = {
  type: 'regular' | 'legacy';
  address: string;
  contract: string;
  userUnBondable: BigNumber;
  userActiveStake: BigNumber;
  claimableRewards: BigNumber;
  userUndelegatedList: [
    {
      amount: BigNumber;
      seconds: number;
    }
  ];
  userWaitingStake: BigNumber;
};

export const StakeList = () => {
  const [stakedInfo, setStakedInfo] = useState<stakedInfoType[]>([]);
  const [delegationProviders, setDelegationProviders] = useState<any[]>([]);

  const { hasPendingTransactions } = useGetPendingTransactions();
  const { address } = useGetAccountInfo();

  const getDelegationProvider = useCallback(
    (contract: string) => {
      const filteredList = delegationProviders.filter(
        (delegator) => delegator?.contract === contract
      );
      if (filteredList.length > 0) return filteredList[0];
      return {};
    },
    [delegationProviders]
  );

  const loadStakedInfo = async () => {
    const delegatedList = await getDelegated(address);
    setStakedInfo(
      delegatedList.filter(
        (staked: stakedInfoType) =>
          staked.userActiveStake.isGreaterThan(0) ||
          staked.userWaitingStake.isGreaterThan(0)
      )
    );
  };

  const loadDelegationProviders = async () => {
    const delegationProvidersList = await stakingProvidersLoadService();
    setDelegationProviders(delegationProvidersList);
  };

  useEffect(() => {
    loadStakedInfo();
  }, [hasPendingTransactions]);

  useEffect(() => {
    loadDelegationProviders();
  }, []);

  return (
    <>
      {stakedInfo.length ? (
        <>
          {stakedInfo.map((staked, index) => (
            <StakeInfo
              key={index}
              stakeData={staked}
              providerInfo={getDelegationProvider(staked.contract)}
            />
          ))}
        </>
      ) : (
        <Card
          className='flex-2 border position-relative'
          key={''}
          title={''}
          description={''}
          reference={''}
        >
          <p>You have no staked amount</p>
        </Card>
      )}
    </>
  );
};
