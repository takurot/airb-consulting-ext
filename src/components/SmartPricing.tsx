import React from 'react';
import { PricingAnalysis } from '@/types/listing';
import { TrendingUp, AlertTriangle, CheckCircle, Copy } from 'lucide-react';

interface SmartPricingProps {
    analysis: PricingAnalysis | null;
    onAnalyze: () => void;
    isLoading: boolean;
}

const SmartPricing: React.FC<SmartPricingProps> = ({ analysis, onAnalyze, isLoading }) => {
    if (!analysis) {
        return (
            <div className="card mt-4 text-center py-8">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3 opacity-80" />
                <h3 className="text-lg font-semibold mb-2">AI価格分析</h3>
                <p className="text-sm text-airbnb-foggy mb-4 px-4">
                    周辺の市場データと物件の特徴を分析し、最適な価格設定を提案します。
                </p>
                <button
                    onClick={onAnalyze}
                    disabled={isLoading}
                    className="btn-primary w-full max-w-xs"
                >
                    {isLoading ? '分析中...' : '分析を開始する'}
                </button>
            </div>
        );
    }

    const getJudgmentBadge = (judgment: string) => {
        switch (judgment) {
            case '適正':
                return <span className="badge badge-success"><CheckCircle className="w-3 h-3 mr-1" /> 適正価格</span>;
            case '割高':
                return <span className="badge badge-warning"><AlertTriangle className="w-3 h-3 mr-1" /> 割高</span>;
            case '割安':
                return <span className="badge badge-info"><TrendingUp className="w-3 h-3 mr-1" /> 割安</span>;
            default:
                return null;
        }
    };

    const copyPrice = () => {
        const price = Math.round((analysis.recommendedPriceMin + analysis.recommendedPriceMax) / 2);
        navigator.clipboard.writeText(price.toString());
    };

    return (
        <div className="space-y-4 mt-4 animate-fade-in">
            <div className="card border-l-4 border-primary">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">推奨価格</h3>
                    {getJudgmentBadge(analysis.judgment)}
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-airbnb-hof">
                        ¥{analysis.recommendedPriceMin.toLocaleString()}
                    </span>
                    <span className="text-airbnb-foggy">
                        - ¥{analysis.recommendedPriceMax.toLocaleString()}
                    </span>
                </div>

                <p className="text-sm text-airbnb-hof bg-gray-50 p-3 rounded-lg mb-4 leading-relaxed">
                    {analysis.reason}
                </p>

                <button onClick={copyPrice} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" />
                    推奨価格をコピー
                </button>
            </div>
        </div>
    );
};

export default SmartPricing;
