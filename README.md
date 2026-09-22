# 115學年度｜國小‧國中自然科三版本課程比對

康軒／南一／翰林三版本，國小自然（三～六年級）與國中自然科學／理化（七～九年級）課程單元比對網站。用途：

- 國小到國中的課程銜接
- 跨版本主題比對
- 備課進度規劃（可勾選已備課單元，記錄在瀏覽器本機）
- 公開展示
- 標示本校自然科實際採用版本（`data.js` 內 `SCHOOL_VERSIONS` 設定），並可切換「只看本校版本」

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
git commit -m "115學年度自然科三版本課程比對"
git branch -M main
git remote add origin https://github.com/<your-account>/<repo-name>.git
git push -u origin main
```

3. 到 repository 的 Settings → Pages，Source 選擇 `main` 分支、根目錄 `/`，儲存後幾分鐘內即可透過
   `https://<your-account>.github.io/<repo-name>/` 瀏覽。

## 檔案結構

- `index.html` — 頁面結構（課程比對／課程銜接地圖／資料來源說明 三個分頁）
- `style.css` — 樣式
- `app.js` — 互動邏輯（年級／學期切換、備課進度勾選、課程銜接地圖渲染）
- `data.js` — **核心資料**：三版本、七個年級、上下學期的課程單元清單，以及課程銜接主題（`THREADS`）
- `sources/` — 各版本原始研究筆記（agent 調查紀錄，含來源網址與可信度備註），供日後校對更新使用

## 更新資料的方式

若發現某年級／學期的單元名稱與貴校實際課本不符，直接編輯 `data.js` 對應的 `g年級.s學期.units.版本` 陣列即可，
每個單元為 `{ name: "單元名稱", sub: ["小節1", "小節2", ...] }`（`sub` 可省略）。改完存檔、`git commit` + `git push`
後，GitHub Pages 會自動重新部署。

若要更新「本校使用版本」標示，編輯 `data.js` 最上方的 `SCHOOL_VERSIONS` 物件即可：

```js
const SCHOOL_VERSIONS = {
  "國語": "康軒",
  "數學": "翰林",
  "自然": "翰林",
  "社會": "翰林",
};
```

網站目前只有「自然」科的課程資料，因此比對頁面只會依 `SCHOOL_VERSIONS["自然"]` 標示與過濾對應版本；
其餘科目僅顯示於頁首作為參考資訊。

## 資料來源與免責聲明

本站為個人整理之教學參考工具，**並非康軒／南一／翰林三家出版社之官方資料**。資料整理方式：

- **國小（三～六年級）**：主要依三家出版社「115學年教材博覽會」公開簡介本資料，並參考第三方彙整站
  [prayer168.github.io/science-course](https://prayer168.github.io/science-course/)（整理日期2026-06-22）之編排，
  再以 [LearnMode 學習吧](https://www.learnmode.net) 上三家出版社 112學年度課本目次頁面逐一交叉核對。
- **國中（七～九年級）**：主要依 LearnMode 學習吧公開課程頁面之課本目次（多數為112學年度版，翰林部分頁面為
  108～112學年度版），並輔以補教業者「巨匠 iWorldJR」部落格（wincenter.com.tw）發布之逐節整理交叉比對。
- 108課綱教材在同一課綱週期內單元架構通常穩定，但仍發現康軒國小四年級下學期在112學年改版後與108學年舊版
  有明顯差異（已於 `data.js` 該學期 `note` 欄位註明）。

**正式教學計畫、進度安排，請務必以任教學校當學期實際採用之課本目次與學校課程計畫為準。**

「課程銜接地圖」頁面中的主題分類（力與運動、電與磁……等）為整理者依內容歸納之跨年級脈絡，並非教育部或
出版社的正式分類，僅供備課參考。
