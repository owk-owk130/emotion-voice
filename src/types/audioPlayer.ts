export interface AudioComparisonPlayerProps {
  audioData: ArrayBuffer | null
  audioDataRaw: ArrayBuffer | null
  ssml: string | null
  ssmlRaw: string | null
  isLoading: boolean
  onError?: (error: string) => void
}

export interface AudioPlayerConfig {
  type: 'enhanced' | 'raw'
  title: string
  emoji: string
  bgColor: string
  textColor: string
  buttonColor: string
  buttonHoverColor: string
}

export const AUDIO_PLAYER_CONFIGS: Record<'enhanced' | 'raw', AudioPlayerConfig> = {
  enhanced: {
    type: 'enhanced',
    title: '加工版（AI音声調整）',
    emoji: '🎯',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    buttonColor: 'bg-blue-500',
    buttonHoverColor: 'hover:bg-blue-600',
  },
  raw: {
    type: 'raw',
    title: '無加工版（プレーンテキスト）',
    emoji: '📝',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-900',
    buttonColor: 'bg-gray-500',
    buttonHoverColor: 'hover:bg-gray-600',
  },
}
