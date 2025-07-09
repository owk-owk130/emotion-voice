import { useCallback, useState } from 'react'
import { GeminiService } from '../services/gemini'
import { TTSService } from '../services/tts'
import type { GeminiAnalysisResult } from '../types/api'
import type { VoiceModulation } from '../types/voice'
import { createVoiceModulation } from '../utils/voiceModulation'

interface UseVoiceGenerationState {
  isLoading: boolean
  analysis: GeminiAnalysisResult | null
  modulation: VoiceModulation | null
  audioData: ArrayBuffer | null
  ssml: string | null
  error: string | null
}

interface UseVoiceGenerationOptions {
  geminiApiKey: string
  ttsApiKey: string
}

export function useVoiceGeneration({ geminiApiKey, ttsApiKey }: UseVoiceGenerationOptions) {
  const [state, setState] = useState<UseVoiceGenerationState>({
    isLoading: false,
    analysis: null,
    modulation: null,
    audioData: null,
    ssml: null,
    error: null,
  })

  const generateVoice = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setState((prev) => ({
          ...prev,
          error: 'テキストが入力されていません',
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        analysis: null,
        modulation: null,
        audioData: null,
        ssml: null,
      }))

      try {
        // Gemini APIで声の抑揚を分析
        const geminiService = new GeminiService(geminiApiKey)
        const { analysis, ssml } = await geminiService.analyzeVoiceModulation(text)

        // 声の抑揚パラメータを計算
        const modulation = createVoiceModulation(analysis.type, analysis.intensity)

        // TTS APIで音声を生成
        const ttsService = new TTSService(ttsApiKey)
        const audioData = await ttsService.synthesizeSpeech(ssml)

        setState((prev) => ({
          ...prev,
          isLoading: false,
          analysis,
          modulation,
          audioData,
          ssml,
        }))
      } catch (error) {
        console.error('Voice generation error:', error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : '音声生成中にエラーが発生しました',
        }))
      }
    },
    [geminiApiKey, ttsApiKey],
  )

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      analysis: null,
      modulation: null,
      audioData: null,
      ssml: null,
      error: null,
    })
  }, [])

  return {
    ...state,
    generateVoice,
    clearError,
    reset,
  }
}
