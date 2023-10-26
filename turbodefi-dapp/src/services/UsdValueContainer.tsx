import React, { useContext, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';

export const UsdValueContext = React.createContext({
  totalUsdValue: new BigNumber(0),
  handleUpdateTotalUsdValue: (priceInUsd: BigNumber) => {}
});

export const UsdValueProvider = ({ children }: { children: any }) => {
  const [totalUsdValue, setTotalUsdValue] = useState<BigNumber>(
    new BigNumber(0)
  );

  const handleUpdateTotalUsdValue = (valueToAdd: BigNumber) => {
    setTotalUsdValue((total) => {
      return total.plus(valueToAdd);
    });
  };

  return (
    <UsdValueContext.Provider
      value={{ totalUsdValue, handleUpdateTotalUsdValue }}
    >
      {children}
    </UsdValueContext.Provider>
  );
};
export const UsdValueContainer = () => {
  const [totalUsdValue, setTotalUsdValue] = useState<BigNumber>(
    new BigNumber(0)
  );

  const usdValueContext = useContext(UsdValueContext);
  const decimals = 6;

  useEffect(() => {
    setTotalUsdValue(usdValueContext.totalUsdValue);
  }, [usdValueContext.totalUsdValue]);

  return (
    <>
      {totalUsdValue.isZero() ? (
        <></>
      ) : (
        <span>
          {'$(' +
            formatAmount({
              input: totalUsdValue.multipliedBy(10 ** decimals).toFixed(0),
              decimals: decimals,
              digits: 2,
              addCommas: true,
              showLastNonZeroDecimal: false
            }) +
            ')'}
        </span>
      )}
    </>
  );
};
