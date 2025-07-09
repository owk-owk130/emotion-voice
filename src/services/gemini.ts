import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GeminiAnalysisResult } from '../types/api'
import type { VoiceIntensity, VoiceModulationType } from '../types/voice'

const VOICE_ANALYSIS_PROMPT = `
あなたは日本語音声合成とSSML（Speech Synthesis Markup Language）の専門家です。
与えられたテキストを分析し、最適な声の抑揚とSSMLを生成してください。

## SSML仕様（Google Cloud Text-to-Speech）
### 使用可能なタグ
- <speak>: ルート要素（必須）
- <prosody>: 音声の韻律を制御
  - pitch: 音の高さ（-50% ～ +50%、推奨範囲: -20% ～ +20%）
  - rate: 話速（0.25 ～ 4.0、推奨範囲: 0.7 ～ 1.3）
  - volume: 音量（-40dB ～ +40dB、推奨範囲: -6dB ～ +6dB）
- <emphasis>: 強調（none, moderate, strong）
- <break>: 無音（時間指定可能、例: 0.5s, 200ms）
- <say-as>: 読み方の指定（数字、日付など）

### 品質ガイドライン
- 極端な値は避け、自然な音声を目指す
- 複数の文がある場合は適切に区切る
- 日本語の特性を考慮した調整

## 声の抑揚タイプ（詳細）
### 優しい
- 特徴: 柔らかく温かい話し方、包容力がある
- 使用場面: 挨拶、お礼、慰め、説明
- 音声特性: やや低いピッチ、ゆっくりした話速、穏やかな音量

### 甘え
- 特徴: 甘えた、可愛らしい話し方、親しみやすい
- 使用場面: お願い、感謝、親しい関係での会話
- 音声特性: 高めのピッチ、標準的な話速、適度な音量

### 元気
- 特徴: 明るく活発な話し方、エネルギッシュ
- 使用場面: 挨拶、励まし、楽しい話題、宣伝
- 音声特性: 高いピッチ、速い話速、大きな音量

### 落ち着き
- 特徴: 冷静で落ち着いた話し方、信頼感がある
- 使用場面: 説明、報告、重要な話、知識の共有
- 音声特性: 低いピッチ、ゆっくりした話速、控えめな音量

### 厳しい
- 特徴: 厳格で強い話し方、権威的
- 使用場面: 注意、指示、重要な警告、叱責
- 音声特性: 標準的なピッチ、速い話速、大きな音量

### ささやき
- 特徴: 小声で内緒話のような話し方、親密感がある
- 使用場面: 秘密の話、静かな場面、親密な会話
- 音声特性: 標準的なピッチ、遅い話速、小さな音量

### 励まし
- 特徴: 勇気づける、応援するような話し方、前向き
- 使用場面: 応援、激励、前向きなメッセージ、サポート
- 音声特性: やや高いピッチ、標準的な話速、適度な音量

## 分析フレームワーク
### 1. 文章タイプの識別
- 挨拶・お礼: 優しい、甘え
- 質問・疑問: 元気、優しい
- 説明・解説: 落ち着き
- 感嘆・驚き: 元気
- 指示・命令: 厳しい、落ち着き
- 感情表現: 文脈に応じて選択

### 2. 感情・意図の分析
- ポジティブ: 元気、励まし
- ネガティブ: 落ち着き、厳しい
- 中立: 優しい、落ち着き
- 親密: 甘え、ささやき

### 3. 文脈の考慮
- 敬語使用: 落ち着き、優しい
- カジュアル: 元気、甘え
- 丁寧語: 優しい、落ち着き
- 感情的表現: 文脈に応じて調整

## 分析対象テキスト
{text}

## 出力形式
以下の形式で必ず出力してください：

### 1. 声の抑揚分析（JSON）
\`\`\`json
{
  "type": "抑揚タイプ（上記7つから選択）",
  "intensity": "強度（low/medium/high）",
  "reason": "選択した理由（文章タイプ、感情、文脈を含む詳細な説明）"
}
\`\`\`

### 2. SSML（完全な形式）
\`\`\`xml
<speak>
  <!-- 分析に基づいた適切なSSMLを生成 -->
  <!-- 必要に応じてbreak、emphasisタグも使用 -->
  <!-- 長い文章の場合は適切に区切る -->
</speak>
\`\`\`

## 重要事項
- 必ずJSONとSSMLの両方を含めてください
- SSMLは文法的に正しく、自然な音声になるように調整してください
- 日本語の特性を考慮した適切なパラメータを設定してください
- 極端な値は避け、聞きやすい音声を目指してください
`

export class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }

  async analyzeVoiceModulation(text: string): Promise<{
    analysis: GeminiAnalysisResult
    ssml: string
  }> {
    const prompt = VOICE_ANALYSIS_PROMPT.replace('{text}', text)

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()

      // JSONとSSMLを抽出（コードブロック形式に対応）
      const jsonMatch =
        response.match(/```json\s*\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*?\}/)
      const ssmlMatch =
        response.match(/```xml\s*\n([\s\S]*?)\n```/) || response.match(/<speak>[\s\S]*?<\/speak>/)

      if (!jsonMatch || !ssmlMatch) {
        throw new Error('Failed to extract JSON or SSML from response')
      }

      // コードブロックから抽出した場合は capture group 1 を使用、そうでなければ match[0]
      const jsonText = jsonMatch[1] || jsonMatch[0]
      const ssmlText = ssmlMatch[1] || ssmlMatch[0]

      const analysis = JSON.parse(jsonText) as GeminiAnalysisResult
      const ssml = ssmlText

      // 型の検証
      this.validateAnalysisResult(analysis)

      return { analysis, ssml }
    } catch (error) {
      console.error('Gemini API error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to analyze voice modulation')
    }
  }

  private validateAnalysisResult(result: any): asserts result is GeminiAnalysisResult {
    const validTypes: VoiceModulationType[] = [
      '優しい',
      '甘え',
      '元気',
      '落ち着き',
      '厳しい',
      'ささやき',
      '励まし',
    ]
    const validIntensities: VoiceIntensity[] = ['low', 'medium', 'high']

    if (!validTypes.includes(result.type)) {
      throw new Error(`Invalid voice type: ${result.type}`)
    }

    if (!validIntensities.includes(result.intensity)) {
      throw new Error(`Invalid intensity: ${result.intensity}`)
    }

    if (typeof result.reason !== 'string') {
      throw new Error('Missing or invalid reason')
    }
  }
}
