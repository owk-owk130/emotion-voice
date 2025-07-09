import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useVoiceGeneration } from '../../src/hooks/useVoiceGeneration'

// サービスのモック
vi.mock('../../src/services/gemini', () => ({
  GeminiService: vi.fn().mockImplementation(() => ({
    analyzeVoiceModulation: vi.fn(),
  })),
}))

vi.mock('../../src/services/tts', () => ({
  TTSService: vi.fn().mockImplementation(() => ({
    synthesizeSpeech: vi.fn(),
  })),
}))

describe('useVoiceGeneration', () => {
  const mockOptions = {
    geminiApiKey: 'test-gemini-key',
    ttsApiKey: 'test-tts-key',
  }

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useVoiceGeneration(mockOptions))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.analysis).toBeNull()
    expect(result.current.modulation).toBeNull()
    expect(result.current.audioData).toBeNull()
    expect(result.current.ssml).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle empty text input', async () => {
    const { result } = renderHook(() => useVoiceGeneration(mockOptions))

    await act(async () => {
      await result.current.generateVoice('')
    })

    expect(result.current.error).toBe('テキストが入力されていません')
    expect(result.current.isLoading).toBe(false)
  })

  it('should clear error', () => {
    const { result } = renderHook(() => useVoiceGeneration(mockOptions))

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should reset state', () => {
    const { result } = renderHook(() => useVoiceGeneration(mockOptions))

    act(() => {
      result.current.reset()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.analysis).toBeNull()
    expect(result.current.modulation).toBeNull()
    expect(result.current.audioData).toBeNull()
    expect(result.current.ssml).toBeNull()
    expect(result.current.error).toBeNull()
  })
})
