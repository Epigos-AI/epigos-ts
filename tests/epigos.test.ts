import axios from 'axios'
import { ClassificationModel, Epigos, EpigosError, ObjectDetectionModel } from '../src'
import { API_URL, DetectDefaultOptions } from '../src/constants'
import { version } from '../src/version'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const apiKey = 'api-key'
const MODEL_ID = 'model-id'
const AXIOS_CONFIG = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey,
    'X-Client-Sdk': `Epigos-SDK/Node; Version: ${version}`,
  },
}

describe('Epigos', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear()
  })
  it('should be defined', () => {
    expect(Epigos).toBeDefined()
  })

  it('should instantiate properly', () => {
    const epigos = new Epigos({ apiKey })

    expect(epigos.apiKey).toBe(apiKey)
    expect(epigos.baseUrl).toBe(API_URL)
  })

  it('should instantiate with custom url', () => {
    const epigos = new Epigos({ apiKey, baseUrl: 'http://localhost' })

    expect(epigos.apiKey).toBe(apiKey)
    expect(epigos.baseUrl).toBe('http://localhost')
  })

  it('should error without apiKey', () => {
    expect(() => new Epigos({ apiKey: '' })).toThrowError('apiKey required')
  })

  describe('callApi()', () => {
    it('should send request', async () => {
      const epigos = new Epigos({ apiKey })

      mockedAxios.request.mockResolvedValue({ data: null })

      const params = {
        ...AXIOS_CONFIG,
        data: {},
        method: 'post',
      }
      await epigos.callApi(params)
      expect(axios.request).toHaveBeenCalledWith(params)

      mockedAxios.post.mockClear()
    })
    it('should error', async () => {
      const epigos = new Epigos({ apiKey })

      mockedAxios.request.mockRejectedValueOnce(new Error('network error'))

      const params = {
        ...AXIOS_CONFIG,
        data: {},
        method: 'post',
      }

      const results = epigos.callApi(params)
      await expect(results).rejects.toThrowError(
        new EpigosError('opps! something went wrong while setting up request')
      )
      expect(axios.request).toHaveBeenCalledWith(params)

      mockedAxios.post.mockClear()
    })
    it('should error on client error', async () => {
      const epigos = new Epigos({ apiKey })

      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'validation error', details: [] },
        },
      }
      mockedAxios.request.mockRejectedValueOnce(errorResponse)

      const params = {
        ...AXIOS_CONFIG,
        data: {},
        method: 'post',
      }

      const results = epigos.callApi(params)
      await expect(results).rejects.toThrowError(new EpigosError('validation error'))
      expect(axios.request).toHaveBeenCalledWith(params)

      mockedAxios.post.mockClear()
    })

    it('should error on timeout error', async () => {
      const epigos = new Epigos({ apiKey })

      const errorResponse = {
        request: {},
      }
      mockedAxios.request.mockRejectedValueOnce(errorResponse)

      const params = {
        ...AXIOS_CONFIG,
        data: {},
        method: 'post',
      }

      const results = epigos.callApi(params)
      await expect(results).rejects.toThrowError(new EpigosError('server time out'))
      expect(axios.request).toHaveBeenCalledWith(params)

      mockedAxios.post.mockClear()
    })
  })

  describe('classification()', () => {
    it('should be defined', () => {
      const epigos = new Epigos({ apiKey })

      const model = epigos.classification(MODEL_ID)
      expect(model).toBeDefined()
      expect(model).toBeInstanceOf(ClassificationModel)
    })

    it('should instantiate model properly', () => {
      const epigos = new Epigos({ apiKey })

      const model = epigos.classification(MODEL_ID)

      expect(model.modelId).toBe(MODEL_ID)
    })
    it('should error without modelId', () => {
      const epigos = new Epigos({ apiKey })

      expect(() => epigos.classification('')).toThrowError('modelId is required')
    })

    describe('predict()', () => {
      it('should error without image', async () => {
        const epigos = new Epigos({ apiKey })

        const model = epigos.classification(MODEL_ID)
        const results = model.predict({})
        await expect(results).rejects.toThrowError('imageBase64 or imageUrl is required')
      })

      it('should send imageBase64 payload', async () => {
        const base64 = 'base64'
        const epigos = new Epigos({ apiKey })

        const model = epigos.classification(MODEL_ID)

        const data = {}
        mockedAxios.request.mockResolvedValue({ data })

        const results = await model.predict({
          imageBase64: base64,
        })
        expect(axios.request).toHaveBeenCalledWith({
          ...AXIOS_CONFIG,
          data: {
            image: base64,
          },
          method: 'post',
          url: `/predict/classify/${MODEL_ID}/`,
        })

        expect(results).toBe(data)

        mockedAxios.post.mockClear()
      })

      it('should send imageUrl payload', async () => {
        const imageUrl = 'https://foo.bar/image.png'
        const epigos = new Epigos({ apiKey })

        const model = epigos.classification(MODEL_ID)

        const data = {}
        mockedAxios.request.mockResolvedValue({ data })

        const results = await model.predict({
          imageUrl,
        })
        expect(axios.request).toHaveBeenCalledWith({
          ...AXIOS_CONFIG,
          data: {
            image: imageUrl,
          },
          method: 'post',
          url: `/predict/classify/${MODEL_ID}/`,
        })

        expect(results).toBe(data)

        mockedAxios.post.mockClear()
      })

      it('should send image with confidence payload', async () => {
        const imageUrl = 'https://foo.bar/image.png'
        const epigos = new Epigos({ apiKey })

        const model = epigos.classification(MODEL_ID)

        const data = {}
        mockedAxios.request.mockResolvedValue({ data })

        const results = await model.predict({
          imageUrl,
          confidence: 0.7,
        })
        expect(axios.request).toHaveBeenCalledWith({
          ...AXIOS_CONFIG,
          data: {
            image: imageUrl,
            confidence: 0.7,
          },
          method: 'post',
          url: `/predict/classify/${MODEL_ID}/`,
        })

        expect(results).toBe(data)

        mockedAxios.post.mockClear()
      })
    })
  })

  describe('objectDetection()', () => {
    it('should be defined', () => {
      const epigos = new Epigos({ apiKey })

      const model = epigos.objectDetection(MODEL_ID)
      expect(model).toBeDefined()
      expect(model).toBeInstanceOf(ObjectDetectionModel)
    })

    it('should instantiate model properly', () => {
      const epigos = new Epigos({ apiKey })

      const model = epigos.objectDetection(MODEL_ID)

      expect(model.modelId).toBe(MODEL_ID)
    })
    it('should error without modelId', () => {
      const epigos = new Epigos({ apiKey })

      expect(() => epigos.objectDetection('')).toThrowError('modelId is required')
    })

    describe('detect()', () => {
      it('should error without image', async () => {
        const epigos = new Epigos({ apiKey })

        const model = epigos.objectDetection(MODEL_ID)
        const results = model.detect({})
        await expect(results).rejects.toThrowError('imageBase64 or imageUrl is required')
      })

      it('should send imageBase64 payload', async () => {
        const base64 = 'base64'
        const epigos = new Epigos({ apiKey })

        const model = epigos.objectDetection(MODEL_ID)

        const data = { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA', detections: [] }
        mockedAxios.request.mockResolvedValue({ data })

        const results = await model.detect({
          imageBase64: base64,
        })
        expect(axios.request).toHaveBeenCalledWith({
          ...AXIOS_CONFIG,
          data: {
            image: base64,
            ...DetectDefaultOptions,
          },
          method: 'post',
          url: `/predict/detect/${MODEL_ID}/`,
        })

        expect(results).toBe(data)

        mockedAxios.post.mockClear()
      })

      it('should send imageUrl payload', async () => {
        const imageUrl = 'https://foo.bar/image.png'
        const epigos = new Epigos({ apiKey })

        const model = epigos.objectDetection(MODEL_ID)

        const data = { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA', detections: [] }
        mockedAxios.request.mockResolvedValue({ data })

        const results = await model.detect({
          imageUrl,
        })
        expect(axios.request).toHaveBeenCalledWith({
          ...AXIOS_CONFIG,
          data: {
            image: imageUrl,
            ...DetectDefaultOptions,
          },
          method: 'post',
          url: `/predict/detect/${MODEL_ID}/`,
        })

        expect(results).toBe(data)

        mockedAxios.post.mockClear()
      })

      it('should send image with confidence payload', async () => {
        const imageUrl = 'https://foo.bar/image.png'
        const epigos = new Epigos({ apiKey })

        const model = epigos.objectDetection(MODEL_ID)

        const data = { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA', detections: [] }
        mockedAxios.request.mockResolvedValue({ data })

        const results = await model.detect({
          imageUrl,
          confidence: 0.7,
        })
        expect(axios.request).toHaveBeenCalledWith({
          ...AXIOS_CONFIG,
          data: {
            confidence: 0.7,
            image: imageUrl,
            ...DetectDefaultOptions,
          },
          method: 'post',
          url: `/predict/detect/${MODEL_ID}/`,
        })

        expect(results).toBe(data)

        mockedAxios.post.mockClear()
      })

      it('should send image with custom options', async () => {
        const imageUrl = 'https://foo.bar/image.png'
        const epigos = new Epigos({ apiKey })

        const model = epigos.objectDetection(MODEL_ID)

        const data = { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA', detections: [] }
        mockedAxios.request.mockResolvedValue({ data })

        const options = {
          annotate: true,
          showProb: false,
          strokeWidth: 5,
        }
        const results = await model.detect({
          imageUrl,
          options,
        })
        expect(axios.request).toHaveBeenCalledWith({
          ...AXIOS_CONFIG,
          data: {
            image: imageUrl,
            ...options,
          },
          method: 'post',
          url: `/predict/detect/${MODEL_ID}/`,
        })

        expect(results).toBe(data)

        mockedAxios.post.mockClear()
      })
    })
  })
})
