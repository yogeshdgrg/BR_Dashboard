"use client"
import { ReactNode } from 'react';
import Sidebar from '../components/ui/sidebar';
import Header from '../components/Header';
// import Header from '@/components/ui/Header';
// import Sidebar from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// app/components/ui/sidebar.tsx