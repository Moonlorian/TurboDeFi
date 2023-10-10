import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import { Button, Card, TokenSelector, OutputContainer } from 'components';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DataType } from 'StructReader';
import Executor from 'StructReader/Executor';
import PrettyPrinter from 'StructReader/PrettyPrinter';
import {
  useGetAccountInfo,
  useGetPendingTransactions,
  useGetTokenInfo
} from 'hooks';
import StructReader from 'StructReader/StructReader';
import { ShowEndpointData } from './ShowEndpointData';
import BigNumber from 'bignumber.js';

//Wallet in proteo
//erd1kx38h2euvsgm8elhxttluwn4lm9mcua0vuuyv4heqmfa7xgg3smqkr3yaz

//wallet in seed captain
//erd1lwtuygl44xqlydzhmpcczsu2g2r53ptg52d02htn52vryd2zs8nquv0ahq

//wallet for test gnogen
//erd1jl3sunvv58tplcke6y0qg0zrr5tnwpg54ql9ngs8jad89tm2u8hqehey5y

//erd1hrh4gdjc506v5mhd74lv44mmwha66a4tk4mnjse48ka20ddatmyq42n5jy

export const ProjectEndpointForm = ({
  module,
  endpoint,
  structReader
}: {
  module: StructModule;
  endpoint: StructEndpoint;
  structReader: StructReader;
}) => {
  const [fieldValues, setFieldValues] = useState<string[]>([]);
  const [response, setResponse] = useState<DataType[]>([]);
  const [executeAction, setExecuteAction] = useState(false);
  const [showExecuteBtn, setShowExecuteBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const tokenInfo = useGetTokenInfo();
  const { address } = useGetAccountInfo();
  const { pendingTransactions } = useGetPendingTransactions();

  const executeEndpoint = () => {
    setResponse([]);
    setIsLoading(true);

    //Alwais use endpoint name to execute it. internally, the execcute function uses endpoint instead
    Executor.exec(
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
      if (endpoint.inputs[index].type == 'Address' && fieldValues[index])
        return false;

      //TODO ==> Right now, only address fields will be hidden to users
      return true;
    },
    [fieldValues, endpoint.inputs]
  );

  const formatInputField = useCallback(
    (value: any, index: number) => {
      const input = endpoint.inputs[index];
      if (input.type === 'BigUint' && input.token != '') {
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
      if (input.type == 'Address') return fieldValues[index] || address;
      if (
        input.type == 'EgldOrEsdtTokenIdentifier' ||
        input.type == 'TokenIdentifier'
      )
        return fieldValues[index] || input.token || endpoint.token || '';
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

  return (
    <Card
      className='flex-2 border my-2'
      key={'projectEndpoint_' + endpoint.name}
      title={endpoint.label || endpoint.name}
      description={endpoint.description}
      reference={''}
    >
      {endpoint.notImplemented ? (
        <p>
          Not implemented in this version.
          {projectUrl && (
            <span>
              Visit <a href={projectUrl}>{projectUrl}</a> for more information
            </span>
          )}
        </p>
      ) : (
        <Form className='mb-3'>
          {endpoint.inputs?.map((input: DataType, index) => (
            <Fragment key={index}>
              {showField(index) && (
                <>
                  <Form.Group className='mb-1'>
                    <Form.Label>{input.label || input.name}</Form.Label>
                    {input.type == 'TokenIdentifier' ||
                    input.type == 'EgldOrTokenIdentifier' ? (
                      <TokenSelector
                        onChange={(tokenId: string) => {
                          updateValue(index, tokenId);
                        }}
                        placeHolder='Token'
                        defaultValue={input.token || endpoint.token}
                      />
                    ) : (
                      <Form.Control
                        type={PrettyPrinter.getFormInputType(input.type)}
                        placeholder={input.label}
                        value={fieldValues[index] ?? ''}
                        onChange={(e: any) => {
                          updateValue(index, e.target.value);
                        }}
                      />
                    )}
                  </Form.Group>
                </>
              )}
            </Fragment>
          ))}
          <>
            {showExecuteBtn && (
              <Button disabled={!address} onClick={executeEndpoint}>
                { endpoint.buttonLabel || 'Execute'}
              </Button>
            )}
          </>
          <br />
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
        </Form>
      )}
    </Card>
  );
};
