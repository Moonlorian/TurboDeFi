import { Button } from 'components/Button';

export const ActionButton = ({
  action,
  children,
  className = '',
  disabled = false
}: {
  action?: any;
  children?: any;
  className?: string;
  disabled?:boolean;
}) => {
  const finalClassName = ['text-white'];
  finalClassName.push(...className.split(' '));
  return (
    <Button
      disabled={disabled}
      onClick={action}
      className={finalClassName
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(' ')}
    >
      {children}
    </Button>
  );
};
