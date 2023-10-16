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
      className={`flex flex-col rounded-xl bg-white p-6 ${className}`}
      data-testid={props['data-testid']}
    >
      <span className='flex items-center'>
        <h2 className='flex text-xl font-medium group text-uppercase'>
          {title}
          {reference && (
            <a
              href={reference}
              target='_blank'
              className='hidden group-hover:block ml-2 text-blue-600'
            >
              <FontAwesomeIcon icon={faInfoCircle} size='sm' />
            </a>
          )}
        </h2>
        {address &&
          <ExplorerLink
            page={`/address/${address}`}
            className="mb-2 pointer"
          >
            <FontAwesomeIcon
              title='Smart Contract'
              icon={faFileAlt}
              size='sm'
              className='text-secondary'
            />
          </ExplorerLink>
        }
      </span>
      {description && <p className='text-gray-400 mb-6'>{description}</p>}
      {children}
    </div>
  );
};