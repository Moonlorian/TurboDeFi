import classNames from 'classnames';
export const Input = (props: any) => {
  return (
    <input
      {...props}
      className={classNames(
        'placeholder-black/70 w-full py-[0.375rem] px-[0.75rem] text-base border rounded focus:border-blue-300 focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,.25)]',
        props?.className
      )}
    />
  );
};
