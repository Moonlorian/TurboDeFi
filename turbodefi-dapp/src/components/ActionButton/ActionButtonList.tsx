import { Button } from 'components/Button';

export const ActionButtonList = ({
  children,
  className = ''
}: {
  children?: any;
  className?: string;
}) => {
  const finalClassName = ['absolute', 'right-[1%]', 'flex', 'gap-1'];
  finalClassName.push(...className.split(' '));

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
