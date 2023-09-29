import { DataType } from 'StructReader';
import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import StructProject from 'StructReader/StructParts/StructProject';
import StructReader from 'StructReader/StructReader';
import { Card, Label, OutputContainer } from 'components';
import { useMemo } from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { ProjectEndpointForm } from './ProjectEndpointForm';

export const ProjectEndpoint = ({
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
  return (
    <Accordion.Item eventKey={endpoint.name}>
      <Accordion.Header>{endpoint.name}</Accordion.Header>
      <Accordion.Body>
        {endpoint.description}
        <ProjectEndpointForm
          selectedFileName={selectedFileName}
          structReader={structReader}
          module={module}
          endpoint={endpoint}
        />
      </Accordion.Body>
    </Accordion.Item>
  );
};
