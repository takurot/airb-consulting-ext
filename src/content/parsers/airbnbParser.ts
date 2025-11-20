import { ListingData, ExtractionResult } from '@/types/listing';

// Type definition for window object extension
declare global {
    interface Window {
        __NEXT_DATA__?: any;
        __ROUTE_DATA__?: any;
    }
}

export const parseAirbnbListing = (): ExtractionResult<ListingData> => {
    try {
        // Priority 1: Try extracting from window.__NEXT_DATA__
        if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
            const nextData = window.__NEXT_DATA__;
            const listing = nextData?.props?.pageProps?.initialState?.pdp?.listingInfo?.listing;

            if (listing) {
                const location = listing.location || {};
                const priceElement = document.querySelector('span._1y74zjx');
                const priceText = priceElement?.textContent || '';
                const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;

                return {
                    success: true,
                    method: 'window_object',
                    data: {
                        roomId: listing.id,
                        title: listing.name,
                        price: price, // Price is often dynamic, might need DOM fallback even with JSON
                        capacity: listing.personCapacity,
                        bedrooms: parseInt(listing.bedroomLabel?.split(' ')[0] || '0', 10),
                        bathrooms: parseFloat(listing.bathroomLabel?.split(' ')[0] || '0'),
                        location: {
                            lat: location.lat,
                            lon: location.lng,
                            name: listing.p3SummaryTitle || '',
                        },
                        rating: listing.avgRating,
                        reviewCount: listing.reviewCount,
                        description: listing.sectionedDescription?.description || '',
                        hostName: listing.host?.name,
                        isSuperhost: listing.host?.isSuperhost,
                    },
                };
            }
        }

        // Priority 2: DOM Fallback
        const title = document.querySelector('h1')?.textContent;
        const priceText = document.querySelector('span._1y74zjx')?.textContent || '';
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

        // Extract capacity, bedrooms, etc. from the list
        // This is fragile and depends on specific classes or structure
        // For MVP, we'll do a best-effort text search in the list items
        const listItems = Array.from(document.querySelectorAll('li'));
        const getText = (items: Element[], regex: RegExp) => {
            const item = items.find(i => regex.test(i.textContent || ''));
            return item ? parseInt(item.textContent || '0', 10) : 0;
        };

        const capacity = getText(listItems, /guests?|人が泊まれます/);
        const bedrooms = getText(listItems, /bedrooms?|寝室/);
        // const beds = getText(listItems, /beds?|ベッド/);
        const baths = parseFloat(listItems.find(i => /baths?|バスルーム/.test(i.textContent || ''))?.textContent?.split(' ')[0] || '0');

        const ratingText = document.querySelector('.r1lutz1s')?.textContent || '0';
        const reviewCountText = document.querySelector('a.l1ovpqvx')?.textContent || '0';
        const description = document.querySelector('.d1czm02p span')?.textContent || '';
        const hostName = document.querySelector('h2.st22bf')?.textContent?.replace('Hosted by ', '').replace('ホスト：', '') || '';

        if (title && !isNaN(price)) {
            return {
                success: true,
                method: 'dom_fallback',
                data: {
                    roomId: window.location.href.split('/rooms/')[1]?.split('?')[0] || '',
                    title: title || '',
                    price: price,
                    capacity: capacity,
                    bedrooms: bedrooms,
                    bathrooms: baths,
                    location: {
                        lat: 0, // Hard to get from DOM without map interaction
                        lon: 0,
                        name: '',
                    },
                    rating: parseFloat(ratingText),
                    reviewCount: parseInt(reviewCountText.replace(/[^\d]/g, ''), 10),
                    description: description,
                    hostName: hostName,
                },
            };
        }

        return {
            success: false,
            error: 'Failed to extract listing data',
        };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error during extraction',
        };
    }
};
