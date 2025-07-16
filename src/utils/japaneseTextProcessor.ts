/**
 * 日本語テキストの前処理ユーティリティ
 * ElevenLabsでより自然な日本語音声を生成するためのテキスト最適化
 */

interface JapaneseTextOptions {
  convertDifficultKanji?: boolean // 難しい漢字をひらがなに変換
  optimizePunctuation?: boolean // 句読点を最適化
  processNumbers?: boolean // 数字を日本語読みに変換
  addPauses?: boolean // 自然な間を追加
}

/**
 * 難読漢字をひらがなに変換するマッピング
 */
const DIFFICULT_KANJI_MAP: Record<string, string> = {
  // 人名でよく使われる難読漢字
  雄: 'ゆう',
  雅: 'まさ',
  智: 'とも',
  哲: 'てつ',
  慶: 'けい',
  恵: 'え',
  惠: 'え',
  瞳: 'ひとみ',
  翔: 'しょう',

  // 一般的な難読漢字
  薔薇: 'ばら',
  紫陽花: 'あじさい',
  向日葵: 'ひまわり',
  百合: 'ゆり',
  椿: 'つばき',
  桜: 'さくら',
  梅: 'うめ',

  // ビジネス用語
  企画: 'きかく',
  戦略: 'せんりゃく',
  効率: 'こうりつ',
  品質: 'ひんしつ',
  技術: 'ぎじゅつ',
  開発: 'かいはつ',
  設計: 'せっけい',
  実装: 'じっそう',

  // IT用語
  API: 'エーピーアイ',
  UI: 'ユーアイ',
  UX: 'ユーエックス',
  AI: 'エーアイ',
  ML: 'エムエル',
  IoT: 'アイオーティー',
  DX: 'ディーエックス',
}

/**
 * 数字を日本語読みに変換
 */
function convertNumbersToJapanese(text: string): string {
  // 年号
  text = text.replace(/(\d{4})年/g, (_match, year) => {
    return `${convertNumberToJapanese(year)}年`
  })

  // 月日
  text = text.replace(/(\d{1,2})月/g, (_match, month) => {
    return `${convertNumberToJapanese(month)}がつ`
  })

  text = text.replace(/(\d{1,2})日/g, (_match, day) => {
    return `${convertNumberToJapanese(day)}にち`
  })

  // 時刻
  text = text.replace(/(\d{1,2})時/g, (_match, hour) => {
    return `${convertNumberToJapanese(hour)}じ`
  })

  text = text.replace(/(\d{1,2})分/g, (_match, minute) => {
    return `${convertNumberToJapanese(minute)}ふん`
  })

  // パーセント
  text = text.replace(/(\d+)%/g, (_match, num) => {
    return `${convertNumberToJapanese(num)}パーセント`
  })

  // 一般的な数字（4桁以下）
  text = text.replace(/\b(\d{1,4})\b/g, (match, num) => {
    const numValue = parseInt(num)
    if (numValue <= 10000) {
      return convertNumberToJapanese(num)
    }
    return match
  })

  return text
}

/**
 * 数字を日本語読みに変換（簡易版）
 */
function convertNumberToJapanese(numStr: string): string {
  const num = parseInt(numStr)

  const ones = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
  const tens = [
    '',
    'じゅう',
    'にじゅう',
    'さんじゅう',
    'よんじゅう',
    'ごじゅう',
    'ろくじゅう',
    'ななじゅう',
    'はちじゅう',
    'きゅうじゅう',
  ]
  const hundreds = [
    '',
    'ひゃく',
    'にひゃく',
    'さんびゃく',
    'よんひゃく',
    'ごひゃく',
    'ろっぴゃく',
    'ななひゃく',
    'はっぴゃく',
    'きゅうひゃく',
  ]
  const thousands = [
    '',
    'せん',
    'にせん',
    'さんぜん',
    'よんせん',
    'ごせん',
    'ろくせん',
    'ななせん',
    'はっせん',
    'きゅうせん',
  ]

  if (num === 0) return 'ゼロ'
  if (num < 10) return ones[num]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + ones[one]
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const remainder = num % 100
    return hundreds[hundred] + (remainder > 0 ? convertNumberToJapanese(remainder.toString()) : '')
  }
  if (num < 10000) {
    const thousand = Math.floor(num / 1000)
    const remainder = num % 1000
    return (
      thousands[thousand] + (remainder > 0 ? convertNumberToJapanese(remainder.toString()) : '')
    )
  }

  return numStr // フォールバック
}

/**
 * 句読点を最適化
 */
function optimizePunctuationText(text: string): string {
  // 長い文を適切に区切る
  text = text.replace(/([。！？])\s*([あ-ん])/g, '$1　$2')

  // 読点の後に適切な間を追加
  text = text.replace(/、\s*/g, '、　')

  // 疑問符・感嘆符の後に間を追加
  text = text.replace(/([！？])\s*/g, '$1　')

  // 長音記号の適切な処理
  text = text.replace(/ー+/g, 'ー')

  return text
}

/**
 * 自然な間を追加
 */
function addNaturalPausesToText(text: string): string {
  // 長い文章の途中に自然な間を追加
  text = text.replace(/([、。])([あ-んア-ンー]{10,})/g, '$1　$2')

  // 接続詞の前に軽い間を追加
  text = text.replace(/(そして|しかし|また|さらに|なお|ただし|ところで|ちなみに)/g, '　$1')

  return text
}

/**
 * メインの日本語テキスト前処理関数
 */
export function preprocessJapaneseText(text: string, options: JapaneseTextOptions = {}): string {
  const {
    convertDifficultKanji = true,
    optimizePunctuation = true,
    processNumbers = true,
    addPauses = true,
  } = options

  let processedText = text

  // 難読漢字をひらがなに変換
  if (convertDifficultKanji) {
    for (const [kanji, hiragana] of Object.entries(DIFFICULT_KANJI_MAP)) {
      processedText = processedText.replace(new RegExp(kanji, 'g'), hiragana)
    }
  }

  // 数字を日本語読みに変換
  if (processNumbers) {
    processedText = convertNumbersToJapanese(processedText)
  }

  // 句読点を最適化
  if (optimizePunctuation) {
    processedText = optimizePunctuationText(processedText)
  }

  // 自然な間を追加
  if (addPauses) {
    processedText = addNaturalPausesToText(processedText)
  }

  // 余分な空白を正規化
  processedText = processedText.replace(/\s+/g, ' ').trim()

  return processedText
}

/**
 * よく使われる日本語テスト用フレーズ
 */
export const JAPANESE_TEST_PHRASES = [
  'こんにちは、今日はよい天気ですね。',
  'ありがとうございました。またお会いしましょう。',
  'すみません、少し急いでいるのですが。',
  'お疲れさまでした。今日も一日頑張りましたね。',
  'おはようございます。今日も元気に頑張りましょう。',
  'それでは、会議を始めさせていただきます。',
  '申し訳ございませんが、もう一度説明していただけますか。',
  'とても美しい桜が咲いていますね。春らしくて素敵です。',
]
