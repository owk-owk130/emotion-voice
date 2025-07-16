import type { AudioType } from '../hooks/useAudioPlayer'

interface AudioPlayerControlProps {
  type: AudioType
  title: string
  emoji: string
  isActive: boolean
  isDisabled: boolean
  onPlay: () => void
  onDownload: () => void
  bgColor: string
  textColor: string
  buttonColor: string
  buttonHoverColor: string
}

export const AudioPlayerControl = ({
  type,
  title,
  emoji,
  isActive,
  isDisabled,
  onPlay,
  onDownload,
  bgColor,
  textColor,
  buttonColor,
  buttonHoverColor,
}: AudioPlayerControlProps) => {
  return (
    <div
      className={`border rounded-lg p-4 ${bgColor} ${type === 'enhanced' ? 'border-blue-200' : 'border-gray-200'}`}
    >
      <h4 className={`font-medium mb-3 ${textColor}`}>
        {emoji} {title}
      </h4>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPlay}
          disabled={isDisabled}
          className={`flex items-center justify-center w-12 h-12 ${buttonColor} ${buttonHoverColor} disabled:bg-gray-300 text-white rounded-lg transition-colors`}
        >
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-label="再生">
            <title>再生</title>
            <path fillRule="evenodd" d="M8 5v10l7-5-7-5z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={isDisabled}
          className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-label="ダウンロード"
          >
            <title>ダウンロード</title>
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isActive && (
        <div
          className={`mt-2 px-2 py-1 text-sm rounded ${type === 'enhanced' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}
        >
          再生中...
        </div>
      )}
    </div>
  )
}
