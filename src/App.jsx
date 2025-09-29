import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Exams from './pages/Exams';
import Account from './pages/Account';
import Exam from './pages/Exam';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminExams from './pages/admin/AdminExams';
import QuestionBank from './pages/admin/QuestionBank';
import Subjects from './pages/admin/Subjects';
import PaymentRequests from './pages/admin/PaymentRequests';
import Subscriptions from './pages/admin/Subscriptions';

// Helpers
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exam/:id" element={<Exam />} />
            <Route path="/account" element={<Account />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="question-bank" element={<QuestionBank />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="payments" element={<PaymentRequests />} />
            <Route path="subscriptions" element={<Subscriptions />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
