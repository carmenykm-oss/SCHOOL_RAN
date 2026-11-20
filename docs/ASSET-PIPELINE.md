# 2D 素材製作與整合規格

## 地圖

- Tile 基準：16×16 px；地面、道路、牆、屋頂、門窗、樹木、花圃、圍欄及校園裝飾分層管理。
- 地圖以 tile grid 組裝，碰撞資料獨立於圖像。
- 建議圖層：Ground、Ground Detail、Collision、Objects Low、Objects High、Foreground、Events。
- 大型建築及樹木使用多格占位，需定義碰撞區及角色遮擋順序。

## 角色圖集

- 每角色需有方向與動作索引，檔名建議：`<gender>_<body>_<direction>_<action>_<frame>.png`。
- 方向統一：down、up、left、right。
- 動作初期：idle、walk；後續：run、attack、hit、cast、death。
- 角色圖集需保留透明背景、固定錨點與一致腳底基準。

## 可拆層換裝

各裝備部件使用相同畫布尺寸、錨點及方向／動作格數，並以角色骨架或對位規格確保疊合。層級順序建議：背部配件、身體底圖、褲子、上衣、鞋子、頭髮後層、頭部、頭髮前層、頭盔／飾品、武器前後層。

## 匯入與檢查

- 支援 PNG sprite sheet 及逐幀 PNG。
- 匯入時顯示透明背景預覽、格線、裁切框、方向與動作指定。
- 儲存前檢查尺寸、格數、透明通道及錨點一致性。
- 地圖編輯器與角色編輯器應輸出遊戲可直接讀取的 JSON manifest。
