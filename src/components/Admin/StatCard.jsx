import React from 'react';

const StatCard = ({ icon: Icon, title, value, change, color }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className={`bg-secondary-900 p-6 rounded-xl border border-secondary-700 flex items-start justify-between`}>
      <div>
        <h3 className="text-secondary-400 text-sm font-medium">{title}</h3>
        <p className="text-white text-3xl font-bold mt-2">{value}</p>
        <p className={`text-xs mt-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change} عن الشهر الماضي
        </p>
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default StatCard;
