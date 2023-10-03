import { ReactNode, createContext, useEffect, useState } from 'react';
import { getApiFullGeneric } from './apiQueries';

const globalData = {
  tokenList: {} as { [key: string]: any }
};

export type GlobalDataTYpe = typeof globalData;

export const GlobalDataContext = createContext<GlobalDataTYpe>(globalData);

export const GlobalDataComponent = ({ children }: { children: ReactNode }) => {
  const [componentGlobalData, setComponentGlobalData] =
    useState<GlobalDataTYpe>(globalData);

  const loadTokens = async () => {
    const tokenList = await getApiFullGeneric('tokens', { pageSize: 1000 });
    const newTokenList = {} as { [key: string]: any };
    tokenList.map((tokenData) => {
      newTokenList[tokenData.identifier] = tokenData;
    });
    console.log(newTokenList['WEGLD-d7c6bb']);
    return newTokenList;
  };

  useEffect(() => {
    loadTokens().then((tokenList) => {
      setComponentGlobalData({
        ...componentGlobalData,
        tokenList
      });
    });
  }, []);
  //Here we are going to load all the dapp data
  return (
    <GlobalDataContext.Provider value={componentGlobalData}>
      {children}
    </GlobalDataContext.Provider>
  );
};
