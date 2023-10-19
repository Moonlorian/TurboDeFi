import type { PropsWithChildren } from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WithClassnameType } from 'types';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { ExplorerLink } from '@multiversx/sdk-dapp/UI';

interface CardType extends PropsWithChildren, WithClassnameType {
  title: string;
  description?: string;
  reference: string;
  address?: string;
}

export const Card = (props: CardType) => {
  const { title, children, description, reference, className, address } = props;

  return (
    <div
      className={`flex flex-wrap flex-col rounded-xl bg-white py-6 px-[4%] md:px-6 ${className}`}
      data-testid={props['data-testid']}
    >
      <span className='flex'>
        {title && (
          <h2 className='flex text-lg md:text-xl font-medium group text-uppercase items-baseline gap-2'>
            {title}
          </h2>
        )}
        {address && (
          <ExplorerLink page={`/address/${address}`} className='mb-2 pointer'>
            <FontAwesomeIcon
              title='Smart Contract'
              icon={faFileAlt}
              size='sm'
              className='text-secondary'
            />
          </ExplorerLink>
        )}
      </span>
      {description && <p className='text-gray-400 pb-0 mb-0'>{description}</p>}
      {reference != '' && (
        <a
          href={reference}
          target='_blank'
          className='group-hover:block text-main-color/70 text-lowercase md:text-lg text-base mb-6'
        >
          {reference}
        </a>
      )}
      {children}
    </div>
  );
};
