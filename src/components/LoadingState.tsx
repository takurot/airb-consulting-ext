import React from 'react';

const LoadingState: React.FC = () => {
    return (
        <div className="space-y-4 animate-fade-in">
            {/* Listing Card Skeleton */}
            <div className="card p-4 space-y-3">
                <div className="skeleton h-6 w-3/4 rounded"></div>
                <div className="space-y-2">
                    <div className="skeleton h-4 w-1/3 rounded"></div>
                    <div className="skeleton h-4 w-1/2 rounded"></div>
                    <div className="skeleton h-4 w-1/4 rounded"></div>
                </div>
            </div>

            {/* Analysis Card Skeleton */}
            <div className="card p-4 border-l-4 border-gray-200 space-y-4">
                <div className="flex justify-between">
                    <div className="skeleton h-6 w-1/3 rounded"></div>
                    <div className="skeleton h-6 w-16 rounded-full"></div>
                </div>

                <div className="skeleton h-10 w-1/2 rounded"></div>

                <div className="space-y-2">
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-4 w-2/3 rounded"></div>
                </div>

                <div className="skeleton h-10 w-full rounded"></div>
            </div>
        </div>
    );
};

export default LoadingState;
