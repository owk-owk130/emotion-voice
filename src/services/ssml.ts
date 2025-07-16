export function validateSSML(ssml: string): boolean {
  // 基本的なSSML構造の検証のみ
  if (!ssml || typeof ssml !== 'string') {
    return false
  }

  // speakタグの存在確認
  return /<speak>[\s\S]*<\/speak>/.test(ssml)
}

/**
 * 最小限の処理でGeminiのSSMLを活かす関数
 */
export function enhanceSSML(ssml: string): string {
  // 既にSSMLタグが含まれている場合はそのまま返す（GeminiのSSMLを優先）
  if (ssml.includes('<speak>') && ssml.includes('</speak>')) {
    return ssml
  }

  // プレーンテキストの場合のみ基本的な処理
  const processedText = ssml.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case '"':
        return '&quot;'
      case "'":
        return '&apos;'
      default:
        return match
    }
  })

  return `<speak>${processedText}</speak>`
}
