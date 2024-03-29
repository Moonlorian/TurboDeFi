import {
  useGetAccountInfo,
  useGetPendingTransactions
} from '@multiversx/sdk-dapp/hooks';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { Card } from 'components/Card';
import { Spinner } from 'components/Spinner';
import {
  useGetTokenInfo,
  useGetTokenUSDPrices,
  useGetTokensBalanceInfo,
  usePriceUpdater
} from 'hooks';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';

export const BalancePanel = () => {
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [maxElements, setMaxElements] = useState(6);
  const [totalUsd, setTotalUsd] = useState<BigNumber>(new BigNumber(0));

  const { updatePrice } = usePriceUpdater();

  const { hasPendingTransactions } = useGetPendingTransactions();
  const tokensBalance = useGetTokensBalanceInfo();
  const tokenInfo = useGetTokenInfo();
  const tokensPrice = useGetTokenUSDPrices();

  const usdDecimals = 6;

  const balanceList = useMemo(
    () =>
      Object.keys(tokensBalance.tokensBalance).map((tokenId) => ({
        token: tokenId,
        balance: tokensBalance.getBalance(tokenId),
        price: tokensPrice.getPrice(tokenId)
      })),
    [tokensBalance.tokensBalance, tokensPrice.tokensPrice]
  );

  useEffect(() => {
    setLoadingTokens(
      !Object.keys(tokenInfo.tokenList).length ||
        !Object.keys(tokensPrice.tokensPrice).length
    );
  }, [
    hasPendingTransactions,
    tokensBalance.tokensBalance,
    tokenInfo.tokenList,
    tokensPrice.tokensPrice
  ]);

  useEffect(() => {
    setTotalUsd(
      balanceList.reduce((previous, current, index, fullList) => {
        return previous.plus(
          current.balance
            .multipliedBy(current.price)
            .dividedBy(
              10 **
                (Number.isNaN(
                  parseInt(tokenInfo.get(current.token, 'decimals'))
                )
                  ? 0
                  : parseInt(tokenInfo.get(current.token, 'decimals')))
            )
        );
      }, new BigNumber(0))
    );
  }, [balanceList]);

  useEffect(() => {
    updatePrice(totalUsd);
  }, [totalUsd]);
  return (
    <Card
      className='border bg-cards-bg-color border-secondary-color'
      title='Wallet Balances'
      reference=''
      subtitle={`($${formatAmount({
        input: totalUsd.multipliedBy(10 ** usdDecimals).toFixed(0),
        decimals: usdDecimals,
        digits: 2,
        showIsLessThanDecimalsLabel: true,
        addCommas: true,
        showLastNonZeroDecimal: false
      })})`}
    >
      {loadingTokens ? (
        <Spinner color={'main-color'} msg='Loading balance...' />
      ) : (
        <div className='grid auto-rows-min lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1'>
          {balanceList
            .sort((previous: any, last: any) =>
              previous.balance
                .multipliedBy(previous.price)
                .dividedBy(
                  10 ** parseInt(tokenInfo.get(previous.token, 'decimals'))
                )
                .isLessThan(
                  last.balance
                    .multipliedBy(last.price)
                    .dividedBy(
                      10 ** parseInt(tokenInfo.get(last.token, 'decimals'))
                    )
                )
                ? 1
                : -1
            )
            .slice(0, maxElements)
            .map((token, index) => (
              <div
                key={index}
                className='flex flex-row items-center mb-1 shrink-1 grow-0 basics-0 flex-nowrap'
              >
                <span className='shrink text-gray-500 text-base'>
                  {tokenInfo.get(token.token, 'name')}{' '}
                  <span className='font-bold text-black-500 text-base'>
                    {formatAmount({
                      input: token.balance.toFixed(0),
                      decimals: Number.isNaN(
                        parseInt(tokenInfo.get(token.token, 'decimals'))
                      )
                        ? 0
                        : parseInt(tokenInfo.get(token.token, 'decimals')),
                      digits: 2,
                      showIsLessThanDecimalsLabel: true,
                      addCommas: true,
                      showLastNonZeroDecimal: false
                    })}
                  </span>{' '}
                  <span className='font-normal text-sm'>
                    ($
                    {formatAmount({
                      input: token.balance.multipliedBy(token.price).toFixed(0),
                      decimals: Number.isNaN(
                        parseInt(tokenInfo.get(token.token, 'decimals'))
                      )
                        ? 0
                        : parseInt(tokenInfo.get(token.token, 'decimals')),
                      digits: 2,
                      showIsLessThanDecimalsLabel: true,
                      addCommas: true,
                      showLastNonZeroDecimal: false
                    })}
                    )
                  </span>
                </span>
                <img
                  className='w-[24px] text-center shrink mx-2'
                  src={tokenInfo.get(token.token, 'assets')?.svgUrl}
                />
              </div>
            ))}
        </div>
      )}
      {maxElements < balanceList.length ? (
        <a
          className='cursor-pointer'
          onClick={(e) => {
            setMaxElements(balanceList.length);
          }}
        >
          Show all
        </a>
      ) : (
        <a
          className='cursor-pointer'
          onClick={(e) => {
            setMaxElements(6);
          }}
        >
          Show less
        </a>
      )}
    </Card>
  );
};
