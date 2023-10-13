import { FlowStepType } from './Flow';
import { ComponentLoader } from 'services';

export const ComponentStep = ({ step }: { step: FlowStepType }) => {
  return (
    <div className='border'>
      <ComponentLoader componentName={step.component || ''} />
    </div>
  );
};
