import { EnvironmentsEnum } from 'types';

export * from './sharedConfig';

export const contractAddress =
  'erd1qqqqqqqqqqqqqpgq8vzz7erevzuz5qmamaamcmt0qq6sv7mzam7q8dnkpx';
export const API_URL = 'https://devnet-api.multiversx.com';
//export const GATEWAY_URL = 'https://devnet-gateway.multiversx.com';
export const GATEWAY_URL = 'https://elrond-api-devnet.blastapi.io/9c12de34-9e4a-4a72-8f41-1042197ffe9a';
export const EXPLORER_URL = 'https://devnet-explorer.multiversx.com';
export const GRAPHQL_URL = 'https://devnet-graph.xexchange.com/graphql';
export const CHAIN_ID = 'D';
export const sampleAuthenticatedDomains = [API_URL];
export const environment:EnvironmentsEnum = EnvironmentsEnum.devnet;

export const turbodefiAddress = 'erd1kxqyvfachg9v64lyh55j5ssecw46um4pdsl5vjcavd5jswf3am7qet69hm';

export const projectContractList:{[key: string]: string} = {
  erd1qqqqqqqqqqqqqpgqmldpgqt7e67skh7e0dxfeeezwyf98jw5m8qsjuxcuk: 'gnogen',
  erd1qqqqqqqqqqqqqpgq5dzmhfj43kh2kjj6exwc6ua4sadgyh4xznyq8k86my: 'proteo',
  erd1qqqqqqqqqqqqqpgqhe7j4rvnv4kksuxqya3hy3d9dhj3s89xznyqveauma: 'proteo',
  erd1qqqqqqqqqqqqqpgqnlvedtspz0cgls9l4dhcrwgqnr0lkkwsznyqsq7u9a: 'proteo',
  erd1qqqqqqqqqqqqqpgqarahd5ywlz2gz598mnn74xjwr4v6qm3m697qz7ra7k: 'seedCaptain'
};

export const ProjectList = ['proteo', 'seedCaptain', 'gnogen', 'xexchange', 'flow'];

export const defaultBalanceTokens = ['EGLD', 'WEGLD-d7c6bb', 'USDC-8d4068'];