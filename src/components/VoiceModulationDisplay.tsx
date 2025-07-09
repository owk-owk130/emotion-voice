import { useState } from 'react'
import type { GeminiAnalysisResult } from '../types/api'
import type { VoiceModulation } from '../types/voice'

interface VoiceModulationDisplayProps {
  analysis: GeminiAnalysisResult | null
  modulation: VoiceModulation | null
  ssml: string | null
  isLoading: boolean
}

export function VoiceModulationDisplay({
  analysis,
  modulation,
  ssml,
  isLoading,
}: VoiceModulationDisplayProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'ssml'>('analysis')
  const [copySuccess, setCopySuccess] = useState(false)
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (!analysis || !modulation || !ssml) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">テキストを入力して音声を生成してください</p>
      </div>
    )
  }

  const handleCopySSML = async () => {
    try {
      await navigator.clipboard.writeText(ssml)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy SSML:', err)
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case '優しい':
        return '😊'
      case '甘え':
        return '🥺'
      case '元気':
        return '😄'
      case '落ち着き':
        return '😌'
      case '厳しい':
        return '😠'
      case 'ささやき':
        return '🤫'
      case '励まし':
        return '💪'
      default:
        return '🗣️'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">声の抑揚分析結果</h3>

      {/* タブ */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'analysis'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          分析結果
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ssml')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ssml'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          生成SSML
        </button>
      </div>

      {/* 分析結果タブ */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          {/* 抑揚タイプ */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">抑揚タイプ</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getTypeEmoji(analysis.type)}</span>
              <span className="text-lg font-semibold text-gray-900">{analysis.type}</span>
            </div>
          </div>

          {/* 強度 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">強度</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getIntensityColor(
                analysis.intensity,
              )}`}
            >
              {analysis.intensity}
            </span>
          </div>

          {/* 推論理由 */}
          <div>
            <span className="text-sm font-medium text-gray-600 block mb-2">推論理由</span>
            <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{analysis.reason}</p>
          </div>

          {/* 音声パラメータ */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-600 mb-3">音声パラメータ</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <span className="block text-gray-500">ピッチ</span>
                <span className="font-mono font-semibold text-blue-600">{modulation.pitch}</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-500">速度</span>
                <span className="font-mono font-semibold text-green-600">{modulation.rate}</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-500">音量</span>
                <span className="font-mono font-semibold text-orange-600">{modulation.volume}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SSMLタブ */}
      {activeTab === 'ssml' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600">生成されたSSML</h4>
            <button
              type="button"
              onClick={handleCopySSML}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {copySuccess ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <title>コピー完了アイコン</title>
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  コピー済み
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <title>コピーアイコン</title>
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  コピー
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">{ssml}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
