import axios from 'axios';
import { environment } from 'config';

export const getTokenList = async () => {
  return axios.get('/json/tokenList.' + environment + '.json').then((response) => {
    return response.data;
  });
};
