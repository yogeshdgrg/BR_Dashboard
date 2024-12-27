"use client" 
import React from 'react';

const TopProducts = () => {
  const products = [
    { name: 'Laptop', sales: 120 },
    { name: 'Headphones', sales: 95 },
    { name: 'Smartphone', sales: 80 },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
      <ul className="space-y-3">
        {products.map((product, index) => (
          <li
            key={index}
            className="flex justify-between items-center text-sm text-gray-700"
          >
            <span>{product.name}</span>
            <span className="font-semibold">{product.sales} sales</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;
