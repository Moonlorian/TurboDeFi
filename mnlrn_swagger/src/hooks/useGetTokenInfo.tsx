import { useCallback, useContext, useEffect, useState } from 'react';
import { GlobalDataContext } from '../services';

export const useGetTokenInfo = () => {
  const [tokenList, setTokenList] = useState<any>({});

  const globalDataContext = useContext(GlobalDataContext);

  useEffect(() => {
    setTokenList(globalDataContext.tokenList);
  }, [globalDataContext.tokenList]);

  /**
   * Get a token property or a full token data
   *
   * @remarks
   * If no property is passed, it returns all properties.
   *
   * @param tokenId - (string) Token id.
   *
   * @param fieldName - (string, optional) If field exists this function will returns this property value. If not, return null.
   * If fieldname is not specified, this function returns al token properties
   *
   */
  function get(tokenId: string, fieldName?: string) {
    if (fieldName) {
      const defaultValue = '';
      if (tokenList[tokenId]) return tokenList[tokenId][fieldName];
      throw new Error('Token not found');
    } else {
      return tokenList[tokenId];
    }
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
      Object.keys(tokenList).map((tokenId) => {
        if (filter.length == 0 || filter.includes(tokenId))
          finalTokenList.push(tokenList[tokenId]);
      });
      return finalTokenList;
    },
    [tokenList]
  );

  /**
   * Returns if a token exists
   *
   * @remarks
   * Return true if a token exists
   *
   */
  const hasToken = useCallback(
    (tokenId: string): boolean => tokenList[tokenId],
    [tokenList]
  );

  return { get, getList, tokenList, hasToken };
};
