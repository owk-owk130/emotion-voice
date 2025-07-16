# Emotion Voice Generator

AI（Gemini）がテキストから感情を自動判定し、日本語専用に最適化された ElevenLabs で感情豊かな音声を生成する Web アプリケーション

## 概要

テキストを入力すると、Gemini API が感情を分析し、判定された感情に基づいて ElevenLabs API でパラメータ調整された自然な音声を生成します。日本語に最適化された SSML を使用し、優しい・甘え・元気などの感情表現を音声で再現します。

## 主な機能

- 🤖 **AI 感情分析**: Gemini API による自動感情判定
- 🎵 **感情豊かな音声生成**: 8 種類の感情表現（イケメン、優しい、甘え、元気、落ち着き、厳しい、ささやき、励まし）
- 🎯 **日本語最適化**: ElevenLabs の高品質な多言語音声モデル使用
- 🔊 **高品質音声**: ElevenLabs API の最新音声技術
- 🎛️ **音声選択**: 複数の音声から選択可能
- 📝 **SSML 対応**: 詳細な音声制御が可能

## 技術スタック

- **ランタイム**: Bun
- **フレームワーク**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS
- **AI/音声合成**:
  - Google Gemini API（感情分析）
  - ElevenLabs API（音声生成）

## 声の抑揚システム

### 対応する抑揚タイプ

| タイプ   | 特徴                             | 使用場面                         |
| -------- | -------------------------------- | -------------------------------- |
| イケメン | 低く安定した声                   | カッコいい男性のキャラクター     |
| 優しい   | 柔らかく温かい話し方             | 挨拶、お礼、慰め、説明           |
| 甘え     | 甘えた、可愛らしい話し方         | お願い、感謝、親しい関係での会話 |
| 元気     | 明るく活発な話し方               | 挨拶、励まし、楽しい話題         |
| 落ち着き | 冷静で落ち着いた話し方           | 説明、報告、重要な話             |
| 厳しい   | 厳格で強い話し方                 | 注意、指示、重要な警告           |
| ささやき | 小声で内緒話のような話し方       | 秘密の話、静かな場面             |
| 励まし   | 勇気づける、応援するような話し方 | 応援、激励、前向きなメッセージ   |

## セットアップ

### 前提条件

- Bun 1.0.0 以上

### インストール

1. リポジトリをクローン:

```bash
git clone <repository-url>
cd emotion-voice
```

2. 依存関係をインストール:

```bash
bun install
```

3. 環境変数を設定:

```bash
cp .env.example .env
```

`.env`ファイルを編集し、API キーを設定:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### API キーの取得

#### Google Gemini API

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. 新しい API キーを作成
3. `.env`の`VITE_GEMINI_API_KEY`に設定

#### ElevenLabs API

1. [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)にアクセス
2. API キーを生成またはコピー
3. `.env`の`VITE_ELEVENLABS_API_KEY`に設定

## 開発

### 開発サーバー起動

```bash
bun run dev
```

http://localhost:5173 でアプリケーションにアクセスできます。

### ビルド

```bash
bun run build
```

### テスト

```bash
bun run test
```

### Lint & Format

```bash
bun run lint    # Biomeによるlintチェック
bun run format  # コードフォーマット
```

## 使用方法

1. **テキスト入力**: 読み上げたいテキストを入力
2. **音声選択**: お好みの音声を選択（デフォルトは日本語対応音声）
3. **音声生成**: 「音声を生成」ボタンをクリック
4. **結果確認**: AI が判定した感情タイプと理由を確認
5. **音声再生**: 生成された音声を再生

## プロジェクト構造

```
src/
├── components/         # UIコンポーネント
│   ├── TextInput.tsx
│   ├── VoiceSelector.tsx
│   ├── AudioPlayer.tsx
│   └── SSMLViewer.tsx
├── services/          # API連携ロジック
│   ├── gemini.ts     # Gemini API クライアント
│   ├── tts.ts        # ElevenLabs API クライアント
│   └── ssml.ts       # SSML生成ロジック
├── types/            # TypeScript型定義
├── utils/            # ユーティリティ関数
├── hooks/            # カスタムフック
└── constants/        # 定数定義
```

## 感情パラメータ設定

ElevenLabs の音声パラメータは感情に応じて自動調整されます：

| 感情タイプ | stability | similarity_boost | style | 特徴               |
| ---------- | --------- | ---------------- | ----- | ------------------ |
| イケメン   | 0.90      | 0.95             | 0.10  | 低く安定した声     |
| 優しい     | 0.95      | 0.98             | 0.05  | 穏やかで自然な声   |
| 元気       | 0.85      | 0.90             | 0.20  | 明るく活発な声     |
| 落ち着き   | 0.98      | 0.99             | 0.02  | 冷静で落ち着いた声 |
| 甘え       | 0.88      | 0.92             | 0.15  | 甘えた可愛らしい声 |
| 厳しい     | 0.90      | 0.90             | 0.20  | 厳格で強い声       |
| ささやき   | 0.95      | 0.96             | 0.08  | 小声で内緒話の声   |
| 励まし     | 0.88      | 0.90             | 0.18  | 力強く励ます声     |

## トラブルシューティング

### よくある問題

1. **API キーエラー**: 環境変数が正しく設定されているか確認
2. **音声生成エラー**: ElevenLabs のクレジットが残っているか確認
3. **感情分析エラー**: Gemini API の利用制限を確認
