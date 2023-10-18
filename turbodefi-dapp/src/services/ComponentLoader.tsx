import { StakeList } from 'components/StakeInfo';
import { AshSwap } from '../components/AshSwap';
import React, { ComponentClass, FunctionComponent, ReactNode } from 'react';

type componentType = {
  label: string;
  component: string | FunctionComponent<any> | ComponentClass<any, any>
};

export const COMPONENTS: { [key: string]: componentType } = {
  ['AshSwap']: { label: 'Ash swap', component: AshSwap },
  ['NativeStaking']: { label: 'Native staking', component: StakeList }
};

export const ComponentLoader = ({
  componentName,
  props,
  children
}: {
  componentName: string;
  props?: any;
  children?: ReactNode[];
}) => {
  if (!COMPONENTS[componentName]) return <></>;

  return React.createElement(COMPONENTS[componentName].component, props, children);
};
