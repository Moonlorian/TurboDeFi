import React, { useEffect, useState } from 'react';

import { Card } from 'components/Card';
import { StakingProviderSelector } from 'components/StakingProviderSelector';
import { Button } from 'components/Button';
import {
  useGetAccount,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetTokenInfo,
  useGetTokensBalanceInfo
} from 'hooks';
import BigNumber from 'bignumber.js';
import { Label } from 'components/Label';
import {
  delegate,
  getEgldPrice,
  stakingProvidersLoadService
} from 'services';

export const StakeAmount = () => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [providersList, setProvidersList] = useState<any[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [egldPrice, setEgldPrice] = useState<BigNumber>(new BigNumber(0));
  const [selectedAmountInput, setSelectedAmountInput] = useState('');
  
  const balanceInfo = useGetTokensBalanceInfo();
  const tokenInfo = useGetTokenInfo();
  const { address } = useGetAccountInfo();

  const egldToken = 'EGLD';

  const loadDelegationProviders = async () => {
    const delegationProvidersList = await stakingProvidersLoadService();
    setProvidersList(delegationProvidersList);
  };

  const loadEgldPrice = async () => {
    const elgldPrice = await getEgldPrice();
    setEgldPrice(elgldPrice);
  };

  const stake = async () => {
    delegate(
      selectedProvider,
      address,
      selectedAmount.dividedBy(
        10 **
          (tokenInfo.hasToken(egldToken)
            ? tokenInfo.get(egldToken, 'decimals')
            : 18)
      )
    );
  };

  useEffect(() => {
    setSelectedAmount(
      new BigNumber(selectedAmountInput ? selectedAmountInput : 0).multipliedBy(
        10 **
          (tokenInfo.hasToken(egldToken)
            ? tokenInfo.get(egldToken, 'decimals')
            : 18)
      )
    );
  }, [selectedAmountInput]);

  useEffect(() => {
    loadDelegationProviders();
    loadEgldPrice();
  }, []);

  return (
    <Card
      className='flex-2 border position-relative bg-cards-bg-color'
      key={''}
      title={''}
      description={''}
      reference={''}
    >
      {providersList.length > 0 && (
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <StakingProviderSelector
              className='w-full'
              onChange={setSelectedProvider}
              filter={providersList}
            />
            <div className='text-gray-500 text-sm'>
              <Label>
                Balance{' '}
                {balanceInfo
                  .getBalance(egldToken)
                  .dividedBy(
                    10 **
                      (tokenInfo.hasToken(egldToken)
                        ? tokenInfo.get(egldToken, 'decimals')
                        : 18)
                  )
                  .toFixed(4)}
              </Label>
            </div>
          </div>
          <div className='position-relative flex-1 flex items-end flex-column flex-1'>
            <span
              className='flex-0 text-sm cursor-pointer rounded-md text-white position-absolute top-[8%] left-[3%] bg-main-color hover:bg-main-color/70 p-1'
              onClick={() => {
                setSelectedAmountInput(
                  balanceInfo
                    .getBalance(egldToken)
                    .dividedBy(
                      10 **
                        (tokenInfo.hasToken(egldToken)
                          ? tokenInfo.get(egldToken, 'decimals')
                          : 18)
                    )
                    .toFixed()
                );
              }}
            >
              max
            </span>
            <input
              className='w-full h-[38px] text-right border rounded-lg'
              type='number'
              placeholder='Amount'
              value={selectedAmountInput}
              onChange={(e: any) => {
                setSelectedAmountInput(e.target.value);
              }}
            />
            <div className='text-gray-500 text-sm'>
              <Label>
                ≈{' '}
                {(selectedAmount.multipliedBy(egldPrice).isNaN()
                  ? new BigNumber(0)
                  : selectedAmount
                      .multipliedBy(egldPrice)
                      .dividedBy(
                        10 **
                          (tokenInfo.hasToken(egldToken)
                            ? tokenInfo.get(egldToken, 'decimals')
                            : 18)
                      )
                      .decimalPlaces(4)
                ).toFixed()}
                $
              </Label>
            </div>
          </div>
        </div>
      )}
      <Button
        disabled={
          !selectedProvider ||
          selectedAmount.isLessThan(
            1 *
              10 **
                (tokenInfo.hasToken(egldToken)
                  ? tokenInfo.get(egldToken, 'decimals')
                  : 18)
          )
        }
        onClick={stake}
      >
        Stake
      </Button>
    </Card>
  );
};
