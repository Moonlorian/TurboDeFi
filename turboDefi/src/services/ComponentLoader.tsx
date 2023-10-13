import React, { ReactNode } from 'react';
import { AshSwap } from '../pages/AshSwap';

const COMPONENTS: { [key: string]: any } = {
  ['AshSwap']: AshSwap
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
