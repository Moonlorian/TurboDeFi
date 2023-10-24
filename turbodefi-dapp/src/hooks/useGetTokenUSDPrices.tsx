import { useCallback, useContext, useEffect, useState } from 'react';
import { GlobalDataContext, getTokenListData } from '../services';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from './sdkDappHooks';

export const useGetTokenUSDPrices = () => {
  const [tokensPrice, setTokensPrice] = useState<{
    [index: string]: BigNumber;
  }>({});

  /**
   * Load tokens price in USD
   *
   * @remarks
   * Returns only tokens price
   *
   * @param tokenList - List of tokens for which we are going to get the price in USD
   *
   *
   */
  async function loadPrices(tokenList: string[]) {
    const tokenData = await getTokenListData(tokenList);
    const finalTokenList: { [index: string]: BigNumber } = {};

    Object.keys(tokenData).map((token: any) => {
      finalTokenList[token] = new BigNumber(tokenData[token]?.price ?? 0);
    });

    setTokensPrice(finalTokenList);
  }

  /**
   * Get an specific token price un USD
   *
   * @remarks
   * Returns only token price
   *
   * @param tokenId - Token of which we need price
   *
   *
   */
  function getPrice(tokenID: string) {
    return tokensPrice[tokenID] ? tokensPrice[tokenID] : new BigNumber(0);
  }
  return { loadPrices, tokensPrice, getPrice};
};
