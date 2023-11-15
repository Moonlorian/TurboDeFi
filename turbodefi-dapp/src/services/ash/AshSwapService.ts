import axios from 'axios';
import { CHAIN_ID, environment } from '../../config/index';
import BigNumber from 'bignumber.js';
import {
  AbiRegistry,
  Address,
  SmartContract,
  TokenTransfer
} from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { ashAbi } from './ash.abi';

export type AggregatorStep = {
  token_in: string;
  token_out: string;
  amount_in: BigNumber;
  pool_address: string;
  function_name: string;
  arguments: Buffer[];
};

export type SorSwap = {
  poolId: string;
  assetInIndex: number;
  assetOutIndex: number;
  amount: string;
  returnAmount: string;
  assetIn: string;
  assetOut: string;
  functionName: string;
  arguments: string[];
};
export type SorHop = {
  poolId: string;
  tokenInAmount: string;
  tokenOutAmount: string;
  tokenIn: string;
  tokenOut: string;
  pool: {
    allTokens: Array<{ address: string; decimal: number }>;
    type: string;
  };
};
export type SorRoute = {
  hops: SorHop[];
  share: number;
  tokenIn: string;
  tokenInAmount: string;
  tokenOut: string;
  tokenOutAmount: string;
};
export type SorSwapResponse = {
  effectivePrice: number | null;
  effectivePriceReversed: number | null;
  priceImpact: number | null;
  swapAmount: string;
  returnAmount: string;
  returnAmountConsideringFees: string;
  tokenAddresses: string[];
  tokenIn: string;
  tokenOut: string;
  marketSp: string;
  routes?: SorRoute[];
  swaps: SorSwap[];
};

const aggregatorUrl = {
  testnet: '',
  devnet: 'https://aggregator-devnet2.ashswap.io',
  mainnet: 'https://aggregator.ashswap.io'
};

const aggregatorContract = {
  testnet: '',
  devnet: 'erd1qqqqqqqqqqqqqpgqh96hhj42huhe47j3jerlec7ndhw75gy72gesy7w2d6',
  mainnet: 'erd1qqqqqqqqqqqqqpgqglgkaxm73j7mhw5u940fsmmncnayxj884fvs54lnr6'
};

export const getAshTokenList = async () => {
  return axios.get(aggregatorUrl[environment] + '/tokens').then((response) => {
    return response.data;
  });
};

export const aggregate = async (from: string, to: string, amount: string) => {
  return axios
    .get(
      aggregatorUrl[environment] +
        '/aggregate?from=' +
        from +
        '&to=' +
        to +
        '&amount=' +
        amount
    )
    .then((response) => {
      return response.data;
    });
};

export const swap = async (
  sender: string,
  swapData: SorSwap[],
  tokenAddresses: string[],
  slippage: number,
  minOut: BigNumber,
  tokenInAmount: BigNumber
) => {
  const steps: AggregatorStep[] = swapData.map((s, index) => {
    //const lastElement = index == swapData.length - 1;
    const lastElement = false;
    const step: AggregatorStep = {
      token_in: lastElement ? s.assetOut : s.assetIn,
      token_out: lastElement ? s.assetIn : s.assetOut,
      amount_in: new BigNumber(s.amount),
      pool_address: s.poolId,
      function_name: s.functionName,
      arguments: s.arguments.map((arg) => Buffer.from(arg, 'base64'))
    };
    return step;
  });
  console.log(tokenAddresses);
  const limits = tokenAddresses.map((tokenId, index) => {
    const listElement: any = {
      token: tokenId,
      amount:
        index == tokenAddresses.length - 1
          ? minOut.multipliedBy(0.1 - slippage / 100).decimalPlaces(0, 1)
          : new BigNumber(0)
    };
    return listElement;
  });

  const abi = AbiRegistry.create(ashAbi);
  const contract = new SmartContract({
    address: new Address(aggregatorContract[environment]),
    abi: abi
  });

  const interaction = contract.methods
    .aggregate([steps, ...limits])
    .withSender(new Address(sender))
    .withValue(0)
    .withGasLimit(100000000)
    .withChainID(CHAIN_ID);
  const payments = [
    TokenTransfer.fungibleFromAmount(
      steps[0].token_in,
      tokenInAmount.toFixed(),
      0
    )
  ];
  interaction.withMultiESDTNFTTransfer(payments);
  //TODO, check if they are NFT or ESDT tokens
  const transaction = interaction.buildTransaction();
  sendTransactions({ transactions: transaction });

  //TODO: whe will use 100 - slippage
};
