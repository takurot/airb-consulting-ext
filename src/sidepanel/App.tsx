import { useState, useEffect } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import type { ListingData, PricingAnalysis, ListingOptimization, UserSettings } from '@/types/listing';
import SmartPricing from '@/components/SmartPricing';
import ListingOptimizer from '@/components/ListingOptimizer';
import SettingsPanel from '@/components/Settings';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

import { analyzePricing, optimizeListing } from '@/services/aiService';



function App() {
    const [listingData, setListingData] = useState<ListingData | null>(null);
    const [pricingAnalysis, setPricingAnalysis] = useState<PricingAnalysis | null>(null);
    const [optimization, setOptimization] = useState<ListingOptimization | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [activeTab, setActiveTab] = useState<'pricing' | 'optimizer'>('pricing');

    // Extract listing data on mount
    useEffect(() => {
        extractListingData();
    }, []);

    const extractListingData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab.id) {
                throw new Error('アクティブなタブが見つかりません');
            }

            // Check if it's an Airbnb listing page
            if (!tab.url?.includes('airbnb.') || !tab.url?.includes('/rooms/')) {
                throw new Error('このページはAirbnbの物件ページではありません');
            }

            // Send message to content script to extract data
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractListing' });

            if (response.success && response.data) {
                setListingData(response.data);
            } else {
                throw new Error(response.error || 'データの抽出に失敗しました');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const getSettings = async (): Promise<UserSettings> => {
        return new Promise((resolve) => {
            chrome.storage.local.get(['userSettings'], (result) => {
                resolve(result.userSettings as UserSettings);
            });
        });
    };

    const handleAnalyzePricing = async () => {
        if (!listingData) return;

        setIsLoading(true);
        setError(null);

        try {
            const settings = await getSettings();
            if (!settings || !settings.apiKey) {
                setShowSettings(true);
                throw new Error('APIキーを設定してください');
            }

            const result = await analyzePricing(listingData, settings);
            setPricingAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI分析に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptimizeListing = async () => {
        if (!listingData) return;

        setIsLoading(true);
        setError(null);

        try {
            const settings = await getSettings();
            if (!settings || !settings.apiKey) {
                setShowSettings(true);
                throw new Error('APIキーを設定してください');
            }

            const result = await optimizeListing(listingData, settings);
            setOptimization(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : '最適化の生成に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    if (showSettings) {
        return <SettingsPanel onClose={() => setShowSettings(false)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h1 className="text-lg font-semibold text-airbnb-hof">AI Host Assistant</h1>
                    </div>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="設定"
                    >
                        <Settings className="w-5 h-5 text-airbnb-foggy" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 space-y-4">
                {error && <ErrorState error={error} onRetry={extractListingData} />}

                {isLoading && !listingData && <LoadingState />}

                {listingData && (
                    <>
                        {/* Listing Info Card */}
                        <div className="card animate-fade-in">
                            <h2 className="font-semibold text-airbnb-hof mb-2 line-clamp-2">
                                {listingData.title}
                            </h2>
                            <div className="text-sm text-airbnb-foggy space-y-1">
                                <p>💰 ¥{listingData.price.toLocaleString()} / 泊</p>
                                <p>📍 {listingData.location.name}</p>
                                <p>⭐ {listingData.rating} ({listingData.reviewCount}件のレビュー)</p>
                                <p>👥 最大{listingData.capacity}名</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('pricing')}
                                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'pricing'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-airbnb-foggy hover:text-airbnb-hof'
                                    }`}
                            >
                                価格分析
                            </button>
                            <button
                                onClick={() => setActiveTab('optimizer')}
                                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'optimizer'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-airbnb-foggy hover:text-airbnb-hof'
                                    }`}
                            >
                                物件改善
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'pricing' && (
                            <SmartPricing
                                analysis={pricingAnalysis}
                                onAnalyze={handleAnalyzePricing}
                                isLoading={isLoading}
                            />
                        )}

                        {activeTab === 'optimizer' && (
                            <ListingOptimizer
                                optimization={optimization}
                                onOptimize={handleOptimizeListing}
                                isLoading={isLoading}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
