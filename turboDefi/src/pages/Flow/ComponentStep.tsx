import { FlowStepType } from './Flow';
import { AshSwap } from 'pages/AshSwap';
import React from 'react';
import { ComponentLoader } from 'services';

export const ComponentStep = ({ step }: { step: FlowStepType }) => {
  return (
    <div className='border'>
      <ComponentLoader componentName={step.component || ''} />
    </div>
  );
};
