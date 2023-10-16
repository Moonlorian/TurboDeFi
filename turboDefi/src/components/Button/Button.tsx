import type { PropsWithChildren, MouseEvent } from 'react';
import { WithClassnameType } from 'types';

interface ButtonType extends WithClassnameType, PropsWithChildren {
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
  dataTestId?: string;
  dataCy?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  dataTestId,
  dataCy,
  type = 'button',
  id,
  className = ''
}: ButtonType) => {
  const defaultClassName = 'bg-main-color inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-white hover:bg-main-color/80 mr-0 disabled:bg-main-color/20 disabled:text-black disabled:cursor-not-allowed';
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
