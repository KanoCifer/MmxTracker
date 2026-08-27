import axios from 'axios';

export const request = axios.create({
  baseURL: 'https://www.minimaxi.com/backend',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
