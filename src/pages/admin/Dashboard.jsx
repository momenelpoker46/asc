import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { faker } from '@faker-js/faker';
import { Users, BookOpen, DollarSign, Award, ArrowUp } from 'lucide-react';
import StatCard from '../../components/Admin/StatCard';

const Dashboard = () => {
  const stats = [
    {
      icon: DollarSign,
      title: 'إجمالي الإيرادات',
      value: `EGP ${faker.finance.amount(25000, 50000, 0, '')}`,
      change: `+${faker.number.float({ min: 2, max: 15, fractionDigits: 1 })}%`,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'إجمالي الطلاب',
      value: faker.number.int({ min: 8000, max: 12000 }).toLocaleString(),
      change: `+${faker.number.float({ min: 1, max: 5, fractionDigits: 1 })}%`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'إجمالي الامتحانات',
      value: faker.number.int({ min: 400, max: 600 }).toLocaleString(),
      change: `+${faker.number.int({ min: 10, max: 30 })}`,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Award,
      title: 'الاشتراكات النشطة',
      value: faker.number.int({ min: 6000, max: 9000 }).toLocaleString(),
      change: `-${faker.number.float({ min: 0.5, max: 2, fractionDigits: 1 })}%`,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderColor: '#334155',
      textStyle: { color: '#cbd5e1' },
      formatter: (params) => {
        return `${params[0].axisValue}<br/>${params[0].seriesName}: EGP ${params[0].value.toLocaleString()}`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true, lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8', formatter: 'EGP {value}' },
      splitLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        name: 'الإيرادات',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [12000, 15200, 11000, 18400, 19000, 23000, 21000],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(2, 132, 199, 0.5)' }, { offset: 1, color: 'rgba(2, 132, 199, 0)' }]
          }
        },
        lineStyle: { color: '#0ea5e9' },
        itemStyle: { color: '#0ea5e9' }
      }
    ]
  };

  const recentPayments = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    amount: faker.finance.amount(50, 120, 0),
    plan: faker.helpers.arrayElement(['الأساسية', 'المميزة', 'الذهبية']),
    date: faker.date.recent({ days: 7 }),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div variants={itemVariants} key={index}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-secondary-900 p-6 rounded-xl border border-secondary-700">
          <h3 className="text-white text-lg font-semibold mb-4">تحليلات الإيرادات</h3>
          <div style={{ height: '350px' }}>
            <ReactECharts option={chartOptions} style={{ height: '100%' }} notMerge={true} lazyUpdate={true} />
          </div>
        </motion.div>

        {/* Recent Payments */}
        <motion.div variants={itemVariants} className="bg-secondary-900 p-6 rounded-xl border border-secondary-700">
          <h3 className="text-white text-lg font-semibold mb-4">أحدث المدفوعات</h3>
          <div className="space-y-4">
            {recentPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{payment.name}</p>
                    <p className="text-secondary-400 text-xs">{payment.date.toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">+EGP {payment.amount}</p>
                  <p className="text-secondary-400 text-xs">باقة {payment.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
