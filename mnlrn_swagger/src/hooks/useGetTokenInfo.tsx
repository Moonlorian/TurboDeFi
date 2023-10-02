import { useContext, useEffect, useState } from 'react';
import { GlobalDataContext } from '../services';

export const useGetTokenInfo = () => {
  const [tokenList, setTokenList] = useState<any>({});

  const globalDataContext = useContext(GlobalDataContext);

  useEffect(() => {
    setTokenList(globalDataContext.tokenList);
  }, [globalDataContext.tokenList]);

  function get(tokenId: string, fieldName: string) {
    const defaultValue = fieldName == 'decimals' ? 18 : '';
    if (tokenList[tokenId]) return tokenList[tokenId][fieldName];
    return defaultValue;
  }
  return { get };
};
