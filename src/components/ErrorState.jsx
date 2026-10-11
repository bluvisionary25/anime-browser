import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-2">Oops! Something went wrong</h3>
      
      <p className="text-slate-400 max-w-md mb-6">
        {message || "Unable to retrieve anime data. Please check your connection and try again."}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full font-medium transition-colors border border-slate-700 hover:border-slate-600"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
