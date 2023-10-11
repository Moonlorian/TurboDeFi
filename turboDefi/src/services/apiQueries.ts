import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { API_URL } from '../config/index';
import {Nonce} from '@multiversx/sdk-network-providers/out/primitives';

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

export const getNFT = async (
  collection: string,
  nonce: number
) => {
  const provider = new ApiNetworkProvider(API_URL);
  
  //const NFT = await provider.getNonFungibleToken(collection, nonce );
  const NFT = await provider.doGetGeneric('nfts/' + collection + '-' + new Nonce(nonce).hex());
  return (NFT);
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
