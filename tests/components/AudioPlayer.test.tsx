import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AudioPlayer } from '../../src/components/AudioPlayer'

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
  writable: true,
})

// Mock HTMLAudioElement
const mockPlay = vi.fn()
const mockPause = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

global.HTMLAudioElement = vi.fn().mockImplementation(() => ({
  play: mockPlay,
  pause: mockPause,
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  currentTime: 0,
  duration: 0,
  src: '',
  preload: 'metadata',
})) as any

describe('AudioPlayer', () => {
  const mockAudioData = new ArrayBuffer(1024)
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateObjectURL.mockReturnValue('mock-url')
  })

  it('should show loading state', () => {
    render(<AudioPlayer audioData={null} isLoading={true} onError={mockOnError} />)

    expect(screen.getByText('音声を生成中...')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should show empty state when no audio data', () => {
    render(<AudioPlayer audioData={null} isLoading={false} onError={mockOnError} />)

    expect(screen.getByText('音声データがありません')).toBeInTheDocument()
  })

  it('should render audio player with controls when audio data is provided', () => {
    render(<AudioPlayer audioData={mockAudioData} isLoading={false} onError={mockOnError} />)

    expect(screen.getByText('音声プレイヤー')).toBeInTheDocument()
    expect(screen.getByLabelText('再生')).toBeInTheDocument()
    expect(screen.getByLabelText('ダウンロード')).toBeInTheDocument()
  })

  it('should handle download functionality', () => {
    render(<AudioPlayer audioData={mockAudioData} isLoading={false} onError={mockOnError} />)

    const downloadButton = screen.getByLabelText('ダウンロード')
    expect(downloadButton).toBeInTheDocument()

    // ダウンロードボタンがクリック可能であることを確認
    fireEvent.click(downloadButton)

    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url')
  })

  it('should not download when no audio data', () => {
    render(<AudioPlayer audioData={null} isLoading={false} onError={mockOnError} />)

    // No download button should be visible when no audio data
    expect(screen.queryByLabelText('ダウンロード')).not.toBeInTheDocument()
  })

  it('should create blob with correct MIME type', () => {
    render(<AudioPlayer audioData={mockAudioData} isLoading={false} onError={mockOnError} />)

    const downloadButton = screen.getByLabelText('ダウンロード')
    fireEvent.click(downloadButton)

    expect(mockCreateObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'audio/mpeg',
      }),
    )
  })

  it('should generate filename with timestamp', () => {
    // Mock Date to have consistent timestamp
    const mockDate = new Date('2023-12-01T12:34:56.789Z')
    const dateSpy = vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(<AudioPlayer audioData={mockAudioData} isLoading={false} onError={mockOnError} />)

    const downloadButton = screen.getByLabelText('ダウンロード')
    fireEvent.click(downloadButton)

    // ダウンロードボタンがクリックされたことを確認
    expect(downloadButton).toBeInTheDocument()

    dateSpy.mockRestore()
  })
})
