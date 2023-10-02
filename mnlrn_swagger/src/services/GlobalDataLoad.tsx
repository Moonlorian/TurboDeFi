import { ReactNode, createContext, useEffect } from 'react';
import { getApiFullGeneric } from './apiQueries';

const globalData = {
  tokenList: {} as { [key: string]: any }
};

export type GlobalDataTYpe = typeof globalData;

export const GlobalDataContext = createContext<GlobalDataTYpe>(globalData);

export const GlobalDataComponent = ({ children }: { children: ReactNode }) => {
  const loadTokens = async () => {
    const tokenList = await getApiFullGeneric('tokens', { pageSize: 1000 });
    tokenList.map((tokenData) => {
      globalData.tokenList[tokenData.identifier.split('-')[0]] = tokenData;
    });
    console.log(globalData);
  };

  useEffect(() => {
    //loadTokens();
  }, []);
  //Here we are going to load all the dapp data
  return (
    <GlobalDataContext.Provider value={globalData}>
      {children}
    </GlobalDataContext.Provider>
  );
};

