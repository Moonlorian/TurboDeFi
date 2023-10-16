import {
  ApiNetworkProvider,
  ProxyNetworkProvider
} from '@multiversx/sdk-network-providers/out';
import { API_URL, CHAIN_ID } from '../config/index';
import { Nonce } from '@multiversx/sdk-network-providers/out/primitives';
import BigNumber from 'bignumber.js';
import {
  Address,
  ContractFunction,
  Interaction,
  SmartContract,
  TokenTransfer
} from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';

type transactionType = {
  contractAddress: string;
  functionName: ContractFunction;
  sender: string;
  args?: any[];
  amount?: BigNumber;
  tokenTransferList?: TokenTransfer[];
  gasLimit?: number;
};

export const sendTransaction = async (
  receivedTransactionData: transactionType
) => {
  const transactionData = {
    args: [],
    amount: new BigNumber(0),
    tokenTransferList: [],
    gasLimit: 20000000,
    ...receivedTransactionData
  };

  const contract = new SmartContract({
    address: new Address(transactionData.contractAddress)
  });
  const interaction = new Interaction(
    contract,
    transactionData.functionName,
    transactionData.args
  )
    .withSender(new Address(transactionData.sender))
    .withValue(TokenTransfer.egldFromAmount(transactionData.amount));
  if (transactionData.tokenTransferList.length > 0) {
    //TODO ==> Add withMultiESDTNFTTransfer, withSingleESDTTransfer, etc.
  }
  interaction.withGasLimit(transactionData.gasLimit).withChainID(CHAIN_ID);

  const transaction = interaction.buildTransaction();
  sendTransactions({ transactions: [transaction] });
};
