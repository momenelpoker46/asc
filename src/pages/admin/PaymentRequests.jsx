import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { Filter, Search, Check, X } from 'lucide-react';

const PaymentRequests = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        id,
        amount,
        transfer_number,
        status,
        created_at,
        student:student_id ( first_name, last_name ),
        plan:plan_id ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
    } else {
      setPayments(data);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    const { error } = await supabase
      .from('payment_requests')
      .update({ status: newStatus })
      .eq('id', paymentId);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchPayments();
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const studentName = `${p.student?.first_name || ''} ${p.student?.last_name || ''}`;
      const searchMatch = filters.search === '' ||
        studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.transfer_number && p.transfer_number.toLowerCase().includes(filters.search.toLowerCase()));
      const statusMatch = filters.status === 'all' || p.status === filters.status;
      return searchMatch && statusMatch;
    });
  }, [payments, filters]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-900/50 text-green-400 border-green-800';
      case 'pending': return 'bg-yellow-900/50 text-yellow-400 border-yellow-800';
      case 'rejected': return 'bg-red-900/50 text-red-400 border-red-800';
      default: return 'bg-secondary-700 text-secondary-300';
    }
  };

  const getStatusText = (status) => {
    const statuses = { approved: 'مقبول', pending: 'قيد المراجعة', rejected: 'مرفوض' };
    return statuses[status] || 'غير محدد';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">طلبات الدفع</h2>

      {/* Filters */}
      <div className="bg-secondary-900 p-4 rounded-xl border border-secondary-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text" name="search" placeholder="بحث بالاسم أو رقم التحويل..."
              value={filters.search} onChange={handleFilterChange}
              className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 pl-10 pr-4"
            />
          </div>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-4">
            <option value="all">كل الحالات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>
          <button
            onClick={() => setFilters({ search: '', status: 'all' })}
            className="bg-secondary-700 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 space-x-reverse"
          >
            <Filter className="w-4 h-4" />
            <span>مسح الفلاتر</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-secondary-900 rounded-xl border border-secondary-700 overflow-hidden">
        {loading ? (
          <p className="text-white text-center p-8">جاري تحميل الطلبات...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-secondary-300">
              <thead className="text-xs text-secondary-400 uppercase bg-secondary-800">
                <tr>
                  <th className="px-6 py-3">الطالب</th>
                  <th className="px-6 py-3">الباقة</th>
                  <th className="px-6 py-3">المبلغ</th>
                  <th className="px-6 py-3">رقم التحويل</th>
                  <th className="px-6 py-3">التاريخ</th>
                  <th className="px-6 py-3 text-center">الحالة</th>
                  <th className="px-6 py-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="border-b border-secondary-700 hover:bg-secondary-800/50">
                    <td className="px-6 py-4 font-medium text-white">{`${p.student?.first_name || ''} ${p.student?.last_name || ''}`}</td>
                    <td className="px-6 py-4">{p.plan?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono text-green-400">{p.amount} EGP</td>
                    <td className="px-6 py-4 font-mono">{p.transfer_number}</td>
                    <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString('ar-EG')}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(p.status)}`}>
                        {getStatusText(p.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.status === 'pending' ? (
                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          <button onClick={() => handleStatusChange(p.id, 'approved')} className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 text-green-400">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleStatusChange(p.id, 'rejected')} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-secondary-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentRequests;
