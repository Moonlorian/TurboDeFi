import classNames from 'classnames';
import {
  TimeAgo,
  TransactionMethod,
  TransactionValue
} from '@multiversx/sdk-dapp/UI';
import {
  WithClassnameType,
  WithTransactionType
} from '@multiversx/sdk-dapp/UI/types';
import { ScannerTransactionHash } from './ScannerTransactionHash';
import { projectContractList } from 'config';
import { useNavigate } from 'react-router-dom';
import { AccountName } from '@multiversx/sdk-dapp/UI/TransactionsTable/components/AccountName';

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
  showLockedAccounts,
  receiverDetails
}: TransactionRowPropsType) => {
  const navigate = useNavigate();
  return (
    <tr className={classNames(className, { new: transaction.isNew })}>
      <td>
        {projectContractList[transaction.receiver] && (
          <a
            href=''
            onClick={() => {
              navigate('/project/' + projectContractList[transaction.receiver]);
            }}
          >
            {projectContractList[transaction.receiver]}
          </a>
        )}
      </td>
      <td>
        <div className='d-flex align-items-center'>
          <a
            href=''
            onClick={() => {
              receiverDetails(transaction.receiver);
            }}
          >
            <AccountName
              address={transaction.receiver}
              assets={transaction.receiverAssets}
            />
          </a>
        </div>
      </td>

      <td className=''>
        <TransactionMethod transaction={transaction} />
      </td>

      <td>
        <TimeAgo value={transaction.timestamp} short tooltip />
      </td>

      <td className=''>
        <TransactionValue {...{ transaction, hideMultipleBadge: true }} />
      </td>

      <td>
        <ScannerTransactionHash transaction={transaction} />
      </td>
    </tr>
  );
};
