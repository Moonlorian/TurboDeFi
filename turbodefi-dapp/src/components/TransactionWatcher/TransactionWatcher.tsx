import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks';
import { ITransaction } from '@multiversx/sdk-network-providers/out/interface';
import React from 'react';
import { useEffect, useState } from 'react';

const TransactionWatcher = ({
  functionName = '',
  children
}: any) => {
  const [showPanel, setShowPanel] = useState(false);

  const { hasPendingTransactions, pendingTransactionsArray } =
    useGetPendingTransactions();

  const checkCreatingOrder = () => {
    let pending = false;
    pendingTransactionsArray.map((transactionList) => {
      if (transactionList.length > 1) {
        if ('transactions' in transactionList[1]) {
          for (
            let i = 0;
            i < transactionList[1].transactions.length && !pending;
            i++
          ) {
            const data = transactionList[1].transactions[i].data;
            pending =
              Buffer.from(data, 'base64').toString().split('@')[0] ===
              functionName;
          }
        }
      }
    });
    setShowPanel(pending);
  };

  useEffect(() => {
    checkCreatingOrder();
  }, [hasPendingTransactions]);

  useEffect(() => {
    checkCreatingOrder();
  }, []);

  if (showPanel) return <>{children}</>;
  return <></>;
};

export default TransactionWatcher;
