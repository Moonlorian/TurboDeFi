import { formatAmount } from "@multiversx/sdk-dapp/utils/operations/formatAmount";
import { Label } from "components";
import { useGetTokenInfo } from "hooks";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const FormatEndpointField = ({ output, field }: { output: any; field: any }) => {
    const tokenInfo = useGetTokenInfo();
    return (
      <div
        className={`${
          field.balance ? 'font-weight-bold' : ''
        } d-flex align-items-center`}
      >
        {(field?.label || field?.name) && (
          <Label>{field?.label || field?.name}: </Label>
        )}
        {field.balance ? (
          <div>
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
        {field.token && (
          <>
            {tokenInfo.get(field?.token || '', 'assets').svgUrl ? (
              <OverlayTrigger
                overlay={
                  <Tooltip>{tokenInfo.get(field?.token || '', 'ticker')}</Tooltip>
                }
                placement='top'
                delay={150}
              >
                <img
                  className='ms-2 max-h-6'
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
    );
  };