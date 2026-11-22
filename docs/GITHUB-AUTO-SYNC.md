# DATA MANAGER 自動同步 GitHub

DATA MANAGER 會在每次儲存怪物、裝備、道具、技能資料時，自動更新 GitHub 的 `data/game-data.json`。上載怪物圖片時，會先把圖片放進 `public/assets/monsters/` 並同步到 GitHub，再自動儲存怪物資料。

## 一次性設定

### 1. 建立 GitHub Token

1. 在 GitHub 開啟 Settings → Developer settings → Personal access tokens → Fine-grained tokens。
2. 建立一個只授權給 `carmenykm-oss/SCHOOL_RAN` 的 Token。
3. Repository permissions 設定為 **Contents: Read and write**。
4. 建立後複製 Token。不要把 Token 貼到聊天、HTML、JavaScript 或 GitHub repository。

### 2. 設定伺服器環境變數

在專案根目錄把 `.env.example` 複製成 `.env`，填入：

- `GITHUB_TOKEN`：剛建立的 Fine-grained Token。
- `GITHUB_REPO`：保持 `carmenykm-oss/SCHOOL_RAN`。
- `GITHUB_BRANCH`：保持 `main`。
- `DATA_MANAGER_KEY`：自行設定一組長而隨機的管理密鑰。這是 DATA MANAGER 寫入 API 的保護密鑰，請勿與 GitHub Token 設成相同。

儲存 `.env` 後，重新啟動 `npm start`。伺服器會在後端讀取 Token；Token 不會傳送到瀏覽器。根目錄 `.gitignore` 已排除 `.env`。

### 3. 開啟管理器

使用 `http://localhost:3000/data-manager.html`。第一次開啟時，輸入 `DATA_MANAGER_KEY`。密鑰只保存在目前分頁的 sessionStorage，關閉分頁後需要重新輸入。

## 自動同步內容

- 儲存怪物、裝備、道具、技能或 ProjectR 匯入資料：同步更新 `data/game-data.json`。
- 上載怪物圖片：同步新增／更新 `public/assets/monsters/<怪物ID>.<副檔名>`。
- 管理器會顯示本機保存及 GitHub 同步狀態；同步失敗會顯示錯誤，不會假裝已同步。

## 部署注意

GitHub Pages 只能提供靜態檔案，不能執行這個 Node.js API，也不能安全保存 GitHub Token。若要跨裝置使用自動同步，必須把 Node.js `server.js` 部署到支援持久環境變數的 Node 主機，並在主機的 Environment Variables 設定以上四個變數。不要把 Token 寫入前端或提交到 GitHub。
