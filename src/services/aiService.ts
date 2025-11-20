import { ListingData, PricingAnalysis, ListingOptimization, UserSettings } from '@/types/listing';
import { generatePricingAnalysisPrompt, generateListingOptimizationPrompt } from '@/utils/promptTemplates';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export const analyzePricing = async (
    listing: ListingData,
    settings: UserSettings
): Promise<PricingAnalysis> => {
    if (!settings.apiKey) {
        throw new Error('APIキーが設定されていません');
    }

    const prompt = generatePricingAnalysisPrompt(listing);

    if (settings.provider === 'openai') {
        return callOpenAI<PricingAnalysis>(settings.apiKey, prompt);
    } else {
        return callClaude<PricingAnalysis>(settings.apiKey, prompt);
    }
};

export const optimizeListing = async (
    listing: ListingData,
    settings: UserSettings
): Promise<ListingOptimization> => {
    if (!settings.apiKey) {
        throw new Error('APIキーが設定されていません');
    }

    const prompt = generateListingOptimizationPrompt(listing);

    if (settings.provider === 'openai') {
        return callOpenAI<ListingOptimization>(settings.apiKey, prompt);
    } else {
        return callClaude<ListingOptimization>(settings.apiKey, prompt);
    }
};

async function callOpenAI<T>(apiKey: string, prompt: string): Promise<T> {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert Airbnb consultant. Respond only in valid JSON.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        return JSON.parse(content) as T;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('AI分析中にエラーが発生しました。APIキーを確認してください。');
    }
}

async function callClaude<T>(apiKey: string, prompt: string): Promise<T> {
    try {
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true', // Required for browser extension
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: prompt + "\n\nRespond only in valid JSON.",
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Anthropic API request failed');
        }

        const data = await response.json();
        const content = data.content[0]?.text;

        if (!content) {
            throw new Error('No content received from Claude');
        }

        // Claude might wrap JSON in markdown code blocks, strip them
        const jsonStr = content.replace(/```json\n|\n```/g, '');
        return JSON.parse(jsonStr) as T;
    } catch (error) {
        console.error('Claude API Error:', error);
        throw new Error('AI分析中にエラーが発生しました。APIキーを確認してください。');
    }
}
