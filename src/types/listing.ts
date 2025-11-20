/**
 * Core data structure for Airbnb listing information
 */
export interface ListingData {
    /** Unique room/listing ID from Airbnb */
    roomId: string;

    /** Listing title */
    title: string;

    /** Base price per night (in local currency) */
    price: number;

    /** Cleaning fee (optional) */
    cleaningFee?: number;

    /** Maximum guest capacity */
    capacity: number;

    /** Number of bedrooms */
    bedrooms: number;

    /** Number of bathrooms */
    bathrooms: number;

    /** Location information */
    location: {
        /** Latitude */
        lat: number;
        /** Longitude */
        lon: number;
        /** Human-readable location name (e.g., "Shibuya, Tokyo") */
        name: string;
    };

    /** Average rating (0-5) */
    rating: number;

    /** Total number of reviews */
    reviewCount: number;

    /** Full listing description */
    description: string;

    /** List of amenities */
    amenities?: string[];

    /** Host name */
    hostName?: string;

    /** Whether the host is a superhost */
    isSuperhost?: boolean;
}

/**
 * AI analysis response for pricing
 */
export interface PricingAnalysis {
    /** Judgment: "適正" | "割高" | "割安" */
    judgment: '適正' | '割高' | '割安';

    /** Minimum recommended price */
    recommendedPriceMin: number;

    /** Maximum recommended price */
    recommendedPriceMax: number;

    /** Natural language explanation (100-200 chars) */
    reason: string;
}

/**
 * Title suggestion with target audience
 */
export interface TitleSuggestion {
    /** Suggested title text */
    title: string;

    /** Target audience label (e.g., "ファミリー向け", "リモートワーク向け") */
    targetAudience: string;
}

/**
 * Response from listing optimizer
 */
export interface ListingOptimization {
    /** 3 alternative title suggestions */
    titleSuggestions: TitleSuggestion[];

    /** AI-generated engaging first paragraph */
    descriptionOpener: string;
}

/**
 * Extraction status
 */
export interface ExtractionResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    /** Which extraction method was used */
    method?: 'window_object' | 'json_ld' | 'dom_fallback';
}

/**
 * API provider type
 */
export type AIProvider = 'openai' | 'claude';

/**
 * User settings stored in chrome.storage.local
 */
export interface UserSettings {
    /** API provider */
    provider: AIProvider;

    /** API key (stored in plain text for MVP) */
    apiKey: string;

    /** Whether user has accepted terms */
    termsAccepted: boolean;

    /** Last updated timestamp */
    updatedAt: number;
}
