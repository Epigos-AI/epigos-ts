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
    if (!payload.imageBase64 && !payload.imageUrl) {
      throw new Error('imageBase64 or imageUrl is required')
    }
    const url = this.buildUrl()

    const data: { image: string; confidence?: number | null } = {
      image: payload.imageBase64! || payload.imageUrl!,
      confidence: payload.confidence || null,
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
