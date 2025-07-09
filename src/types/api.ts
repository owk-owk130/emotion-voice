import type { VoiceIntensity, VoiceModulationType } from './voice'

export interface GeminiAnalysisResult {
  type: VoiceModulationType
  intensity: VoiceIntensity
  reason: string
}

export interface TTSVoiceConfig {
  languageCode: string
  name: string
  ssmlGender: 'FEMALE' | 'MALE' | 'NEUTRAL'
}

export interface TTSAudioConfig {
  audioEncoding: 'MP3' | 'OGG_OPUS' | 'LINEAR16'
  effectsProfileId?: string[]
  speakingRate?: number
  pitch?: number
  volumeGainDb?: number
}

export interface TTSRequest {
  input: {
    ssml: string
  }
  voice: TTSVoiceConfig
  audioConfig: TTSAudioConfig
}

export interface TTSResponse {
  audioContent: string
}
