import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { Loader } from 'components/sdkDappComponents';
import { WithClassnameType } from 'types';

interface OutputContainerPropsType
  extends PropsWithChildren,
    WithClassnameType {
  isLoading?: boolean;
}

export const OutputContainer = (props: OutputContainerPropsType) => {
  const { children, isLoading = false, className = 'pl-2' } = props;

  return (
    <div
      className={classNames(
        'border-gray-200 rounded overflow-auto',
        className
      )}
      data-testid={props['data-testid']}
    >
      {isLoading ? <Loader /> : children}
    </div>
  );
};
