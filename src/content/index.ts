import { parseAirbnbListing } from './parsers/airbnbParser';

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'extractListing') {
        const result = parseAirbnbListing();
        sendResponse(result);
    }
    return true; // Keep the message channel open for async response
});
