import type { TTSAudioConfig, TTSRequest, TTSResponse, TTSVoiceConfig } from '../types/api'
import { validateSSML } from './ssml'

export class TTSService {
  private apiKey: string
  private apiEndpoint = 'https://texttospeech.googleapis.com/v1/text:synthesize'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async synthesizeSpeech(ssml: string): Promise<ArrayBuffer> {
    // SSMLの検証
    if (!validateSSML(ssml)) {
      throw new Error('Invalid SSML format')
    }

    const voiceConfig: TTSVoiceConfig = {
      languageCode: 'ja-JP',
      name: 'ja-JP-Neural2-B',
      ssmlGender: 'FEMALE',
    }

    const audioConfig: TTSAudioConfig = {
      audioEncoding: 'MP3',
      effectsProfileId: ['headphone-class-device'],
      speakingRate: 1.0,
      pitch: 0.0,
      volumeGainDb: 0.0,
    }

    const request: TTSRequest = {
      input: { ssml },
      voice: voiceConfig,
      audioConfig,
    }

    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`TTS API error: ${error.error?.message || response.statusText}`)
      }

      const data: TTSResponse = await response.json()

      // Base64をArrayBufferに変換
      const audioData = this.base64ToArrayBuffer(data.audioContent)

      return audioData
    } catch (error) {
      console.error('TTS API error:', error)
      throw error
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes.buffer
  }
}
