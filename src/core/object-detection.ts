import {
  type ClientInterface,
  type ObjectDetectionModelInterface,
  type ObjectDetectionOption,
  type ObjectDetectionPayload,
  type ObjectDetectionPrediction,
} from '../types'
import { DetectDefaultOptions } from '../constants'

export class ObjectDetectionModel implements ObjectDetectionModelInterface {
  client: ClientInterface
  modelId: string

  constructor(client: ClientInterface, modelId: string) {
    if (!modelId) {
      throw new Error('modelId is required')
    }
    this.client = client
    this.modelId = modelId
  }

  async detect(payload: ObjectDetectionPayload): Promise<ObjectDetectionPrediction> {
    const image = payload.imageBase64 ?? payload.imageUrl

    if (!image) {
      throw new Error('imageBase64 or imageUrl is required')
    }
    const url = this.buildUrl()

    const options: ObjectDetectionOption = payload.options ?? DetectDefaultOptions
    const data: { image: string; confidence?: number | null } = { image, ...options }
    if (payload.confidence) {
      data.confidence = payload.confidence
    }

    const resp = await this.client.callApi({
      method: 'post',
      url,
      data,
    })

    return resp as ObjectDetectionPrediction
  }

  private buildUrl(): string {
    return `/predict/detect/${this.modelId}/`
  }
}
