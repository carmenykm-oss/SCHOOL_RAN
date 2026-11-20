# SCHOOL_RAN

**亂校園｜2D GBA 16-bit 像素風網頁 MMORPG**

本倉庫是 2D 像素版的獨立主線，與舊版 3D PROJECT_RAN 分開維護。只遷移可供 2D 專案重用的管理工具與設計規格，不包含舊版 3D 模型、骨架、動畫、X/DDS/WLD/RCC 資源或 3D 測試程式。

## 目前內容

- `public/data-manager.html`：遊戲資料管理器，可管理怪物、裝備、道具、技能與怪物掉落表。
- `docs/GAME-DESIGN.md`：2D GBA 16-bit 遊戲方向及核心系統規格。
- `docs/ASSET-PIPELINE.md`：角色、地圖、動畫素材規格與整合流程。

## 開啟資料管理器

直接以瀏覽器開啟 `public/data-manager.html`，或部署 GitHub Pages 後前往：

`https://carmenykm-oss.github.io/SCHOOL_RAN/data-manager.html`

資料管理器目前將資料自動儲存在瀏覽器 localStorage，並支援 JSON 匯入／匯出。跨裝置或多人共用前，請先匯出 JSON 備份。此管理器目前尚未連接線上遊戲伺服器。

## 開發原則

- 2D 正交俯視角，GBA 16-bit 像素美術。
- Q 版約 3 頭身人物，人物比環境 tile 更精細，以凸顯時裝。
- 男女角色、髮型、上衣、褲子、鞋子、武器、飾品採可拆分圖層。
- 遊戲系統以資料驅動，避免新增怪物或裝備時修改程式碼。
- 原始 PROJECT_RAN 倉庫保留不動；SCHOOL_RAN 為 2D 主線。
