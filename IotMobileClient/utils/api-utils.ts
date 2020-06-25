import axios from "axios";
import {AccessToken} from "react-native-fbsdk";
const moment = require('moment');
// @ts-ignore
import JWT from 'expo-jwt';

type HttpMethod = 'GET' | 'POST' | 'PUT';

async function getAxiosInstance() {
  const accessToken = await AccessToken.getCurrentAccessToken();
  const payload = {
    userId: accessToken?.userID,
    token: accessToken?.accessToken,
    expirationDate: moment.now(),
  }
  return axios.create({
    timeout: 5000,
    headers: {
      // @ts-ignore
      Authorization: await JWT.encode(payload, 'SECRET', { algorithm: 'HS256' }),
      'Content-Type': 'application/json'
    }
  });
}

export async function apiCall(method: HttpMethod, url: string, data?: any) {
  let f;
  const axiosInstance = await getAxiosInstance();
  if (method === "GET") {
    f = axiosInstance.get
  } else if (method === "POST") {
    f = axiosInstance.post
  } else if (method === "PUT") {
    f = axiosInstance.put
  } else throw new Error('Unsupported type of HTTP request')
  return await f(url, data);
}
