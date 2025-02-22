import type { InternalAxiosRequestConfig } from 'axios'
import CryptoJS from 'crypto-js'
// noinspection SpellCheckingInspection
import { v4 as uuidv4 } from 'uuid'

export function generateCommonHeaders(config: InternalAxiosRequestConfig) {
  const requestIdString = uuidv4()
  const timestampString = Date.now().toString()
  const requestPath = config.url
  const requestBody = config.data == null
    ? ''
    : config.data
  // 转换为紧凑格式的 JSON 字符串
  const compactJsonString = requestBody.length === 0
    ? ''
    : JSON.stringify(requestBody)
  const dataToSign = timestampString + requestIdString + requestPath
    + compactJsonString
  const signatureString = CryptoJS.HmacSHA256(dataToSign, import.meta.env.VITE_SIGNATURE_SECRET)
    .toString(CryptoJS.enc.Hex)
  return {
    timestamp: timestampString,
    requestId: requestIdString,
    signature: signatureString,
  }
}
