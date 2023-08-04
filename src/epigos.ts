import {
  type ClassificationModelInterface,
  type ClientInterface,
  type EpigosConfig,
  ErrorResponse,
} from './types'
import { ClassificationModel } from './core'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { API_URL } from './constants'
import { version } from './version'

export class EpigosError extends Error {
  status?: number
  data?: object

  constructor(message: string, status?: number, data?: {}) {
    super(message)
    this.status = status
    this.data = data
  }
}

export class Epigos implements ClientInterface {
  apiKey: string
  baseUrl: string
  version?: string

  constructor({ apiKey, baseUrl }: EpigosConfig) {
    if (!apiKey) {
      throw new Error('apiKey required')
    }
    this.apiKey = apiKey
    this.baseUrl = baseUrl || API_URL
  }

  classification(modelId: string): ClassificationModelInterface {
    return new ClassificationModel(this, modelId)
  }

  async callApi(config: AxiosRequestConfig): Promise<object> {
    try {
      const { data } = await axios.request({
        ...config,
        baseURL: this.baseUrl,
        timeout: 1000,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
          'user-agent': `Epigos-SDK/Node; Version: ${version}`,
        },
      })
      return data?.data ?? data
    } catch (e) {
      const { message, status, details } = errorHandler(e as Error)
      throw new EpigosError(message, status, details)
    }
  }
}

export const errorHandler = (error: Error): ErrorResponse => {
  const { request, response } = error as AxiosError
  if (response) {
    const { message, details } = response.data as ErrorResponse
    const status = response.status
    return {
      message,
      status,
      details,
    }
  } else if (request) {
    //request sent but no response received
    return {
      message: 'server time out',
      status: 503,
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    return { message: 'opps! something went wrong while setting up request' }
  }
}

export default Epigos
