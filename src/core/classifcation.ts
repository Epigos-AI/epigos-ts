import {
  type ClassificationModelInterface,
  type ClassificationPayload,
  type ClassificationPrediction,
  type ClientInterface,
} from '../types'

export class ClassificationModel implements ClassificationModelInterface {
  client: ClientInterface
  modelId: string

  constructor(client: ClientInterface, modelId: string) {
    if (!modelId) {
      throw new Error('modelId is required')
    }
    this.client = client
    this.modelId = modelId
  }

  async predict(payload: ClassificationPayload): Promise<ClassificationPrediction> {
    const image = payload.imageBase64 ?? payload.imageUrl

    if (!image) {
      throw new Error('imageBase64 or imageUrl is required')
    }
    const url = this.buildUrl()

    const data: { image: string; confidence?: number | null } = { image }
    if (payload.confidence) {
      data.confidence = payload.confidence
    }

    const resp = await this.client.callApi({
      method: 'post',
      url,
      data,
    })

    return resp as ClassificationPrediction
  }

  private buildUrl(): string {
    return `/predict/classify/${this.modelId}/`
  }
}
