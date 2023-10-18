import { EnvironmentsEnum } from 'types';

export * from './sharedConfig';

export const contractAddress = 'erd1qqqqqqqqqqqqqpgqchgs4elfyup4yfkrd6yafnmkxaxjqq9lam7q8l5dja';
export const API_URL = 'https://api.multiversx.com';
export const GATEWAY_URL = 'https://api.multiversx.com';
export const EXPLORER_URL = 'https://explorer.multiversx.com';
export const GRAPHQL_URL = 'https://graph.xexchange.com/graphql';
export const CHAIN_ID = '1';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.mainnet;

export const turbodefiAddress = 'erd1kxqyvfachg9v64lyh55j5ssecw46um4pdsl5vjcavd5jswf3am7qet69hm';

export const projectContractList: { [key: string]: string } = {
    erd1qqqqqqqqqqqqqpgqqgxy40dn5tx2dtg0z4jt0sl0zpqm0sca398sv4d50e: "CyberpunkCity",
    erd1qqqqqqqqqqqqqpgqsu2vxxx5l3tjgcnjl6mftlz5dtz5cp5s398syqw3gz: "CyberpunkCity",
    erd1qqqqqqqqqqqqqpgqhe8t5jewej70zupmh44jurgn29psua5l2jps3ntjj3: "xExchange",
    erd1qqqqqqqqqqqqqpgq3j97mjvu7vpn638ekcupcy4n0x6rdnleznyqn5faj9: "Proteo",
    erd1qqqqqqqqqqqqqpgqwqxfv48h9ssns5cc69yudvph297veqeeznyqr4l930: "Proteo",
    erd1qqqqqqqqqqqqqpgq3lh80a92d49am3t2pfzheapdxtykzt5kznyqsjhfrx: "Proteo",
    erd1qqqqqqqqqqqqqpgql9z9vm8d599ya2r9seklpkcas6qmude4mvlsgrj7hv: "OneDex",
    erd1qqqqqqqqqqqqqpgq5774jcntdqkzv62tlvvhfn2y7eevpty6mvlszk3dla: "OneDex",
    erd1qqqqqqqqqqqqqpgq8nlmvjm8gum6y2kqe0v296kgu8cm4jlemvlsays3ku: "OneDex",
    erd1qqqqqqqqqqqqqpgqfyks2llx45lczzz6htdpe09prxem4ad3mesqlgra36: "gnogen",
    erd1qqqqqqqqqqqqqpgqxp28qpnv7rfcmk6qrgxgw5uf2fnp84ar78ssqdk6hr: "Hatom",
};

export const ProjectList = ['CyberpunkCity', "xExchange", 'OneDex', 'Proteo', 'gnogen', 'Hatom'];