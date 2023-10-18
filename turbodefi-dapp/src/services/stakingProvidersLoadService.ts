import axios from 'axios';
import { environment } from 'config';

export const stakingProvidersLoadService = async () => {
  //https://delegation-api.multiversx.com/providers
  return axios.get(`/json/delegators.${environment}.json`).then((response) => {
    return response.data;
  });
};
