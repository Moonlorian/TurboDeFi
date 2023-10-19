import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { Label } from 'components';
import { useGetTokenInfo } from 'hooks';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const FormatEndpointField = ({
  output,
  field
}: {
  output: any;
  field: any;
}) => {
  const tokenInfo = useGetTokenInfo();

  return (
    <div
      className={`${
        field.balance ? 'font-weight-bold' : ''
      } flex align-items-center flex-wrap sm:flex-nowrap`}
    >
      {(field?.label || field?.name) && (
        <Label className='whitespace-nowrap'>
          {field?.label || field?.name}:{' '}
        </Label>
      )}
      <div className='flex whitespace-nowrap'>
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
      </div>
    </div>
  );
};
