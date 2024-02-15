import { Button } from 'components/Button';

export const ActionButton = ({
  action,
  children,
  className = '',
  disabled = false,
  color = 'white',
  bgColor
}: {
  action?: any;
  children?: any;
  className?: string;
  disabled?:boolean;
  color?: string;
  bgColor?: string;
}) => {
  const finalClassName = [];
  finalClassName.push(...className.split(' '));
  return (
    <Button
      disabled={disabled}
      onClick={action}
      className={finalClassName
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(' ')}
      color={color}
      bgColor={bgColor}
    >
      {children}
    </Button>
  );
};
