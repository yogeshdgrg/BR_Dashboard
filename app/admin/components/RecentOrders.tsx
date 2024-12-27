"use client" 

import React from 'react';

const RecentOrders = () => {
  const orders = [
    { id: 1, product: 'Laptop', customer: 'John Doe', amount: '$1200', date: '2024-12-01' },
    { id: 2, product: 'Headphones', customer: 'Jane Smith', amount: '$300', date: '2024-12-02' },
    { id: 3, product: 'Smartphone', customer: 'Mike Johnson', amount: '$800', date: '2024-12-03' },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left text-sm text-gray-600">
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-sm text-gray-700 border-b">
              <td className="px-4 py-2">{order.product}</td>
              <td className="px-4 py-2">{order.customer}</td>
              <td className="px-4 py-2">{order.amount}</td>
              <td className="px-4 py-2">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
