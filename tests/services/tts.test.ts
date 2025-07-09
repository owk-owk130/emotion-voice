import { describe, expect, it, vi } from 'vitest'
import { TTSService } from '../../src/services/tts'

// fetchのモック
global.fetch = vi.fn()

describe('TTSService', () => {
  const ttsService = new TTSService('test-api-key')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should synthesize speech from valid SSML', async () => {
    const mockResponse = {
      audioContent: 'SGVsbG8gV29ybGQ=', // "Hello World" in base64
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const ssml = '<speak>Hello World</speak>'
    const audioData = await ttsService.synthesizeSpeech(ssml)

    expect(audioData).toBeInstanceOf(ArrayBuffer)
    expect(audioData.byteLength).toBeGreaterThan(0)

    // fetchが正しく呼ばれたか確認
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://texttospeech.googleapis.com/v1/text:synthesize?key=test-api-key',
      ),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"ssml":"<speak>Hello World</speak>"'),
      }),
    )
  })

  it('should throw error for invalid SSML', async () => {
    const invalidSSML = 'This is not valid SSML'

    await expect(ttsService.synthesizeSpeech(invalidSSML)).rejects.toThrow('Invalid SSML format')
  })

  it('should handle API errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      json: async () => ({
        error: {
          message: 'Invalid API key',
        },
      }),
    })

    const ssml = '<speak>Test</speak>'

    await expect(ttsService.synthesizeSpeech(ssml)).rejects.toThrow(
      'TTS API error: Invalid API key',
    )
  })

  it('should convert base64 to ArrayBuffer correctly', async () => {
    const mockResponse = {
      audioContent: 'SGVsbG8=', // "Hello" in base64
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const ssml = '<speak>Hello</speak>'
    const audioData = await ttsService.synthesizeSpeech(ssml)

    // ArrayBufferをStringに変換して確認
    const decoder = new TextDecoder()
    const text = decoder.decode(new Uint8Array(audioData))

    expect(text).toBe('Hello')
  })
})
