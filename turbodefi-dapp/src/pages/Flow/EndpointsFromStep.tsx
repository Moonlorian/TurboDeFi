import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from 'pages/Project/ProjectInfo';
import { useEffect, useState } from 'react';
import { environment } from 'config';
import { FlowStepType } from 'types';
import { EndpointStep } from './EndpointStep';

export const EndpointsFromStep = ({ step }: { step: FlowStepType }) => {
  return (
    <>
      {step.endpoints?.map((endpoint, index) => (
        <EndpointStep endpoint={endpoint} key={index} />
      ))}
    </>
  );
};
