# 英語會話辦公室遊戲

這是一個期末專題範例，實作一個辦公室英語會話遊戲。

- 前端：使用 HTML5 Canvas 繪製辦公室場景與角色。\n- 使用 PlotlyJS 繪製答題正確率圖表。\n- 使用 JavaScript 處理遊戲邏輯、對話題目與答案選擇。\n- 後端：使用 Python Flask 提供題目 API 與答案判斷。

## 啟動方式

1. 安裝套件：

```bash
pip install -r backend/requirements.txt
```

2. 啟動後端伺服器：

```bash
python backend/app.py
```

3. 在瀏覽器中開啟：

```
http://127.0.0.1:5000/
```

## 遊戲玩法

1. 在辦公室場景中點擊移動角色。\n2. 點擊 NPC 即可開始對話。\n3. 從四個答案中選出最合適的回應。\n4. 答對即可得分，並更新 Plotly 成績圖表。
