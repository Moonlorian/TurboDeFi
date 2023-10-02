import { Children, ReactNode, createContext, useEffect } from 'react';
import { getApiFullGeneric } from './apiQueries';

const dappData = {
  tokenList: {} as { [key: string]: any }
};

export type DappDataTYpe = typeof dappData;

export const DappDataContext = createContext<DappDataTYpe>(dappData);

export const DappDataComponent = ({ children }: { children: ReactNode }) => {
  const loadTokens = async () => {  
    const tokenList = await loadAllTokens();
    
  };

  useEffect(() => {
    loadTokens();
  }, []);
  //Here we are going to load all the dapp data
  return (
    <DappDataContext.Provider value={dappData}>
      {children}
    </DappDataContext.Provider>
  );
};

const loadAllTokens = async () => {
  return getApiFullGeneric('tokens', {pageSize:1000});
};

