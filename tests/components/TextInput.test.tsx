import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TextInput } from '../../src/components/TextInput'

describe('TextInput', () => {
  const mockOnChange = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    render(<TextInput value="" onChange={mockOnChange} onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText('読み上げテキスト')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('テキストを入力してください...')).toBeInTheDocument()
    expect(screen.getByText('Ctrl + Enter で音声を生成します')).toBeInTheDocument()
  })

  it('should display custom placeholder', () => {
    const customPlaceholder = 'カスタムプレースホルダー'

    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        placeholder={customPlaceholder}
      />,
    )

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument()
  })

  it('should call onChange when text is entered', () => {
    render(<TextInput value="" onChange={mockOnChange} onSubmit={mockOnSubmit} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'テスト入力' } })

    expect(mockOnChange).toHaveBeenCalledWith('テスト入力')
  })

  it('should call onSubmit when Ctrl+Enter is pressed', () => {
    render(<TextInput value="テスト" onChange={mockOnChange} onSubmit={mockOnSubmit} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true })

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it('should not call onSubmit when Enter is pressed without Ctrl', () => {
    render(<TextInput value="テスト" onChange={mockOnChange} onSubmit={mockOnSubmit} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: false })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<TextInput value="" onChange={mockOnChange} onSubmit={mockOnSubmit} disabled={true} />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })
})
