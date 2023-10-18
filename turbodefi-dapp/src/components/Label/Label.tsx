import { PropsWithChildren } from 'react';

export const Label = ({
  children,
  className = ''
}: PropsWithChildren & { className?: string }) => {

  return <label className={`${className} text-gray-500 mr-1`}>{children}</label>;
};
