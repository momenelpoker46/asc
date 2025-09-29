import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Book, 
  CreditCard, 
  Award,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navLinks = [
    { to: '/admin', icon: LayoutDashboard, text: 'لوحة التحكم' },
    { to: '/admin/exams', icon: BookOpen, text: 'الامتحانات' },
    { to: '/admin/question-bank', icon: HelpCircle, text: 'بنك الأسئلة' },
    { to: '/admin/subjects', icon: Book, text: 'المواد الدراسية' },
    { to: '/admin/payments', icon: CreditCard, text: 'طلبات الدفع' },
    { to: '/admin/subscriptions', icon: Award, text: 'الاشتراكات' },
  ];

  return (
    <aside className="w-64 bg-secondary-900 text-secondary-300 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-800">
        <Link to="/admin" className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">
              حلهالي
            </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-secondary-800'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-800 space-y-2">
        <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-secondary-800'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>الإعدادات</span>
        </NavLink>
        <button className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-red-400 hover:bg-red-900/50 transition-colors duration-200">
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
