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

export interface TransactionRowPropsType
  extends WithTransactionType,
  WithClassnameType {
  showDirectionCol?: boolean;
  showLockedAccounts?: boolean;
}

export const ScannerTransactionRow = ({
  className,
  transaction,
  showDirectionCol,
  showLockedAccounts
}: TransactionRowPropsType) => {
  return (
    <tr className={classNames(className, { new: transaction.isNew })}>
      <td>
        <ScannerTransactionHash transaction={transaction} />
      </td>

      <td>
        <TransactionReceiver {...{ transaction, showLockedAccounts }} />
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
