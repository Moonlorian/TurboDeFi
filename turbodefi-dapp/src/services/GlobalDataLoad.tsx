import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react';
import { getUserBalance } from './apiQueries';
import { getTokenList } from './tokenLoadService';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks/transactions/useGetPendingTransactions';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks';

const globalData = {
  tokenList: {} as { [key: string]: any },
  tokenBalance: {} as { [key: string]: any }
};

export type GlobalDataTYpe = typeof globalData;

export const GlobalDataContext = createContext<GlobalDataTYpe>(globalData);

export const GlobalDataComponent = ({ children }: { children: ReactNode }) => {
  const [componentGlobalData, setComponentGlobalData] =
    useState<GlobalDataTYpe>(globalData);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { balance } = useGetAccount();

  const loadTokens = async () => {
    //const tokenList = await getApiFullGeneric('tokens', { pageSize: 1000 });
    const tokenList = await getTokenList();
    const newTokenList = {} as { [key: string]: any };
    tokenList.map((tokenData: any) => {
      newTokenList[tokenData.identifier] = tokenData;
    });

    return newTokenList;
  };

  //To update any field in global data, we have to use this function
  const updateBalance = useCallback(
    (tokenBalance: any) => {
      setComponentGlobalData({
        ...componentGlobalData,
        tokenBalance: tokenBalance
      });
    },
    [componentGlobalData.tokenList, balance]
  );

  const getFullUserBalance = useCallback(async () => {
    const fullBalance = await getUserBalance(address);
    fullBalance['EGLD'] = {
      balance,
      name: 'Egld',
      ticker: 'EGLD',
      identifier: 'EGLD'
    };
    return fullBalance;
  }, [address, balance]);


  useEffect(() => {
    const newTimer = setTimeout(() => {
      getFullUserBalance().then((tokenBalance: any) => {
        updateBalance(tokenBalance);
      });
    }, 120000);
    setTimer(newTimer);
    return () => clearTimeout(newTimer);
  }, [componentGlobalData.tokenBalance]);

  useEffect(() => {
    //Only load tokens balance if there is an address and tokens are loaded
    if (
      address != '' &&
      Object.keys(componentGlobalData.tokenList).length > 0 &&
      !hasPendingTransactions
    ) {
      clearTimeout(timer);
      //Here we load global data that depends on user
      getFullUserBalance().then((tokenBalance: any) => {
        updateBalance(tokenBalance);
      });
    }
  }, [hasPendingTransactions, address, updateBalance]);

  useEffect(() => {
    //Here we are going toload global data  that not depends on user

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
