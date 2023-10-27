import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import {
  UsdValueContext,
  getDelegated,
  stakingProvidersLoadService
} from 'services';
import {
  useGetPendingTransactions,
  useGetTokenInfo,
  useGetTokenUSDPrices,
  usePriceUpdater
} from 'hooks';
import { StakeInfo } from './StakeInfo';
import { Card } from 'components/Card';
import { useGetEgldPrice } from '@multiversx/sdk-dapp/hooks';

export type stakedInfoType = {
  type: 'regular' | 'legacy';
  address: string;
  contract: string;
  userUnBondable: BigNumber;
  userActiveStake: BigNumber;
  claimableRewards: BigNumber;
  total: BigNumber;
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

  const { updatePrice } = usePriceUpdater();

  const { hasPendingTransactions } = useGetPendingTransactions();
  const { address } = useGetAccountInfo();
  const tokenInfo = useGetTokenInfo();
  const { price } = useGetEgldPrice();

  const egldId = 'EGLD';
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
    const activeStakings: stakedInfoType[] = delegatedList.filter(
      (staked: stakedInfoType) =>
        staked.userActiveStake.isGreaterThan(0) ||
        staked.userWaitingStake.isGreaterThan(0)
    );
    setStakedInfo(activeStakings);
  };

  const loadDelegationProviders = async () => {
    const delegationProvidersList = await stakingProvidersLoadService();
    setDelegationProviders(delegationProvidersList);
  };

  useEffect(() => {
    if (!tokenInfo.hasToken(egldId)) return;
    updatePrice(
      stakedInfo.reduce(
        (previous: BigNumber, current: stakedInfoType): BigNumber =>
          previous.plus(
            current.total
              .dividedBy(
                10 **
                  (tokenInfo.hasToken(egldId)
                    ? tokenInfo.get(egldId, 'decimals')
                    : 18)
              )
              .multipliedBy(price || 0)
          ),
        new BigNumber(0)
      )
    );
  }, [stakedInfo, price, tokenInfo.tokenList[egldId]]);

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
