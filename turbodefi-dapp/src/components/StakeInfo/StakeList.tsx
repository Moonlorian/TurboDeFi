import React, { Fragment, useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { getDelegated, stakingProvidersLoadService } from 'services';
import { Label } from 'components/Label';
import { FormatAmount } from '@multiversx/sdk-dapp/UI';
import { useGetPendingTransactions, useGetTokenInfo } from 'hooks';
import { Card } from 'components/Card';
import { Button } from 'components/Button';
import { legacyContract } from 'services/staking/config';
import { environment } from 'config';
import { claim, redelegate } from 'services/staking';
import { StakeInfo } from './StakeInfo';

export type stakedInfoType = {
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
};

export const StakeList = () => {

  const [stakedInfo, setStakedInfo] = useState<stakedInfoType[]>([]);
  const [delegationProviders, setDelegationProviders] = useState<any[]>([]);

  const { hasPendingTransactions } = useGetPendingTransactions();
  const tokenInfo = useGetTokenInfo();
  const { address } = useGetAccountInfo();


  const getDelegationProvider = useCallback((contract:string) => {
    const filteredList = delegationProviders.filter((delegator) => delegator?.contract === contract);
    if (filteredList.length > 0) return filteredList[0];
    return {};
  }, [delegationProviders]);

  const loadStakedInfo = async () => {
    const delegatedList = await getDelegated(address);
    console.log(delegatedList);
    setStakedInfo(
      delegatedList.filter((staked: stakedInfoType) =>
        staked.userActiveStake.isGreaterThan(0)
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
    <Card
      className='flex flex-col gap-6 max-w-7xl w-full'
      key={'staked'}
      title={'Staked'}
      description={'EGLDs staked'}
      reference={''}
    >
      {stakedInfo.map((staked, index) => (
        <StakeInfo key={index} stakeData={staked} providerInfo={getDelegationProvider(staked.contract)}/>
      ))}
    </Card>
  );
};
