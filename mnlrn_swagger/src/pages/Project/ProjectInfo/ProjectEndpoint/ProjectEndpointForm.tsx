import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import {
  Button,
  Card,
  TokenSelector,
  Label,
  OutputContainer
} from 'components';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DataType } from 'StructReader';
import Executor from 'StructReader/Executor';
import PrettyPrinter from 'StructReader/PrettyPrinter';
import { useGetAccountInfo, useGetTokenInfo } from 'hooks';
import StructReader from 'StructReader/StructReader';
import { ShowEndpointData } from './ShowEndpointData';

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

  const { address } = useGetAccountInfo();

  const executeEndpoint = () => {
    const endpointName =
      endpoint.endpoint != '' ? endpoint.endpoint : endpoint.name;

    setResponse([]);
    setIsLoading(true);
    Executor.exec(
      structReader,
      module.name,
      endpointName || '',
      ...fieldValues
    ).then((output: any) => {
      const newResponse = Object.keys(output).map((field) => output[field]);
      setIsLoading(false);
      setResponse(newResponse);
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
    const initialValues = (endpoint.inputs || []).map((input) => {
      if (input.type == 'Address') return address;
      return '';
    });

    setFieldValues(initialValues);

    if (
      endpoint.readonly &&
      initialValues.filter((data) => data).length === initialValues.length
    ) {
      setExecuteAction(true);
      setShowExecuteBtn(false);
    }
  }, []);

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
              {fieldValues.filter((data) => !data).length > 0 && (
                <>
                  {input.type != 'Address' && (
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
                  )}
                </>
              )}
            </Fragment>
          ))}
          <>
            {showExecuteBtn && (
              <Button disabled={!address} onClick={executeEndpoint}>
                Execute
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
