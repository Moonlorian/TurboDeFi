import { Button } from 'components/Button';

export const ActionButton = ({
  action,
  children,
  className
}: {
  action: any;
  children: any;
  className: string;
}) => {
  const finalClassName = [];
  finalClassName.push(...className.split(' '));
  return (
    <div
      className={finalClassName
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(' ')}
    >
      <Button onClick={action}>{children}</Button>
    </div>
  );
};