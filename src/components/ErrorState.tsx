import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">エラーが発生しました</h3>
                    <p className="text-sm text-red-700 mb-3">{error}</p>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="text-sm font-medium text-red-800 hover:text-red-900 flex items-center gap-1 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded transition-colors"
                        >
                            <RefreshCw className="w-3 h-3" />
                            再試行する
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorState;
