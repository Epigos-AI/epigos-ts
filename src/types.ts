import { type AxiosRequestConfig, type AxiosResponse } from 'axios'

export interface PredictedClass {
  category: string
  confidence: number
}

export interface ClassificationPrediction extends PredictedClass {
  predictions: PredictedClass[]
}

interface PredictionPayload {
  imageBase64?: string
  imageUrl?: string
  confidence?: number
}

export interface ClassificationPayload extends PredictionPayload {}

export interface ClassificationModelInterface {
  modelId: string
  predict: (payload: ClassificationPayload) => Promise<ClassificationPrediction>
}

export interface DetectedObject {
  label: string
  confidence: number
  x: number
  y: number
  width: number
  height: number
}

export interface ObjectDetectionPrediction {
  detections: DetectedObject[]
  image?: string
}

export interface ObjectDetectionOption {
  annotate: boolean
  showProb?: boolean
  strokeWidth?: number | null
}

export interface ObjectDetectionPayload extends PredictionPayload {
  options?: ObjectDetectionOption
}

export interface ObjectDetectionModelInterface {
  modelId: string
  detect: (payload: ObjectDetectionPayload) => Promise<ObjectDetectionPrediction>
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
  objectDetection: (modelId: string) => ObjectDetectionModelInterface
  callApi: (config: AxiosRequestConfig) => Promise<object>
}
