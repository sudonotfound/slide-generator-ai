# AI Slide Generator

AIとの対話を通じて、前提・目的・構成を整理しながらスライド資料を生成するためのプロジェクトです。

## 現在の方針

- 1資料1JSONファイルを正本として管理する
- AIの生成手順はSkillとして定義する
- JSONからMarp用Markdownを自動生成する
- HTMLとしてブラウザで閲覧できるようにする
- PDF・画像出力を優先する
- PowerPoint出力は将来の検討事項とする
- ブラウザ上の直接編集機能は実装しない

設計上の決定事項は[`docs/technology-decisions.md`](docs/technology-decisions.md)に記録する。

## 実装状況

最小の生成パイプラインを実装済みです。

```text
presentation.json
  ↓
JSON Schema validation
  ↓
Technical Clean component renderer
  ↓
Marp Markdown
  ↓
Marp CLI
  ↓
HTML / PDF / PNG
```

### セットアップ

```sh
npm install
```

### 実行

```sh
# サンプルJSONを検証
npm run validate

# Marp Markdownを生成
npm run markdown

# HTMLを生成（dist/sample-lt.html）
npm run render

# PDFまたはPNGを生成
node src/cli.js render examples/sample-lt.json --format pdf
node src/cli.js render examples/sample-lt.json --format png
```

PDF・PNG出力はMarpが内部で使用するChromiumが必要です。HTML出力にはブラウザ実行環境は不要ですが、PDF・PNGを使う環境ではChromiumの起動条件も確認してください。PNGは`dist/sample-lt-images/`にページごとに出力されます。

生成されたHTMLをブラウザで開くことで、AIが作成したスライドを確認できます。編集はHTMLを直接変更せず、JSONをAIとの対話で更新して再生成します。

### 実装済みコンポーネント

- `slide-heading`
- `body-text`
- `quote`
- `card-grid`
- `process-diagram`
- `bullet-list`
- `code-block`

新しいページテンプレートやコンポーネントの追加手順は、[`skills/design-system-extension/SKILL.md`](skills/design-system-extension/SKILL.md)を参照してください。
