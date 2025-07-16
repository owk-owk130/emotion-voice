import type { VoiceModulationType } from '../types/voice'

interface Props {
  selectedEmotion: VoiceModulationType
  onEmotionChange: (emotion: VoiceModulationType) => void
  disabled?: boolean
}

const EMOTIONS: { value: VoiceModulationType; label: string; description: string; icon: string }[] =
  [
    {
      value: 'イケメン',
      label: 'イケメン',
      description: '低くて落ち着いた魅力的な話し方',
      icon: '😎',
    },
    { value: '優しい', label: '優しい', description: '柔らかく温かい話し方', icon: '😊' },
    { value: '甘え', label: '甘え', description: '甘えた、可愛らしい話し方', icon: '🥺' },
    { value: '元気', label: '元気', description: '明るく活発な話し方', icon: '😆' },
    { value: '落ち着き', label: '落ち着き', description: '冷静で落ち着いた話し方', icon: '😌' },
    { value: '厳しい', label: '厳しい', description: '厳格で強い話し方', icon: '😤' },
    { value: 'ささやき', label: 'ささやき', description: '小声で内緒話のような話し方', icon: '🤫' },
    {
      value: '励まし',
      label: '励まし',
      description: '勇気づける、応援するような話し方',
      icon: '💪',
    },
  ]

export function EmotionSelector({ selectedEmotion, onEmotionChange, disabled = false }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">感情・抑揚の選択</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion.value}
            type="button"
            onClick={() => onEmotionChange(emotion.value)}
            disabled={disabled}
            className={`
              p-3 rounded-lg border transition-all duration-200 text-left
              ${
                selectedEmotion === emotion.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{emotion.icon}</span>
              <span className="font-medium text-sm">{emotion.label}</span>
            </div>
            <p className="text-xs text-gray-600 leading-tight">{emotion.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          💡 選択した感情に応じてElevenLabsの音声パラメータが自動調整されます
        </p>
      </div>
    </div>
  )
}
