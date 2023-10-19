import { ContractFunction } from '@multiversx/sdk-core/out';
import { sendTransaction } from 'services/contractInteractions';
import BigNumber from 'bignumber.js';

export const claim = async (address: string, sender: string) => {
  await sendTransaction({
    contractAddress: address,
    functionName: new ContractFunction('claimRewards'),
    sender
  });
};

export const redelegate = async (address: string, sender: string) => {
  await sendTransaction({
    contractAddress: address,
    functionName: new ContractFunction('reDelegateRewards'),
    sender
  });
};

export const delegate = async (
  address: string,
  sender: string,
  amount: BigNumber
) => {

  await sendTransaction({
    contractAddress: address,
    functionName: new ContractFunction('delegate'),
    sender,
    amount
  });

};
