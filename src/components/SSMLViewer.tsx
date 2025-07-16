interface Props {
  ssml: string
}

export const SSMLViewer = ({ ssml }: Props) => {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">📝 生成されたSSML</p>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(ssml)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
        >
          コピー
        </button>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto border">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">{ssml}</pre>
      </div>
    </div>
  )
}
