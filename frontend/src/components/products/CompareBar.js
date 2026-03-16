import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { Link } from 'react-router-dom';

export default function CompareBar() {
  const { compareItems, toggleCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-dark-800 border-t dark:border-dark-700 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-6 py-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0">
          <div className="hidden sm:block">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Compare Products</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{compareItems.length} items added</p>
          </div>
          
          <div className="flex gap-3">
            {compareItems.map(item => (
              <div key={item.productId} className="relative w-14 h-14 bg-gray-50 dark:bg-dark-700 rounded-xl border dark:border-dark-600 p-1 group">
                <img 
                  src={item.primaryImageUrl || 'https://via.placeholder.com/50'} 
                  alt={item.name} 
                  className="w-full h-full object-contain rounded-lg"
                />
                <button 
                  onClick={() => toggleCompare(item)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 2 - compareItems.length) }).map((_, i) => (
              <div key={i} className="w-14 h-14 border-2 border-dashed border-gray-200 dark:border-dark-600 rounded-xl flex items-center justify-center">
                <span className="text-gray-300 dark:text-dark-500 text-xl">+</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={clearCompare}
            className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors hidden sm:block"
          >
            REMOVE ALL
          </button>
          
          <Link 
            to="/compare" 
            className={`btn-primary px-8 py-3 text-sm font-bold shadow-xl shadow-primary-500/20 ${compareItems.length < 2 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            COMPARE {compareItems.length > 0 && `(${compareItems.length})`}
          </Link>
        </div>
      </div>
    </div>
  );
}
