import type { VoiceQualityMode } from '../types/api'

interface Props {
  selectedMode: VoiceQualityMode
  onModeChange: (mode: VoiceQualityMode) => void
  disabled?: boolean
}

const QUALITY_MODES = [
  {
    mode: 'high_quality' as VoiceQualityMode,
    label: '高品質',
    icon: '💎',
    description: '最高品質の音声（処理時間：長い）',
    model: 'eleven_multilingual_v2',
    badge: '推奨',
  },
  {
    mode: 'balanced' as VoiceQualityMode,
    label: 'バランス',
    icon: '⚖️',
    description: '品質と速度のバランス',
    model: 'eleven_turbo_v2_5',
    badge: '',
  },
  {
    mode: 'fast' as VoiceQualityMode,
    label: '高速',
    icon: '⚡',
    description: '高速生成（品質：標準）',
    model: 'eleven_turbo_v2',
    badge: '',
  },
]

export function VoiceQualitySelector({ selectedMode, onModeChange, disabled = false }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">音声品質設定</h3>
        <span className="text-xs text-gray-500">日本語最適化済み</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {QUALITY_MODES.map((qualityMode) => (
          <button
            key={qualityMode.mode}
            type="button"
            onClick={() => onModeChange(qualityMode.mode)}
            disabled={disabled}
            className={`
              relative p-4 rounded-lg border transition-all duration-200 text-left
              ${
                selectedMode === qualityMode.mode
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* バッジ */}
            {qualityMode.badge && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {qualityMode.badge}
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{qualityMode.icon}</span>
              <span className="font-medium">{qualityMode.label}</span>
            </div>

            <p className="text-sm text-gray-600 mb-2">{qualityMode.description}</p>

            <div className="text-xs text-gray-500">モデル: {qualityMode.model}</div>
          </button>
        ))}
      </div>

      {/* 説明 */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600 text-sm">💡</span>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">品質モードについて</p>
            <ul className="text-xs space-y-1">
              <li>
                • <strong>高品質</strong>: 最も自然で流暢な日本語音声（初回利用推奨）
              </li>
              <li>
                • <strong>バランス</strong>: 品質と速度のバランスが取れたモード
              </li>
              <li>
                • <strong>高速</strong>: リアルタイム用途に適した高速生成
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
