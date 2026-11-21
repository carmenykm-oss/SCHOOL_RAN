# SCHOOL_RAN

**亂校園｜2D GBA 16-bit 像素風網頁 MMORPG**

本倉庫是 2D 像素版的獨立主線，與舊版 3D PROJECT_RAN 分開維護。不包含舊版 3D 模型、骨架、動畫、X/DDS/WLD/RCC 資源或 3D 測試程式。

## 目前內容

- `public/game.html`：0.6 校園冒險測試場景，讀取資料庫怪物、裝備、道具與掉落資料，支援移動、戰鬥、重生及本機測試背包。\n- `public/data-manager.html`：遊戲資料管理器，管理怪物、裝備、道具、技能及怪物掉落表。
- `server.js`：Node.js 遊戲資料伺服器與怪物獎勵結算 API。
- `data/game-data.json`：伺服器權威遊戲資料。
- `docs/GAME-DATA-API.md`：API 規格與遊戲端串接範例。
- `docs/GAME-DESIGN.md`：2D GBA 16-bit 遊戲方向及核心系統規格。
- `docs/ASSET-PIPELINE.md`：角色、地圖、動畫素材規格與整合流程。

## 啟動資料管理器及伺服器

需要 Node.js 18 或更新版本，無需額外套件：

```bash
npm start
```

然後開啟：

`http://localhost:3000/data-manager.html`

管理器會讀取 `GET /api/game-data`，新增／修改／刪除時會透過 `PUT /api/game-data` 寫回伺服器的 `data/game-data.json`。頁面上方／總覽會顯示伺服器連線狀態。不要直接以 file:// 開啟 HTML，必須經由 Node.js 伺服器使用。

## 遊戲掉落結算

遊戲判定怪物被擊敗時，呼叫：

`POST /api/game/monsters/:id/defeat`

伺服器按最新怪物資料計算經驗、金幣及掉落物。詳見 `docs/GAME-DATA-API.md`。

## 目前階段限制

這是可運行的資料伺服器原型；尚未整合完整遊戲戰鬥場景、帳號登入、角色背包持久化、資料庫及多人防作弊驗證。正式多人伺服器上線前必須補齊身份驗證、權限及玩家狀態持久化。

## 開發原則

- 2D 正交俯視角，GBA 16-bit 像素美術。
- Q 版約 3 頭身人物，人物比環境 tile 更精細，以凸顯時裝。
- 男女角色、髮型、上衣、褲子、鞋子、武器、飾品採可拆分圖層。
- 遊戲系統以資料驅動，新增怪物或裝備不應要求修改程式碼。
- 原始 PROJECT_RAN 倉庫保留不動；SCHOOL_RAN 為 2D 主線。
