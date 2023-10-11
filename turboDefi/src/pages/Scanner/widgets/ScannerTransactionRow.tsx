import classNames from 'classnames';
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
import { ScannerTransactionHash } from './ScannerTransactionHash';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EXPLORER_URL, projectContractList } from 'config';
import { useNavigate } from 'react-router-dom';

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
        <ScannerTransactionHash transaction={transaction} />
      </td>
      <td>
        {projectContractList[transaction.receiver] && (
          <a
            href='#'
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
          <TransactionReceiver {...{ transaction, showLockedAccounts }} />
          {receiverDetails !== null && (
            <FontAwesomeIcon
              title='See more interactions with this contract'
              icon={faPlusSquare}
              className={`ml-2 pointer`}
              onClick={() => receiverDetails(transaction.receiver)}
            />
          )}
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