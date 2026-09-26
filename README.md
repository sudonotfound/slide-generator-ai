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

## ステータス

現在は企画・設計フェーズ。実装前の技術選定とデザインシステムの整理を進めている。
