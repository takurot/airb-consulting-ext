import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzePricing } from './aiService';
import { ListingData, UserSettings } from '@/types/listing';

// Mock fetch
globalThis.fetch = vi.fn() as any;

describe('aiService', () => {
    const mockListing: ListingData = {
        roomId: '123',
        title: 'Test Room',
        price: 10000,
        capacity: 2,
        bedrooms: 1,
        bathrooms: 1,
        location: { lat: 0, lon: 0, name: 'Tokyo' },
        rating: 4.5,
        reviewCount: 10,
        description: 'Test description',
        hostName: 'Test Host',
    };

    const mockSettings: UserSettings = {
        apiKey: 'sk-test-key',
        provider: 'openai',
        termsAccepted: true,
        updatedAt: Date.now(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('analyzePricing', () => {
        it('should call OpenAI API and return analysis', async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                judgment: '適正',
                                recommendedPriceMin: 9000,
                                recommendedPriceMax: 11000,
                                reason: 'Test reason',
                            }),
                        },
                    },
                ],
            };

            (globalThis.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await analyzePricing(mockListing, mockSettings);

            expect(globalThis.fetch).toHaveBeenCalledWith(
                'https://api.openai.com/v1/chat/completions',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer sk-test-key',
                    }),
                })
            );
            expect(result.judgment).toBe('適正');
        });

        it('should call Claude API when provider is claude', async () => {
            const claudeSettings = { ...mockSettings, provider: 'claude' as const };
            const mockResponse = {
                content: [
                    {
                        text: JSON.stringify({
                            judgment: '割高',
                            recommendedPriceMin: 8000,
                            recommendedPriceMax: 9000,
                            reason: 'Claude reason',
                        }),
                    },
                ],
            };

            (globalThis.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await analyzePricing(mockListing, claudeSettings);

            expect(globalThis.fetch).toHaveBeenCalledWith(
                'https://api.anthropic.com/v1/messages',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'x-api-key': 'sk-test-key',
                    }),
                })
            );
            expect(result.judgment).toBe('割高');
        });

        it('should throw error if API key is missing', async () => {
            const noKeySettings = { ...mockSettings, apiKey: '' };
            await expect(analyzePricing(mockListing, noKeySettings)).rejects.toThrow('APIキーが設定されていません');
        });

        it('should handle API errors', async () => {
            (globalThis.fetch as any).mockResolvedValue({
                ok: false,
                json: async () => ({ error: { message: 'API Error' } }),
            });

            await expect(analyzePricing(mockListing, mockSettings)).rejects.toThrow('AI分析中にエラーが発生しました');
        });
    });
});
