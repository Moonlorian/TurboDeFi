import { EnvironmentsEnum } from 'types';

export * from './sharedConfig';

export const contractAddress = '';
export const API_URL = 'https://api.multiversx.com';
export const EXPLORER_URL = 'https://explorer.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.mainnet;

export const projectContractList:{[key: string]: string} = {};