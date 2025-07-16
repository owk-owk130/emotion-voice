import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GeminiAnalysisResult } from '../types/api'
import type { VoiceIntensity, VoiceModulationType } from '../types/voice'

const VOICE_ANALYSIS_PROMPT = `
あなたは日本語テキストの感情分析とSSML生成の専門家です。
与えられたテキストを分析し、感情に応じて高精度なSSMLを生成してください。

## 感情タイプ
- イケメン: 低くて落ち着いた魅力的な話し方
- 優しい: 柔らかく温かい話し方
- 甘え: 甘えた、可愛らしい話し方
- 元気: 明るく活発な話し方
- 落ち着き: 冷静で落ち着いた話し方
- 厳しい: 厳格で強い話し方
- ささやき: 小声で内緒話のような話し方
- 励まし: 勇気づける、応援するような話し方

## SSML生成指針（高精度版）
音声合成の品質向上のため、以下の方針でSSMLを生成してください：

### 1. 漢字のひらがな変換とイントネーション制御（最重要）
**全ての漢字を文脈に応じた正確なひらがなに変換し、自然なイントネーションを付与**
- 漢字は必ずひらがなに変換（ElevenLabsはsub aliasをサポートしていないため）
- 一般的な漢字も含めてすべて対象
- 文脈による読み分けを正確に判断
- カタカナはそのまま保持

**ひらがな変換時のイントネーション補正**：
- **アクセント位置**: 第1音節が高い語は <prosody pitch="+5%">き</prosody>ょう
- **語境界明確化**: 複合語は <break time="0.1s"/> で区切る
- **長音制御**: 「おお」は <prosody rate="80%">おお</prosody> でゆっくり
- **促音制御**: 「っ」は <break time="0.1s"/>っ<break time="0.1s"/> で間を作る
- **助詞弱化**: 「は」「が」「を」は <prosody volume="soft">は</prosody>

### 2. 感情別イントネーション制御
**感情に応じたprosodyタグでの細かな制御**
- イケメン: <prosody pitch="-10%" rate="85%" volume="loud">
- 優しい: <prosody pitch="-5%" rate="90%" volume="soft">
- 甘え: <prosody pitch="+10%" rate="95%" volume="soft">
- 元気: <prosody pitch="+15%" rate="110%" volume="loud">
- 落ち着き: <prosody pitch="-15%" rate="80%" volume="soft">
- 厳しい: <prosody pitch="+5%" rate="100%" volume="loud">
- ささやき: <prosody pitch="+5%" rate="75%" volume="x-soft">
- 励まし: <prosody pitch="+10%" rate="105%" volume="loud">

### 3. 文構造に応じた制御
- **重要な語句**: <emphasis level="strong">で強調
- **文節区切り**: <break time="0.3s"/>で自然な間
- **文末**: <break time="0.5s"/>でしっかりとした間
- **疑問文**: 語尾を<prosody pitch="+20%">で上げる（例：「ですか？」→「<prosody pitch="+20%">ですか</prosody>？」）
- **感嘆文**: <emphasis level="moderate">で感情を表現
- **並列**: 「、」の後に<break time="0.2s"/>を挿入

### 4. 数字・記号の処理
- 数字: <say-as interpret-as="cardinal">123</say-as>
- 日付: <say-as interpret-as="date">2024-01-15</say-as>
- 時刻: <say-as interpret-as="time">14:30</say-as>

## 分析対象テキスト
{text}

## 出力形式
以下のJSON形式で回答してください：

{
  "type": "感情タイプ",
  "intensity": "low/medium/high",
  "reason": "判定理由",
  "ssml": "<speak>生成した高精度SSMLコンテンツ</speak>"
}

## SSML生成例
**入力テキスト**: 今日は良い天気ですね。会社に行きます。
**優しい感情でのSSML例（イントネーション補正付き）**:
<speak>
<prosody pitch="-5%" rate="90%" volume="soft">
<prosody pitch="+5%">きょ</prosody>う<prosody volume="soft">は</prosody> <prosody pitch="+3%">よ</prosody>い <prosody pitch="+2%">てん</prosody>きですね。
<break time="0.5s"/>
かい<break time="0.1s"/>しゃ<prosody volume="soft">に</prosody> いきます。
</prosody>
</speak>

**重要な注意点**:
- 全ての漢字をひらがなに変換（sub aliasは使用しない）
- 感情に応じたprosodyで全体を包み、イントネーションを制御
- 文脈に応じた適切な間（break）を配置
- 疑問文は語尾を<prosody pitch="+20%">で囲んで上昇調に
- 重要な語句はemphasisで強調
- カタカナ語はそのまま保持

**追加例**:
- 疑問文: 「元気ですか？」→「<prosody pitch="+20%">げんきですか</prosody>？」
- 感嘆文: 「すごいですね！」→「<emphasis level="moderate">すごいですね</emphasis>！」
- 強調: 「とても重要です」→「<emphasis level="strong">とても</emphasis> じゅうようです」
- アクセント: 「学校」→「<prosody pitch="+3%">がっ</prosody>こう」
- 複合語: 「新年会」→「しん<break time="0.1s"/>ねん<break time="0.1s"/>かい」
- 助詞: 「私は」→「わたし<prosody volume="soft">は</prosody>」

感情タイプは上記8つから選択し、intensityは感情の強さを示してください。
SSMLは日本語音声合成に最適化し、自然で感情豊かな表現を心がけてください。
`

export class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    })
  }

  async analyzeEmotion(text: string): Promise<GeminiAnalysisResult> {
    const prompt = VOICE_ANALYSIS_PROMPT.replace('{text}', text)

    let response = ''
    let jsonText = ''

    try {
      const result = await this.model.generateContent(prompt)
      response = result.response.text()

      console.log('Gemini raw response:', response)

      // JSONを抽出（コードブロック形式に対応）
      const jsonMatch =
        response.match(/```json\s*\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*?\}/)

      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from response')
      }

      // コードブロックから抽出した場合は capture group 1 を使用、そうでなければ match[0]
      jsonText = jsonMatch[1] || jsonMatch[0]
      console.log('Extracted JSON text:', jsonText)

      // JSONを整形・修正
      jsonText = this.cleanupJsonText(jsonText)
      console.log('Cleaned JSON text:', jsonText)

      const analysis = JSON.parse(jsonText) as GeminiAnalysisResult

      // 型の検証
      this.validateAnalysisResult(analysis)

      return analysis
    } catch (error) {
      console.error('Gemini API error:', error)
      if (error instanceof SyntaxError) {
        console.error('JSON Parse Error details:', {
          message: error.message,
          rawResponse: response,
          extractedJson: jsonText,
        })
        throw new Error(`JSON解析エラー: ${error.message}`)
      }
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to analyze emotion')
    }
  }

  /**
   * JSONテキストをクリーンアップして構文エラーを修正
   */
  private cleanupJsonText(jsonText: string): string {
    const cleaned = jsonText.trim()

    // トレーリングカンマを削除
    return cleaned.replace(/,(\s*[}\]])/g, '$1')
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
      'イケメン',
    ]
    const validIntensities: VoiceIntensity[] = ['low', 'medium', 'high']

    if (!result || typeof result.type === 'undefined') {
      throw new Error('Missing voice type in analysis result')
    }

    if (!validTypes.includes(result.type)) {
      throw new Error(`Invalid voice type: ${result.type}`)
    }

    if (typeof result.intensity === 'undefined') {
      throw new Error('Missing intensity in analysis result')
    }

    if (!validIntensities.includes(result.intensity)) {
      throw new Error(`Invalid intensity: ${result.intensity}`)
    }

    if (typeof result.reason !== 'string') {
      throw new Error('Missing or invalid reason')
    }

    if (result.ssml && typeof result.ssml !== 'string') {
      throw new Error('Invalid SSML format')
    }
  }
}
