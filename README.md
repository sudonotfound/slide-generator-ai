# AI Slide Generator

AIとの対話を通じて、前提・目的・構成を整理しながらスライド資料を生成するためのプロジェクトです。

## ライセンス

本プロジェクトのソースコードは[Apache License 2.0](LICENSE)の下で公開しています。個人・企業を問わず、ライセンス条件に従って無料で利用・改変・再配布・商用利用できます。改変版の再配布時はライセンス文と既存の著作権表示を保持し、変更したファイルには変更した旨を明記してください。

このライセンスは、生成されたスライドの内容や利用者が追加した素材・フォント等の権利を一律に定めるものではありません。それらは各素材の権利・ライセンスに従ってください。

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

JSON資料からHTMLを生成するパイプラインと、基底デザイン/用途別テンプレートを分離したデザインパッケージの読み込みを実装済みです。

```text
presentation.json
  ↓
JSON Schema validation
  ↓
design package (foundation tokens + use-case template)
  ↓
design/template validation
  ↓
content-aware component renderer
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

# 基底デザインと用途別テンプレートの検証
node src/cli.js validate-design designs/technical-lt
```

### デザインパッケージ

資料JSONの`meta.designPackage`でパッケージのディレクトリを指定します（資料JSONからの相対パス）。パッケージには次の2ファイルを置きます。

- `foundation.json`: 共有する色・文字・余白・形状のデザイントークン
- `template.json`: 用途、ページレイアウト、利用可能なコンポーネント、構成ルール

デザイン参照画像/PDFからこれらを作成する手順は[`skills/design-template-setup/SKILL.md`](skills/design-template-setup/SKILL.md)、資料作成の手順は[`skills/slide-authoring/SKILL.md`](skills/slide-authoring/SKILL.md)を参照してください。現在のTechnical LTパッケージは既存テーマを分離した初期サンプルであり、ユーザー提供の参考画像/PDFを反映したものではありません。

テンプレート契約はレイアウト名・領域・許可コンポーネントを検証します。現行レンダラーが実装するページレイアウト/コンポーネントは有限です。未実装の図表形式をJSONに書くだけでは描画されないため、追加時はデザインシステム拡張が必要です。草案スライドの受け渡し/取り込み形式は未決定のままです。

PDF・PNG出力はMarpが内部で使用するChromiumが必要です。HTML出力にはブラウザ実行環境は不要ですが、PDF・PNGを使う環境ではChromiumの起動条件も確認してください。PNGはMarpの仕様により、`dist/sample-lt-images.001`〜`dist/sample-lt-images.006`のようにページごとのファイルとして出力されます。

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
