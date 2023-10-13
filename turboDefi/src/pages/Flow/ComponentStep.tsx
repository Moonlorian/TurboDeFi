import { FlowStepType } from './Flow';
import { ComponentLoader } from 'services';

export const ComponentStep = (
  {
    step,
    props
  }: {
    step: FlowStepType,
    props: any
  }) => {
  return (
    <div className='border'>
      <ComponentLoader componentName={step.component || ''} props={props} />
    </div>
  );
};
