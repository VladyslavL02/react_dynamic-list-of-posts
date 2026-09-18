import { client } from '../utils/fetchClient';

export function getUsers() {
  return client.get('/users');
}
