# ようこそ Line Gen (alpha)へ

## About
* フリーハンドのような線を書くイラレスクリプトです
* 既存のパスをなぞる「なぞり」版と、円を描く「円」版の2種類があります
* 個人制作のalpha版です。問題や不具合があればお知らせ下さい

## 使い方
* お好きなファイルをダウンロードし、イラレのスクリプトとして開いてください
    *  なぞり版：[Line_gen_Trace.jsx](Line_gen_Trace.jsx)
    *  円版：[Line_gen_Circle.jsx](Line_gen_Circle.jsx)

## 作例
#### なぞり版
<img width="550" alt="なぞり1" src="https://github.com/user-attachments/assets/bc942329-8330-4072-b6f1-55f8d483dace" />
<img width="550" alt="なぞり2" src="https://github.com/user-attachments/assets/5142ecdf-9def-4d9e-8312-4b0d322d21bb" />
#### 円版
<img width="550" alt="円1" src="https://github.com/user-attachments/assets/5ad1843f-55ad-4b52-a70c-d8de417ceeb6" />
<img width="550" alt="円2" src="https://github.com/user-attachments/assets/a39c0cd7-1099-4ca0-ba7c-0419d9e43407" />
<img width="550" alt="円3" src="https://github.com/user-attachments/assets/42eed10a-0f3c-4d2e-adca-a57cc84af078" />

### なぞり版 - 設定項目
<img width="450" alt="なぞり設定項目" src="https://github.com/user-attachments/assets/684f2db6-4b06-4752-bc58-f72e38d93b80" />

#### ドット個数
* 縦、横、奥行きのドット個数を指定します
#### 出力モード
* 全てのドットを出力するか、面のみにするか、フレームのみにするかを指定します
* 全て出力 / 面のみ出力では、フレーム表示のオンオフを選べます
* 面の状態は透過 / 不透過から選べます
#### シェイプ設定
* ドット形状を丸 / 四角 / テキストから指定します
* テキストを選択した場合には、リピートして使うか / ランダムに1文字を選ぶかを選べます
* リピートの場合は、開始位置（どの頂点からか）と埋める順序（どちら側に進むか）を選べます
#### オブジェクト回転
* オブジェクト（立方体や直方体）の回転を指定します
* X / Y / Zのそれぞれの軸を中心とした任意の回転角度を指定します
#### カメラ
* オブジェクトと視点（カメラ）の距離を指定します
* 距離が近いとパースが強くかかり、距離が遠いと平行投影っぽくなりなります
#### 効果
* グラデーション / ライティングの効果を選択します
* グラデーションの場合、ドットのサイズを一定方向で徐々に変化させます
* ライティングの場合、光源による各面の明るさに応じてドットのサイズを変化させます
* 双方とも、方向（水平の角度 / 垂直の角度）と、最大・最小の濃度を指定します
#### 設定値を出力
* 設定項目をテキストとして生成します
* 一度出力したドットパターンを再現したいときに便利です

* ### 円版 - 設定項目
<img width="450" alt="円設定項目" src="https://github.com/user-attachments/assets/fad24a92-a0fe-4cdd-94d3-8c45293a2d72" />


