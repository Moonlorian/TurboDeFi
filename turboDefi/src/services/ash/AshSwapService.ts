import axios from 'axios';
import { environment } from '../../config/index';
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
  devnet: 'https://aggregator-devnet.ashswap.io',
  mainnet: 'https://aggregator.ashswap.io'
};

const aggregatorContract = {
  testnet: '',
  devnet: 'erd1qqqqqqqqqqqqqpgqqtaru570tfcq4fwer9nlnzl6n4afp4yzh2uswv2vkh',
  mainnet: 'erd1qqqqqqqqqqqqqpgqglgkaxm73j7mhw5u940fsmmncnayxj884fvs54lnr6'
};

export const getTokenList = async () => {
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
  minOut: BigNumber
) => {
  //console.log('Do swap: ', swapData);

  const steps: AggregatorStep[] = swapData.map((s) => {
    const step: AggregatorStep = {
      token_in: s.assetIn,
      token_out: s.assetOut,
      amount_in: new BigNumber(s.amount),
      pool_address: s.poolId,
      function_name: s.functionName,
      arguments: s.arguments.map((arg) => Buffer.from(arg, 'base64'))
    };
    return step;
  });
  const limits = tokenAddresses.map((tokenId, index) => {
    const listElement: any = {
      token: tokenId,
      amount:
        index == tokenAddresses.length - 1
          ? minOut.multipliedBy(1 - slippage / 100).decimalPlaces(0, 1)
          : new BigNumber(0)
    };
    return listElement;
  });

  //console.log(limits);

  limits.map((limit) => {
    console.log(limit.token, limit.amount.toFixed());
  });
  const abi = AbiRegistry.create(ashAbi);
  const contract = new SmartContract({
    address: new Address(aggregatorContract[environment]),
    abi: abi
  });

  console.log(limits);
  const interaction = contract.methods
    .aggregate([steps, ...limits])
    .withSender(new Address(sender))
    .withValue(0)
    .withGasLimit(60000000)
    .withChainID('1');
  const payments = [
    TokenTransfer.fungibleFromAmount(steps[0].token_in, steps[0].amount_in, 0)
  ];
  interaction.withMultiESDTNFTTransfer(payments);
  //TODO, check if they are NFT or ESDT tokens
  const transaction = interaction.buildTransaction();
  console.log(transaction);
  sendTransactions({ transactions: transaction });

  //TODO: whe will use 100 - slippage
};
