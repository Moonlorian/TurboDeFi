import { useCallback, useContext, useEffect, useState } from 'react';
import {  PricesDataContext, getTokenListData } from '../services';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from './sdkDappHooks';

export const useGetTokenUSDPrices = () => {
  const [tokensPrice, setTokensPrice] = useState<{
    [index: string]: BigNumber;
  }>({});

  const priceDataContext = useContext(PricesDataContext);

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
  const loadPrices = async (tokenList: string[]) => {
    return(priceDataContext.updatePrices(tokenList));
  };

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
  useEffect(() => {
    setTokensPrice(priceDataContext.prices);
  }, [priceDataContext.prices]);

  return { loadPrices, tokensPrice, getPrice };
};
