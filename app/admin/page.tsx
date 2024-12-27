// import DashboardStats from './components/DashboardStats';
// import RevenueChart from './components/RevenueChart';
// import TopProducts from './components/TopProducts';
// import RecentOrders from './components/RecentOrders';
// "use client" 
import DashboardStats from "./components/DashboardStats";
import RecentOrders from "./components/RecentOrders";
import RevenueChart from "./components/RevenueChart";
import TopProducts from "./components/TopProducts";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <TopProducts />
      </div>
      
      <RecentOrders />
    </div>
  );
}