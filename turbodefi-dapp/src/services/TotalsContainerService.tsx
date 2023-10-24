import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react';
import { getApiFullGeneric, getUserBalance } from './apiQueries';
import { getTokenList } from './tokenLoadService';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks/transactions/useGetPendingTransactions';
import { getTokenListData } from './graphql';
import BigNumber from 'bignumber.js';

export const TotalsContainerContext = createContext<{
  total: BigNumber;
  updateTotal: (amount: BigNumber | string | number) => void;
  resetTotal: () => void;
}>({
  total: new BigNumber(0),
  updateTotal: (amount: BigNumber | string | number) => {},
  resetTotal: () => {}
});

export const TotalsContainerService = ({
  children
}: {
  children: ReactNode;
}) => {
  const [total, setTotal] = useState<BigNumber>(new BigNumber(0));
  const updateTotal = (amount: BigNumber | string | number) => {
    setTotal(total.plus(amount));
  };
  const resetTotal = () => {
    setTotal(new BigNumber(0));
  };

  return (
    <TotalsContainerContext.Provider value={{ total, updateTotal, resetTotal }}>
      {children}
    </TotalsContainerContext.Provider>
  );
};
