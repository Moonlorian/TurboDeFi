import { EnvironmentsEnum } from 'types';

export * from './sharedConfig';

export const contractAddress = '';
export const API_URL = 'https://api.multiversx.com';
export const GATEWAY_URL = 'https://api.multiversx.com';
export const EXPLORER_URL = 'https://explorer.multiversx.com';
export const CHAIN_ID = '1';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.mainnet;

export const projectContractList: { [key: string]: string } = {
    erd1qqqqqqqqqqqqqpgqqgxy40dn5tx2dtg0z4jt0sl0zpqm0sca398sv4d50e: "cyberpunkcity",
    erd1qqqqqqqqqqqqqpgqsu2vxxx5l3tjgcnjl6mftlz5dtz5cp5s398syqw3gz: "cyberpunkcity",
};

export const ProjectList = ['cyberpunkcity'];