import { ReactNode, createContext, useEffect, useState } from 'react';
import { getApiFullGeneric } from './apiQueries';
import { getTokenList } from './tokenLoadService';

const globalData = {
  tokenList: {} as { [key: string]: any }
};

export type GlobalDataTYpe = typeof globalData;

export const GlobalDataContext = createContext<GlobalDataTYpe>(globalData);

export const GlobalDataComponent = ({ children }: { children: ReactNode }) => {
  const [componentGlobalData, setComponentGlobalData] =
    useState<GlobalDataTYpe>(globalData);

  const loadTokens = async () => {
    //const tokenList = await getApiFullGeneric('tokens', { pageSize: 1000 });
    const tokenList = await getTokenList();
    const newTokenList = {} as { [key: string]: any };
    tokenList.map((tokenData:any) => {
      newTokenList[tokenData.identifier] = tokenData;
    });

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
