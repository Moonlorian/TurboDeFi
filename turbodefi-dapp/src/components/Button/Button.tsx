import type { PropsWithChildren, MouseEvent } from 'react';
import { WithClassnameType } from 'types';

interface ButtonType extends WithClassnameType, PropsWithChildren {
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
  dataTestId?: string;
  dataCy?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  color?: string;
  bgColor?: string;
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  dataTestId,
  dataCy,
  type = 'button',
  id,
  className = '',
  color = 'white',
  bgColor = 'main-color'

}: ButtonType) => {
  const defaultClassName = `bg-${bgColor} inline-block rounded-lg px-[1rem] py-2 text-center hover:no-underline my-0 text-${color} hover:opacity-80 mr-0 disabled:opacity-50 disabled:cursor-not-allowed`;
  return (
    <button
      id={id}
      data-cy={dataCy}
      data-test-id={dataTestId}
      disabled={disabled}
      onClick={onClick}
      className={`${defaultClassName} ${className}`}
      type={type}
    >
      {children}
    </button>
  );
};
