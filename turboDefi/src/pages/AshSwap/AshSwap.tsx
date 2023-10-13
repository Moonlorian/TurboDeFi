import { useCallback, useEffect, useMemo, useState } from 'react';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons/faArrowsRotate';
import {
  aggregate,
  getAshTokenList,
  swap
} from '../../services/ash/AshSwapService';
import {
  Card,
  FormatAmount,
  Label,
  OutputContainer,
  TokenSelector
} from 'components';
import { getTokenListData, getUserTokensBalance } from 'services';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import BigNumber from 'bignumber.js';
import { useGetTokenInfo } from 'hooks';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { Button } from 'react-bootstrap';
import { ProjectEndpointForm } from 'pages/Project/ProjectInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [priceFrom, setPriceFrom] = useState<BigNumber>(new BigNumber(0));
  const [priceTo, setPriceTo] = useState<BigNumber>(new BigNumber(0));

  const { address } = useGetAccountInfo();
  const tokenInfo = useGetTokenInfo();

  const loadTokenList = async () => {
    const currentTokenList = await getAshTokenList();
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
    setSwapData(path);
  };

  const loadUserBalances = async () => {
    const tokenList = [];
    if (tokenFrom) tokenList.push(tokenFrom);
    if (tokenTo) tokenList.push(tokenTo);
    if (tokenList.length == 0) return;
    const finalBalances = await getUserTokensBalance(address, tokenList);
    setBalanceFrom(new BigNumber(finalBalances[tokenFrom]?.balance ?? 0));
    setBalanceTo(new BigNumber(finalBalances[tokenTo]?.balance ?? 0));
  };

  const loadTokensPrices = async () => {
    const tokenList = [];
    if (tokenFrom) tokenList.push(tokenFrom);
    if (tokenTo) tokenList.push(tokenTo);
    if (tokenList.length == 0) return;

    const tokensData = await getTokenListData(tokenList);

    setPriceFrom(new BigNumber(tokensData[tokenFrom]?.price ?? 0));
    setPriceTo(new BigNumber(tokensData[tokenTo]?.price ?? 0));

    /*
    const finalBalances = await getUserTokensBalance(address, tokenList);
    setBalanceFrom(new BigNumber(finalBalances[tokenFrom]?.balance ?? 0));
    setBalanceTo(new BigNumber(finalBalances[tokenTo]?.balance ?? 0));
    */
  };

  const swapTokenOrder = () => {
    if (tokenFrom == '') return;
    if (tokenTo == '') return;

    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
    setAmountTo(new BigNumber(0));
    setAmountFrom(amountTo.dividedBy(10 ** tokenInfo.get(tokenTo, 'decimals')));
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
    loadTokensPrices();
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
      <Card
        className='flex-2'
        key={'swap'}
        title={'SWAP'}
        description={'Powered by AshShawp'}
        reference={''}
      >
        <Card
          className='flex-2 border w-50 position-relative'
          key={''}
          title={''}
          description={''}
          reference={''}
        >
          <div className='bg-neutral-100 py-4 px-3'>
            <div className=''>
              <Label>From</Label>
            </div>
            <div className='position-relative flex flex-row'>
              <TokenSelector
                onChange={(tokenId: string) => changeToken('from', tokenId)}
                isSearchable={true}
                filter={getFilteredList(tokenTo)}
                defaultValue={tokenFrom}
                className='flex-1'
              />
              <span
                className='text-sm cursor-pointer rounded-md position-absolute top-[15%] text-white right-[40%] main-color-bg main-color-30-border p-1'
                onClick={() => {
                  setAmountFrom(
                    tokenFrom
                      ? balanceFrom.dividedBy(
                          10 ** tokenInfo.get(tokenFrom, 'decimals')
                        )
                      : new BigNumber(0)
                  );
                }}
              >
                max
              </span>
              <input
                className='ms-2 text-end flex-1'
                type='number'
                placeholder='Amount'
                value={amountFrom.isGreaterThan(0) ? amountFrom.toFixed() : ''}
                onChange={(e: any) => {
                  changeAmount('from', e.target.value);
                }}
              />
            </div>
            <div className='ms-2 flex justify-between me-2'>
              <Label>
                Balance:{' '}
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
              </Label>
              <Label>
                ≈{' '}
                <FormatAmount
                  value={amountFrom.multipliedBy(priceFrom).toFixed()}
                  token=''
                  decimals={tokenFrom ? tokenInfo.get(tokenFrom, 'decimals') : 0}
                  digits={4}
                />
                $
              </Label>
            </div>
          </div>
          <div className='text-center'>
            <a className='cursor-pointer' onClick={swapTokenOrder}>
              <FontAwesomeIcon icon={faArrowsRotate} className='main-color' />
            </a>
          </div>
          <div className='bg-neutral-100 py-4 px-3'>
            <div className=''>
              <Label>To</Label>
            </div>
            <div className='flex flex-row'>
              <TokenSelector
                onChange={(tokenId: string) => changeToken('to', tokenId)}
                isSearchable={true}
                filter={getFilteredList(tokenFrom)}
                defaultValue={tokenTo}
                className='flex-1'
              />
              <input
                className='ms-2 text-end flex-1 pe-2 bg-transparent'
                value={
                  tokenTo
                    ? formatAmount({
                        input: amountTo.toFixed(),
                        decimals: tokenInfo.get(tokenTo, 'decimals'),
                        digits: 4,
                        addCommas: true,
                        showLastNonZeroDecimal: false
                      })
                    : 0
                }
                readOnly={true}
              />
            </div>
            <div className='ms-2 flex justify-between me-2'>
              <Label>
                Balance:{' '}
                <FormatAmount
                  value={balanceTo.toFixed()}
                  egldLabel=''
                  token=''
                  decimals={
                    balanceTo.isGreaterThan(0)
                      ? tokenInfo.get(tokenTo, 'decimals')
                      : 0
                  }
                  digits={4}
                />
              </Label>
              <Label>
                ≈{' '}
                <FormatAmount
                  value={amountTo.multipliedBy(priceTo).toFixed()}
                  token=''
                  decimals={tokenTo ? tokenInfo.get(tokenTo, 'decimals') : 0}
                  digits={4}
                />
                $
              </Label>
            </div>
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
            onClick={() =>
              swap(
                address,
                swapData.swaps,
                swapData.tokenAddresses,
                1,
                new BigNumber(swapData.returnAmountWithDecimal)
              )
            }
            className='mt-3 main-color-bg main-color-30-border'
          >
            Swap
          </Button>
        </Card>
      </Card>
    </div>
  );
};
