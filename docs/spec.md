# 香港郊野公園營地指南 — 產品規格 (Product Spec)

> 狀態：v1 草案 · 語言：繁體中文（香港）為主，英文為輔

## 1. 目標 (Goals)

1. 以一個清晰、易讀的網站，整理漁農自然護理署（漁護署，AFCD）在郊野公園及特別地區內設立的 **41 個指定露營地點**。
2. 每個營地提供：簡介、所屬郊野公園、水源、營位數目、座標、交通指引，以及漁護署官方頁面連結。
3. 提供 **編輯評分**（非用戶評價），讓使用者按「綜合分」或單一維度（設施、景色、清靜度、交通）比較及排序營地。
4. 協助新手露營者了解露營守則，並清楚引導至官方資料來源。

## 2. 目標用戶 (Users)

| 用戶 | 需要 |
| --- | --- |
| 新手露營者 | 想找交通方便、有水喉及洗手間的營地；需要基本守則提示 |
| 有經驗的遠足露營者 | 想找偏遠、清靜、景色好的營地；關心水源是否季節性 |
| 家庭／團體 | 需要營位較多、車路可達附近的營地；需知道是否須預約（例如荃錦營地） |
| 手機用戶（主要） | 出發前或途中於手機上快速查看交通及水源資訊 |

## 3. 資訊架構 (IA / Pages)

| 路徑 | 頁面 | 內容 |
| --- | --- | --- |
| `/` | 營地列表 | 全部 41 個營地卡片；篩選（地區、郊野公園、是否須預約）；排序（綜合分〔預設〕、設施、景色、清靜度、交通、名稱） |
| `/campsites/[slug]` | 營地詳情 | 簡介、設施（水源、營位）、交通指引、各維度編輯評分及綜合分、座標及地圖連結、漁護署官方頁面連結 |
| `/map` | 地圖總覽 | 按郊野公園分組的營地清單，每個營地附 OpenStreetMap 及 Google 地圖連結（不使用付費地圖 API） |
| `/about` | 關於及資料來源 | 資料來源、評分方法、露營守則提示、免責聲明、與官方機構無關的聲明 |

全站共用：頁首（網站名稱、導覽：營地、地圖、關於）、頁尾（資料來源引用、免責聲明摘要）。

## 4. 資料模型 (Data Model)

v1 使用 TypeScript 型別化內容模組（`src/data/campsites.ts`），不使用資料庫。

```ts
type Region = "北區／大埔" | "西貢" | "沙田／馬鞍山" | "東龍洲" | "荃灣／元朗" | "大嶼山";
type WaterSource = "tap" | "stream" | "toilet"; // 水喉／溪澗(季節性)／洗手間
type TentCapacity = "lt20" | "20to50" | "gt50"; // 少於20／20–50／多於50

interface RatingScores {
  facilities: 1 | 2 | 3 | 4 | 5; // 營地設施
  scenery: 1 | 2 | 3 | 4 | 5;    // 景色
  quietness: 1 | 2 | 3 | 4 | 5;  // 清靜度（越高越清靜）
  transport: 1 | 2 | 3 | 4 | 5;  // 交通便利度
}

interface Campsite {
  id: number;            // 漁護署營地編號 (1–41)
  slug: string;          // URL 用，唯一
  nameZh: string; nameEn: string;
  parkZh: string; parkEn: string;
  region: Region;
  water: WaterSource; waterZh: string; waterEn: string;
  tentCapacity: TentCapacity;
  lat: number; lng: number;
  afcdUrlZh: string; afcdUrlEn: string;
  bookingRequired: boolean; bookingNoteZh: string | null;
  introZh: string;
  transportZh: string;
  facilitiesNotesZh: string | null;
  sceneryNotesZh: string | null; // null → UI 顯示「待補充」
  ratings: RatingScores;         // composite 不儲存，由程式計算
}
```

驗證規則（建置時斷言 + `pnpm validate:data` 腳本）：

- 剛好 41 個營地；`id` 及 `slug` 均唯一。
- 每項評分為 1–5 的整數。
- 荃錦營地（id 24）`bookingRequired === true`。
- 座標位於香港範圍內。

## 5. 評分方法 (Rating Formula)

所有分數均標示為「**編輯評分**」，由本站編輯根據公開資料（水源、營位、位置、交通方式）作出的主觀評估，**並非用戶評價**。

| 維度 | 欄位 | 權重 | 說明 |
| --- | --- | --- | --- |
| 營地設施 | `facilities` | 25% | 水喉、洗手間、營位數目 |
| 景色 | `scenery` | 30% | 海景、山景、地質景觀 |
| 清靜度 | `quietness` | 20% | **越高代表越清靜、越少人** |
| 交通便利度 | `transport` | 25% | 是否車路可達、步程、是否需乘船 |

```
綜合分 composite = round(facilities×0.25 + scenery×0.30 + quietness×0.20 + transport×0.25, 2)
```

- 綜合分只透過單一函數 `computeComposite()` 計算，不手動儲存。
- **清靜度慣例**：常見的「擁擠程度」是越高越差，為方便加權計算，本站將其反轉為「清靜度」（`quietness = 6 − 擁擠程度`），因此所有維度皆「越高越好」。UI 一律標示為「清靜度」並附說明。

## 6. 資料來源及署名 (Sources & Attribution)

- 漁護署「露營地點」頁面：<https://www.afcd.gov.hk/tc_chi/country/cou_vis/cou_vis_cam/cou_vis_cam_cam/cou_vis_cam_cam.html>
- 漁護署營地資料 CSV（座標、水源、營位）：<https://www.afcd.gov.hk/data/AFCD_Campsite.csv>
- 康樂及文化事務署（康文署）營地資料（次要參考，度假營／非政府機構營地，**不納入**本站 41 個漁護署營地目錄）：<https://www.lcsd.gov.hk/tc/camp/campsites/p_campsite.html>
- 青年網站 youth.gov.hk 露營相關文章（可選參考）

頁尾及「關於」頁均須列明來源。本站**並非**漁護署或康文署網站，與政府部門無任何隸屬關係。

## 7. 國際化 (i18n)

- 主要語言：繁體中文（香港），`<html lang="zh-HK">`。
- 英文營地及郊野公園名稱作為次要標示，方便對照官方英文資料。
- v1 不提供完整英文版介面（見非目標）。
- 字型使用系統中文字型堆疊（PingFang HK、Noto Sans TC、Microsoft JhengHei）。

## 8. 非目標 (Non-goals)

- **不提供即時營位佔用／人流資訊**。
- 不提供網上預約（荃錦營地等需預約的營地只連結至官方資料）。
- 不收集用戶評價、帳戶或留言。
- 不使用付費地圖 API。
- v1 不使用資料庫；不提供完整英文介面。

## 9. 無障礙 (Accessibility)

- 語義化 HTML（`header`、`nav`、`main`、`footer`、標題層級）。
- 評分不只靠顏色表達：同時顯示數字（例如「4 / 5」）及 `aria-label`（例如「景色：5 分（滿分 5 分）」）。
- 所有篩選控件有可見標籤；鍵盤可操作；可見焦點樣式。
- 文字與背景對比度符合 WCAG AA。
- 外部連結清楚標示（文字說明「漁護署官方頁面」並以新分頁開啟時附提示）。

## 10. 流動裝置 (Mobile)

- 以手機優先設計；單欄卡片於手機、兩至三欄於平板及桌面。
- 篩選列在手機上堆疊顯示，不出現水平捲動。
- 觸控目標至少 40×40px。
- 測試寬度：360px、390px、768px、1280px。

## 11. 免責聲明 (Disclaimer)

> 本站為非官方的資訊整理網站，與漁農自然護理署（漁護署）及康樂及文化事務署（康文署）並無任何關係。營地資料整理自漁護署公開資料，可能有所變更；評分為編輯主觀意見，僅供參考。出發前請查閱漁護署最新公告、天氣及交通資訊，並遵守《郊野公園及特別地區規例》及露營守則。

必須於頁尾（摘要）及「關於」頁（全文）顯示。
