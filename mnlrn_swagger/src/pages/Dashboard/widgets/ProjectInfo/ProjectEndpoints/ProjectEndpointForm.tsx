import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import {
  Button,
  Card,
  TokenSelector,
  FormatAmount,
  Label,
  OutputContainer
} from 'components';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DataType } from 'StructReader';
import Executor from 'StructReader/Executor';
import { DashBorardStructReaderContext } from 'pages/Dashboard/Dashboard';
import PrettyPrinter from 'StructReader/PrettyPrinter';
import { useGetTokenInfo } from 'hooks';

//Wallet in proteo
//erd1kx38h2euvsgm8elhxttluwn4lm9mcua0vuuyv4heqmfa7xgg3smqkr3yaz

//wallet in seed captain
//erd1lwtuygl44xqlydzhmpcczsu2g2r53ptg52d02htn52vryd2zs8nquv0ahq

//wallet for test gnogen
//erd1jl3sunvv58tplcke6y0qg0zrr5tnwpg54ql9ngs8jad89tm2u8hqehey5y

export const ProjectEndpointForm = ({
  module,
  endpoint
}: {
  module: StructModule;
  endpoint: StructEndpoint;
}) => {
  const [fieldValues, setFieldValues] = useState<string[]>([]);
  const [response, setResponse] = useState<DataType[]>([]);

  const dashBorardStructReaderContext = useContext(
    DashBorardStructReaderContext
  );

  const tokenInfo = useGetTokenInfo();

  const executeEndpoint = () => {
    setResponse([]);
    Executor.exec(
      dashBorardStructReaderContext.structReader,
      module.name,
      endpoint.name,
      ...fieldValues
    ).then((output: any) => {
      const newResponse = Object.keys(output).map((field) => output[field]);
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

  useEffect(() => {
    const initialValues = (endpoint.inputs || []).map(() => '');
    setFieldValues(initialValues);
  }, []);

  return (
    <Form className='mb-3'>
      {endpoint.inputs?.map((input: DataType, index) => (
        <Form.Group key={index} className='mb-1'>
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
      ))}
      <Button onClick={executeEndpoint}>Execute</Button>

      <br />
      {response.length > 0 && (
        <OutputContainer>
          {response.map((output: DataType, index) => (
            <p
              className={`${output.balance ? 'font-weight-bold' : ''}`}
              key={index}
            >
              <Label>{output.label ?? output.name}:</Label>{' '}
              {output.balance ? (
                <FormatAmount
                  value={output.value.toFixed()}
                  decimals={tokenInfo.get(output.token || '', 'decimals')}
                  token={output.token || ''}
                  digits={4}
                />
              ) : (
                <>{output.value.toString()}</>
              )}
            </p>
          ))}
        </OutputContainer>
      )}
    </Form>
  );
};
