import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { RoleProvider } from '@/lib/RoleContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import DirectorDashboard from '@/pages/DirectorDashboard';
import Student360 from '@/pages/Student360';
import Attendance from '@/pages/Attendance';
import HesaReturn from '@/pages/HesaReturn';
import ReportBuilder from '@/pages/ReportBuilder';
import WithdrawalWorkflow from '@/pages/WithdrawalWorkflow';
import PaymentPlans from '@/pages/PaymentPlans';
import Communications from '@/pages/Communications';
import AdminSettings from '@/pages/AdminSettings';
import AuditLog from '@/pages/AuditLog';
import StaffDirectory from '@/pages/StaffDirectory';
import FundingStatus from '@/pages/FundingStatus';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DirectorDashboard />} />
          <Route path="/students" element={<Student360 />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/hesa" element={<HesaReturn />} />
          <Route path="/reports" element={<ReportBuilder />} />
          <Route path="/withdrawals" element={<WithdrawalWorkflow />} />
          <Route path="/finance" element={<PaymentPlans />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/staff" element={<StaffDirectory />} />
          <Route path="/funding-status" element={<FundingStatus />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/audit" element={<AuditLog />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <RoleProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
          <Toaster />
        </QueryClientProvider>
      </RoleProvider>
    </AuthProvider>
  )
}

export default App