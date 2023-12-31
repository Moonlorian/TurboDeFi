import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL, environment } from '../config';
import { Nonce } from '@multiversx/sdk-network-providers/out/primitives';
import BigNumber from 'bignumber.js';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import axios from 'axios';
import { stakedInfoType } from 'components';

export type apiQueryOptions = {
  maxRetries?: number;
  milisecondsToWaitBetweenRetries?: number;
  pageSize?: number;
  milisecondsBetweenCalls?: number;
};

export type apiQueryMandatoryOptions = {
  maxRetries: number;
  milisecondsToWaitBetweenRetries: number;
  pageSize: number;
  milisecondsBetweenCalls: number;
};

export const getEgldPrice = async () => {
  const url = `https://${
    environment != EnvironmentsEnum.mainnet ? environment + '-' : ''
  }api.multiversx.com/economics`;
  return axios
    .get(url)
    .then((response: any) => new BigNumber(response?.data?.price ?? '0'));
};

export const getDelegated = async (address: string) => {
  const finalList: any = [];

  //First staked
  const stakedList = (
    await getApiGeneric(`accounts/${address}/delegation`)
  ).map((staked: any) => {
    return {
      type: 'regular',
      address: staked.address,
      contract: staked.contract,
      userUnBondable: new BigNumber(staked.userUnBondable),
      userActiveStake: new BigNumber(staked.userActiveStake),
      claimableRewards: new BigNumber(staked.claimableRewards),
      userUndelegatedList: Array.isArray(staked.userUndelegatedList)
        ? staked.userUndelegatedList.map((undelegated: any) => ({
            amount: new BigNumber(undelegated.amount),
            seconds: undelegated.seconds
          }))
        : [],
      userWaitingStake: new BigNumber(0)
    };
  });
  //Second legacy
  const legacyStaked = (
    await getApiGeneric(`accounts/${address}/delegation-legacy`)
  ).map((staked: any) => {
    return {
      type: 'legacy',
      address: staked.address,
      contract: staked.contract,
      userUnBondable: new BigNumber(staked.userUnBondable || 0),
      userActiveStake: new BigNumber(staked.userActiveStake || 0),
      claimableRewards: new BigNumber(staked.claimableRewards || 0),
      userUndelegatedList: Array.isArray(staked.userUndelegatedList || 0)
        ? staked.userUndelegatedList.map((undelegated: any) => ({
            amount: new BigNumber(undelegated.amount || 0),
            seconds: undelegated.seconds.toNumber()
          }))
        : [],
      userWaitingStake: new BigNumber(staked.userWaitingStake)
    };
  });
  finalList.push(...stakedList);
  if (legacyStaked.length > 0) {
    finalList.push(...legacyStaked);
  }

  return finalList.map((stakedInfo: stakedInfoType) => {
    return {
      ...stakedInfo,
      total: new BigNumber(stakedInfo.userUnBondable || new BigNumber(0))
        .plus(stakedInfo.userActiveStake || new BigNumber(0))
        .plus(stakedInfo.claimableRewards || new BigNumber(0))
        .plus(
          stakedInfo.userUndelegatedList.reduce(
            (previous: BigNumber, current: any) =>
              previous.plus(current.amount),
            new BigNumber(0)
          )
        )
        .plus(stakedInfo.userWaitingStake)
    };
  });
};

export const getNFT = async (collection: string, nonce: number) => {
  const NFT = await getApiGeneric(
    'nfts/' + collection + '-' + new Nonce(nonce).hex()
  );
  return NFT;
};

export const getUserTokensBalance = async (
  address: string,
  tokenList: string[]
) => {
  const balanceList: { [key: string]: any } = {};

  const response = await getApiGeneric(
    'accounts/' + address + '/tokens?identifiers=' + tokenList.join(',')
  );
  response.map((tokenData) => (balanceList[tokenData.identifier] = tokenData));

  return balanceList;
};

export const getUserBalance = async (address: string) => {
  const balanceList: { [key: string]: any } = {};

  if (address) {
    const response = await getApiFullGeneric(
      'accounts/' + address + '/tokens',
      {
        pageSize: 1000
      }
    );
    response.map(
      (tokenData) => (balanceList[tokenData.identifier] = tokenData)
    );
  }
  return balanceList;
};

export const getApiGeneric = async (
  query: string,
  userOptions?: apiQueryOptions
) => {
  const options: apiQueryMandatoryOptions = getOptions(userOptions);
  const finalArray = [];

  const provider = new ApiNetworkProvider(API_URL);
  const list = await asyncRetry(
    options.maxRetries,
    options.milisecondsToWaitBetweenRetries,
    () => provider.doGetGeneric(query)
  );
  Array.isArray(list) ? finalArray.push(...list) : finalArray.push(list);

  return finalArray;
};

export const getApiFullGeneric = async (
  query: string,
  userOptions?: apiQueryOptions
) => {
  const options: apiQueryMandatoryOptions = getOptions(userOptions);
  let currentPage = 0;
  const finalArray = [];
  const provider = new ApiNetworkProvider(API_URL);
  let list = [];

  do {
    const finalUrl =
      query +
      (query.includes('?') ? '&' : '?') +
      'from=' +
      currentPage * options.pageSize +
      '&size=' +
      options.pageSize;
    list = await asyncRetry(
      options.maxRetries,
      options.milisecondsToWaitBetweenRetries,
      () => provider.doGetGeneric(finalUrl)
    );
    finalArray.push(...list);
    currentPage++;
    await waitMiliSeconds(options.milisecondsBetweenCalls);
  } while (list.length === options.pageSize);

  return finalArray;
};

export const asyncRetry = async (
  maxRetries: number,
  milisecondsToWaitBetweenRetries: number,
  callBack: any,
  onErrorCallBack = (err: any, retryNumber: number) => {},
  hideErrors = true
) => {
  let error = undefined;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await callBack();
      return result;
    } catch (err) {
      error = err;
      console.log('Retry number ' + i);
      if (!hideErrors) {
        console.log(err);
      }
      onErrorCallBack(err, i + 1);
      await waitMiliSeconds(milisecondsToWaitBetweenRetries);
    }
  }
  return error;
};

const waitMiliSeconds = async (miliseconds: number) => {
  await new Promise((res) => setTimeout(() => res('p1'), miliseconds));
};

export const getOptions = (userOptions?:apiQueryOptions) => {
  const options: apiQueryMandatoryOptions = {
    maxRetries: 10,
    milisecondsToWaitBetweenRetries: 2000,
    pageSize: 20,
    milisecondsBetweenCalls: 400,
    ...userOptions
  };
  return options;
}
