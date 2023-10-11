import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTokenList } from '../../services/AshSwapService';
import { Label, TokenSelector } from 'components';

export const AshSwap = () => {
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [tokenFrom, setTokenFrom] = useState('');
  const [tokenTo, setTokenTo] = useState('');

  const loadTokenList = async () => {
    const currentTokenList = await getTokenList();
    setTokenList(currentTokenList.map((tokenData: any) => tokenData.id));
  };

  const onChangeTokenFrom = useCallback((tokenId: string) => {
    console.log('New token from: ', tokenId);
    setTokenFrom(tokenId);
  }, []);

  const onChangeTokenTo = useCallback((tokenId: string) => {
    console.log('New token to: ', tokenId);
    setTokenTo(tokenId);
  }, []);

  const getFilteredList = useCallback(
    (tokenToExclude: string) => {
      const filteredList = tokenList.filter(
        (tokenId) => tokenId != tokenToExclude
      );
      console.log(filteredList);
      return filteredList;
    },
    [tokenList]
  );

  useEffect(() => {
    loadTokenList();
  }, []);

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <Label>From</Label>
      <TokenSelector
        onChange={(tokenId: string) => onChangeTokenFrom(tokenId)}
        isSearchable={true}
        filter={getFilteredList(tokenTo)}
      />
      <Label>To</Label>
      <TokenSelector
        onChange={(tokenId: string) => onChangeTokenTo(tokenId)}
        isSearchable={true}
        filter={getFilteredList(tokenFrom)}
      />
    </div>
  );
};
