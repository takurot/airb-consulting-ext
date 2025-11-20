import { describe, it, expect, beforeEach } from 'vitest';
import { parseAirbnbListing } from './airbnbParser';

describe('airbnbParser', () => {
    beforeEach(() => {
        // Reset DOM and window object before each test
        document.body.innerHTML = '';

        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { href: 'https://www.airbnb.jp/rooms/12345678' },
            writable: true
        });

        // Clear globals
        window.__NEXT_DATA__ = undefined;
        window.__ROUTE_DATA__ = undefined;
    });

    describe('JSON Data Extraction (Priority 1)', () => {
        it('should extract data from window.__NEXT_DATA__', () => {
            const mockNextData = {
                props: {
                    pageProps: {
                        initialState: {
                            pdp: {
                                listingInfo: {
                                    listing: {
                                        id: '12345678',
                                        name: 'Cozy Apartment in Shibuya',
                                        avgRating: 4.85,
                                        reviewCount: 120,
                                        personCapacity: 4,
                                        bathroomLabel: '1 bath',
                                        bedLabel: '2 beds',
                                        bedroomLabel: '1 bedroom',
                                        host: {
                                            name: 'Taro',
                                            isSuperhost: true,
                                        },
                                        listingExpectations: [],
                                        sectionedDescription: {
                                            description: 'A beautiful place to stay.',
                                        },
                                        location: {
                                            lat: 35.658034,
                                            lng: 139.701636,
                                        },
                                        p3SummaryTitle: 'Entire rental unit in Shibuya City',
                                    },
                                },
                            },
                        },
                    },
                },
            };

            // Mock window.__NEXT_DATA__
            window.__NEXT_DATA__ = mockNextData;

            // Mock price element since it's often dynamic or separate
            document.body.innerHTML = `
        <span class="_1y74zjx">¥15,000</span>
      `;

            const result = parseAirbnbListing();

            expect(result.success).toBe(true);
            expect(result.data).toEqual(expect.objectContaining({
                roomId: '12345678',
                title: 'Cozy Apartment in Shibuya',
                capacity: 4,
                rating: 4.85,
                reviewCount: 120,
                hostName: 'Taro',
                isSuperhost: true,
                description: 'A beautiful place to stay.',
                location: {
                    lat: 35.658034,
                    lon: 139.701636,
                    name: expect.any(String),
                },
            }));
            expect(result.method).toBe('window_object');
        });
    });

    describe('DOM Fallback Extraction', () => {
        it('should extract data from DOM when JSON is missing', () => {
            // Ensure no JSON data
            window.__NEXT_DATA__ = undefined;
            window.__ROUTE_DATA__ = undefined;

            // Mock DOM elements
            document.body.innerHTML = `
        <h1 class="hpipapi">Cozy Apartment in Shibuya</h1>
        <div data-testid="book-it-default">
            <span class="_1y74zjx">¥15,000</span>
        </div>
        <ol class="lgx66tx">
            <li class="l7n4lsf">4 guests</li>
            <li class="l7n4lsf">1 bedroom</li>
            <li class="l7n4lsf">2 beds</li>
            <li class="l7n4lsf">1 bath</li>
        </ol>
        <div class="r1lutz1s">4.85</div>
        <a class="l1ovpqvx">120 reviews</a>
        <div class="d1czm02p">
            <span>A beautiful place to stay.</span>
        </div>
        <h2 class="st22bf">Hosted by Taro</h2>
      `;

            const result = parseAirbnbListing();

            expect(result.success).toBe(true);
            expect(result.data?.title).toBe('Cozy Apartment in Shibuya');
            expect(result.data?.capacity).toBe(4);
            // Note: Price extraction might be tricky in test env without exact classes, 
            // so we focus on structure.
            expect(result.method).toBe('dom_fallback');
        });

        it('should return failure when critical data is missing', () => {
            document.body.innerHTML = ''; // Empty body
            const result = parseAirbnbListing();
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
});
