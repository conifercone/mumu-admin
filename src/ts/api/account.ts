import { SERVER_URL } from '../config/constants'
import { fetchWithAuth } from './fetch-with-auth'
import type { ResponseResult } from './response-result'

export type Account = {
  username: string;
  id: bigint;
  avatarUrl: string;
  phone: string;
  sex: bigint;
  email: string;
}

export async function queryCurrentLoginAccount(): Promise<Account> {
  const response = await fetchWithAuth(`${SERVER_URL}/api/centaur/authentication/account/currentLoginAccount`, {
    method: 'GET'
  })
  const result = await response.json() as ResponseResult
  return result.data as Account
}
