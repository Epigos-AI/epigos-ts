import { type AxiosRequestConfig, type AxiosResponse } from 'axios'

export interface PredictedClass {
  category: string
  confidence: number
}

export interface ClassificationPrediction extends PredictedClass {
  predictions: PredictedClass[]
}

export interface ClassificationPayload {
  imageBase64?: string
  imageUrl?: string
  confidence?: number
}

export interface ClassificationModelInterface {
  modelId: string
  predict: (payload: ClassificationPayload) => Promise<ClassificationPrediction>
}

export interface EpigosConfig {
  apiKey: string
  baseUrl?: string
}

export interface ErrorResponse {
  message: string
  details?: object[]
  status?: number
  response?: AxiosResponse
  request?: any
}

// Epigos Client
export interface ClientInterface {
  classification: (modelId: string) => ClassificationModelInterface
  callApi: (config: AxiosRequestConfig) => Promise<object>
}
