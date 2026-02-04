
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col h-full mb-4">
      {/* Image Placeholder */}
      <div className="relative w-full aspect-[3/4] bg-gray-200 rounded-sm overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
      </div>
      
      {/* Text Placeholders */}
      <div className="flex justify-between items-center pt-2 mb-2">
         <div className="h-2 w-16 bg-gray-200 rounded-full animate-pulse"></div>
         <div className="h-2 w-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
      <div className="h-3 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>
      
      <div className="mt-auto flex gap-2">
         <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
         <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
