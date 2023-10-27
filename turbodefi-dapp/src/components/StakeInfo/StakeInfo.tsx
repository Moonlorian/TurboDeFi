import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { Label } from 'components/Label';
import { FormatAmount } from '@multiversx/sdk-dapp/UI';
import { useGetTokenInfo } from 'hooks';
import { Card } from 'components/Card';
import { Button } from 'components/Button';
import { legacyContract } from 'services/staking/config';
import { environment } from 'config';
import { claim, redelegate } from 'services/staking';
import { stakedInfoType } from './StakeList';
import BigNumber from 'bignumber.js';
import { useContext, useEffect, useState } from 'react';
import { useGetEgldPrice } from '@multiversx/sdk-dapp/hooks';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';

export const StakeInfo = ({
  stakeData,
  providerInfo
}: {
  stakeData: stakedInfoType;
  providerInfo: any;
}) => {
  const [egldUsdPrice, setEgldUsdPrice] = useState<BigNumber>(new BigNumber(0));

  const { price } = useGetEgldPrice();
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

  useEffect(() => {
    setEgldUsdPrice(new BigNumber(price || 0));
  }, [price]);

  return (
    <Card
      className='flex-2 border position-relative'
      key={''}
      title={''}
      description={''}
      reference={''}
    >
      {stakeData.type == 'regular' ? (
        <div className='flex flex-row'>
          {providerInfo.identity?.avatar && (
            <div className='max-w-[75px] me-3'>
              <img
                className='w-full rounded-circle'
                src={providerInfo.identity.avatar}
              />
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
            <div className='text-gray-500'>
              <FormatAmount
                value={stakeData.total.toFixed()}
                decimals={
                  tokenInfo.hasToken(egldId)
                    ? tokenInfo.get(egldId, 'decimals')
                    : 18
                }
                digits={4}
                showLabel={true}
              />
              <span className='text-gray-500 text-sm ms-1'>
                {'($'}
                {formatAmount({
                  input: stakeData.total
                    .multipliedBy(egldUsdPrice)
                    .toFixed(0),
                  decimals: tokenInfo.hasToken(egldId)
                    ? tokenInfo.get(egldId, 'decimals')
                    : 18,
                  digits: 2,
                  showIsLessThanDecimalsLabel: true,
                  addCommas: true,
                  showLastNonZeroDecimal: false
                })}
                {')'}
              </span>
            </div>
            {providerInfo.identity?.description && (
              <div className=''>{providerInfo.identity?.description}</div>
            )}
          </div>
        </div>
      ) : (
        <h2>Legacy Delegation</h2>
      )}
      <div className='flex mt-3 items-center'>
        <Label>Staked: </Label>
        <FormatAmount
          value={stakeData.userActiveStake.toFixed()}
          decimals={
            tokenInfo.hasToken(egldId) ? tokenInfo.get(egldId, 'decimals') : 18
          }
          digits={4}
          showLabel={true}
        />
        <span className='text-gray-500 text-sm ms-1'>
          {'($'}
          {formatAmount({
            input: stakeData.userActiveStake
              .multipliedBy(egldUsdPrice)
              .toFixed(0),
            decimals: tokenInfo.hasToken(egldId)
              ? tokenInfo.get(egldId, 'decimals')
              : 18,
            digits: 2,
            showIsLessThanDecimalsLabel: true,
            addCommas: true,
            showLastNonZeroDecimal: false
          })}
          {')'}
        </span>
      </div>
      {stakeData.userWaitingStake.isGreaterThan(0) && (
        <div className='flex items-center'>
          <Label>Waiting: </Label>
          <FormatAmount
            value={stakeData.userWaitingStake.toFixed()}
            decimals={
              tokenInfo.hasToken(egldId)
                ? tokenInfo.get(egldId, 'decimals')
                : 18
            }
            digits={4}
            showLabel={true}
          />
          <span className='text-gray-500 text-sm ms-1'>
            {'($'}
            {formatAmount({
              input: stakeData.userWaitingStake
                .multipliedBy(egldUsdPrice)
                .toFixed(0),
              decimals: tokenInfo.hasToken(egldId)
                ? tokenInfo.get(egldId, 'decimals')
                : 18,
              digits: 2,
              showIsLessThanDecimalsLabel: true,
              addCommas: true,
              showLastNonZeroDecimal: false
            })}
            {')'}
          </span>
        </div>
      )}
      <div className='flex mb-3 items-center'>
        <Label>Pending rewards: </Label>
        <FormatAmount
          value={stakeData.claimableRewards.toFixed()}
          decimals={
            tokenInfo.hasToken(egldId) ? tokenInfo.get(egldId, 'decimals') : 18
          }
          digits={4}
          showLabel={true}
        />
        <span className='text-gray-500 text-sm ms-1'>
          {'($'}
          {formatAmount({
            input: stakeData.claimableRewards
              .multipliedBy(egldUsdPrice)
              .toFixed(0),
            decimals: tokenInfo.hasToken(egldId)
              ? tokenInfo.get(egldId, 'decimals')
              : 18,
            digits: 2,
            showIsLessThanDecimalsLabel: true,
            addCommas: true,
            showLastNonZeroDecimal: false
          })}
          {')'}
        </span>
      </div>
      {stakeData.type == 'regular' && (
        <div>
          <Button
            disabled={stakeData.claimableRewards.isEqualTo(0)}
            className='me-2'
            onClick={stakeClaim}
          >
            Claim
          </Button>
          <Button
            disabled={stakeData.claimableRewards.isEqualTo(0)}
            onClick={stakeRedelegate}
          >
            Reinvest
          </Button>
        </div>
      )}
    </Card>
  );
};
