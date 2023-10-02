import React from 'react';
import classNames from 'classnames';

//import globalStyles from 'assets/sass/main.scss';

//import styles from './transactionsTable.styles.scss';
import {
  TimeAgo,
  TransactionMethod,
  TransactionReceiver,
  TransactionValue
} from '@multiversx/sdk-dapp/UI';
import {
  WithClassnameType,
  WithTransactionType
} from '@multiversx/sdk-dapp/UI/types';
import { getInterpretedTransaction } from '@multiversx/sdk-dapp/utils/transactions/getInterpretedTransaction';

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
        <TimeAgo value={transaction.timestamp} short tooltip />
      </td>

      <td>
        <TransactionReceiver {...{ transaction, showLockedAccounts }} />
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
