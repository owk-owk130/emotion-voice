# Emotion Voice Generator

感情豊かな音声を生成する Web アプリケーション

## 概要

このアプリケーションは、LLM（Google Gemini）を使用してテキストから声の抑揚を推論し、Google Text-to-Speech API で感情豊かな音声を生成します。ユーザーが入力したテキストを解析し、適切な声の抑揚（優しい、甘え、元気など）を自動判定して SSML ベースの音声合成を行います。

## 主な機能

- **感情分析**: テキストから適切な声の抑揚を自動推論
- **音声生成**: 高品質な日本語音声合成（ja-JP-Neural2-B）
- **リアルタイム再生**: ブラウザ内での音声再生機能
- **MP3 ダウンロード**: 生成した音声を MP3 ファイルとしてダウンロード
- **SSML 表示**: 生成された SSML コードの表示・コピー機能
- **レスポンシブ UI**: 使いやすいモダンなユーザーインターフェース

## 技術スタック

- **ランタイム**: Node.js
- **ビルドツール**: Vite
- **フレームワーク**: React 19 + TypeScript
- **スタイリング**: Tailwind CSS v4
- **テスト**: Vitest + Testing Library
- **Linter/Formatter**: Biome
- **AI/ML API**:
  - Google Gemini API（感情分析）
  - Google Cloud Text-to-Speech API（音声生成）

## 声の抑揚システム

### 対応する抑揚タイプ

| タイプ   | 特徴                             | 使用場面                         |
| -------- | -------------------------------- | -------------------------------- |
| 優しい   | 柔らかく温かい話し方             | 挨拶、お礼、慰め、説明           |
| 甘え     | 甘えた、可愛らしい話し方         | お願い、感謝、親しい関係での会話 |
| 元気     | 明るく活発な話し方               | 挨拶、励まし、楽しい話題         |
| 落ち着き | 冷静で落ち着いた話し方           | 説明、報告、重要な話             |
| 厳しい   | 厳格で強い話し方                 | 注意、指示、重要な警告           |
| ささやき | 小声で内緒話のような話し方       | 秘密の話、静かな場面             |
| 励まし   | 勇気づける、応援するような話し方 | 応援、激励、前向きなメッセージ   |

## セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

1. リポジトリをクローン:

```bash
git clone <repository-url>
cd emotion-voice
```

2. 依存関係をインストール:

```bash
npm install
```

3. 環境変数を設定:

```bash
cp .env.example .env
```

`.env`ファイルを編集し、API キーを設定:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_TTS_API_KEY=your_google_tts_api_key
```

### API キーの取得

#### Google Gemini API

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. 新しい API キーを作成
3. `.env`の`VITE_GEMINI_API_KEY`に設定

#### Google Cloud Text-to-Speech API

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. Text-to-Speech API を有効化
3. サービスアカウントを作成し、API キーを生成
4. `.env`の`VITE_GOOGLE_TTS_API_KEY`に設定

## 開発

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:5173 でアプリケーションにアクセスできます。

### ビルド

```bash
npm run build
```

### テスト

```bash
npm run test
```

### Lint & Format

```bash
npm run lint    # Biomeによるlintチェック
npm run format  # コードフォーマット
```

## 使用方法

1. **テキスト入力**: 読み上げたいテキストを入力欄に入力
2. **音声生成**: 「音声を生成」ボタンをクリック
3. **結果確認**:
   - 分析結果（抑揚タイプ、強度、推論理由）を確認
   - 生成された SSML コードを確認
4. **音声再生**: 再生ボタンで音声を聞く
5. **ダウンロード**: 必要に応じて MP3 ファイルをダウンロード

## プロジェクト構造

```
src/
├── components/           # Reactコンポーネント
│   ├── TextInput.tsx    # テキスト入力
│   ├── VoiceModulationDisplay.tsx  # 分析結果表示
│   └── AudioPlayer.tsx  # 音声プレイヤー
├── services/            # 外部API連携
│   ├── gemini.ts       # Gemini API
│   ├── tts.ts         # Text-to-Speech API
│   └── ssml.ts        # SSML関連
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
├── hooks/              # カスタムフック
└── tests/              # テストファイル
```

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 謝辞

- Google Gemini API
- Google Cloud Text-to-Speech API
- React + TypeScript + Vite テンプレート
