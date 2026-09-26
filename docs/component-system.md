# デザインコンポーネントシステム

最終更新: 2026-09-26

## 目的

AIが既存のデザインコンポーネントを選択し、必要に応じて新しいデザインコンポーネントを追加できるようにする。

コンポーネントは、スライドの意味そのものではなく、情報をどのように見せるかを定義する。

## 階層

```text
Design Tokens
  ↓
Primitive Components
  ↓
Layout Components
  ↓
Page Templates / Design Patterns
  ↓
Slide Document
```

### Design Tokens

- 色
- フォント
- フォントサイズ
- 行間
- 余白
- 枠線
- 角丸
- 影

### Primitive Components

- Text
- Heading
- Stack
- Grid
- Divider
- Icon

### Layout Components

- Columns
- CardGrid
- Header
- Footer
- ContentArea

### Page Templates / Design Patterns

- CoverHero
- Message
- TwoColumn
- Process
- Comparison
- DataStory
- Closing

JSONから直接指定する主な単位は、Page Template / Design Patternとする。Primitiveや細かいレイアウト部品は、テンプレート内部で利用する。

## 共通契約（暫定）

すべてのコンポーネントは、最低限以下の情報を持つ。

```text
component
kind
version
variant
props
slots
```

共通契約は識別と呼び出し方法を定義する。実際に必要な入力データ、スロット、制約はコンポーネントごとに定義する。

## コンポーネントの種類

```text
page-template
  = スライド全体の構造

layout
  = 段組み・整列・配置

content
  = 見出し・本文・引用・画像・コード

visualization
  = 表・グラフ・図解・タイムライン
```

## ページテンプレートの契約例

```json
{
  "id": "two-column",
  "kind": "page-template",
  "version": "1.0.0",
  "slots": {
    "header": {
      "accepts": ["slide-heading"]
    },
    "left": {
      "accepts": ["body-text", "image-block", "quote"]
    },
    "right": {
      "accepts": ["body-text", "diagram", "table"]
    }
  },
  "constraints": {
    "maxTitleLines": 2,
    "maxBodyItems": 4,
    "maxColumns": 2
  },
  "variants": ["default", "dark", "accent-left"]
}
```

## 再利用レベル

新しいデザインは、最初から共通テンプレートとして登録しない。

```text
資料専用デザイン
  ↓
資料内テンプレート
  ↓
共通デザインテンプレート
```

昇格は、使用回数だけでなく以下を基準に判断する。

- 今後も似た用途で利用できる
- 内容とレイアウトを分離できる
- パラメータ化できる
- 保守する価値がある

共通テンプレートへの登録・昇格は、人間の確認を受ける。

## 新規コンポーネント追加フロー

1. 既存コンポーネントで対応できるか確認する
2. 新規作成が必要な理由を整理する
3. 用途・スロット・入力・制約を定義する
4. コンポーネントを実装する
5. サンプルJSONを作成する
6. HTML / PDFで表示を検証する
7. 資料専用または資料内テンプレートとして利用する
8. 再利用価値が確認できたら共通テンプレートへ昇格する

## JSONでの利用例

```json
{
  "pageTemplate": "two-column",
  "design": {
    "variant": "accent-left"
  },
  "regions": {
    "header": [
      {
        "component": "slide-heading",
        "props": {
          "text": "従来の方法の課題"
        }
      }
    ],
    "left": [
      {
        "component": "body-text",
        "props": {
          "text": "..."
        }
      }
    ],
    "right": [
      {
        "component": "diagram",
        "props": {
          "type": "process",
          "steps": ["入力", "処理", "出力"]
        }
      }
    ]
  }
}
```
