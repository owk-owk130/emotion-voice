import { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  audioData: ArrayBuffer | null
  isLoading: boolean
  onError?: (error: string) => void
}

export function AudioPlayer({ audioData, isLoading, onError }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    if (audioData && audioData.byteLength > 0) {
      // ArrayBufferからBlobを作成
      const blob = new Blob([audioData], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [audioData])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setIsPlaying(false)
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
  }, [onError])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const seekTime = Number(e.target.value)
    audio.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDownload = () => {
    if (!audioData) return

    const blob = new Blob([audioData], { type: 'audio/mpeg' })
    const url = URL.createObjectURL(blob)

    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `emotion-voice-${timestamp}.mp3`

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">音声を生成中...</span>
        </div>
      </div>
    )
  }

  if (!audioUrl) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">音声データがありません</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">音声プレイヤー</h3>

      {/* biome-ignore lint/a11y/useMediaCaption: Dynamic audio generation without caption files */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" aria-label="音声プレイヤー" />

      <div className="space-y-4">
        {/* 再生ボタンとダウンロードボタン */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handlePlayPause}
            className="flex items-center justify-center w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
          >
            {isPlaying ? (
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="一時停止"
              >
                <title>一時停止アイコン</title>
                <path fillRule="evenodd" d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="再生"
              >
                <title>再生アイコン</title>
                <path fillRule="evenodd" d="M8 5v10l7-5-7-5z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-label="ダウンロード"
            >
              <title>ダウンロードアイコン</title>
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* 再生時間とシークバー */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                (currentTime / duration) * 100
              }%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
