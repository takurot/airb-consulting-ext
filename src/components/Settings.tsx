import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { UserSettings, AIProvider } from '@/types/listing';

interface SettingsProps {
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [provider, setProvider] = useState<AIProvider>('openai');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        // Load settings from storage
        chrome.storage.local.get(['userSettings'], (result) => {
            const settings = result.userSettings as UserSettings;
            if (settings) {
                setApiKey(settings.apiKey || '');
                setProvider(settings.provider || 'openai');
                setTermsAccepted(settings.termsAccepted || false);
            }
        });
    }, []);

    const handleSave = () => {
        if (!apiKey.trim()) {
            setMessage({ type: 'error', text: 'APIキーを入力してください' });
            return;
        }

        if (!termsAccepted) {
            setMessage({ type: 'error', text: '利用規約への同意が必要です' });
            return;
        }

        // Basic validation for OpenAI key
        if (provider === 'openai' && !apiKey.startsWith('sk-')) {
            setMessage({ type: 'error', text: '無効なOpenAI APIキーの形式です' });
            return;
        }

        setIsSaving(true);
        const settings: UserSettings = {
            apiKey,
            provider,
            termsAccepted,
            updatedAt: Date.now(),
        };

        chrome.storage.local.set({ userSettings: settings }, () => {
            setIsSaving(false);
            setMessage({ type: 'success', text: '設定を保存しました' });
            setTimeout(() => {
                onClose();
            }, 1500);
        });
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
                <h2 className="text-lg font-semibold">設定</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-airbnb-hof" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* AI Provider Section */}
                <section>
                    <h3 className="text-sm font-semibold text-airbnb-foggy uppercase tracking-wider mb-3">
                        AIプロバイダー
                    </h3>
                    <div className="space-y-2">
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="provider"
                                value="openai"
                                checked={provider === 'openai'}
                                onChange={() => setProvider('openai')}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="ml-3 font-medium">OpenAI (GPT-4o)</span>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="provider"
                                value="claude"
                                checked={provider === 'claude'}
                                onChange={() => setProvider('claude')}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="ml-3 font-medium">Anthropic (Claude 3.5)</span>
                        </label>
                    </div>
                </section>

                {/* API Key Section */}
                <section>
                    <h3 className="text-sm font-semibold text-airbnb-foggy uppercase tracking-wider mb-3">
                        APIキー設定
                    </h3>
                    <div className="relative">
                        <input
                            type={showKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-airbnb-foggy mt-2">
                        ※ APIキーはブラウザ内にのみ保存され、外部サーバーには送信されません。
                        <a
                            href={provider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://console.anthropic.com/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline inline-flex items-center ml-1"
                        >
                            キーを取得 <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                    </p>
                </section>

                {/* Terms Section */}
                <section className="bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-start cursor-pointer">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-3 text-sm text-airbnb-hof">
                            <span className="font-medium">利用規約に同意する</span>
                            <br />
                            <span className="text-airbnb-foggy text-xs">
                                本拡張機能はAIによる助言を提供するものであり、収益を保証するものではありません。
                                最終的な価格設定の責任はユーザーにあります。
                            </span>
                        </span>
                    </label>
                </section>

                {message && (
                    <div
                        className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {message.text}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                    {isSaving ? (
                        '保存中...'
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            設定を保存
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;
