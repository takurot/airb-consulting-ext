import React from 'react';
import { ListingOptimization } from '@/types/listing';
import { Sparkles, Copy, Check } from 'lucide-react';

interface ListingOptimizerProps {
    optimization: ListingOptimization | null;
    onOptimize: () => void;
    isLoading: boolean;
}

const ListingOptimizer: React.FC<ListingOptimizerProps> = ({ optimization, onOptimize, isLoading }) => {
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (!optimization) {
        return (
            <div className="card mt-4 text-center py-8">
                <Sparkles className="w-12 h-12 text-accent mx-auto mb-3 opacity-80" />
                <h3 className="text-lg font-semibold mb-2">物件ページの改善</h3>
                <p className="text-sm text-airbnb-foggy mb-4 px-4">
                    クリック率を高めるタイトルと、魅力的な説明文をAIが生成します。
                </p>
                <button
                    onClick={onOptimize}
                    disabled={isLoading}
                    className="btn-primary w-full max-w-xs bg-accent hover:bg-accent-dark"
                >
                    {isLoading ? '生成中...' : '改善案を生成する'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-4 animate-fade-in">
            {/* Title Suggestions */}
            <section>
                <h3 className="text-sm font-semibold text-airbnb-foggy uppercase tracking-wider mb-3">
                    おすすめのタイトル
                </h3>
                <div className="space-y-3">
                    {optimization.titleSuggestions.map((suggestion, index) => (
                        <div key={index} className="card hover:border-accent border border-transparent transition-all group">
                            <div className="flex justify-between items-start gap-3">
                                <div>
                                    <span className="text-xs font-bold text-accent bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
                                        {suggestion.targetAudience}
                                    </span>
                                    <p className="font-medium text-airbnb-hof text-balance">
                                        {suggestion.title}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCopy(suggestion.title, index)}
                                    className="p-2 text-gray-400 hover:text-accent transition-colors"
                                    title="コピー"
                                >
                                    {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Description Opener */}
            <section>
                <h3 className="text-sm font-semibold text-airbnb-foggy uppercase tracking-wider mb-3">
                    魅力的な冒頭文
                </h3>
                <div className="card bg-gray-50 border border-gray-100">
                    <p className="text-sm leading-relaxed text-airbnb-hof mb-3">
                        {optimization.descriptionOpener}
                    </p>
                    <button
                        onClick={() => handleCopy(optimization.descriptionOpener, 99)}
                        className="text-xs font-medium text-accent hover:text-accent-dark flex items-center gap-1 ml-auto"
                    >
                        {copiedIndex === 99 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        コピーする
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ListingOptimizer;
