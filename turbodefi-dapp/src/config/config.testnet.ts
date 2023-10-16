import { EnvironmentsEnum } from 'types';

export * from './sharedConfig';

export const contractAddress = '';
export const API_URL = 'https://testnet-api.multiversx.com';
export const GATEWAY_URL = 'https://testnet-gateway.multiversx.com';
export const EXPLORER_URL = 'https://testnet-explorer.multiversx.com';
export const GRAPHQL_URL = 'https://testnet-graph.xexchange.com/graphql';
export const DELEGATION_URL = 'https://testnet-delegation-api.multiversx.com/providers';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.testnet;


export const projectContractList:{[key: string]: string} = {
    erd1qqqqqqqqqqqqqpgqmldpgqt7e67skh7e0dxfeeezwyf98jw5m8qsjuxcuk: 'gnogen',
    erd1qqqqqqqqqqqqqpgq5dzmhfj43kh2kjj6exwc6ua4sadgyh4xznyq8k86my: 'proteo',
    erd1qqqqqqqqqqqqqpgqhe7j4rvnv4kksuxqya3hy3d9dhj3s89xznyqveauma: 'proteo',
    erd1qqqqqqqqqqqqqpgqnlvedtspz0cgls9l4dhcrwgqnr0lkkwsznyqsq7u9a: 'proteo',
    erd1qqqqqqqqqqqqqpgqarahd5ywlz2gz598mnn74xjwr4v6qm3m697qz7ra7k: 'seedCaptain'
  };
  