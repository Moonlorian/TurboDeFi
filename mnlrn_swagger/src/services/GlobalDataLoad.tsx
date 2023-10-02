import { ReactNode, createContext, useEffect } from 'react';
import { getApiFullGeneric } from './apiQueries';

const GlobalData = {
  tokenList: {} as { [key: string]: any }
};

export type GlobalDataTYpe = typeof GlobalData;

export const GlobalDataContext = createContext<GlobalDataTYpe>(GlobalData);

export const GlobalDataComponent = ({ children }: { children: ReactNode }) => {
  const loadTokens = async () => {
    const tokenList = await loadAllTokens();
  };

  useEffect(() => {
    loadTokens();
  }, []);
  //Here we are going to load all the dapp data
  return (
    <GlobalDataContext.Provider value={GlobalData}>
      {children}
    </GlobalDataContext.Provider>
  );
};

const loadAllTokens = async () => {
  return getApiFullGeneric('tokens', { pageSize: 1000 });
};
