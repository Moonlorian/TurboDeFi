import { WithClassnameType, WithTransactionType } from '@multiversx/sdk-dapp/UI/types';
import { ExplorerLink } from '@multiversx/sdk-dapp/UI';
import { DataTestIdsEnum } from '@multiversx/sdk-dapp/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TransactionServerStatusesEnum } from '@multiversx/sdk-dapp/types';

export const ScannerTransactionHash = ({
  className,
  transaction
}: WithTransactionType & WithClassnameType) => {
  const transactionHashLink = `/transactions/${transaction.originalTxHash
    ? `${transaction.originalTxHash}#${transaction.txHash}`
    : transaction.txHash
    }`;

  const txIsSucces = transaction.status == TransactionServerStatusesEnum.success;

  return (
    <div
      className={`d-flex align-items-center transaction-cell ${className}`}
    >
      <FontAwesomeIcon
        title={transaction.txHash}
        icon={txIsSucces ? faCheckCircle : faTimes}
        size='lg'
        className={`mr-1 ${txIsSucces ? 'text-green-500' : 'text-red-400'}`}
      />
      <ExplorerLink
        page={transactionHashLink}
        data-testid={DataTestIdsEnum.transactionLink}
        className="w-100 transaction-cell-margin transaction-cell-overflow transaction-cell-link"
      >
        <FontAwesomeIcon
          title={transaction.txHash}
          icon={faMagnifyingGlass}
          size='sm'
          className={`mr-1 text-secondary`}
        />
      </ExplorerLink>
    </div>
  );
};
