import {
  useGetAccountInfo,
  useGetPendingTransactions
} from '@multiversx/sdk-dapp/hooks';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { Card } from 'components/Card';
import { Spinner } from 'components/Spinner';
import { API_URL, defaultBalanceTokens } from 'config';
import { useGetTokenInfo, useGetTokensBalanceInfo } from 'hooks';
import React, { useEffect, useState } from 'react';
import TurbodefiContractService from 'services/TurbodefiContractService';

export const BalancePanel = () => {
  const [loadingTokens, setLoadingTokens] = useState(true);

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const tokensBalance = useGetTokensBalanceInfo();
  const tokenInfo = useGetTokenInfo();
  console.log(tokensBalance.tokensBalance);

  useEffect(() => {
    setLoadingTokens(!Object.keys(tokenInfo.tokenList).length);
  }, [
    hasPendingTransactions,
    tokensBalance.tokensBalance,
    tokenInfo.tokenList
  ]);

  return (
    <Card className='border' title='Balances' reference=''>
      {loadingTokens ? (
        <Spinner color={'main-color'} msg='Loading balance...' />
      ) : (
        <div className='grid auto-rows-min lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
          {Object.keys(tokensBalance.tokensBalance).map((token, index) => (
            <div
              key={index}
              className='flex flex-row items-center mb-1 shrink-1 grow-0 basics-0 flex-nowrap'
            >
              <span className='shrink text-gray-500 text-sm'>
                {tokenInfo.get(token, 'name')}{' '}
                <span className='font-bold text-black-500 text-base'>
                  {formatAmount({
                    input: tokensBalance
                      .getBalance(token)
                      .toFixed(0),
                    decimals: tokenInfo.get(token, 'decimals'),
                    digits: 4,
                    showIsLessThanDecimalsLabel: true,
                    addCommas: true,
                    showLastNonZeroDecimal: false
                  })}
                </span>
              </span>
              <img
                className='w-[24px] text-center shrink mx-2'
                src={tokenInfo.get(token, 'assets')?.svgUrl}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
