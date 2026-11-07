# 實作計劃 (Implementation Plan)

## 1. 技術決定 (Tech Decisions)

| 範疇 | 選擇 | 原因 |
| --- | --- | --- |
| 框架 | **Next.js（App Router）+ React + TypeScript** | 靜態生成（SSG）所有營地頁面，SEO 友好，可直接部署至 Vercel |
| 樣式 | **Tailwind CSS** | 快速建立響應式版面 |
| 元件 | **shadcn/ui**（card、badge、button、select、separator 等） | 可存取（a11y）的基礎元件，原始碼留在專案內可自訂 |
| 套件管理 | **pnpm** | 快速、鎖定檔穩定 |
| 建置工具 | Next.js 內建（Turbopack） | **不使用 Vite**：Next.js 已自帶建置流程，加入 Vite 只會重複 |
| 資料 | **型別化 TypeScript 內容模組**（`src/data/campsites.ts`） | 41 筆靜態資料，無需資料庫 |
| 地圖 | OpenStreetMap／Google 地圖外部連結 | 無需 API 金鑰、無費用、無 SSR 問題 |

### 關於「Next.js 內建資料庫」

Next.js **並沒有**內建資料庫。v1 的資料完全以 TypeScript 模組形式存放並在建置時靜態輸出。若日後需要用戶評價、收藏或後台編輯，可考慮：

- **Vercel Postgres／Neon**（Serverless Postgres，可於 Vercel Marketplace 一鍵接入），配合 Drizzle 或 Prisma；
- 或以 Headless CMS 管理內容。

屆時資料模型（`src/types/campsite.ts`）可直接映射為資料表。

## 2. 種子資料處理 (Seed Approach)

1. 參考檔 `campsites-seed.reference.json`（41 筆）已與漁護署 CSV 核對：名稱、郊野公園、水源、營位及座標一致。
2. 轉換為 `src/data/campsites.ts`：
   - 加入型別（`src/types/campsite.ts`）、水源及營位改為列舉值（enum-like union），並保留官方中英文字串；
   - **不儲存** `composite`，改由 `computeComposite()` 計算（種子中的綜合分已核實與公式一致）；
   - 修正簡體字（例如「状况请出发前查阅渔护署最新资讯」）並改寫為香港繁體中文；
   - 為每個營地撰寫較具體的交通指引，只使用可從公開資料確認的起點／方式，並提示出發前查閱最新班次；
   - 缺少的景色描述保留 `null`，UI 顯示「待補充」；
   - 荃錦營地（id 24）保持 `bookingRequired: true`。
3. 驗證：`src/lib/validate.ts` 於建置時斷言（41 筆、slug 唯一、評分 1–5、荃錦須預約），另提供 `pnpm validate:data` 腳本。
4. 參考檔會隨資料提交（commit）一併保留於版本庫根目錄，作為資料來源追溯。

## 3. 里程碑 (Milestones)

| 里程碑 | 內容 |
| --- | --- |
| M0 文件 | spec.md、plan.md |
| M1 骨架 | Next.js + Tailwind + shadcn、共用版面 |
| M2 資料 | 型別、41 個營地、驗證 |
| M3 瀏覽 | 首頁列表、篩選、排序；詳情頁 |
| M4 評分 UI | 可存取的評分元件 |
| M5 地圖及關於 | 地圖總覽、資料來源、免責聲明 |
| M6 打磨 | 流動版面、SEO metadata、sitemap、README |
| M7 發佈 | GitHub 公開版本庫、Vercel 部署 |

## 4. 提交清單 (Commit-sized Features)

每項功能一個提交（Conventional Commits），提交前執行 `pnpm lint` 及 `pnpm build`（或最少 `pnpm exec tsc --noEmit`）。

1. `docs: add product spec`
2. `docs: add implementation plan`
3. `chore: scaffold Next.js app with Tailwind and shadcn` — App Router、頁首頁尾、響應式外殼、首頁佔位
4. `feat: add campsite data model and AFCD seed catalog` — 型別、41 個營地、驗證
5. `feat: home list with filters and sort by composite score` — 地區／郊野公園／須預約篩選；排序
6. `feat: campsite detail page with intro facilities transport and scores` — `generateStaticParams` 生成 41 頁
7. `feat: ratings UI components for dimension and composite scores` — aria 標籤、非單靠顏色
8. `feat: map overview with OpenStreetMap links` — 按郊野公園分組
9. `feat: about page sources and camping rules disclaimer`
10. `chore: polish mobile SEO metadata and README` — 每頁 metadata／OG、sitemap、robots、README

## 5. 部署 (Deploy)

- 推送至 GitHub 公開版本庫 `jasonzhouu/hk-campsites`（`main` 分支，HTTPS remote）。
- 部署至 **Vercel**：連結 GitHub 版本庫後自動建置（Framework preset：Next.js，Build：`pnpm build`）。全部頁面為靜態輸出，無需環境變數。
- 如 CLI 已登入可執行 `npx vercel --yes`；否則於 Vercel 控制台匯入版本庫。

## 6. 風險 (Risks)

- 官方資料可能更新 → 頁面列明資料整理日期並連結官方頁面。
- 交通資訊易過時 → 只提供起點及方式，班次一律請用戶查閱最新資料。
