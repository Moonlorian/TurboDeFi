export type FlowType = {
  type?: 'user' | 'system' | 'forbidden';
  id: number;
  name: string;
  label: string;
  description: string;
  steps: FlowStepType[];
};

export type FlowStepType = {
  flowId?: number;
  type?: 'user' | 'system' | 'forbidden';
  index?: number;
  label?: string;
  description: string;
  endpoints?: FlowEndpointType[];
  component?: string;
  componentProps?: {
    defaultTokenFrom?: string;
    defaultTokenTo?: string;
  };
};

export type FlowEndpointType = {
  type?: 'user' | 'system' | 'forbidden';
  id: number;
  project?: string;
  module?: string;
  endpoint?: string;
};
