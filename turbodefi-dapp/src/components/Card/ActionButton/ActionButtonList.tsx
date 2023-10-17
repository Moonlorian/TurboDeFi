import { Button } from 'components/Button';

export const ActionButtonList = ({
  children,
  className
}: {
  children?: any;
  className?: string;
}) => {
  const finalClassName = ['absolute'];
  if (className) {
    finalClassName.push(...(className).split(' '));
  }
  return (
    <div
      className={finalClassName
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(' ')}
    >
      {children}
    </div>
  );
};
