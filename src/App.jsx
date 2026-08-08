import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
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
import Dashboard from '@/pages/Dashboard';
import Student360 from '@/pages/Student360';
import Attendance from '@/pages/Attendance';
import HesaReturn from '@/pages/HesaReturn';
import ReportBuilder from '@/pages/ReportBuilder';
import WithdrawalWorkflow from '@/pages/WithdrawalWorkflow';
import PaymentPlans from '@/pages/PaymentPlans';
import Communications from '@/pages/Communications';
import AdminSettings from '@/pages/AdminSettings';
import AuditLog from '@/pages/AuditLog';
import Admissions from '@/pages/Admissions';
import AcademicStructure from '@/pages/AcademicStructure';
import DirectorDashboard from '@/pages/DirectorDashboard';
import RoleGuard from '@/components/RoleGuard';
import ClaimWorkspace from '@/pages/ClaimWorkspace';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated, user } = useAuth();

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

  // A signed-in user with no team role yet (fresh registration, or Google
  // sign-in with no invite) has no route they're allowed to reach — every
  // route requires a specific role. Intercept here rather than letting
  // RoleGuard bounce them in a redirect loop.
  if (isAuthenticated && (!user?.role || user.role === "user")) {
    return <ClaimWorkspace />;
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
          <Route path="/" element={<RoleGuard path="/"><Dashboard /></RoleGuard>} />
          <Route path="/director" element={<RoleGuard path="/director"><DirectorDashboard /></RoleGuard>} />
          <Route path="/admissions" element={<RoleGuard path="/admissions"><Admissions /></RoleGuard>} />
          <Route path="/academic-structure" element={<RoleGuard path="/academic-structure"><AcademicStructure /></RoleGuard>} />
          <Route path="/students" element={<RoleGuard path="/students"><Student360 /></RoleGuard>} />
          <Route path="/attendance" element={<RoleGuard path="/attendance"><Attendance /></RoleGuard>} />
          <Route path="/hesa" element={<RoleGuard path="/hesa"><HesaReturn /></RoleGuard>} />
          <Route path="/reports" element={<RoleGuard path="/reports"><ReportBuilder /></RoleGuard>} />
          <Route path="/withdrawals" element={<RoleGuard path="/withdrawals"><WithdrawalWorkflow /></RoleGuard>} />
          <Route path="/finance" element={<RoleGuard path="/finance"><PaymentPlans /></RoleGuard>} />
          <Route path="/communications" element={<RoleGuard path="/communications"><Communications /></RoleGuard>} />
          <Route path="/settings" element={<RoleGuard path="/settings"><AdminSettings /></RoleGuard>} />
          <Route path="/audit" element={<RoleGuard path="/audit"><AuditLog /></RoleGuard>} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App