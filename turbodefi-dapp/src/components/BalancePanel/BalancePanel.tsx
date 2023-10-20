import {
  useGetAccountInfo,
  useGetPendingTransactions
} from '@multiversx/sdk-dapp/hooks';
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
    setLoadingTokens(
      !Object.keys(tokensBalance.tokensBalance).length &&
        !!Object.keys(tokenInfo.tokenList).length
    );
  }, [hasPendingTransactions, tokensBalance.tokensBalance]);

  return (
    <Card className='border' title='Balances' reference=''>
      {loadingTokens ? (
        <Spinner color={'main-color'} msg='Loading balance...' />
      ) : (
        <>
          {Object.keys(tokensBalance.tokensBalance).map((token, index) => (
            <div key={index} className='flex flex-row items-center mb-1'>
              <span className='shrink text-gray-500 text-sm'>
                {token}{' '}
                <span className='font-bold text-black-500 text-base'>
                  {tokensBalance
                    .getBalance(token)
                    .dividedBy(10 ** tokenInfo.get(token, 'decimals'))
                    .toFixed(4)}
                </span>
              </span>
              <img
                className='w-[24px] text-center shrink mx-2'
                src={tokenInfo.get(token, 'assets')?.svgUrl}
              />
            </div>
          ))}
        </>
      )}
    </Card>
  );
};
