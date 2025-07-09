import { describe, expect, it, vi } from 'vitest'
import { GeminiService } from '../../src/services/gemini'

// モックレスポンス
const mockGenerateContent = vi.fn()
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}))

describe('GeminiService', () => {
  const geminiService = new GeminiService('test-api-key')

  it('should analyze voice modulation and generate SSML', async () => {
    const mockResponse = {
      response: {
        text: () => `
          分析結果：
          {
            "type": "優しい",
            "intensity": "medium",
            "reason": "挨拶の文章なので、優しく温かい印象を与えるため"
          }

          SSML:
          <speak>
            <prosody pitch="-2.5%" rate="90%" volume="-0.5dB">
              こんにちは、今日はいい天気ですね。
            </prosody>
          </speak>
        `,
      },
    }

    mockGenerateContent.mockResolvedValueOnce(mockResponse)

    const result = await geminiService.analyzeVoiceModulation('こんにちは、今日はいい天気ですね。')

    expect(result.analysis).toEqual({
      type: '優しい',
      intensity: 'medium',
      reason: '挨拶の文章なので、優しく温かい印象を与えるため',
    })

    expect(result.ssml).toContain('<speak>')
    expect(result.ssml).toContain('</speak>')
    expect(result.ssml).toContain('prosody')
  })

  it('should throw error for invalid voice type', async () => {
    const mockResponse = {
      response: {
        text: () => `
          {
            "type": "無効なタイプ",
            "intensity": "medium",
            "reason": "テスト"
          }

          <speak>test</speak>
        `,
      },
    }

    mockGenerateContent.mockResolvedValueOnce(mockResponse)

    await expect(geminiService.analyzeVoiceModulation('テスト')).rejects.toThrow(
      'Invalid voice type',
    )
  })

  it('should throw error when JSON is missing', async () => {
    const mockResponse = {
      response: {
        text: () => `
          JSONがありません
          <speak>test</speak>
        `,
      },
    }

    mockGenerateContent.mockResolvedValueOnce(mockResponse)

    await expect(geminiService.analyzeVoiceModulation('テスト')).rejects.toThrow(
      'Failed to extract JSON or SSML from response',
    )
  })
})
