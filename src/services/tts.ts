import { DEFAULT_VOICE_ID } from '../constants/voices'
import type {
  ElevenLabsRequest,
  ElevenLabsVoiceConfig,
  ElevenLabsVoiceSettings,
} from '../types/api'
import { preprocessJapaneseText } from '../utils/japaneseTextProcessor'

export class TTSService {
  private apiKey: string
  private apiEndpoint = 'https://api.elevenlabs.io/v1/text-to-speech'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async synthesizeSpeech(text: string, emotion?: string, voiceId?: string): Promise<ArrayBuffer> {
    // SSMLかどうかを判定
    const isSSML = text.trim().startsWith('<speak>')

    console.log('TTS Input:', { text, isSSML, emotion })

    let processedText: string
    if (isSSML) {
      // SSMLの場合はそのまま使用
      processedText = text
      console.log('Using SSML mode:', processedText)
    } else {
      // プレーンテキストの場合は日本語前処理を適用
      processedText = preprocessJapaneseText(text, {
        convertDifficultKanji: true,
        optimizePunctuation: true,
        processNumbers: true,
        addPauses: true,
      })
      console.log('Using plain text mode:', processedText)
    }

    // Voice IDの決定（指定がなければデフォルト）
    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID

    // 音声設定（SSMLサポートモデルを使用）
    const voiceConfig: ElevenLabsVoiceConfig = {
      voice_id: selectedVoiceId,
      model_id: isSSML ? 'eleven_turbo_v2' : 'eleven_multilingual_v2',
    }

    // 感情に応じた音声設定を取得
    const voiceSettings: ElevenLabsVoiceSettings = emotion
      ? this.getVoiceSettingsForEmotion(emotion)
      : {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        }

    const request: ElevenLabsRequest = {
      text: processedText,
      voice_settings: voiceSettings,
      enable_ssml_parsing: isSSML,
    }

    console.log('ElevenLabs Request:', JSON.stringify(request, null, 2))

    try {
      const response = await fetch(`${this.apiEndpoint}/${voiceConfig.voice_id}`, {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }

      // レスポンスがすでにArrayBufferとして返される
      const audioData = await response.arrayBuffer()
      return audioData
    } catch (error) {
      console.error('ElevenLabs TTS API error:', error)
      throw error
    }
  }

  /**
   * 感情に応じてElevenLabsの音声設定を調整（日本語専用最適化・高品質版）
   */
  getVoiceSettingsForEmotion(emotion: string): ElevenLabsVoiceSettings {
    switch (emotion) {
      case 'イケメン':
        return {
          stability: 0.9, // 非常に安定した低い声
          similarity_boost: 0.95, // オリジナル音声を最大限重視
          style: 0.1, // 最小限の演出で自然さ重視
          use_speaker_boost: true,
        }
      case '優しい':
        return {
          stability: 0.95, // 最高レベルの安定性
          similarity_boost: 0.98, // 極めて自然な優しさ
          style: 0.05, // ほぼ無演出で自然な優しさ
          use_speaker_boost: true,
        }
      case '元気':
        return {
          stability: 0.85, // 元気さを表現しつつ安定
          similarity_boost: 0.9, // 自然さを保持
          style: 0.2, // 控えめな元気さ
          use_speaker_boost: true,
        }
      case '落ち着き':
        return {
          stability: 0.98, // 最高レベルの安定性
          similarity_boost: 0.99, // 極めて自然で落ち着いた声
          style: 0.02, // ほぼ無演出
          use_speaker_boost: false,
        }
      case '甘え':
        return {
          stability: 0.88, // 甘えを表現しつつ安定
          similarity_boost: 0.92, // 自然な甘えた声
          style: 0.15, // 控えめな甘え表現
          use_speaker_boost: true,
        }
      case '厳しい':
        return {
          stability: 0.9, // 厳格さを保持しつつ安定
          similarity_boost: 0.9, // 自然な厳しさ
          style: 0.2, // 控えめな厳格表現
          use_speaker_boost: true,
        }
      case 'ささやき':
        return {
          stability: 0.95, // 非常に安定したささやき
          similarity_boost: 0.96, // 自然なささやき声
          style: 0.08, // 最小限のささやき表現
          use_speaker_boost: false, // 音量を抑える
        }
      case '励まし':
        return {
          stability: 0.88, // 励ましの力強さと安定性
          similarity_boost: 0.9, // 自然な励まし
          style: 0.18, // 控えめな励まし表現
          use_speaker_boost: true,
        }
      default:
        return {
          stability: 0.9, // デフォルトも高安定性
          similarity_boost: 0.95, // 自然さ重視
          style: 0.1, // 最小限の演出
          use_speaker_boost: true,
        }
    }
  }
}
