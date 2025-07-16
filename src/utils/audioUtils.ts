import type { AudioType } from '../hooks/useAudioPlayer'

export const createAudioUrl = (audioData: ArrayBuffer): string => {
  const blob = new Blob([audioData], { type: 'audio/mpeg' })
  return URL.createObjectURL(blob)
}

export const downloadAudio = (audioData: ArrayBuffer, type: AudioType): void => {
  const blob = new Blob([audioData], { type: 'audio/mpeg' })
  const url = URL.createObjectURL(blob)

  const now = new Date()
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const filename = `emotion-voice-${type}-${timestamp}.mp3`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

export const useAudioUrl = (audioData: ArrayBuffer | null): string | null => {
  if (!audioData || audioData.byteLength === 0) return null
  return createAudioUrl(audioData)
}
