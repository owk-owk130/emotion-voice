import type { VoiceIntensity, VoiceModulationType } from './voice'

export interface GeminiAnalysisResult {
  type: VoiceModulationType
  intensity: VoiceIntensity
  reason: string
  ssml?: string
}

// ElevenLabs API用の型定義
export interface ElevenLabsVoiceConfig {
  voice_id: string
  model_id?: string
}

export interface ElevenLabsVoiceSettings {
  stability: number
  similarity_boost: number
  style?: number
  use_speaker_boost?: boolean
}

export interface ElevenLabsRequest {
  text: string
  voice_settings: ElevenLabsVoiceSettings
  enable_ssml_parsing?: boolean
}

// 音声品質モード
export type VoiceQualityMode = 'high_quality' | 'balanced' | 'fast'

export interface VoiceQualityConfig {
  mode: VoiceQualityMode
  model_id: string
  description: string
}

// 下位互換性のため既存の型も保持
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
