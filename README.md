# 115學年度｜國小‧國中三版本課程比對

康軒／南一／翰林三版本，國小（三～六年級）與國中（七～九年級）**自然／國語／數學／社會**課程單元比對網站。用途：

- 國小到國中的課程銜接
- 跨版本主題比對
- 備課進度規劃（可勾選已備課單元，記錄在瀏覽器本機）
- 公開展示
- 標示本校各科實際採用版本（`data-subjects.js` 內 `SCHOOL_VERSIONS` 設定），並可切換「只看本校版本」

## 如何在本機預覽

不需要安裝任何套件，直接用瀏覽器開啟 `index.html` 即可，或用任一簡易伺服器：

```bash
python -m http.server 8080
# 開啟 http://localhost:8080
```

## 如何發布到 GitHub Pages

1. 在 GitHub 建立一個新的 repository（例如 `science-course-115`）。
2. 將本資料夾內容 push 上去：

```bash
git init
git add .
git commit -m "115學年度三版本課程比對"
git branch -M main
git remote add origin https://github.com/<your-account>/<repo-name>.git
git push -u origin main
```

3. 到 repository 的 Settings → Pages，Source 選擇 `main` 分支、根目錄 `/`，儲存後幾分鐘內即可透過
   `https://<your-account>.github.io/<repo-name>/` 瀏覽。

## 檔案結構

- `index.html` — 頁面結構（課程比對／課程銜接地圖／資料來源說明 三個分頁）
- `style.css` — 樣式
- `app.js` — 互動邏輯（科目／年級／學期切換、備課進度勾選、課程銜接地圖渲染）
- `data.js` — **自然科資料**：三版本、七個年級、上下學期的課程單元清單，以及課程銜接主題（`THREADS`）
- `data-subjects.js` — **國語／數學／社會資料**（`DATA_CHINESE`／`DATA_MATH`／`DATA_SOCIAL`，統一透過 `SUBJECT_DATA` 匯出），
  以及跨科目共用的 `SCHOOL_VERSIONS`（本校各科採用版本）與 `SUBJECT_META`（各科版次說明）
- `sources/` — 各版本原始研究筆記（agent 調查紀錄，含來源網址與可信度備註），供日後校對更新使用

科學腳本檔案（`data.js`／`data-subjects.js`／`app.js`）皆以 `<script src="..." charset="utf-8">` 載入 ——
**請勿移除 `charset="utf-8"` 屬性**，部分伺服器（例如陽春的本機測試伺服器）不會在回應標頭宣告編碼，
若缺少此屬性，瀏覽器可能誤判編碼導致中文內容解析成無效語法而整份 JS 載入失敗。

## 更新資料的方式

若發現某年級／學期的單元名稱與貴校實際課本不符：

- **自然科**：編輯 `data.js` 對應的 `data.g年級.s學期.units.版本` 陣列。
- **國語／數學／社會**：編輯 `data-subjects.js` 對應科目常數（`DATA_CHINESE`／`DATA_MATH`／`DATA_SOCIAL`）裡
  `g年級.s學期.units.版本` 陣列；社會科國中部分為三科（歷史／地理／公民與社會）分列，每個 strand 是一個
  `{ name: "歷史", sub: [...] }` 物件。

每個單元為 `{ name: "單元名稱", sub: ["小節1", "小節2", ...] }`（`sub` 可省略；也可用檔案內的 `U([...])` /
`US([[名稱, [小節...]], ...])` 輔助函式簡寫）。改完存檔、`git commit` + `git push` 後，GitHub Pages 會自動重新部署。

若要更新「本校使用版本」標示，編輯 `data-subjects.js` 最上方的 `SCHOOL_VERSIONS` 物件即可：

```js
const SCHOOL_VERSIONS = {
  "國語": "康軒",
  "數學": "翰林",
  "自然": "翰林",
  "社會": "翰林",
};
```

## 資料來源與免責聲明

本站為個人整理之教學參考工具，**並非康軒／南一／翰林三家出版社之官方資料**。資料整理方式：

### 自然科

- **國小（三～六年級）**：主要依三家出版社「115學年教材博覽會」公開簡介本資料，並參考第三方彙整站
  [prayer168.github.io/science-course](https://prayer168.github.io/science-course/)（整理日期2026-06-22）之編排，
  再以 [LearnMode 學習吧](https://www.learnmode.net) 上三家出版社 112學年度課本目次頁面逐一交叉核對。
- **國中（七～九年級）**：主要依 LearnMode 學習吧公開課程頁面之課本目次（多數為112學年度版，翰林部分頁面為
  108～112學年度版），並輔以補教業者「巨匠 iWorldJR」部落格（wincenter.com.tw）發布之逐節整理交叉比對。
- 108課綱教材在同一課綱週期內單元架構通常穩定，但仍發現康軒國小四年級下學期在112學年改版後與108學年舊版
  有明顯差異（已於 `data.js` 該學期 `note` 欄位註明）。

### 國語／數學／社會

- 全數來自 LearnMode 學習吧（learnmode.net）公開課程頁面之課本目次，該平台聲明依教科書目次建立章節；
  多數為112學年度版，部分翰林社會科頁面為108～111學年度版（已個別標註於各學期資料）。
- 南一「社會」科因研究當次 WebFetch 工具故障，僅能以搜尋摘要拼湊，缺漏與低信心項目甚多（尤其國中公民與
  社會科幾乎全數缺漏），詳見 `sources/research_social_nani.md`。
- 國中「社會」科依歷史／地理／公民與社會三科分別列出。

**正式教學計畫、進度安排，請務必以任教學校當學期實際採用之課本目次與學校課程計畫為準。**

「課程銜接地圖」頁面（自然科限定）中的主題分類（力與運動、電與磁……等）為整理者依內容歸納之跨年級脈絡，
並非教育部或出版社的正式分類，僅供備課參考。
