import { useEffect, useState } from 'react'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import type { AudioComparisonPlayerProps } from '../types/audioPlayer'
import { AUDIO_PLAYER_CONFIGS } from '../types/audioPlayer'
import { downloadAudio, useAudioUrl } from '../utils/audioUtils'
import { AudioPlayerControl } from './AudioPlayerControl'

export function AudioComparisonPlayer({
  audioData,
  audioDataRaw,
  ssml,
  ssmlRaw,
  isLoading,
  onError,
}: AudioComparisonPlayerProps) {
  const {
    enhancedAudioRef,
    rawAudioRef,
    activePlayer,
    currentTime,
    duration,
    playAudio,
    stopAudio,
    formatTime,
  } = useAudioPlayer({ onError })

  const [showSSML, setShowSSML] = useState(false)

  const enhancedUrl = useAudioUrl(audioData)
  const rawUrl = useAudioUrl(audioDataRaw)

  useEffect(() => {
    if (enhancedUrl && enhancedAudioRef.current) {
      enhancedAudioRef.current.src = enhancedUrl
    }
  }, [enhancedUrl, enhancedAudioRef])

  useEffect(() => {
    if (rawUrl && rawAudioRef.current) {
      rawAudioRef.current.src = rawUrl
    }
  }, [rawUrl, rawAudioRef])

  const handleDownload = (type: 'enhanced' | 'raw') => {
    const data = type === 'enhanced' ? audioData : audioDataRaw
    if (data) {
      downloadAudio(data, type)
    }
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

  if (!enhancedUrl && !rawUrl) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">音声データがありません</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">音声聴き比べプレイヤー</h3>

      {/* 隠しオーディオ要素 */}
      {enhancedUrl && (
        // biome-ignore lint/a11y/useMediaCaption: 音声のみの再生でキャプションは不要
        <audio
          ref={enhancedAudioRef}
          src={enhancedUrl}
          preload="metadata"
          aria-label="加工版音声"
        />
      )}
      {rawUrl && (
        // biome-ignore lint/a11y/useMediaCaption: 音声のみの再生でキャプションは不要
        <audio ref={rawAudioRef} src={rawUrl} preload="metadata" aria-label="無加工版音声" />
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AudioPlayerControl
            {...AUDIO_PLAYER_CONFIGS.enhanced}
            isActive={activePlayer === 'enhanced'}
            isDisabled={!enhancedUrl}
            onPlay={() => playAudio('enhanced')}
            onDownload={() => handleDownload('enhanced')}
          />
          <AudioPlayerControl
            {...AUDIO_PLAYER_CONFIGS.raw}
            isActive={activePlayer === 'raw'}
            isDisabled={!rawUrl}
            onPlay={() => playAudio('raw')}
            onDownload={() => handleDownload('raw')}
          />
        </div>

        {/* 停止ボタン */}
        {activePlayer && (
          <div className="text-center">
            <button
              type="button"
              onClick={stopAudio}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              停止
            </button>
          </div>
        )}

        {/* 再生時間表示 */}
        {activePlayer && (
          <div className="text-center text-sm text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}

        {/* SSML表示切り替え */}
        {(ssml || ssmlRaw) && (
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowSSML(!showSSML)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showSSML ? 'SSMLを隠す' : 'SSMLを表示'}
            </button>

            {showSSML && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {ssml && (
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">加工版SSML</h5>
                    <pre className="bg-blue-50 p-3 text-xs rounded border overflow-x-auto text-blue-800">
                      {ssml}
                    </pre>
                  </div>
                )}
                {ssmlRaw && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">無加工版SSML</h5>
                    <pre className="bg-gray-50 p-3 text-xs rounded border overflow-x-auto text-gray-800">
                      {ssmlRaw}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 使い方ヒント */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <h5 className="font-medium text-yellow-800 mb-1">💡 聴き比べのヒント</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 加工版: AIが感情や発音を調整した自然な音声</li>
            <li>• 無加工版: プレーンテキストのみの機械的な読み上げ</li>
            <li>• 同じテキストでも表現力の違いを確認できます</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
