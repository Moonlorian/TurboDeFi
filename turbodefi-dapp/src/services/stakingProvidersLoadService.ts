import axios from 'axios';
import { DELEGATION_URL, environment } from 'config';

export const stakingProvidersLoadService = async () => {
  //https://delegation-api.multiversx.com/providers
  return axios.get(DELEGATION_URL).then((response) => {
    return response.data;
  });
};
