import { StakeList } from 'components/StakeInfo';
import { AshSwap } from '../components/AshSwap';
import React, { ReactNode } from 'react';


const COMPONENTS: { [key: string]: any } = {
  ['AshSwap']: AshSwap,
  ['NativeStaking']: StakeList
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

  return React.createElement(COMPONENTS[componentName], props, children);
};
