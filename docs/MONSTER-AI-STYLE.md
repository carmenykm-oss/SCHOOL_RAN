# 怪物 AI 畫風重繪設定

工作室使用 OpenAI Images API 的 image edits 功能，將怪物原圖作為第一張輸入、人物概念圖作為第二張風格參考，產生透明背景 PNG。

## 需要先設定 API Key

ChatGPT 訂閱與 OpenAI API 計費是分開的。使用前需要在 OpenAI API 平台建立 API key，並確認 API 帳戶有可用額度／付款設定。不要把 API key 放進前端 HTML、GitHub、截圖或聊天訊息。

### Windows PowerShell 本機啟動

在同一個 PowerShell 視窗執行：

```powershell
$env:OPENAI_API_KEY="你的 API key"
npm start
```

再開啟 `http://localhost:3000/monster-style-studio.html`。環境變數只對目前 PowerShell 視窗有效；重新開新視窗時要再設定。

### 雲端部署

在部署平台的服務設定／Environment Variables 加入：

- `OPENAI_API_KEY`：你的 API key（Secret）
- `OPENAI_IMAGE_MODEL`：可選，預設 `gpt-image-2`
- `OPENAI_IMAGE_QUALITY`：可選，預設 `medium`

儲存後重新部署／重啟服務。不要把金鑰提交到 GitHub。

## 使用步驟

1. 開啟怪物風格工作室。
2. 上載你認可的人物概念圖作為風格參考。
3. 加入一張或多張怪物 PNG、JPG、WEBP（每張最大 8 MB）。
4. 先按一隻怪物的「AI 重繪」檢查結果。
5. 認可方向後按「AI 批量重繪」；工作室會逐張處理。
6. 完成後按「批量匯出完成圖」，下載各張 PNG。原圖不會被覆蓋。

## 技術與限制

- 後端代理 `POST /api/monster-style/convert`，API key 只存在伺服器環境變數，不會送到瀏覽器。
- 狀態檢查：`GET /api/monster-style/status`。
- 使用 image edits endpoint，模型預設 `gpt-image-2`，輸出 PNG、透明背景、1024×1024。
- 每張圖會產生 API 費用；批量轉換會逐張呼叫，建議先試一張。
- AI 可能改動原圖細節，請逐張檢查，不應把生成結果視為像素級還原。
- 目前批量匯出是逐張下載 PNG，並非 ZIP。
