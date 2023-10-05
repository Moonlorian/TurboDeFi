import classNames from 'classnames';
import {
  TimeAgo,
  TransactionMethod,
  TransactionReceiver,
  TransactionValue,
} from '@multiversx/sdk-dapp/UI';
import {
  WithClassnameType,
  WithTransactionType
} from '@multiversx/sdk-dapp/UI/types';
import { ScannerTransactionHash } from './ScannerTransactionHash';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface TransactionRowPropsType
  extends WithTransactionType,
  WithClassnameType {
  showDirectionCol?: boolean;
  showLockedAccounts?: boolean;
  receiverDetails: any;
}

export const ScannerTransactionRow = ({
  className,
  transaction,
  showDirectionCol,
  showLockedAccounts,
  receiverDetails
}: TransactionRowPropsType) => {
  return (
    <tr className={classNames(className, { new: transaction.isNew })}>
      <td>
        <ScannerTransactionHash transaction={transaction} />
      </td>

      <td>
        <div className='d-flex align-items-center'>
          <TransactionReceiver {...{ transaction, showLockedAccounts }} />
          <FontAwesomeIcon
            title="See more interactions with this contract"
            icon={faPlusSquare}
            className={`ml-2 pointer`}
            onClick={() => receiverDetails(transaction.receiver)}
          />
        </div>
      </td>

      <td>
        <TimeAgo value={transaction.timestamp} short tooltip />
      </td>

      <td className=''>
        <TransactionMethod transaction={transaction} />
      </td>

      <td className=''>
        <TransactionValue {...{ transaction, hideMultipleBadge: true }} />
      </td>
    </tr>
  );
};
