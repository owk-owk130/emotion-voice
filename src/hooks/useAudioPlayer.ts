import { useCallback, useEffect, useRef, useState } from 'react'

export type AudioType = 'enhanced' | 'raw'

interface UseAudioPlayerProps {
  onError?: (error: string) => void
}

export const useAudioPlayer = ({ onError }: UseAudioPlayerProps = {}) => {
  const enhancedAudioRef = useRef<HTMLAudioElement>(null)
  const rawAudioRef = useRef<HTMLAudioElement>(null)

  const [activePlayer, setActivePlayer] = useState<AudioType | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const setupAudioEvents = useCallback(
    (audio: HTMLAudioElement) => {
      const handleLoadedMetadata = () => setDuration(audio.duration)
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
      const handleEnded = () => {
        setActivePlayer(null)
        setCurrentTime(0)
      }
      const handleError = () => {
        setActivePlayer(null)
        onError?.('音声の再生中にエラーが発生しました')
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
      }
    },
    [onError],
  )

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = []

    if (enhancedAudioRef.current) {
      cleanupFunctions.push(setupAudioEvents(enhancedAudioRef.current))
    }
    if (rawAudioRef.current) {
      cleanupFunctions.push(setupAudioEvents(rawAudioRef.current))
    }

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [setupAudioEvents])

  const stopAllAudio = () => {
    if (enhancedAudioRef.current) {
      enhancedAudioRef.current.pause()
      enhancedAudioRef.current.currentTime = 0
    }
    if (rawAudioRef.current) {
      rawAudioRef.current.pause()
      rawAudioRef.current.currentTime = 0
    }
    setActivePlayer(null)
    setCurrentTime(0)
  }

  const playAudio = (type: AudioType) => {
    stopAllAudio()

    const audioRef = type === 'enhanced' ? enhancedAudioRef : rawAudioRef
    if (audioRef.current) {
      audioRef.current.play()
      setActivePlayer(type)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    enhancedAudioRef,
    rawAudioRef,
    activePlayer,
    currentTime,
    duration,
    playAudio,
    stopAudio: stopAllAudio,
    formatTime,
  }
}
