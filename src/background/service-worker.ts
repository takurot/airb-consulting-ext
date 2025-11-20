// Background service worker
// Currently just a placeholder, but can be used for more complex logic later

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// Optional: Listen for tab updates to update side panel state if needed
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.includes('airbnb')) {
        // Could proactively notify side panel, but for now we pull data on open
    }
});
