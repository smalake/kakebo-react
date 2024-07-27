import { axiosAuthedClient } from './axiosAuthedClient';

export const settingApi = {
  getName: () => axiosAuthedClient.get('/display-name'),
  updateName: (params: any) => axiosAuthedClient.put('display-name', params),
  invite: () => axiosAuthedClient.get('/invite'),
  isParent: () => axiosAuthedClient.get('/is-admin'),
  sendMail: (params: Object) => axiosAuthedClient.post('/send-mail', params),
};
