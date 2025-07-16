# Emotion Voice Generator - プロジェクト仕様書

## プロジェクト概要

このプロジェクトは、AI（Gemini）がテキストから感情を自動判定し、日本語専用に最適化されたElevenLabsで感情豊かな音声を生成する Web アプリケーションです。ユーザーが入力したテキストをGeminiで感情分析し、判定された感情（優しい、甘え、元気など）に基づいて、ElevenLabs API で日本語音声パラメータ調整を行い高品質な音声を生成・再生します。

## 技術スタック

- **ランタイム**: Bun
- **ビルドツール**: Vite
- **フレームワーク**: React + TypeScript
- **スタイリング**: Tailwind CSS
- **テスト**: Vitest
- **Linter/Formatter**: Biome
- **AI/ML**:
  - Gemini API（感情分析・判定）
  - ElevenLabs API（日本語音声生成）

## 声の抑揚システム

### 重要なドキュメント

- `docs/ssml-reference.md`: SSML の完全リファレンス
- 日本語の抑揚制御と感情表現に特に注意してください

### コーディング規則

- SSML 生成時は必ず日本語向けの最適化を行う
- 感情表現は `prosody` タグを積極的に活用
- 敬語レベルの一貫性を保つ

### 抑揚タイプ定義

```typescript
type VoiceModulationType =
  | "優しい" // 柔らかく温かい話し方
  | "甘え" // 甘えた、可愛らしい話し方
  | "元気" // 明るく活発な話し方
  | "落ち着き" // 冷静で落ち着いた話し方
  | "厳しい" // 厳格で強い話し方
  | "ささやき" // 小声で内緒話のような話し方
  | "励まし"; // 勇気づける、応援するような話し方

interface VoiceModulation {
  type: VoiceModulationType;
  intensity: "low" | "medium" | "high"; // 抑揚の強度
  pitch: string; // -20% ~ +20%
  rate: string; // 50% ~ 200%
  volume: string; // -6dB ~ +6dB
  emphasis: "none" | "moderate" | "strong";
}
```

### SSML パラメータマッピング

| 抑揚タイプ | pitch       | rate        | volume      | 特徴                       |
| ---------- | ----------- | ----------- | ----------- | -------------------------- |
| 優しい     | -5% ~ 0%    | 85% ~ 95%   | -1dB ~ 0dB  | 柔らかく穏やかな話し方     |
| 甘え       | +5% ~ +15%  | 90% ~ 100%  | 0dB ~ +2dB  | 高めの声で甘えた話し方     |
| 元気       | +10% ~ +20% | 110% ~ 130% | +2dB ~ +4dB | 明るく弾んだ話し方         |
| 落ち着き   | -10% ~ -5%  | 80% ~ 90%   | -2dB ~ 0dB  | 低めでゆっくりした話し方   |
| 厳しい     | -5% ~ +5%   | 100% ~ 120% | +2dB ~ +5dB | 強く断定的な話し方         |
| ささやき   | 0% ~ +5%    | 70% ~ 85%   | -6dB ~ -3dB | 小声で内緒話のような話し方 |
| 励まし     | +5% ~ +10%  | 100% ~ 110% | +1dB ~ +3dB | 力強く前向きな話し方       |

## アーキテクチャ

### ディレクトリ構造

```
emotion-voice/
├── src/
│   ├── components/
│   │   ├── TextInput.tsx           # テキスト入力コンポーネント
│   │   ├── VoiceModulationDisplay.tsx  # 声の抑揚表示
│   │   └── AudioPlayer.tsx         # 音声再生コントロール
│   ├── services/
│   │   ├── gemini.ts              # Gemini API クライアント
│   │   ├── tts.ts                 # ElevenLabs API クライアント
│   │   └── ssml.ts                # SSML生成ロジック
│   ├── types/
│   │   ├── voice.ts               # 声の抑揚関連の型定義
│   │   └── api.ts                 # API関連の型定義
│   ├── utils/
│   │   └── voiceModulation.ts     # 声の抑揚パラメータ変換
│   ├── hooks/
│   │   └── useVoiceGeneration.ts  # 音声生成カスタムフック
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── services/
│   │   ├── ssml.test.ts
│   │   └── voiceModulation.test.ts
│   └── utils/
│       └── voiceModulation.test.ts
├── .env.example                    # 環境変数テンプレート
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
└── biome.json                      # Biome設定ファイル
```

## 開発ガイドライン

### TypeScript 使用方針

1. **厳格な型定義**: `strict: true`を有効化
2. **型推論の活用**: 明示的な型定義は必要最小限に
3. **インターフェース優先**: type より interface を優先使用
4. **null チェック**: optional chaining と nullish coalescing を活用

### Tailwind CSS スタイリング規約

1. **ユーティリティファースト**: インラインクラスで直接スタイリング
2. **カラーパレット**: デフォルトカラーを使用、カスタムカラーは最小限
3. **コンポーネント単位**: 各コンポーネントで完結したスタイリング
4. **ダークモード非対応**: 明るいテーマのみ実装

### Vitest テスト方針

1. **単体テスト重視**: 各関数・モジュールの単体テストを優先
2. **モック活用**: 外部 API はモック化してテスト
3. **境界値テスト**: 声の抑揚パラメータの境界値を重点的にテスト
4. **型安全性テスト**: TypeScript の型が正しく機能することを確認

### Biome 設定方針

1. **コード品質チェック**: 実装完了後は必ず `bun run lint` を実行
2. **フォーマット**: `bun run format` でコードを整形
3. **エラーゼロ**: Biome のエラーがないことを確認してから完了
4. **推奨ルール**: Biome の推奨設定を基本的に採用

### 実装完了チェックリスト

実装を完了とする前に、以下のコマンドを必ず実行してエラーがないことを確認：

1. **Lint**: `bun run lint` - Biome によるコード品質チェック
2. **Format**: `bun run format` - コードフォーマットの適用
3. **Test**: `bun run test` - Vitest による全テストの実行
4. **Build**: `bun run build` - ビルドが成功することを確認

すべてのチェックがパスした場合のみ、実装完了とする。

## API 仕様

### Gemini API 使用方法

```typescript
// プロンプトテンプレート
const VOICE_ANALYSIS_PROMPT = `
以下のテキストを読む際の声の抑揚を分析してください。

テキスト: {text}

以下の観点で分析し、JSON形式で返してください：
1. 抑揚タイプ（優しい、甘え、元気、落ち着き、厳しい、ささやき、励まし から選択）
2. 強度（low, medium, high）
3. 推論理由

出力形式:
{
  "type": "抑揚タイプ",
  "intensity": "強度",
  "reason": "推論理由"
}
`;
```

### ElevenLabs API 使用方法

#### 音声設定

- **言語**: 日本語対応
- **音声モデル**: eleven_multilingual_v2 (通常) / eleven_turbo_v2 (SSMLサポート)
- **音声パラメータ**: stability, similarity_boost, style, use_speaker_boost

```typescript
// 音声設定
interface ElevenLabsVoiceSettings {
  stability: number;          // 0.0-1.0 (音声の安定性)
  similarity_boost: number;   // 0.0-1.0 (オリジナル音声への類似度)
  style: number;             // 0.0-1.0 (表現の強さ)
  use_speaker_boost: boolean; // 音声品質の向上
}

// SSML生成例
const generateSSML = (text: string, modulation: VoiceModulation): string => {
  return `
    <speak>
      <prosody pitch="${modulation.pitch}" rate="${modulation.rate}" volume="${modulation.volume}">
        ${text}
      </prosody>
    </speak>
  `;
};

// 感情に応じた設定例（優しい）
const voiceSettings = {
  stability: 0.95,
  similarity_boost: 0.98,
  style: 0.05,
  use_speaker_boost: true
};
```

## 実装フロー

1. **テキスト入力**: ユーザーがテキストを入力
2. **感情分析**: Gemini API がテキストを分析して感情・抑揚タイプを自動判定
3. **音声生成**: ElevenLabs API で判定された感情に応じた日本語専用音声設定により高品質な音声データを生成
4. **音声再生**: Web Audio API で音声を再生
5. **結果表示**: AI分析結果（感情タイプ、強度、判定理由）をユーザーに表示

## エラーハンドリング方針

- API 呼び出しエラー: ユーザーフレンドリーなエラーメッセージ表示
- ネットワークエラー: リトライ機能の実装
- 音声再生エラー: フォールバック処理の実装

## 環境変数

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## 今後の拡張可能性

- 複数話者の対話形式対応
- カスタム抑揚タイプの追加
- 音声ファイルのダウンロード機能
- リアルタイムプレビュー機能
