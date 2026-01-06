# こんにちは Line Gen (alpha) です

## About
* フリーハンドのような線を書くイラレスクリプトです
* 既存のパスをなぞる「なぞり」版と、円を描く「円」版の2種類があります
* 個人制作のalpha版です。問題や不具合があればお知らせ下さい

## 使い方
* お好きなファイルをダウンロードし、イラレのスクリプトとして開いてください
    *  なぞり版：[Line_gen_Trace.jsx](Line_gen_Trace.jsx)
    *  円版：[Line_gen_Circle.jsx](Line_gen_Circle.jsx)

## 作例
### なぞり版

<img width="550" alt="なぞり1" src="https://github.com/user-attachments/assets/bc942329-8330-4072-b6f1-55f8d483dace" />
<img width="550" alt="なぞり2" src="https://github.com/user-attachments/assets/5142ecdf-9def-4d9e-8312-4b0d322d21bb" />

### 円版
<img width="550" alt="円1" src="https://github.com/user-attachments/assets/5ad1843f-55ad-4b52-a70c-d8de417ceeb6" />
<img width="550" alt="円2" src="https://github.com/user-attachments/assets/a39c0cd7-1099-4ca0-ba7c-0419d9e43407" />
<img width="550" alt="円3" src="https://github.com/user-attachments/assets/42eed10a-0f3c-4d2e-adca-a57cc84af078" />

## 設定項目
### なぞり版
<img width="450" alt="なぞり設定項目" src="https://github.com/user-attachments/assets/684f2db6-4b06-4752-bc58-f72e38d93b80" />

#### 基本設定
* モード：一筆書きの1つのパスか、分割された複数のパスのどちらを生成するかを選びます
* 何本の線を描くか、線幅を設定します
#### パラメータ
* 変形：小さな波のサイン波型、大きな波のループ型を選びます
* 中心の移動範囲、長さ/位置の変化、線のゆがみ（直進率）：パスの崩し度合いを設定します（詳しくは作例に記載のパラメータをご覧ください）
* 生成方式、密度：アンカーポイントの打ち方を決めます。基本は距離ベースでよいです
#### 設定値を出力
* 設定項目をテキストとして生成します

<br>
<br>

### 円版
<img width="450" alt="円設定項目" src="https://github.com/user-attachments/assets/fad24a92-a0fe-4cdd-94d3-8c45293a2d72" />

#### 基本設定
* 円の半径、周回数、線幅を設定します
#### 描画モード
* 3つのモードから選びます
    * モード1：フリーハンドのような雑な円パスを描きます
    * モード2：2つの波が合成されたような規則的な円パスを描きます
    * モード3：細かい波によるラーメン麺の縮れのような円パスを描きます
* 中心の移動範囲、サイズの変化量、正円率：パスの崩し度合いを設定します（詳しくは作例に記載のパラメータをご覧ください）
* アンカーポイント数：アンカーポイントの生成数を決めます。周回数が多いときは低めに設定すると良いです
#### 設定値を出力
* 設定項目をテキストとして生成します
