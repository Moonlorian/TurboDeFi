import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import { Button, Card, Label, OutputContainer } from 'components';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DataType } from 'StructReader';
import Executor from 'StructReader/Executor';
import { DashBorardStructReaderContext } from 'pages/Dashboard/Dashboard';
import PrettyPrinter from 'StructReader/PrettyPrinter';

//erd1kx38h2euvsgm8elhxttluwn4lm9mcua0vuuyv4heqmfa7xgg3smqkr3yaz

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

  const executeEndpoint = () => {
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
      console.log('Update index: ', index, 'this value: ', value);
      const newFieldValues = fieldValues.map((data: any, subIndex: number) =>
        index === subIndex ? value : data
      );
      console.log(newFieldValues);
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
          <Form.Label>{input.label}</Form.Label>
          <Form.Control
            type={PrettyPrinter.getFormInputType(input.type)}
            placeholder={input.label}
            value={fieldValues[index] ?? ''}
            onChange={(e: any) => {
              console.log('update index: ', index);
              updateValue(index, e.target.value);
            }}
          />
        </Form.Group>
      ))}
      <Button onClick={executeEndpoint}>Execute</Button>
      <Button
        onClick={() => {
          setResponse([]);
        }}
      >
        Clear
      </Button>
      <br />
      {response.length > 0 && (
        <OutputContainer>
          {response.map((output: DataType, index) => (
            <p
              className={`${output.balance ? 'font-weight-bold' : ''}`}
              key={index}
            >
              <Label>{output.label ?? output.name}:</Label>{' '}
              {output.value.toString()} {output.balance && endpoint.token}
            </p>
          ))}
        </OutputContainer>
      )}
    </Form>
  );
};