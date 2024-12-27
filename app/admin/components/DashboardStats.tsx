"use client" 

import React from 'react';
import DashboardCard from './DashboardCard';
import { FaUser, FaDollarSign, FaShoppingCart, FaChartLine } from 'react-icons/fa';

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Total Users" value="1,234" icon={<FaUser />} />
      <DashboardCard title="Revenue" value="$12,345" icon={<FaDollarSign />} />
      <DashboardCard title="Orders" value="567" icon={<FaShoppingCart />} />
      <DashboardCard title="Growth" value="23%" icon={<FaChartLine />} />
    </div>
  );
};

export default DashboardStats;
