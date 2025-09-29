import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const location = useLocation();

  // A simple way to get a title from the path
  const getTitle = (pathname) => {
    const path = pathname.split('/').pop();
    switch(path) {
      case 'admin': return 'لوحة التحكم';
      case 'exams': return 'إدارة الامتحانات';
      case 'question-bank': return 'بنك الأسئلة';
      case 'subjects': return 'المواد الدراسية';
      case 'payments': return 'طلبات الدفع';
      case 'subscriptions': return 'الاشتراكات';
      default: return 'لوحة التحكم';
    }
  };

  return (
    <div className="flex bg-secondary-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title={getTitle(location.pathname)} />
        <main className="flex-1 p-6 bg-secondary-800/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
