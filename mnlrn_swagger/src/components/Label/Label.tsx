import { PropsWithChildren } from 'react';

export const Label = ({ children }: PropsWithChildren) => {
  return <label className='text-gray-500 mr-1'>{children}</label>;
};
