# SCHOOL_RAN 遊戲資料 API

## 啟動
需要 Node.js 18 或更新版本，無需額外 npm 套件：

```bash
node server.js
```

開啟 `http://localhost:3000/data-manager.html`。資料儲存在 `data/game-data.json`，由伺服器管理；不是只存在管理器瀏覽器 localStorage。

## API
- `GET /api/health`：伺服器健康檢查。
- `GET /api/game-data`：取得怪物、裝備、道具、技能。
- `PUT /api/game-data`：整份驗證後儲存資料。
- `POST /api/game/monsters/:id/defeat`：模擬怪物被擊敗，伺服器按該怪物設定計算經驗、金幣及掉落結果。

## 掉落規則
每項掉落機率獨立判定（0–100%）；命中後按 min/max 隨機數量。掉落 ID 必須存在於 equipment 或 items。管理器儲存時由伺服器驗證引用，遊戲端擊敗怪物時呼叫 defeat API，由伺服器回傳實際掉落。

## 重要限制
目前是可運行的單機／原型伺服器資料層，沒有帳號登入、角色背包持久化、資料庫、交易防作弊或多人同步。正式公開多人伺服器前必須加入身份驗證、授權、玩家狀態持久化及交易安全。不要直接把這個原型 API 暴露到公網。
