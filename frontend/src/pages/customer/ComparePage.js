import React from 'react';
import Navbar from '../../components/common/Navbar';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const INR = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v || 0);

export default function ComparePage() {
  const { compareItems, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <Navbar />
        <div className="pt-32 text-center">
          <div className="text-6xl mb-6">⚖️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No products to compare</h2>
          <p className="text-gray-500 mb-8">Add at least two products to compare them side-by-side.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  // Get unique attributes keys if variants exist, but usually we compare base properties
  // For a Flipkart-like experience, we compare Price, Rating, Brand (Store), and Description
  const attributes = [
    { label: 'Price', key: 'price', format: (v) => INR(v) },
    { label: 'Rating', key: 'averageRating', format: (v) => `${v || 0} ⭐` },
    { label: 'Seller', key: 'storeName' },
    { label: 'Stock', key: 'stock', format: (v) => v > 0 ? `${v} units left` : 'Out of Stock' },
    { label: 'Description', key: 'description' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">⚖️ Compare Products</h1>
            <p className="text-gray-500 mt-1">{compareItems[0].categoryName} Category</p>
          </div>
          <button onClick={clearCompare} className="text-red-500 font-semibold hover:underline">
            Clear All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-6 text-left w-64 bg-gray-50 dark:bg-dark-800 rounded-tl-3xl border-b dark:border-dark-700">
                  <span className="text-gray-400 font-medium">Features</span>
                </th>
                {compareItems.map((item, idx) => (
                  <th key={item.productId} className={`p-6 bg-white dark:bg-dark-800 border-b dark:border-dark-700 min-w-[280px] ${idx === compareItems.length - 1 ? 'rounded-tr-3xl' : ''}`}>
                    <div className="relative group">
                      <button 
                        onClick={() => toggleCompare(item)}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <img 
                        src={item.primaryImageUrl || 'https://via.placeholder.com/150'} 
                        alt={item.name} 
                        className="w-32 h-32 object-contain mx-auto mb-4" 
                      />
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center line-clamp-2 mb-4">
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => handleAddToCart(item.productId)}
                        disabled={item.stock === 0}
                        className="btn-primary w-full py-2 text-xs"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr, idx) => (
                <tr key={attr.label}>
                  <td className={`p-6 text-gray-600 dark:text-gray-400 font-bold bg-gray-50 dark:bg-dark-800 border-b dark:border-dark-700 ${idx === attributes.length - 1 ? 'rounded-bl-3xl' : ''}`}>
                    {attr.label}
                  </td>
                  {compareItems.map((item, idxx) => (
                    <td key={item.productId} className={`p-6 text-center border-b dark:border-dark-700 bg-white dark:bg-dark-800 ${idx === attributes.length - 1 && idxx === compareItems.length - 1 ? 'rounded-br-3xl' : ''}`}>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {attr.format ? attr.format(item[attr.key]) : item[attr.key] || 'N/A'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
