import { useCallback, useEffect, useMemo, useState } from 'react';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons/faArrowsRotate';
import {
  aggregate,
  getAshTokenList,
  new_swap,
  swap
} from '../../services/ash/AshSwapService';
import { Button, Card, FormatAmount, Label, TokenSelector } from '..';
import { getTokenListData } from '../../services';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import BigNumber from 'bignumber.js';
import { useGetTokenInfo, useGetTokensBalanceInfo } from '../../hooks';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const AshSwap = ({
  defaultTokenFrom = '',
  defaultTokenTo = ''
}: {
  defaultTokenFrom?: string;
  defaultTokenTo?: string;
}) => {
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [tokenFrom, setTokenFrom] = useState(defaultTokenFrom);
  const [tokenTo, setTokenTo] = useState(defaultTokenTo);
  const [amountFrom, setAmountFrom] = useState<BigNumber>(new BigNumber(0));
  const [amountTo, setAmountTo] = useState<BigNumber>(new BigNumber(0));
  const [timeoutId, setTimeoutId] = useState<any>(0);
  const [swapData, setSwapData] = useState<any>();
  const [priceFrom, setPriceFrom] = useState<BigNumber>(new BigNumber(0));
  const [priceTo, setPriceTo] = useState<BigNumber>(new BigNumber(0));

  const { address } = useGetAccountInfo();
  const balanceInfo = useGetTokensBalanceInfo();
  const tokenInfo = useGetTokenInfo();

  const loadTokenList = async () => {
    const currentTokenList = await getAshTokenList();
    const newTokenList = currentTokenList.map((tokenData: any) => tokenData.id);
    newTokenList.push('EGLD');
    setTokenList(newTokenList.sort());
  };

  const getEgldEquivalent = (tokenId: string): string => {
    if (tokenId === 'EGLD') return tokenInfo.getID('WEGLD');
    else return tokenId;
  };
  const loadAggregate = async () => {
    if (!tokenFrom || !tokenTo) return;
    if (amountFrom.isEqualTo(0)) {
      setAmountTo(new BigNumber(0));
      setSwapData({});
    } else {
      const path = await aggregate(
        getEgldEquivalent(tokenFrom),
        getEgldEquivalent(tokenTo),
        amountFrom
          .multipliedBy(10 ** tokenInfo.get(tokenFrom, 'decimals'))
          .toFixed()
      );
      setAmountTo(new BigNumber(path.returnAmountWithDecimal));
      setSwapData(path);
    }
  };

  const loadTokensPrices = async () => {
    const tokenList = [];
    const convertedTokenFrom = getEgldEquivalent(tokenFrom);
    const convertedTokenTo = getEgldEquivalent(tokenTo);
    if (tokenFrom) tokenList.push(convertedTokenFrom);
    if (tokenTo) tokenList.push(getEgldEquivalent(tokenTo));
    if (tokenList.length == 0) return;

    const tokensData = await getTokenListData(tokenList);

    setPriceFrom(
      new BigNumber(tokensData[convertedTokenFrom]?.price ?? 0).decimalPlaces(18)
    );
    setPriceTo(
      new BigNumber(tokensData[convertedTokenTo]?.price ?? 0).decimalPlaces(18)
    );
  };

  const swapTokenOrder = () => {
    if (tokenFrom == '') return;
    if (tokenTo == '') return;

    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
    setAmountTo(new BigNumber(0));
    setAmountFrom(new BigNumber(0));
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
      setAmountFrom(
        bigNumberAmount.isNaN() ? new BigNumber(0) : bigNumberAmount
      );
    } else if (direction === 'to') {
      setAmountTo(bigNumberAmount.isNaN() ? new BigNumber(0) : bigNumberAmount);
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
    <div className='flex flex-col w-full border rounded-xl'>
      <Card
        className='flex-2'
        key={'swap'}
        title={'SWAP'}
        description={'Powered by AshShawp'}
        reference={''}
      >
        <div className='rounded-lg bg-neutral-100 py-4 px-3'>
          <div className=''>
            <Label>From</Label>
          </div>
          <div className='position-relative flex flex-row gap-x-4'>
            <div className='w-50 flex-1'>
              <TokenSelector
                onChange={(tokenId: string) => changeToken('from', tokenId)}
                isSearchable={true}
                filter={getFilteredList(tokenTo)}
                defaultValue={tokenList.includes(tokenFrom) ? tokenFrom : ''}
              />
            </div>
            <div className='w-50 position-relative flex-1 flex items-end flex-column'>
              <span
                className='flex-0 text-sm cursor-pointer rounded-md text-white position-absolute top-[7%] left-[3%] bg-main-color hover:bg-main-color/70 p-1'
                onClick={() => {
                  setAmountFrom(
                    tokenFrom
                      ? balanceInfo
                          .getBalance(tokenFrom)
                          .dividedBy(10 ** tokenInfo.get(tokenFrom, 'decimals'))
                      : new BigNumber(0)
                  );
                }}
              >
                max
              </span>
              <input
                className='w-full h-[38px] text-right'
                type='number'
                placeholder='Amount'
                value={amountFrom.isGreaterThan(0) ? amountFrom.toFixed() : ''}
                onChange={(e: any) => {
                  changeAmount('from', e.target.value);
                }}
              />
              <div className='text-gray-500 text-sm'>
                <Label>
                  ≈{' '}
                  {amountFrom
                    .multipliedBy(priceFrom)
                    .decimalPlaces(4)
                    .toFixed()}
                  $
                </Label>
              </div>
            </div>
          </div>
        </div>
        <div className='text-center'>
          <a className='cursor-pointer' onClick={swapTokenOrder}>
            <FontAwesomeIcon
              icon={faArrowsRotate}
              className='text-main-color'
            />
          </a>
        </div>
        <div className='rounded-lg bg-neutral-100 py-4 px-3 mb-3'>
          <div className=''>
            <Label>To</Label>
          </div>
          <div className='flex flex-row gap-4'>
            <div className='w-50 flex-1'>
              <TokenSelector
                onChange={(tokenId: string) => changeToken('to', tokenId)}
                isSearchable={true}
                filter={getFilteredList(tokenFrom)}
                defaultValue={tokenList.includes(tokenTo) ? tokenTo : ''}
              />
            </div>
            <div className='w-50 position-relative flex-1 flex items-end flex-column'>
              <input
                className='w-full h-[38px] text-end bg-transparent pe-2'
                value={
                  tokenTo
                    ? formatAmount({
                        input: amountTo.toFixed(),
                        decimals: tokenInfo.hasToken(tokenTo)
                          ? tokenInfo.get(tokenTo, 'decimals')
                          : 0,
                        digits: 4,
                        addCommas: true,
                        showLastNonZeroDecimal: false
                      })
                    : 0
                }
                readOnly={true}
              />
              <div className='text-gray-500 text-sm'>
                <Label>
                  ≈{' '}
                  {amountTo
                    .multipliedBy(priceTo)
                    .dividedBy(
                      10 **
                        (tokenInfo.hasToken(tokenTo)
                          ? tokenInfo.get(tokenTo, 'decimals')
                          : 0)
                    )
                    .decimalPlaces(4)
                    .toFixed()}
                  $
                </Label>
              </div>
            </div>
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
              .isGreaterThan(balanceInfo.getBalance(tokenFrom))
          }
          onClick={() =>
            new_swap(
              address,
              tokenFrom,
              tokenTo,
              100,
              amountFrom.multipliedBy(
                10 ** tokenInfo.get(tokenFrom, 'decimals')
              )
            )
          }
        >
          Swap
        </Button>
      </Card>
    </div>
  );
};
