import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('compareItems');
    if (saved) setCompareItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const exists = prev.find(item => item.productId === product.productId);
      if (exists) {
        return prev.filter(item => item.productId !== product.productId);
      }

      if (prev.length > 0 && prev[0].categoryId !== product.categoryId) {
        toast.error('You can only compare products from the same category');
        return prev;
      }

      if (prev.length >= 4) {
        toast.error('You can compare up to 4 products at a time');
        return prev;
      }

      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, toggleCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
