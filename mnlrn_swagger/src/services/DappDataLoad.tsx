import { Children, ReactNode, createContext } from 'react';

const dappData = {
  tokenList: {} as { [key: string]: any }
};

export type DappDataTYpe = typeof dappData;

export const DappDataContext = createContext<DappDataTYpe>(dappData);

export const DappDataComponent = ({ children }: { children: ReactNode }) => {
  //Here we are going to load all the dapp data
  return (
    <DappDataContext.Provider value={dappData}>
      {children}
    </DappDataContext.Provider>
  );
};
