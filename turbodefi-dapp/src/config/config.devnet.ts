import { EnvironmentsEnum } from 'types';

export * from './sharedConfig';

export const contractAddress =
  'erd1qqqqqqqqqqqqqpgq72l6vl07fkn3alyfq753mcy4nakm0l72396qkcud5x';
export const API_URL = 'https://devnet-api.multiversx.com';
//export const GATEWAY_URL = 'https://devnet-gateway.multiversx.com';
export const GATEWAY_URL = 'https://elrond-api-devnet.blastapi.io/9c12de34-9e4a-4a72-8f41-1042197ffe9a';
export const EXPLORER_URL = 'https://devnet-explorer.multiversx.com';
export const GRAPHQL_URL = 'https://devnet-graph.xexchange.com/graphql';
export const DELEGATION_URL = 'https://devnet-delegation-api.multiversx.com/providers';
export const CHAIN_ID = 'D';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.devnet;

export const projectContractList:{[key: string]: string} = {
  erd1qqqqqqqqqqqqqpgqmldpgqt7e67skh7e0dxfeeezwyf98jw5m8qsjuxcuk: 'gnogen',
  erd1qqqqqqqqqqqqqpgq5dzmhfj43kh2kjj6exwc6ua4sadgyh4xznyq8k86my: 'proteo',
  erd1qqqqqqqqqqqqqpgqhe7j4rvnv4kksuxqya3hy3d9dhj3s89xznyqveauma: 'proteo',
  erd1qqqqqqqqqqqqqpgqnlvedtspz0cgls9l4dhcrwgqnr0lkkwsznyqsq7u9a: 'proteo',
  erd1qqqqqqqqqqqqqpgqarahd5ywlz2gz598mnn74xjwr4v6qm3m697qz7ra7k: 'seedCaptain'
};

export const ProjectList = ['proteo', 'seedCaptain', 'gnogen', 'xexchange', 'flow'];