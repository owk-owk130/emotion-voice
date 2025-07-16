import { AVAILABLE_VOICES } from '../constants/voices'

interface Props {
  selectedVoiceId: string
  onVoiceChange: (voiceId: string) => void
  disabled?: boolean
}

export function VoiceSelector({ selectedVoiceId, onVoiceChange, disabled = false }: Props) {
  const selectedVoice = AVAILABLE_VOICES.find((v) => v.id === selectedVoiceId)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">音声の選択</h3>
        <span className="text-xs text-gray-500">日本語対応音声</span>
      </div>

      {/* 現在選択中の音声 */}
      {selectedVoice && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                {selectedVoice.name} ({selectedVoice.gender === 'male' ? '男性' : '女性'})
              </p>
              <p className="text-sm text-blue-700">{selectedVoice.description}</p>
            </div>
            {selectedVoice.preview && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {selectedVoice.preview}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 音声選択グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {AVAILABLE_VOICES.map((voice) => (
          <button
            key={voice.id}
            type="button"
            onClick={() => onVoiceChange(voice.id)}
            disabled={disabled}
            className={`
              p-3 rounded-lg border transition-all duration-200 text-left
              ${
                selectedVoiceId === voice.id
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{voice.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      voice.gender === 'male'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {voice.gender === 'male' ? '男性' : '女性'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{voice.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {voice.language.map((lang) => (
                    <span key={lang} className="text-xs text-gray-500">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              {selectedVoiceId === voice.id && (
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <title>選択中</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* ヒント */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          💡 各音声には特徴があります。文章の内容や用途に応じて最適な音声を選択してください。
        </p>
      </div>
    </div>
  )
}
