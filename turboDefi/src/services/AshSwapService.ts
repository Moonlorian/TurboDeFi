import axios from 'axios';
import {environment} from '../config/index';

const aggregatorUrl = {
  testnet: "",
  devnet: "https://aggregator-devnet.ashswap.io",
  mainnet: "https://aggregator.ashswap.io"
};

export const getTokenList = async () => {
  return axios.get(aggregatorUrl[environment] + '/tokens').then((response) => {
    return response.data;
  });
};
