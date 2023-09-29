import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import StructProject from 'StructReader/StructParts/StructProject';
import StructReader from 'StructReader/StructReader';
import { Button, Card, Label, OutputContainer } from 'components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { ProjectEndpoint } from './ProjectEndpoint';
import { DataType } from 'StructReader';
import Executor from 'StructReader/Executor';

export const ProjectEndpointForm = ({
  selectedFileName,
  structReader,
  module,
  endpoint
}: {
  selectedFileName: string;
  structReader: StructReader;
  module: StructModule;
  endpoint: StructEndpoint;
}) => {
  const [fieldValues, setFieldValues] = useState<string[]>([]);
  const [response, setResponse] = useState<DataType[]>([]);
  const executeEndpoint = () => {
    Executor.exec(
      structReader,
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
      const newFieldValues = fieldValues.map((data: any, subIndex: number) =>
        data + (index === subIndex) ? value : ''
      );
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
            type=''
            placeholder={input.label}
            value={fieldValues[index] ?? ''}
            onChange={(e: any) => {
              updateValue(index, e.target.value);
            }}
          />
        </Form.Group>
      ))}
      <Button onClick={executeEndpoint}>Execute</Button>
      <Button onClick={() => {setResponse([])}}>Clear</Button>
      <br />
      {response.length > 0 && (
        <OutputContainer>
          {response.map((output: DataType, index) => (
            <p key={index}>
              <Label>{output.label ?? output.name}:</Label>{" "}
              {output.value.toString()}
            </p>
          ))}
        </OutputContainer>
      )}
    </Form>
  );
};
