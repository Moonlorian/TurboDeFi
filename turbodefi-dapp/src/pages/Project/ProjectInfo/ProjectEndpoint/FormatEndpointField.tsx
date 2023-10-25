import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { Label } from 'components';
import { useGetTokenInfo, useGetTokenUSDPrices } from 'hooks';
import { useContext, useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import BigNumber from 'bignumber.js';
import UsdValueContext from './UsdValueContext';

export const FormatEndpointField = ({
  output,
  field
}: {
  output: any;
  field: any;
}) => {
  const [priceInUsd, setPriceInUsd] = useState<BigNumber>(new BigNumber(0));

  const tokenInfo = useGetTokenInfo();
  const priceInfo = useGetTokenUSDPrices();

  const { totalUsdValue, handleUpdateTotalUsdValue } = useContext(UsdValueContext);

  useEffect(() => {
    if (field.balance && field?.token) {
      priceInfo.loadPrices([field.token]);
    }
  }, [field.balance, field.token]);

  useEffect(() => {
    if (
      field.token &&
      field.balance &&
      priceInfo.tokensPrice[field.token] &&
      priceInfo.tokensPrice[field.token].isGreaterThan(0) &&
      priceInUsd.isZero()
    ) {
      const newPrice = priceInfo
        .getPrice(field?.token)
        .multipliedBy(field.value ?? field)
        .dividedBy(10 ** tokenInfo.get(field.token, 'decimals'));
      setPriceInUsd(newPrice);
    }
  }, [priceInfo.tokensPrice[field.token]]);

  useEffect(() => {
    if (priceInUsd.isGreaterThan(0)) {
      handleUpdateTotalUsdValue(priceInUsd);
    }
  }, [priceInUsd]);

  return (
    <div
      className={`${field.balance ? 'font-weight-bold' : ''
        } flex align-items-center flex-wrap sm:flex-nowrap`}
    >
      {(field?.label || field?.name) && (
        <Label className='whitespace-nowrap'>
          {field?.label || field?.name}:{' '}
        </Label>
      )}
      <div className='flex whitespace-nowrap items-center'>
        {field.balance && tokenInfo.hasToken(field.token) ? (
          <div className='whitespace-nowrap'>
            {formatAmount({
              input: (field.value ?? field).toFixed(),
              decimals: tokenInfo.get(field?.token || '', 'decimals'),
              digits: 5,
              addCommas: true,
              showLastNonZeroDecimal: false
            })}
          </div>
        ) : (
          <>{(field.value ?? field).toString()}</>
        )}
        {field.token != '' && tokenInfo.hasToken(field.token) && (
          <>
            {tokenInfo.get(field?.token || '', 'assets').svgUrl ? (
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    {tokenInfo.get(field?.token || '', 'ticker')}
                  </Tooltip>
                }
                placement='top'
                delay={150}
              >
                <img
                  className='ms-2 w-[24px]'
                  src={tokenInfo.get(field?.token || '', 'assets').svgUrl}
                  alt={tokenInfo.get(field?.token || '', 'ticker')}
                />
              </OverlayTrigger>
            ) : (
              <div className='ms-2 max-h-6'>
                {tokenInfo.get(field?.token || '', 'ticker')}
              </div>
            )}
          </>
        )}
        {priceInfo.getPrice(field?.token).isGreaterThan(0) && (
          <span className='text-gray-500 text-sm pt-[0.5px]'>{`($${formatAmount({
            input: priceInfo.getPrice(field?.token).multipliedBy(field.value ?? field).toFixed(0),
            decimals: tokenInfo.get(field?.token || '', 'decimals'),
            digits: 2,
            showIsLessThanDecimalsLabel: true,
            addCommas: true,
            showLastNonZeroDecimal: false
          })})`}</span>
        )}
      </div>
    </div>
  );
};
