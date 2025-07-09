export function validateSSML(ssml: string): boolean {
  // 基本的なSSML構造の検証
  const hasSpeak = /<speak>[\s\S]*<\/speak>/.test(ssml)

  return hasSpeak
}
