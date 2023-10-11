import axios from 'axios';

export const getTokenList = async () => {
  return axios.get('/json/tokenList.json').then((response) => {
    return response.data;
  });
};
