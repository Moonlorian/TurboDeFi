import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL } from '../config';
import { Nonce } from '@multiversx/sdk-network-providers/out/primitives';
import BigNumber from 'bignumber.js';

type apiQueryOptions = {
  maxRetries?: number;
  milisecondsToWaitBetweenRetries?: number;
  pageSize?: number;
  milisecondsBetweenCalls?: number;
};

type apiQueryMandatoryOptions = {
  maxRetries: number;
  milisecondsToWaitBetweenRetries: number;
  pageSize: number;
  milisecondsBetweenCalls: number;
};

export const getDelegated = async (address: string) => {
  const finalList: any = [];

  //First staked
  const stakedList = (
    await getApiGeneric(`accounts/${address}/delegation`)
  ).map((staked: any) => {
    return {
      address: staked.address,
      contract: staked.contract,
      userUnBondable: new BigNumber(staked.userUnBondable),
      userActiveStake: new BigNumber(staked.userActiveStake),
      claimableRewards: new BigNumber(staked.claimableRewards),
      userUndelegatedList: Array.isArray(staked.userUndelegatedList)
        ? staked.userUndelegatedList.map((undelegated: any) => ({
            amount: new BigNumber(undelegated.amount),
            seconds: undelegated.seconds.toNumber()
          }))
        : []
    };
  });
  //Second legacy
  const legacyStaked = (
    await getApiGeneric(`accounts/${address}/delegation-legacy`)
  ).map((staked: any) => {
    return {
      address: staked.address,
      contract: staked.contract,
      userUnBondable: new BigNumber(staked.userUnBondable),
      userActiveStake: new BigNumber(staked.userActiveStake),
      claimableRewards: new BigNumber(staked.claimableRewards),
      userUndelegatedList: Array.isArray(staked.userUndelegatedList)
        ? staked.userUndelegatedList.map((undelegated: any) => ({
            amount: new BigNumber(undelegated.amount),
            seconds: undelegated.seconds.toNumber()
          }))
        : []
    };
  });

  finalList.push(...stakedList);
  if (legacyStaked.length > 0) {
    finalList.push(...legacyStaked);
  }

  return finalList;
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
  const options: apiQueryMandatoryOptions = {
    maxRetries: 10,
    milisecondsToWaitBetweenRetries: 2000,
    pageSize: 20,
    milisecondsBetweenCalls: 400,
    ...userOptions
  };
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
  const options: apiQueryMandatoryOptions = {
    maxRetries: 10,
    milisecondsToWaitBetweenRetries: 2000,
    pageSize: 20,
    milisecondsBetweenCalls: 400,
    ...userOptions
  };
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

const asyncRetry = async (
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
