import { useCallback, useEffect, useMemo, useState } from 'react';
import { aggregate, getTokenList, swap } from '../../services/ash/AshSwapService';
import { FormatAmount, Label, TokenSelector } from 'components';
import { getUserTokensBalance } from 'services';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import BigNumber from 'bignumber.js';
import { useGetTokenInfo } from 'hooks';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { Button } from 'react-bootstrap';

export const AshSwap = () => {
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [tokenFrom, setTokenFrom] = useState('');
  const [tokenTo, setTokenTo] = useState('');
  const [balanceFrom, setBalanceFrom] = useState<BigNumber>(new BigNumber(0));
  const [balanceTo, setBalanceTo] = useState<BigNumber>(new BigNumber(0));
  const [amountFrom, setAmountFrom] = useState<BigNumber>(new BigNumber(0));
  const [amountTo, setAmountTo] = useState<BigNumber>(new BigNumber(0));
  const [timeoutId, setTimeoutId] = useState<any>(0);
  const [swapData, setSwapData] = useState<any>();

  const { address } = useGetAccountInfo();
  const tokenInfo = useGetTokenInfo();

  const loadTokenList = async () => {
    const currentTokenList = await getTokenList();
    setTokenList(currentTokenList.map((tokenData: any) => tokenData.id));
  };

  const loadAggregate = async () => {
    if (!tokenFrom || !tokenTo || amountFrom.isEqualTo(0)) return;

    const path = await aggregate(
      tokenFrom,
      tokenTo,
      amountFrom
        .multipliedBy(10 ** tokenInfo.get(tokenFrom, 'decimals'))
        .toFixed()
    );
    setAmountTo(new BigNumber(path.returnAmountWithDecimal));
    console.log(path);
    setSwapData(path);
  };

  const loadUserBalances = async () => {
    const tokenList = [];
    if (tokenFrom) tokenList.push(tokenFrom);
    if (tokenTo) tokenList.push(tokenTo);
    const finalBalances = await getUserTokensBalance(address, tokenList);
    setBalanceFrom(new BigNumber(finalBalances[tokenFrom]?.balance ?? 0));
    setBalanceTo(new BigNumber(finalBalances[tokenTo]?.balance ?? 0));
  };

  const swapTokenOrder = () => {
    setAmountFrom(new BigNumber(0));
    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
  };

  const changeToken = useCallback((direction: string, tokenId: string) => {
    if (direction === 'from') {
      setTokenFrom(tokenId);
    } else if (direction === 'to') {
      setTokenTo(tokenId);
    }
  }, []);

  const changeAmount = useCallback((direction: string, amount: any) => {
    const bigNumberAmount = new BigNumber(amount);
    if (direction === 'from') {
      setAmountFrom(bigNumberAmount);
    } else if (direction === 'to') {
      setAmountTo(bigNumberAmount);
    }
  }, []);

  const getFilteredList = useCallback(
    (tokenToExclude: string) => {
      const filteredList = tokenList.filter(
        (tokenId) => tokenId != tokenToExclude
      );
      return filteredList;
    },
    [tokenList]
  );

  loadAggregate;
  useEffect(() => {
    loadUserBalances();
    loadAggregate();
  }, [tokenFrom, tokenTo]);

  useEffect(() => {
    clearTimeout(timeoutId);
    setTimeoutId(
      setTimeout(async () => {
        loadAggregate();
      }, 700)
    );
  }, [amountFrom]);
  useEffect(() => {
    loadTokenList();
  }, []);

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <div className=''>
        <Label>From</Label>
        <FormatAmount
          value={balanceFrom.toFixed()}
          token=''
          decimals={
            balanceFrom.isGreaterThan(0)
              ? tokenInfo.get(tokenFrom, 'decimals')
              : 0
          }
          digits={4}
        />
      </div>
      <div className=''>
        <TokenSelector
          onChange={(tokenId: string) => changeToken('from', tokenId)}
          isSearchable={true}
          filter={getFilteredList(tokenTo)}
          defaultValue={tokenFrom}
        />
        <input
          className='text-end'
          type='number'
          placeholder='Amount'
          value={amountFrom.isGreaterThan(0) ? amountFrom.toFixed() : ''}
          onChange={(e: any) => {
            changeAmount('from', e.target.value);
          }}
        />
      </div>
      <a onClick={swapTokenOrder}>change</a>
      <div className=''>
        <Label>To </Label>
        <FormatAmount
          value={balanceTo.toFixed()}
          egldLabel=''
          token=''
          decimals={
            balanceTo.isGreaterThan(0) ? tokenInfo.get(tokenTo, 'decimals') : 0
          }
          digits={4}
        />
      </div>
      <div className=''>
        <TokenSelector
          onChange={(tokenId: string) => changeToken('to', tokenId)}
          isSearchable={true}
          filter={getFilteredList(tokenFrom)}
          defaultValue={tokenTo}
        />
        <span>
          {tokenTo
            ? formatAmount({
                input: amountTo.toFixed(),
                decimals: tokenInfo.get(tokenTo, 'decimals'),
                digits: 4,
                addCommas: true,
                showLastNonZeroDecimal: false
              })
            : 0}
        </span>
      </div>
      <Button
        disabled={
          !address ||
          amountFrom.isEqualTo(0) ||
          amountTo.isEqualTo(0) ||
          tokenFrom === '' ||
          tokenTo === '' ||
          amountFrom
            .multipliedBy(10 ** tokenInfo.get(tokenFrom, 'decimals'))
            .isGreaterThan(balanceFrom)
        }
        onClick={() => swap(address, swapData.swaps, swapData.tokenAddresses, 1, new BigNumber(swapData.returnAmountWithDecimal))}
      >
        Swap
      </Button>
    </div>
  );
};
