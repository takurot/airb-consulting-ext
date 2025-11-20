# Airbnb AI Host Assistant - Verification Guide

Since this is a Chrome Extension, some features require manual verification in the browser. Please follow these steps to verify the MVP.

## 1. Installation
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the `dist` directory in this project (`/Users/takurot/src/airb-consulting-ext/dist`).

## 2. Verify Side Panel & UI
1. Go to any Airbnb room page (e.g., `https://www.airbnb.jp/rooms/plus/25138032`).
2. Click the extension icon in the toolbar to open the Side Panel.
    - *Note: You may need to pin the extension first.*
3. **Check:** Does the Side Panel open?
4. **Check:** Is the styling consistent (Airbnb colors, fonts)?
5. **Check:** Do you see the "Pricing" and "Optimizer" tabs?

## 3. Verify Data Extraction
1. With the Side Panel open on a listing page:
2. **Check:** Does the listing title, price, and capacity appear at the top of the panel?
    - If "Loading..." persists or data is missing, check the Console (`Cmd+Opt+J`) for errors from `content/index.ts` or `airbnbParser`.

## 4. Verify Settings & API Key
1. Click the "Settings" (gear) icon in the Side Panel.
2. **Check:** Does the Settings modal appear?
3. Enter a dummy API key (or real one if you have it) and save.
4. Close and reopen the extension/panel.
5. Open Settings again.
6. **Check:** Is the API key preserved? (It uses `chrome.storage.local`).

## 5. Verify AI Analysis (Smart Pricing)
1. Ensure you have a valid OpenAI or Claude API key saved.
2. Go to the "Pricing" tab.
3. Click "分析を開始する" (Start Analysis).
4. **Check:**
    - Does the loading skeleton appear?
    - After a few seconds, do you see the result (Judgment, Price Range, Reason)?
    - Try clicking "推奨価格をコピー" and paste it somewhere.

## 6. Verify Listing Optimizer
1. Go to the "Optimizer" tab.
2. Click "改善案を生成する".
3. **Check:**
    - Do you see 3 title suggestions with target audiences?
    - Do you see a description opener?
    - Do the copy buttons work?

## Troubleshooting
- **"Active tab not found"**: Make sure you are focused on the Airbnb tab when opening the panel.
- **"Connection failed"**: Reload the extension in `chrome://extensions/` and refresh the Airbnb page.
