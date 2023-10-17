import { Button } from 'components/Button';

export const ActionButton = ({
  action,
  children,
  className = ''
}: {
  action?: any;
  children?: any;
  className?: string;
}) => {
  const finalClassName = ['text-white'];
  finalClassName.push(...className.split(' '));
  return (
    <Button
      onClick={action}
      className={finalClassName
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(' ')}
    >
      {children}
    </Button>
  );
};
