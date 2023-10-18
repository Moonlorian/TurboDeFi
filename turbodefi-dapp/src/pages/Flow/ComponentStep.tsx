import { ComponentLoader } from 'services';
import { FlowStepType } from 'types';

export const ComponentStep = ({
  step,
  props
}: {
  step: FlowStepType;
  props: any;
}) => {
  return <ComponentLoader componentName={step.component || ''} props={props} />;
};
