import { Epigos } from '../src'
import { readFileSync } from 'fs'
import path from 'path'

const apiKey = process.env.API_KEY
const IC_MODEL_ID = process.env.IC_MODEL_ID
const OD_MODEL_ID = process.env.OD_MODEL_ID

const baseUrl = process.env.BASE_URL
const runIntegration = Boolean(process.env.JEST_RUN_INTEGRATION)
const testIf = (condition: boolean, ...args: any[]): void => {
  // @ts-expect-error: arguments to function
  condition ? test(...args) : test.skip(...args)
}

describe('Integration:Epigos', () => {
  testIf(runIntegration, 'should classify', async () => {
    // @ts-expect-error: optional env vars
    const epigos = new Epigos({ apiKey, baseUrl })

    // @ts-expect-error: optional env vars
    const model = epigos.classification(IC_MODEL_ID)
    const base64 = readFileSync(path.join(__dirname, 'fixtures', 'dog.jpg'), {
      encoding: 'base64',
    })

    const resp = await model.predict({
      imageBase64: base64.toString(),
    })

    expect(resp).toHaveProperty('category')
    expect(resp).toHaveProperty('confidence')
    expect(resp).toHaveProperty('predictions')
    expect(resp.predictions.length).toBeGreaterThan(0)
  })
  testIf(runIntegration, 'should detect', async () => {
    // @ts-expect-error: optional env vars
    const epigos = new Epigos({ apiKey, baseUrl })

    // @ts-expect-error: optional env vars
    const model = epigos.objectDetection(OD_MODEL_ID)
    const base64 = readFileSync(path.join(__dirname, 'fixtures', 'car.jpg'), {
      encoding: 'base64',
    })

    const resp = await model.detect({
      imageBase64: base64.toString(),
    })

    expect(resp).toHaveProperty('detections')
    expect(resp).toHaveProperty('image')
    expect(resp.detections.length).toBeGreaterThan(0)

    if (resp.image) {
      const image = Buffer.from(resp.image, 'base64')
      expect(image.byteLength).toBeGreaterThan(0)
    }
  })
})
