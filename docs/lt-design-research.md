# LTデザイン調査メモ

最終更新: 2026-09-26

## 調査方針

Speaker DeckとSlideShareで公開されている技術系LT資料を確認し、個別資料の見た目を複製するのではなく、複数資料に現れる構成・情報量・レイアウトのパターンを抽出する。

## 参照した資料

- [プレゼンスライド作成で意識していること](https://speakerdeck.com/kimichan/purezensuraidozuo-cheng-deyi-shi-siteirukoto)
- [LTのしかた](https://speakerdeck.com/mae616/ltnosikata)
- [LTのテーマ どうきめてる？](https://speakerdeck.com/yama3133/lt-no-tema-dou-kime-teru-5-tsu-no-kata-to-watashi-no-yarikata)
- [さらなるアウトプットに、Let's ライトニングトーク！](https://speakerdeck.com/ma2shita/lets-lt-aws-summit-japan-2024)
- [技術資料を作る時に心掛けていること](https://speakerdeck.com/orangemorishita/ji-shu-zi-liao-wozuo-rushi-nixin-gua-keteirukoto-ji-shu-guang-bao-noji-i-number-2)
- [Lightning Talks日本上陸](https://www.slideshare.net/slideshow/lightning-talks-13792958/13792958)

## 抽出したLTの特徴

### 1. 1枚1メッセージ

各スライドに「このスライドで何を伝えるか」を持たせる。見出しは単なる分類名ではなく、主張や結論を含める。

### 2. 冒頭で前提を揃える

自己紹介、対象者、問題提起、問いなどを早い段階に配置する。聴衆が資料の見方を理解できるようにする。

### 3. 短い時間に合わせた情報量

本文を詰め込むより、見出し・キーワード・図解・発表者の説明を組み合わせる。スライドだけで全情報を完結させない。

### 4. ストーリーを重視する

問題提起、背景、体験・事例、学び、まとめの流れが多い。最後に冒頭の問いやメッセージへ戻る構成も有効。

### 5. 図解は意味ごとに使い分ける

- 比較：2つの違い
- フロー：手順・処理の流れ
- タイムライン：時系列
- 構成図：要素と関係
- グラフ：数値の変化
- 引用：印象的な言葉

### 6. デザインの方向性は複数ある

- 白背景・濃色文字による技術解説型
- 強いアクセントカラーによるイベント・ブランド型
- 大きなタイトルと画像によるストーリー型
- コード・図・グラフを中心にした技術詳細型

## 初期テーマ案

### Technical Clean

- 白または薄い背景
- 濃い本文色
- 青・緑などのアクセント
- 見出しを大きくする
- 図解とコードの可読性を優先

初期テーマとして採用する。ブランドに依存しないため、コンポーネント契約の検証に向いている。

## 初期ページテンプレート候補

```text
cover-hero
message
two-column
process
comparison
code-demo
data-story
quote
closing
```

## 調査から得た設計上の示唆

- ページテンプレートは内容の意味だけでなく、発表時間と情報密度を考慮する
- 見出し、本文、図解、注釈の位置をテンプレート側で安定させる
- 図・表・グラフはページテンプレートから分離する
- デザインのバリエーションは、構造が同じなら`variant`で表現する
- 構造が変わる場合は新しいページテンプレートまたはコンポーネントにする
