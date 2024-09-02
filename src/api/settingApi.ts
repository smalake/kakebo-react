import { axiosAuthedClient } from './axiosAuthedClient';

export const settingApi = {
  getName: () => axiosAuthedClient.get('/setting/name'),
  updateName: (params: any) => axiosAuthedClient.put('setting/name', params),
  invite: () => axiosAuthedClient.get('/setting//invite'),
  sendMail: (params: Object) => axiosAuthedClient.post('/setting/send-mail', params),
};
