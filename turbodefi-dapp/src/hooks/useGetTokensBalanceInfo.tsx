import { useCallback, useContext, useEffect, useState } from 'react';
import { GlobalDataContext } from '../services';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from './sdkDappHooks';

export const useGetTokensBalanceInfo = () => {
  const [tokensBalance, setTokenSBalance] = useState<any>({});

  const { account } = useGetAccountInfo();

  const globalDataContext = useContext(GlobalDataContext);

  useEffect(() => {
    setTokenSBalance(globalDataContext.tokenBalance);
  }, [globalDataContext.tokenBalance]);

  /**
   * Get a tokenBalance
   *
   * @remarks
   * Returns only balance.
   *
   * @param tokenId - (string) Token id.
   *
   *
   */
  function getBalance(tokenId: string) {
    if (account.address) {
      if (tokenId == 'EGLD') return new BigNumber(account.balance);
      if (tokensBalance[tokenId])
        return new BigNumber(tokensBalance[tokenId]['balance']);
    }
    return new BigNumber(0);
  }

  /**
   * Get al tokenData
   *
   * @remarks
   * Get All token data
   *
   * @param tokenId - (string) Token id.
   *
   *
   */
  function get(tokenId: string) {
    return tokensBalance[tokenId];
  }

  /**
   * Get token in array format
   *
   * @remarks
   * Returns token list in array format instead an associative array (object)
   *
   */
  const getList = useCallback(
    (filter: string[] = []) => {
      const finalTokenList: any[] = [];
      Object.keys(tokensBalance).map((tokenId) => {
        if (filter.length == 0 || filter.includes(tokenId))
          finalTokenList.push(tokensBalance[tokenId]);
      });
      return finalTokenList;
    },
    [tokensBalance]
  );

  /**
   * Returns if a token exists
   *
   * @remarks
   * Return true if a token exists
   *
   */
  const hasToken = useCallback(
    (tokenId: string): boolean => tokensBalance[tokenId],
    [tokensBalance]
  );

  return { get, getList, tokensBalance, hasToken, getBalance };
};
