import React from 'react';

const Loading = () => {
  // Create an array of 4 items for skeleton cards
  const skeletons = Array.from({ length: 4 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {skeletons.map((_, index) => (
        <div 
          key={index} 
          className="animate-pulse bg-slate-800 h-80 rounded-xl"
        ></div>
      ))}
    </div>
  );
};

export default Loading;
