import { WithClassnameType, WithTransactionType } from '@multiversx/sdk-dapp/UI/types';
import { ExplorerLink, Trim } from '@multiversx/sdk-dapp/UI';
import { DataTestIdsEnum } from '@multiversx/sdk-dapp/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons/faShareSquare';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TransactionServerStatusesEnum } from '@multiversx/sdk-dapp/types';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton/CopyButton';

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
        className={`mr-1 ${txIsSucces ? 'text-green-500' : 'text-red-400'}`}
      />
      <CopyButton text={transaction.txHash} className={`mx-2 text-secondary`}/>
      <ExplorerLink
        page={transactionHashLink}
        data-testid={DataTestIdsEnum.transactionLink}
        className="w-100 transaction-cell-margin transaction-cell-overflow transaction-cell-link"
      >
        <FontAwesomeIcon
          title={transaction.txHash}
          icon={faShareSquare}
          className={`mr-1 text-secondary`}
        />
      </ExplorerLink>
    </div>
  );
};
