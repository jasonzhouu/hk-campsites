# 香港郊野營地指南 (HK Country Park Campsites)

一個非官方的資訊整理網站，列出漁農自然護理署（漁護署，AFCD）在香港郊野公園及特別地區設立的 **41 個指定露營地點**。每個營地附簡介、水源、營位數目、交通指引、座標及地圖連結，以及「編輯評分」。

An unofficial guide to the 41 designated campsites in Hong Kong's country parks, managed by AFCD. The UI is in Traditional Chinese (Hong Kong).

## 功能

- `/` 營地列表：按地區、郊野公園、是否須預約篩選；按綜合分（預設）、單一評分維度或名稱排序
- `/campsites/[slug]` 營地詳情：簡介、設施、交通指引、編輯評分明細、OpenStreetMap／Google 地圖及漁護署官方頁面連結（41 頁全部靜態生成）
- `/map` 地圖總覽：OpenStreetMap 互動地圖（Leaflet，標出全部營地），以及按郊野公園分組的清單，每個營地附 OpenStreetMap 連結（不使用付費地圖 API，亦無需 API 金鑰）
- `/about` 關於：資料來源、評分方法、露營守則提示及免責聲明

### SEO／社交分享

- Open Graph／Twitter 大圖預覽由 Next.js `opengraph-image`／`twitter-image`（`ImageResponse`）生成：首頁用預設網站圖像；每個 `/campsites/[slug]` 頁面有獨立預覽圖，顯示營地名稱、地區及郊野公園、綜合評分
- 中文字型（Noto Sans TC）於生成圖像時按需從 Google Fonts 載入子集

## 技術

Next.js 16（App Router、Turbopack）、React 19、TypeScript、Tailwind CSS 4、shadcn/ui。資料存放於型別化的 TypeScript 模組 `src/data/campsites.ts`，不使用資料庫，建置時會檢查資料格式（`src/lib/validate.ts`）。

## 本機執行

需要 Node.js 20 或以上版本，以及 pnpm。

```bash
pnpm install       # 安裝依賴
pnpm dev           # 開發伺服器 http://localhost:3000
pnpm build         # 正式建置（同時檢查資料）
pnpm start         # 執行已建置的版本
pnpm lint          # ESLint
pnpm validate:data # 單獨檢查營地資料
```

可選環境變數：`NEXT_PUBLIC_SITE_URL`，用於 canonical URL、Open Graph 及 sitemap，預設為 `https://hk-campsites.vercel.app`。

## 評分說明 (Rating legend)

所有分數均為 **編輯評分**，由本站編輯根據公開資料作出主觀評估，**並非用戶評價**。每個維度 1 至 5 分，**所有維度都是分數越高越好**。

| 維度 | 欄位 | 權重 | 考慮因素 |
| --- | --- | --- | --- |
| 營地設施 | `facilities` | 25% | 水源、洗手間及營位數目 |
| 景色 | `scenery` | 30% | 海景、山景及地質景觀 |
| 清靜度 | `quietness` | 20% | 越高越清靜、越少人 |
| 交通便利度 | `transport` | 25% | 車路可達程度、步程及是否需乘船 |

```
綜合分 = round(設施×0.25 + 景色×0.30 + 清靜度×0.20 + 交通×0.25, 2)
```

**清靜度慣例**：常見的「擁擠程度」是分數越高越差。為方便加權計算，本站把它反轉為「清靜度」（`清靜度 = 6 − 擁擠程度`）。所以清靜度 **5 分代表最清靜、人最少，1 分代表最擁擠**。綜合分只由 `computeComposite()`（`src/lib/ratings.ts`）計算，不會手動儲存。

## 資料來源及署名 (Data attribution)

- 漁農自然護理署「指定露營地點」：<https://www.afcd.gov.hk/tc_chi/country/cou_vis/cou_vis_cam/cou_vis_cam_cam/cou_vis_cam_cam.html>
- 漁農自然護理署營地開放數據（座標、水源、營位）：<https://www.afcd.gov.hk/data/AFCD_Campsite.csv>
- 漁農自然護理署「有關露營守則及法例」：<https://www.afcd.gov.hk/tc_chi/country/cou_vis/cou_vis_cam/cou_vis_cam_cam/cou_vis_cam_cam_ccr.html>
- 康樂及文化事務署營地（次要參考，不包括在本站目錄內）：<https://www.lcsd.gov.hk/tc/camp/campsites/p_campsite.html>
- 青年網站 Youth.gov.hk（延伸參考）：<https://www.youth.gov.hk/tc/cultural-leisure>
- 地圖連結：© [OpenStreetMap](https://www.openstreetmap.org/copyright) 貢獻者

營地名稱、郊野公園、水源、營位及座標整理自漁護署公開資料。簡介、交通指引及評分由本站編輯撰寫。

## 免責聲明

本站為非官方的資訊整理網站，與漁護署及康文署並無任何關係，亦不是政府網站。營地資料可能已經過時或有所變更，評分為編輯主觀意見，僅供參考。出發前請查閱漁護署最新公告、天氣及交通資訊，並遵守《郊野公園及特別地區規例》及露營守則。

## 文件

- 產品規格：[`docs/spec.md`](docs/spec.md)
- 實作計劃：[`docs/plan.md`](docs/plan.md)
