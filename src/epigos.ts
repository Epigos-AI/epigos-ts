import {
  type ClassificationModelInterface,
  type ClientInterface,
  type EpigosConfig,
  type ErrorResponse,
} from './types'
import { ClassificationModel } from './core'
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { API_URL } from './constants'
import { version } from './version'

export class EpigosError extends Error {
  status?: number
  data?: object[]
  response?: AxiosResponse
  request?: any

  constructor(
    message: string,
    status?: number,
    data?: object[],
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)
    this.status = status
    this.data = data
    this.request = request
    this.response = response
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
    this.baseUrl = baseUrl ?? API_URL
  }

  classification(modelId: string): ClassificationModelInterface {
    return new ClassificationModel(this, modelId)
  }

  async callApi(config: AxiosRequestConfig): Promise<object> {
    try {
      const { data } = await axios.request({
        ...config,
        baseURL: this.baseUrl,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
          'X-Client-Sdk': `Epigos-SDK/Node; Version: ${version}`,
        },
      })
      return data
    } catch (e) {
      const { message, status, details, request, response } = errorHandler(e as Error)
      throw new EpigosError(message, status, details, request, response)
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
      response,
    }
  } else if (request) {
    // request sent but no response received
    return {
      message: 'server time out',
      status: 503,
      request,
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    return { message: 'opps! something went wrong while setting up request' }
  }
}

export default Epigos
