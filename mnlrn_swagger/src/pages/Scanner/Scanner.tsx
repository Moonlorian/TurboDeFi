import { TransactionRow } from '@multiversx/sdk-dapp/UI';
import { Card, OutputContainer } from 'components';
import { useEffect, useState } from 'react';
import { getApiFullGeneric } from 'services/apiQueries';
import { ScannerTransactionRow } from './widgets';
import { getInterpretedTransaction } from '@multiversx/sdk-dapp/utils/transactions/getInterpretedTransaction';

export const Scanner = () => {
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [filteredTransactionsList, setFilteredTransactionsList] = useState<
    any[]
  >([]);

  const getTransactionsList = async (address: string) => {
    //const list = await getApiFullGeneric(`accounts/${address}/transactions?after=1695636200&fields=txHash,receiver,timestamp,function`, { pageSize: 1000 });
    //const list = await getApiFullGeneric(`accounts/${address}/transactions?after=1695636200`, { pageSize: 1000 });
    const list = await getApiFullGeneric(
      `transactions?sender=erd1n3fzpwd9m6z35s9lqksxqnhmkyxatu20qp2lvtrdhdx6f4s8ypjsqskr84&withScResults=true`,
      { pageSize: 50 }
    );
    setTransactionsList(list);

    const receiversList: string[] = [];
    const filteredList = list.filter((transaction) => {
      if (!receiversList.includes(transaction.receiver)) {
        receiversList.push(transaction.receiver);
        return true;
      }
      return false;
    });
    setFilteredTransactionsList(filteredList);

    console.log(list);
  };
  useEffect(() => {
    getTransactionsList(
      'erd1n3fzpwd9m6z35s9lqksxqnhmkyxatu20qp2lvtrdhdx6f4s8ypjsqskr84'
    );
  }, []);

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <Card
        className='flex-2'
        key={'walletScanner'}
        title={'Wallet Scanner'}
        description={
          'Latest interactions of a wallet with different smart contracts'
        }
        reference={''}
      >
        {transactionsList.map((transaction, index) => (
          <div key={index}>
            {transaction.receiver} | {transaction.function} |{' '}
            {transaction.timestamp}
          </div>
        ))}
        <br></br>
        <br></br>
        <br></br>
        {filteredTransactionsList.map((transaction, index) => (
          <div key={index}>
            {transaction.receiver} | {transaction.function} |{' '}
            {transaction.timestamp}
          </div>
        ))}
        <br></br>
        <br></br>
        <br></br>
        {filteredTransactionsList.map((transaction, index) => (
          <ScannerTransactionRow
            key={transaction.txHash}
            className='mx-transactions text-gray-500'
            transaction={getInterpretedTransaction({
              address: '',
              explorerAddress: '',
              transaction
            })}
          />
        ))}
      </Card>
    </div>
  );
};
