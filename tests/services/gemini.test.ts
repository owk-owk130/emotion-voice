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

  it('should analyze emotion from text', async () => {
    const mockResponse = {
      response: {
        text: () => `
          {
            "type": "優しい",
            "intensity": "medium",
            "reason": "挨拶の文章なので、優しく温かい印象を与えるため"
          }
        `,
      },
    }

    mockGenerateContent.mockResolvedValueOnce(mockResponse)

    const result = await geminiService.analyzeEmotion('こんにちは、今日はいい天気ですね。')

    expect(result).toEqual({
      type: '優しい',
      intensity: 'medium',
      reason: '挨拶の文章なので、優しく温かい印象を与えるため',
    })
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
        `,
      },
    }

    mockGenerateContent.mockResolvedValueOnce(mockResponse)

    await expect(geminiService.analyzeEmotion('テスト')).rejects.toThrow('Invalid voice type')
  })

  it('should throw error when JSON is missing', async () => {
    const mockResponse = {
      response: {
        text: () => `
          JSONがありません
        `,
      },
    }

    mockGenerateContent.mockResolvedValueOnce(mockResponse)

    await expect(geminiService.analyzeEmotion('テスト')).rejects.toThrow(
      'Failed to extract JSON from response',
    )
  })
})
