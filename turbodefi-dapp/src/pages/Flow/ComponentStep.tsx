import { ComponentLoader } from 'services';
import { FlowStepType } from 'types';

export const ComponentStep = ({
  step,
  props
}: {
  step: FlowStepType;
  props: any;
}) => {
  return (
    <>
      {step.component && (
        <div className='border'>
          <ComponentLoader componentName={step.component || ''} props={props} />
        </div>
      )}
    </>
  );
};
