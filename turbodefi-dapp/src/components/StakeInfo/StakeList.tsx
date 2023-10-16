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

export const StakeList = () => {
  type stakedInfoType = {
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
  const [stakedInfo, setStakedInfo] = useState<stakedInfoType[]>([]);
  const [delegationProviders, setDelegationProviders] = useState<any[]>([]);
  const egldId = 'EGLD';

  const { hasPendingTransactions } = useGetPendingTransactions();
  const tokenInfo = useGetTokenInfo();
  const { address } = useGetAccountInfo();


  const getDelegationProvider = useCallback((contract:string) => {
    const filteredList = delegationProviders.filter((delegator) => delegator?.contract === contract);
    if (filteredList.length > 0) return filteredList[0];
    return {};
  }, delegationProviders);

  const loadStakedInfo = async () => {
    const delegatedList = await getDelegated(address);
    setStakedInfo(
      delegatedList.filter((staked: stakedInfoType) =>
        staked.userActiveStake.isGreaterThan(0)
      )
    );
  };

  const loadDelegationProviders = async () => {
    const delegationProvidersList = await stakingProvidersLoadService();
    console.log(delegationProvidersList);
    setDelegationProviders(delegationProvidersList);
  };

  const stakeClaim = (data: stakedInfoType) => {
    const scAddress = data.contract ?? legacyContract[environment];
    claim(scAddress, address);
  };

  const stakeRedelegate = (data: stakedInfoType) => {
    const scAddress = data.contract ?? legacyContract[environment];
    redelegate(scAddress, address);
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
        <Fragment key={index}>
          <div className='flex'>
            <Label>Staked: </Label>
            <FormatAmount
              value={staked.userActiveStake.toFixed()}
              decimals={tokenInfo.get(egldId, 'decimals')}
              digits={4}
              showLabel={true}
            />
          </div>
          <div className='flex'>
            <Label>Pending rewards: </Label>
            <FormatAmount
              value={staked.claimableRewards.toFixed()}
              decimals={tokenInfo.get(egldId, 'decimals')}
              digits={4}
              showLabel={true}
            />
          </div>
          {staked.claimableRewards.isGreaterThan(0) && (
            <div>
              <Button
                className='me-2'
                onClick={() => {
                  stakeClaim(staked);
                }}
              >
                Claim
              </Button>
              <Button
                onClick={() => {
                  stakeRedelegate(staked);
                }}
              >
                Reinvest
              </Button>
            </div>
          )}
        </Fragment>
      ))}
    </Card>
  );
};
