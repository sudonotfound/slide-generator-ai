# アーキテクチャ

最終更新: 2026-09-26

## 基本構成

```text
AI Skill
  ↓
PresentationContext / Assumptions / NarrativePlan
  ↓
presentation.json
  ↓
JSON Schema validation
  ↓
Component resolver
  ↓
Marp Markdown generator
  ↓
Marp CLI
  ├── HTML（ブラウザ閲覧）
  ├── PDF
  └── PNG
```

## 責務分担

### AI Skill

- 目的・対象者・利用場面を確認する
- 不足情報と推測した前提を整理する
- 全体構成を作成する
- コンポーネントを選択する
- ユーザーの追加指示をJSONの変更へ反映する

### JSON

- 資料全体の前提を保持する
- 各スライドの目的・メッセージを保持する
- ページテンプレートを指定する
- ページ内コンポーネントと入力データを指定する

### Design System

- ページテンプレートを提供する
- ページ内のレイアウトとデザイン部品を提供する
- 使用可能な入力・制約・バリエーションを定義する
- Marp用の出力方法を提供する

### Renderer

- JSONのコンポーネント指定を解決する
- デザインシステムの実装を適用する
- Marp用Markdownを生成する

## データモデルの階層

```text
PresentationContext
  = 資料の目的・対象者・利用場面

Assumptions
  = AIが利用した前提と確信度

NarrativePlan
  = 資料全体の主張とストーリー

SlideDocument
  = 各スライドの目的・内容・デザイン指定

Component Definition
  = コンポーネントの入力・スロット・制約・出力方法
```

## レンダラー方針

初期はMarpを出力エンジンとして利用する。JSONとデザインコンポーネントの契約は、将来HTML／Reactなどの別レンダラーを追加できるよう、Marp固有の記法と分離する。

ただし、初期の実装対象はMarpレンダラーのみとする。

## 将来の拡張

```text
presentation.json
  ├── Marp Renderer       ← 初期実装
  ├── HTML/React Renderer ← 将来検討
  ├── Reveal.js Renderer  ← 将来検討
  └── PPTX Renderer       ← 優先度低
```
