import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import {
  Button,
  Card,
  TokenSelector,
  OutputContainer,
  Input
} from 'components';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { DataType } from 'StructReader';
import Executor from 'StructReader/Executor';
import PrettyPrinter from 'StructReader/PrettyPrinter';
import {
  useGetAccountInfo,
  useGetPendingTransactions,
  useGetTokenInfo,
  useGetTokensBalanceInfo
} from 'hooks';
import StructReader from 'StructReader/StructReader';
import { ShowEndpointData } from './ShowEndpointData';
import BigNumber from 'bignumber.js';
import { CHAIN_ID, GATEWAY_URL } from 'config';

export const ProjectEndpointForm = ({
  module,
  endpoint,
  structReader,
  className = ''
}: {
  module: StructModule;
  endpoint: StructEndpoint;
  structReader: StructReader;
  className?: string;
}) => {
  const [fieldValues, setFieldValues] = useState<string[]>([]);
  const [response, setResponse] = useState<DataType[]>([]);
  const [executeAction, setExecuteAction] = useState(false);
  const [showExecuteBtn, setShowExecuteBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const tokenInfo = useGetTokenInfo();
  const balanceInfo = useGetTokensBalanceInfo();
  const { address } = useGetAccountInfo();
  const { pendingTransactions } = useGetPendingTransactions();

  const executeEndpoint = () => {
    setResponse([]);
    setIsLoading(true);

    //Alwais use endpoint name to execute it. internally, the execcute function uses endpoint instead
    Executor.exec(
      GATEWAY_URL,
      CHAIN_ID,
      structReader,
      module.name,
      endpoint.name,
      {
        address: address
      },
      ...fieldValues.map((value, index) => formatInputField(value, index))
    )
      .then((output: any) => {
        const newResponse = Object.keys(output).map((field) => output[field]);
        setIsLoading(false);
        setResponse(newResponse);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setResponse([
          {
            name: 'error',
            label: 'Error',
            value: 'An error has occurred',
            type: 'bytes'
          }
        ]);
      });
  };

  const updateValue = useCallback(
    (index: any, value: any) => {
      const newFieldValues = [...fieldValues];
      newFieldValues[index] = value;
      setFieldValues(newFieldValues);
    },
    [fieldValues]
  );

  const showField = useCallback(
    (index: number) => {
      if (
        endpoint.inputs[index].hidden ||
        (endpoint.inputs[index].type == 'Address' && fieldValues[index])
      )
        return false;

      //TODO ==> Right now, only address fields will be hidden to users
      return true;
    },
    [fieldValues, endpoint.inputs]
  );

  const formatInputField = useCallback(
    (value: any, index: number) => {
      const input = endpoint.inputs[index];
      //When a field has an associated token, it can not be an array
      if (
        input.type === 'BigUint' &&
        input.token &&
        !Array.isArray(input.token)
      ) {
        return new BigNumber(value)
          .multipliedBy(
            10 **
              tokenInfo.get(
                getTokenFromInputList(input.token || ''),
                'decimals'
              )
          )
          .toFixed();
      }

      return value;
    },
    [fieldValues, endpoint.inputs]
  );
  const getTokenFromInputList = useCallback(
    (tokenName: string) => {
      for (let i = 0; i < endpoint.inputs.length; i++) {
        if (endpoint.inputs[i].name === tokenName) return fieldValues[i];
      }
      return tokenName;
    },
    [fieldValues, endpoint.inputs]
  );

  const showOutput = useMemo(() => {
    return response.length > 0 || isLoading;
  }, [response, isLoading]);

  const projectUrl = useMemo(
    () => structReader.getProject().projectUrl,
    [structReader]
  );

  useEffect(() => {
    if (!executeAction) return;
    executeEndpoint();
    setExecuteAction(false);
  }, [executeAction]);

  useEffect(() => {
    const initialValues = (endpoint.inputs || []).map((input, index) => {
      if (input.defaultValue) return input.defaultValue;
      if (input.type == 'Address') return fieldValues[index] || address;
      if (
        input.type == 'EgldOrEsdtTokenIdentifier' ||
        input.type == 'TokenIdentifier'
      ) {
        if (Array.isArray(input.token)) return input.token[0];
        return fieldValues[index] || input.token || endpoint.token || '';
      }
      return fieldValues[index];
    });
    //TODO ==> Get payable in tokens
    setFieldValues(initialValues);

    if (
      endpoint.readonly &&
      initialValues.filter((data) => data).length === initialValues.length
    ) {
      setExecuteAction(true);
      setShowExecuteBtn(false);
    }
  }, [pendingTransactions]);
  console.log(endpoint.inputs);
  return (
    <Card
      className={`flex-2 ${className}`}
      key={'projectEndpoint_' + endpoint.name}
      title={endpoint.label || endpoint.name}
      description={endpoint.description}
      reference={''}
      address={endpoint.address}
    >
      {endpoint.notImplemented ? (
        <p>
          Not integrated yet!
          {projectUrl && (
            <span>
              Visit <a href={projectUrl}>{projectUrl}</a> for more information
            </span>
          )}
        </p>
      ) : (
        <div className='mb-3'>
          {endpoint.inputs?.map((input: DataType, index) => (
            <Fragment key={index}>
              {showField(index) && (
                <>
                  <div className='mb-1'>
                    <label className='mb-[0.5rem]'>
                      {input.label || input.name}
                    </label>
                    {(input.type == 'TokenIdentifier' ||
                      input.type == 'EgldOrTokenIdentifier') &&
                    !input.fixedValue ? (
                      <TokenSelector
                        onChange={(tokenId: string) => {
                          updateValue(index, tokenId);
                        }}
                        placeHolder='Token'
                        defaultValue={
                          input.defaultValue || input.token || endpoint.token
                        }
                        filter={input.token ? [input.token].flat() : []}
                      />
                    ) : (
                      <div className='w-full position-relative flex-1 flex items-end flex-column'>
                        {input.token && input.type == 'BigUint' && (
                          <span
                            className='flex-0 text-sm cursor-pointer rounded-md text-white position-absolute top-[15%] left-[1%] bg-main-color hover:bg-main-color/70 p-1 px-2'
                            onClick={() => {
                              updateValue(
                                index,
                                input?.token
                                  ? balanceInfo
                                      .getBalance(input.token.toString())
                                      .dividedBy(
                                        10 **
                                          tokenInfo.get(
                                            input.token.toString(),
                                            'decimals'
                                          )
                                      )
                                  : new BigNumber(0)
                              );
                            }}
                          >
                            max
                          </span>
                        )}
                        <Input
                          type={PrettyPrinter.getFormInputType(input.type)}
                          readOnly={input.fixedValue}
                          placeholder={input.label}
                          value={fieldValues[index] ?? ''}
                          className={`w-full ${input.type == 'BigUint' ? 'text-right' : ''}`}
                          onChange={(e: any) => {
                            updateValue(index, e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </Fragment>
          ))}
          <>
            {showExecuteBtn && (
              <Button disabled={!address} onClick={executeEndpoint}>
                {endpoint.buttonLabel || 'Execute'}
              </Button>
            )}
          </>
          {showOutput && (
            <OutputContainer isLoading={isLoading}>
              {response.length > 0 && (
                <ShowEndpointData
                  output={response.length == 1 ? response[0] : response}
                  endpoint={endpoint}
                />
              )}
            </OutputContainer>
          )}
        </div>
      )}
    </Card>
  );
};
