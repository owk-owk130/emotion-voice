import type { ChangeEvent, KeyboardEvent } from 'react'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
}

export function TextInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'テキストを入力してください...',
}: TextInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="w-full">
      <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
        読み上げテキスト
      </label>
      <textarea
        id="text-input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        rows={4}
      />
      <p className="mt-2 text-sm text-gray-500">Ctrl + Enter で音声を生成します</p>
    </div>
  )
}
