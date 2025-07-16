import { useCallback, useState } from 'react'
import { GeminiService } from '../services/gemini'
import { TTSService } from '../services/tts'
import type { GeminiAnalysisResult } from '../types/api'

interface UseVoiceGenerationState {
  isLoading: boolean
  analysis: GeminiAnalysisResult | null
  audioData: ArrayBuffer | null
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
    audioData: null,
    error: null,
  })

  const generateVoice = useCallback(
    async (text: string, voiceId?: string) => {
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
        audioData: null,
      }))

      try {
        // Geminiで感情分析
        const geminiService = new GeminiService(geminiApiKey)
        const analysis = await geminiService.analyzeEmotion(text)

        // ElevenLabs APIで音声を生成
        const ttsService = new TTSService(ttsApiKey)
        const inputText = analysis.ssml || text
        const audioData = await ttsService.synthesizeSpeech(inputText, analysis.type, voiceId)

        setState((prev) => ({
          ...prev,
          isLoading: false,
          analysis,
          audioData,
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
      audioData: null,
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
