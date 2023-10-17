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
import { stakedInfoType } from './StakeList';

export const StakeInfo = ({
  stakeData,
  providerInfo
}: {
  stakeData: stakedInfoType;
  providerInfo: any;
}) => {
  const tokenInfo = useGetTokenInfo();
  const { address } = useGetAccountInfo();

  const egldId = 'EGLD';

  const stakeClaim = () => {
    const scAddress = stakeData.contract ?? legacyContract[environment];
    claim(scAddress, address);
  };

  const stakeRedelegate = () => {
    const scAddress = stakeData.contract ?? legacyContract[environment];
    redelegate(scAddress, address);
  };

  return (
    <Card
      className='flex-2 border max-w-[550px] position-relative'
      key={''}
      title={''}
      description={''}
      reference={''}
    >
      <div className='flex flex-row'>
        {providerInfo.identity?.avatar && (
          <div className='max-w-[75px] me-3'>
            <img className='w-full rounded-circle' src={providerInfo.identity.avatar} />
          </div>
        )}
        <div className='flex flex-col justify-between'>
          {providerInfo.identity?.url ? (
            <a href={providerInfo.identity.url}>
              {providerInfo.identity.name || providerInfo.identity.key}
            </a>
          ) : (
            <span>
              {providerInfo.identity.name || providerInfo.identity.key}
            </span>
          )}
          {providerInfo.identity?.description && (
            <div className=''>{providerInfo.identity?.description}</div>
          )}
        </div>
      </div>
      <div className='flex mt-3'>
        <Label>Staked: </Label>
        <FormatAmount
          value={stakeData.userActiveStake.toFixed()}
          decimals={
            tokenInfo.hasToken(egldId) ? tokenInfo.get(egldId, 'decimals') : 18
          }
          digits={4}
          showLabel={true}
        />
      </div>
      <div className='flex mb-3'>
        <Label>Pending rewards: </Label>
        <FormatAmount
          value={stakeData.claimableRewards.toFixed()}
          decimals={
            tokenInfo.hasToken(egldId) ? tokenInfo.get(egldId, 'decimals') : 18
          }
          digits={4}
          showLabel={true}
        />
      </div>
      {stakeData.claimableRewards.isGreaterThan(0) && (
        <div>
          <Button className='me-2' onClick={stakeClaim}>
            Claim
          </Button>
          <Button onClick={stakeRedelegate}>Reinvest</Button>
        </div>
      )}
    </Card>
  );
};
