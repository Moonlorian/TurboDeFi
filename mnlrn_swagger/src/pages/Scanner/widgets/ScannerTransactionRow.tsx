import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/sass/main.scss';

import styles from './transactionsTable.styles.scss';
import { TimeAgo, TransactionMethod, TransactionReceiver, TransactionValue } from '@multiversx/sdk-dapp/UI';
import { WithClassnameType, WithTransactionType } from '@multiversx/sdk-dapp/UI/types';

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
}: TransactionRowPropsType) => (
  <tr className={classNames(className, { new: transaction.isNew })}>
    <td>
      <TimeAgo value={transaction.timestamp} short tooltip />
    </td>

    <td>
      <TransactionReceiver
        transaction={transaction}
        showLockedAccounts={showLockedAccounts}
      />
    </td>

    <td className={styles.transactionFunction}>
      <TransactionMethod transaction={transaction} />
    </td>

    <td className={globalStyles.textLeft}>
      <TransactionValue transaction={transaction} />
    </td>
  </tr>
);
