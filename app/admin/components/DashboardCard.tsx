import React, { JSX } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
      <div className="text-4xl text-blue-500">{icon}</div>
      <div>
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
