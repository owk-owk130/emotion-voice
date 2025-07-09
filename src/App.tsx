import { useState } from 'react'
import { AudioPlayer } from './components/AudioPlayer'
import { TextInput } from './components/TextInput'
import { VoiceModulationDisplay } from './components/VoiceModulationDisplay'
import { useVoiceGeneration } from './hooks/useVoiceGeneration'

function App() {
  const [text, setText] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 環境変数からAPIキーを取得
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY
  const ttsApiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY

  const {
    isLoading,
    analysis,
    modulation,
    audioData,
    ssml,
    error,
    generateVoice,
    clearError,
    reset,
  } = useVoiceGeneration({
    geminiApiKey: geminiApiKey || '',
    ttsApiKey: ttsApiKey || '',
  })

  const handleGenerateVoice = async () => {
    if (!geminiApiKey || !ttsApiKey) {
      setErrorMessage('APIキーが設定されていません。環境変数を確認してください。')
      return
    }

    setErrorMessage(null)
    clearError()
    await generateVoice(text)
  }

  const handleClear = () => {
    setText('')
    reset()
    setErrorMessage(null)
  }

  const handleAudioError = (audioError: string) => {
    setErrorMessage(audioError)
  }

  const displayError = error || errorMessage

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emotion Voice Generator</h1>
          <p className="text-lg text-gray-600">テキストから感情豊かな音声を生成します</p>
        </div>

        {/* エラーメッセージ */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="エラー"
                >
                  <title>エラーアイコン</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{displayError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null)
                    clearError()
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">閉じる</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-label="閉じる"
                  >
                    <title>閉じるアイコン</title>
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* テキスト入力 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <TextInput
              value={text}
              onChange={setText}
              onSubmit={handleGenerateVoice}
              disabled={isLoading}
              placeholder="読み上げたいテキストを入力してください..."
            />

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={handleGenerateVoice}
                disabled={isLoading || !text.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isLoading ? '生成中...' : '音声を生成'}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                クリア
              </button>
            </div>
          </div>

          {/* 分析結果表示 */}
          <VoiceModulationDisplay
            analysis={analysis}
            modulation={modulation}
            ssml={ssml}
            isLoading={isLoading}
          />

          {/* 音声プレイヤー */}
          <AudioPlayer audioData={audioData} isLoading={isLoading} onError={handleAudioError} />
        </div>

        {/* フッター */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Powered by Google Gemini & Google Text-to-Speech</p>
        </div>
      </div>
    </div>
  )
}

export default App
