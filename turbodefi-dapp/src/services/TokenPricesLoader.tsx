import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react';
import { getEgldPrice } from './apiQueries';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks/transactions/useGetPendingTransactions';
import { getFullPairsList, getTokenListData } from './graphql';
import BigNumber from 'bignumber.js';

export const PricesDataContext = createContext<{
  prices: { [key: string]: BigNumber };
  updatePrices: (tokenList: string[]) => void;
}>({
  prices: {},
  updatePrices: (tokenList: string[]) => {}
});

export const TokenPricesLoader = ({ children }: { children: ReactNode }) => {
  const [pricesList, setPricesList] = useState<{ [key: string]: BigNumber }>(
    {}
  );

  const { hasPendingTransactions } = useGetPendingTransactions();

  const loadPrices = useCallback(
    async (tokenList: string[]) => {
      const currentTokenList = Object.keys(pricesList);
      const finalTokenIdList = tokenList.filter(
        (tokenId: string) => !currentTokenList.includes(tokenId)
      );

      if (finalTokenIdList.length == 0) return;
      if (finalTokenIdList.includes('SPROTEO-c2dffe') && !finalTokenIdList.includes('PROTEO-0c7311')) {
        finalTokenIdList.push('PROTEO-0c7311')
      }
      
      const tokenData = await getTokenListData(finalTokenIdList);

      const finalTokenList: { [key: string]: BigNumber } = { ...pricesList };
      Object.keys(tokenData).map((token: any) => {
        finalTokenList[token] = new BigNumber(tokenData[token]?.price ?? 0);
      });

      if (tokenList.includes('EGLD')){
        finalTokenList['EGLD'] = await getEgldPrice();
      }

      if (finalTokenIdList.includes('PROTEO-0c7311')){
        finalTokenList['SPROTEO-c2dffe'] = finalTokenList['PROTEO-0c7311'].multipliedBy(2);
      }

      const pairList = await getFullPairsList({ pageSize: 100 });
      pairList.map((pair) => {
        finalTokenList[pair.liquidityPoolToken.identifier] = new BigNumber(pair.liquidityPoolTokenPriceUSD);
      });
      
      setPricesList(finalTokenList);
      return finalTokenList;
    },
    [pricesList]
  );

  useEffect(() => {
    loadPrices(Object.keys(pricesList));
  }, [hasPendingTransactions]);

  return (
    <PricesDataContext.Provider
      value={{ prices: pricesList, updatePrices: loadPrices }}
    >
      {children}
    </PricesDataContext.Provider>
  );
};
