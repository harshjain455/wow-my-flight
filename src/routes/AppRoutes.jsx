import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dbService } from '../services/dbService';
import useAuth from '../hooks/useAuth';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Dashboard & CRM Modules
import Dashboard from '../pages/dashboard/Dashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import OperationsDashboard from '../pages/dashboard/OperationsDashboard';
import AgentDashboard from '../pages/dashboard/AgentDashboard';
import FinanceDashboard from '../pages/dashboard/FinanceDashboard';
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
import MarketingDashboard from '../pages/dashboard/MarketingDashboard';
import TeamLeaderDashboard from '../pages/dashboard/TeamLeaderDashboard';
import ExpertTeamLeaderDashboard from '../pages/dashboard/ExpertTeamLeaderDashboard';
import AutomationEngine from '../pages/automation/AutomationEngine';
import SlaManagement from '../pages/sla/SlaManagement';
import CentralNotificationCenter from '../pages/notifications/CentralNotificationCenter';
import AuditTrail from '../pages/audit/AuditTrail';
import ManagementReportingDashboard from '../pages/reports/ManagementReportingDashboard';
import DevelopmentRoadmap from '../pages/roadmap/DevelopmentRoadmap';
import LeadManagementSuite from '../pages/leads/LeadManagementSuite';
import LeadDistributionEngine from '../pages/leads/LeadDistributionEngine';
import LeadLifecycleSystem from '../pages/leads/LeadLifecycleSystem';
import DuplicateLeadProtection from '../pages/leads/DuplicateLeadProtection';
import CommunicationCenter from '../pages/social/CommunicationCenter';
import CallingSoftphoneWorkspace from '../pages/social/CallingSoftphoneWorkspace';
import MandatoryCallDispositionEngine from '../pages/social/MandatoryCallDispositionEngine';
import FlightExpertDesk from '../pages/dashboard/FlightExpertDesk';
import TicketingIssuance from '../pages/dashboard/TicketingIssuance';
import TicketingAgentDashboard from '../pages/dashboard/TicketingAgentDashboard';
import AfterSalesWorkflow from '../pages/after-sales/AfterSalesWorkflow';
import QAAudits from '../pages/qa/QAAudits';
import { QuotesPage, BookingsPage, BookingDetailsPage, FlightAlertsPage, FlightRequestsPage, PaymentsPage, PaymentDetailsPage } from '../pages/dashboard/PlaceholderPages';


import AdminLeadList from '../pages/leads/AdminLeadList';
import OperationsLeadList from '../pages/leads/OperationsLeadList';
import AgentLeadList from '../pages/leads/AgentLeadList';
import AdminLeadDetails from '../pages/leads/AdminLeadDetails';
import OperationsLeadDetails from '../pages/leads/OperationsLeadDetails';
import AgentLeadDetails from '../pages/leads/AgentLeadDetails';
import AdminConsultationList from '../pages/consultations/AdminConsultationList';
import OperationsConsultationList from '../pages/consultations/OperationsConsultationList';
import AgentConsultationList from '../pages/consultations/AgentConsultationList';
import AdminConsultationDetails from '../pages/consultations/AdminConsultationDetails';
import OperationsConsultationDetails from '../pages/consultations/OperationsConsultationDetails';
import AgentConsultationDetails from '../pages/consultations/AgentConsultationDetails';
import AdminCalendarView from '../pages/consultations/AdminCalendarView';
import OperationsCalendarView from '../pages/consultations/OperationsCalendarView';
import AgentCalendarView from '../pages/consultations/AgentCalendarView';

import AdminClientList from '../pages/clients/AdminClientList';
import OperationsClientList from '../pages/clients/OperationsClientList';
import AgentClientList from '../pages/clients/AgentClientList';
import AdminClientDetails from '../pages/clients/AdminClientDetails';
import OperationsClientDetails from '../pages/clients/OperationsClientDetails';
import AgentClientDetails from '../pages/clients/AgentClientDetails';
import AdminAgents from '../pages/team/AdminAgents';
import OperationsAgents from '../pages/team/OperationsAgents';
import AdminActiveCases from '../pages/team/AdminActiveCases';
import OperationsActiveCases from '../pages/team/OperationsActiveCases';
import AdminClosedCases from '../pages/clients/AdminClosedCases';
import OperationsClosedCases from '../pages/clients/OperationsClosedCases';
import AdminMarketing from '../pages/marketing/AdminMarketing';
import OperationsMarketing from '../pages/marketing/OperationsMarketing';
import AdminAgentsPerformance from '../pages/team/AdminAgentsPerformance';
import OperationsAgentsPerformance from '../pages/team/OperationsAgentsPerformance';
import StaffProfile from '../pages/team/StaffProfile';
import AdminPaymentDashboard from '../pages/payments/AdminPaymentDashboard';
import FinancePaymentDashboard from '../pages/payments/FinancePaymentDashboard';
import InvoiceList from '../pages/payments/InvoiceList';
import InvoiceDetails from '../pages/payments/InvoiceDetails';
import Settings from '../pages/settings/Settings';
import Suppliers from '../pages/suppliers/Suppliers';
import AdminSocialInbox from '../pages/social/AdminSocialInbox';
import OperationsSocialInbox from '../pages/social/OperationsSocialInbox';
import AgentSocialInbox from '../pages/social/AgentSocialInbox';
import ClientIntakeForm from '../pages/public/ClientIntakeForm';
import LeadIntakeForm from '../pages/public/LeadIntakeForm';
import FlightDealReview from '../pages/public/FlightDealReview';

import LandingPage from '../pages/public/LandingPage';
import AdminDocumentVerificationDashboard from '../pages/documents/AdminDocumentVerificationDashboard';
import OperationsDocumentVerificationDashboard from '../pages/documents/OperationsDocumentVerificationDashboard';

import Agents from '../pages/team/Agents';
import { TeamList } from '../pages/team/TeamList';
import ActiveCases from '../pages/team/ActiveCases';
import ClosedCases from '../pages/clients/ClosedCases';
import AllAgentsPerformance from '../pages/team/AllAgentsPerformance';

// Super Admin Dedicated Pages
import SuperAdminLeadList from '../pages/leads/SuperAdminLeadList';
import SuperAdminLeadDetails from '../pages/leads/SuperAdminLeadDetails';
import SuperAdminConsultationList from '../pages/consultations/SuperAdminConsultationList';
import SuperAdminConsultationDetails from '../pages/consultations/SuperAdminConsultationDetails';
import SuperAdminCalendarView from '../pages/consultations/SuperAdminCalendarView';
import SuperAdminClientList from '../pages/clients/SuperAdminClientList';
import SuperAdminClientDetails from '../pages/clients/SuperAdminClientDetails';
import SuperAdminClosedCases from '../pages/clients/SuperAdminClosedCases';
import SuperAdminAgents from '../pages/team/SuperAdminAgents';
import SuperAdminActiveCases from '../pages/team/SuperAdminActiveCases';
import SuperAdminAgentsPerformance from '../pages/team/SuperAdminAgentsPerformance';
import SuperAdminMarketing from '../pages/marketing/SuperAdminMarketing';
import SuperAdminSocialInbox from '../pages/social/SuperAdminSocialInbox';
import SuperAdminDocumentVerificationDashboard from '../pages/documents/SuperAdminDocumentVerificationDashboard';
import SuperAdminPaymentDashboard from '../pages/payments/SuperAdminPaymentDashboard';
import SuperAdminRefundCommissionHub from '../pages/payments/SuperAdminRefundCommissionHub';
import SuperAdminStorageBackup from '../pages/documents/SuperAdminStorageBackup';
import SuperAdminCustomization from '../pages/settings/SuperAdminCustomization';
import FlexiblePermissionSystem from '../pages/settings/FlexiblePermissionSystem';
import { PermissionGate } from '../components/PermissionGate';
import Integrations from '../pages/integrations/Integrations';

const getMenuLabelForPath = (path) => {
  const p = path.toLowerCase();

  if (p.includes('/permission-management') || p.includes('/customization')) return 'Permission Control';
  if (p.includes('/management-reports')) return 'Management Reports';
  if (p.includes('/sla-management')) return 'SLA Management';
  if (p.includes('/automation')) return 'Automation';
  if (p.includes('/audit-trail')) return 'Audit Trail';
  if (p.includes('/roadmap')) return 'Priority Roadmap';
  if (p.includes('/lead-distribution')) return 'Lead Distribution';
  if (p.includes('/lead-lifecycle')) return 'Lead Lifecycle';
  if (p.includes('/duplicate-leads')) return 'Duplicate Protection';
  if (p.includes('/communication-center')) return 'Communication Hub';
  if (p.includes('/calling-desk')) return 'Calling & Softphone';
  if (p.includes('/call-dispositions')) return 'Call Dispositions';
  if (p.includes('/dashboard')) return 'Dashboard';
  if (p.includes('/agents/performance')) return 'Sales Dashboard';
  if (p.includes('/agents') || p.includes('/team')) return 'Calling System';
  if (p.includes('/active-cases') || p.includes('/users')) return 'Users';
  if (p.includes('/documents/verify') || p.includes('/documents')) return 'QA';
  if (p.includes('/qa-audits')) return 'QA Audits';
  if (p.includes('/after-sales')) return 'After-Sales';
  if (p.includes('/payments/refund-commission') || p.includes('/payments/refunds')) return 'Finance';
  if (p.includes('/payments/invoices') || p.includes('/invoices')) return 'Invoices';
  if (p.includes('/payments')) return 'Payments';
  if (p.includes('/quotes')) return 'Quotes';
  if (p.includes('/bookings')) return 'Bookings';
  if (p.includes('/ticketing')) return 'Ticketing';
  if (p.includes('/flights')) return 'Flight Search';
  if (p.includes('/clients') || p.includes('/customers')) return 'Customer 360';
  if (p.includes('/leads')) return 'Leads';
  if (p.includes('/social-inbox')) return 'Social Inbox';

  return null;
};

const getDynamicRedirectPath = (label, role) => {
  let prefix = '';
  if (role === 'admin') prefix = 'admin';
  else if (role === 'operations') prefix = 'operations';
  else if (role === 'consultant' || role === 'sales_agent') prefix = 'agent';
  else if (role === 'marketing') prefix = 'marketing-manager';
  else if (role === 'finance') prefix = 'finance';
  else if (role === 'team_leader') prefix = 'team_leader';
  else if (role === 'expert_team_leader') prefix = 'expert_team_leader';
  else if (role === 'flight_expert') prefix = 'flight_expert';
  else if (role === 'ticketing_agent') prefix = 'ticketing_agent';

  let path = '/dashboard';
  if (label === 'Dashboard') path = '/dashboard';
  if (label === 'Priority Roadmap') path = '/roadmap';
  if (label === 'Leads') path = '/leads';
  if (label === 'Customer 360') path = '/customers';
  if (label === 'Calling System') path = '/agents';
  if (label === 'Follow-ups') path = '/consultations/calendar';
  if (label === 'Quotes') path = '/quotes';
  if (label === 'Lead Distribution') path = '/lead-distribution';
  if (label === 'Lead Lifecycle') path = '/lead-lifecycle';
  if (label === 'Duplicate Protection') path = '/duplicate-leads';
  if (label === 'Communication Hub') path = '/communication-center';
  if (label === 'Calling & Softphone') path = '/calling-desk';
  if (label === 'Call Dispositions') path = '/call-dispositions';
  if (label === 'Sales Dashboard') path = '/agents/performance';
  if (label === 'Flight Search') path = '/flights';
  if (label === 'Bookings') path = '/bookings';
  if (label === 'Ticketing') path = '/ticketing';
  if (label === 'Payments') path = '/payments';
  if (label === 'Invoices') path = '/payments/invoices';
  if (label === 'Refunds') path = '/payments/refund-commission';
  if (label === 'Finance') path = '/payments/refund-commission';
  if (label === 'After-Sales') path = '/after-sales';
  if (label === 'Team Leader Dashboard') path = '/team_leader/dashboard';
  if (label === 'QA') path = '/documents/verify';
  if (label === 'QA Audits') path = '/qa-audits';
  if (label === 'SLA Management') path = '/sla-management';
  if (label === 'Automation') path = '/automation';
  if (label === 'Management Reports') path = '/management-reports';
  if (label === 'Permission Control') path = '/permission-management';
  if (label === 'Audit Trail') path = '/audit-trail';
  if (label === 'Marketing Dashboard') path = '/marketing-manager/dashboard';
  if (label === 'Social Inbox') path = '/social-inbox';
  if (label === 'Integrations') path = '/integrations';

  if (!prefix || 
      path.startsWith('/team_leader/') || 
      path.startsWith('/expert_team_leader/') || 
      path.startsWith('/marketing-manager/') || 
      path.startsWith('/flight_expert/') || 
      path.startsWith('/ticketing_agent/') || 
      path.startsWith('/super_admin/') || 
      path.startsWith('/admin/') || 
      path.startsWith('/operations/') || 
      path.startsWith('/finance/') || 
      path.startsWith('/agent/')) {
    return path;
  }
  return `/${prefix}${path}`;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser, hasRole } = useAuth();
  const location = useLocation();

  const logMsg = `[${new Date().toLocaleTimeString()}] Path: ${location.pathname}, Auth: ${isAuthenticated}, Role: ${currentUser?.role}, Allowed: ${allowedRoles?.join(',')}, hasRole: ${allowedRoles ? hasRole(allowedRoles) : 'N/A'}`;

  const saved = localStorage.getItem('routing-debug-logs');
  let logs = [];
  try {
    logs = saved ? JSON.parse(saved) : [];
  } catch (e) {
    logs = [];
  }
  logs.push(logMsg);
  if (logs.length > 10) logs.shift();
  localStorage.setItem('routing-debug-logs', JSON.stringify(logs));

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    // Redirect to role-specific dashboard, not generic /dashboard
    let rolePrefix = currentUser.role;
    if (currentUser.role === 'consultant' || currentUser.role === 'sales_agent') rolePrefix = 'agent';
    else if (currentUser.role === 'super_admin') rolePrefix = 'super_admin';
    else if (currentUser.role === 'marketing') rolePrefix = 'marketing-manager';
    
    return <Navigate to={`/${rolePrefix}/dashboard`} replace />;
  }

  // Dynamic Customization Check
  const { data: customizationSettings } = useQuery({
    queryKey: ['customization-settings'],
    queryFn: dbService.getCustomizationSettings
  });

  if (currentUser && currentUser.role !== 'super_admin') {
    try {
      const currentMenuLabel = getMenuLabelForPath(location.pathname);

      // Core management & operational routes are exempt from redirect loop
      const EXEMPT_MENU_LABELS = [
        'Dashboard',
        'Priority Roadmap',
        'Management Reports',
        'Permission Control',
        'SLA Management',
        'Automation',
        'Audit Trail',
        'QA Audits',
        'After-Sales',
        'QA'
      ];

      if (currentMenuLabel && !EXEMPT_MENU_LABELS.includes(currentMenuLabel)) {
        // 1. Check individual custom permissions first (highest priority)
        if (currentUser.customPermissions?.enabled) {
          const allowedMenus = currentUser.customPermissions.menus || [];
          if (!allowedMenus.includes(currentMenuLabel)) {
            if (allowedMenus.length > 0) {
              const firstAllowedLabel = allowedMenus[0];
              const redirectPath = getDynamicRedirectPath(firstAllowedLabel, currentUser.role);
              if (location.pathname !== redirectPath) {
                return <Navigate to={redirectPath} replace />;
              }
            }
          }
        } else if (customizationSettings) {
          // 2. Fall back to role-level customization settings
          const roleSettings = customizationSettings[currentUser.role];
          if (roleSettings && roleSettings.menus) {
            const allowedMenus = roleSettings.menus;
            if (!allowedMenus.includes(currentMenuLabel)) {
              if (allowedMenus.length > 0) {
                const firstAllowedLabel = allowedMenus[0];
                const redirectPath = getDynamicRedirectPath(firstAllowedLabel, currentUser.role);
                if (location.pathname !== redirectPath) {
                  return <Navigate to={redirectPath} replace />;
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error checking dynamic route customization:', e);
    }
  }

  return children;
};

const getPrefixForRole = (role) => {
  if (!role) return 'super_admin';
  if (role === 'consultant' || role === 'sales_agent') return 'agent';
  if (role === 'marketing') return 'marketing-manager';
  return role;
};

// Redirectors for un-prefixed detail/list paths
const LeadDetailsRedirect = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/leads/details/${id}`} replace />;
};

const ClientDetailsRedirect = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/customers/details/${id}`} replace />;
};

const ConsultationDetailsRedirect = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/consultations/details/${id}`} replace />;
};

const ConsultationsRedirect = () => {
  const { currentUser } = useAuth();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/consultations`} replace />;
};

const ConsultationsCalendarRedirect = () => {
  const { currentUser } = useAuth();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/consultations/calendar`} replace />;
};

const ClientsRedirect = () => {
  const { currentUser } = useAuth();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/customers`} replace />;
};

const LeadsRedirect = () => {
  const { currentUser } = useAuth();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/leads`} replace />;
};

const PaymentsRedirect = () => {
  const { currentUser } = useAuth();
  return <Navigate to={`/${getPrefixForRole(currentUser?.role)}/payments`} replace />;
};

const RootRedirect = () => {
  const { isAuthenticated, currentUser } = useAuth();
  if (isAuthenticated && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Route - Direct Login / Authenticated Dashboard */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/flight-landing" element={<Navigate to="/" replace />} />

      {/* Auth Shell Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Public Secure Client Intake Portal & Public Flight Deal Review (Unprotected) */}
      <Route path="/public/intake/client/:clientId" element={<ClientIntakeForm />} />
      <Route path="/public/intake" element={<LeadIntakeForm />} />
      <Route path="/deal/:dealId" element={<FlightDealReview />} />
      <Route path="/deals/:dealId" element={<FlightDealReview />} />
      <Route path="/public/deal/:dealId" element={<FlightDealReview />} />
      <Route path="/public/quote/:dealId" element={<FlightDealReview />} />

      {/* Client Portal removed — not used in flight booking flow */}

      {/* Main CRM Dashboard Shell Layout (Protected) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Core Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Un-prefixed fallback redirects for details / lists */}
        <Route path="/leads" element={<ProtectedRoute><LeadsRedirect /></ProtectedRoute>} />
        <Route path="/leads/details/:id" element={<ProtectedRoute><LeadDetailsRedirect /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><ClientsRedirect /></ProtectedRoute>} />
        <Route path="/clients/details/:id" element={<ProtectedRoute><ClientDetailsRedirect /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><ClientsRedirect /></ProtectedRoute>} />
        <Route path="/consultations" element={<ProtectedRoute><ConsultationsRedirect /></ProtectedRoute>} />
        <Route path="/consultations/calendar" element={<ProtectedRoute><ConsultationsCalendarRedirect /></ProtectedRoute>} />
        <Route path="/consultations/details/:id" element={<ProtectedRoute><ConsultationDetailsRedirect /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><PaymentsRedirect /></ProtectedRoute>} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/dashboard"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'sales_agent', 'super_admin']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/dashboard"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* New Travel CRM Role Dashboards */}
        <Route path="/:role/team_leader/dashboard" element={<Navigate to="/team_leader/dashboard" replace />} />
        <Route path="/:role/expert_team_leader/dashboard" element={<Navigate to="/expert_team_leader/dashboard" replace />} />
        <Route
          path="/team_leader/dashboard"
          element={
            <ProtectedRoute allowedRoles={['team_leader', 'super_admin']}>
              <TeamLeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expert_team_leader/dashboard"
          element={
            <ProtectedRoute allowedRoles={['expert_team_leader', 'super_admin']}>
              <ExpertTeamLeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/automation"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <AutomationEngine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sla-management"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <SlaManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications/all"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <CentralNotificationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-trail"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <AuditTrail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management-reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <ManagementReportingDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <DevelopmentRoadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <LeadManagementSuite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lead-distribution"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <LeadDistributionEngine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lead-lifecycle"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <LeadLifecycleSystem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/duplicate-leads"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <DuplicateLeadProtection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communication-center"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <CommunicationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calling-desk"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <CallingSoftphoneWorkspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/call-dispositions"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'team_leader', 'expert_team_leader', 'consultant', 'sales_agent', 'operations', 'marketing', 'finance']}>
              <MandatoryCallDispositionEngine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/permission-management"
          element={
            <ProtectedRoute>
              <FlexiblePermissionSystem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:role/permission-management"
          element={
            <ProtectedRoute>
              <FlexiblePermissionSystem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/customization"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <SuperAdminCustomization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customization"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <SuperAdminCustomization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flight_expert/dashboard"
          element={
            <ProtectedRoute allowedRoles={['flight_expert', 'super_admin']}>
              <FlightExpertDesk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticketing_agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ticketing_agent', 'super_admin']}>
              <TicketingAgentDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/social-inbox" element={<ProtectedRoute><SuperAdminSocialInbox /></ProtectedRoute>} />
        <Route path="/:role/social-inbox" element={<ProtectedRoute><SuperAdminSocialInbox /></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
        <Route path="/:role/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><SuperAdminClientList /></ProtectedRoute>} />
        <Route path="/:role/customers" element={<ProtectedRoute><SuperAdminClientList /></ProtectedRoute>} />
        <Route path="/agents" element={<ProtectedRoute><SuperAdminAgents /></ProtectedRoute>} />
        <Route path="/:role/agents" element={<ProtectedRoute><SuperAdminAgents /></ProtectedRoute>} />
        <Route path="/agents/performance" element={<ProtectedRoute><SuperAdminAgentsPerformance /></ProtectedRoute>} />
        <Route path="/:role/agents/performance" element={<ProtectedRoute><SuperAdminAgentsPerformance /></ProtectedRoute>} />
        <Route path="/consultations/calendar" element={<ProtectedRoute><SuperAdminCalendarView /></ProtectedRoute>} />
        <Route path="/:role/consultations/calendar" element={<ProtectedRoute><SuperAdminCalendarView /></ProtectedRoute>} />
        <Route path="/:role/quotes" element={<ProtectedRoute><QuotesPage /></ProtectedRoute>} />
        <Route path="/:role/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="/quotes" element={<ProtectedRoute><QuotesPage /></ProtectedRoute>} />
        <Route path="/flights" element={<ProtectedRoute><FlightRequestsPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="/:role/bookings/:id" element={<ProtectedRoute><BookingDetailsPage /></ProtectedRoute>} />
        <Route path="/:role/flights" element={<ProtectedRoute><FlightRequestsPage /></ProtectedRoute>} />
        <Route path="/:role/after-sales" element={<ProtectedRoute><AfterSalesWorkflow /></ProtectedRoute>} />
        <Route path="/after-sales" element={<ProtectedRoute><AfterSalesWorkflow /></ProtectedRoute>} />
        <Route path="/:role/qa-audits" element={<ProtectedRoute><QAAudits /></ProtectedRoute>} />
        <Route path="/qa-audits" element={<ProtectedRoute><QAAudits /></ProtectedRoute>} />
        <Route path="/:role/documents/verify" element={<ProtectedRoute><SuperAdminDocumentVerificationDashboard /></ProtectedRoute>} />
        <Route path="/documents/verify" element={<ProtectedRoute><SuperAdminDocumentVerificationDashboard /></ProtectedRoute>} />
        <Route path="/:role/ticketing" element={<ProtectedRoute><TicketingIssuance /></ProtectedRoute>} />
        <Route path="/ticketing" element={<ProtectedRoute><TicketingIssuance /></ProtectedRoute>} />
        <Route path="/:role/flight-alerts" element={<ProtectedRoute><FlightAlertsPage /></ProtectedRoute>} />
        <Route path="/flight-alerts" element={<ProtectedRoute><FlightAlertsPage /></ProtectedRoute>} />
        <Route path="/:role/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
        <Route path="/:role/payments/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
        <Route path="/:role/payments/refund-commission" element={<ProtectedRoute><SuperAdminRefundCommissionHub /></ProtectedRoute>} />
        <Route path="/:role/payments/:id" element={<ProtectedRoute><PaymentDetailsPage /></ProtectedRoute>} />
        <Route path="/finance/payments" element={<ProtectedRoute allowedRoles={['finance', 'super_admin']}><FinancePaymentDashboard /></ProtectedRoute>} />
        <Route path="/finance/payments/invoices" element={<ProtectedRoute allowedRoles={['finance', 'super_admin']}><InvoiceList /></ProtectedRoute>} />
        <Route path="/finance/payments/refund-commission" element={<ProtectedRoute allowedRoles={['finance', 'super_admin']}><SuperAdminRefundCommissionHub /></ProtectedRoute>} />

        <Route
          path="/super_admin/leads"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminLeadList />
            </ProtectedRoute>
          }
        />
        <Route path="/team_leader/leads" element={<ProtectedRoute allowedRoles={['team_leader', 'super_admin']}><SuperAdminLeadList /></ProtectedRoute>} />
        <Route
          path="/super_admin/leads/details/:id"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminLeadDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/consultations"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminConsultationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/consultations/details/:id"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminConsultationDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/consultations/calendar"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/clients"
          element={<Navigate to="/super_admin/customers" replace />}
        />
        <Route
          path="/super_admin/customers"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminClientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/clients/details/:id"
          element={<ClientDetailsRedirect />}
        />
        <Route
          path="/super_admin/customers/details/:id"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminClientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/agents"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/agents/performance"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminAgentsPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/active-cases"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminActiveCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/closed-cases"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminClosedCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/documents/verify"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDocumentVerificationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/marketing"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminMarketing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/payments"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminPaymentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/payments/refund-commission"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminRefundCommissionHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/documents/storage"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminStorageBackup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/customization"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminCustomization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/social-inbox"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminSocialInbox />
            </ProtectedRoute>
          }
        />
        <Route path="/:role/marketing-manager/dashboard" element={<Navigate to="/marketing-manager/dashboard" replace />} />
        <Route
          path="/marketing-manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'admin', 'super_admin']}>
              <MarketingDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Leads Module (Admins, Consultants, Operations, Team Leaders, Expert TLs) */}
        <Route
          path="/expert_team_leader/leads"
          element={
            <ProtectedRoute allowedRoles={['expert_team_leader', 'team_leader', 'admin', 'super_admin']}>
              <SuperAdminLeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expert_team_leader/leads/details/:id"
          element={
            <ProtectedRoute allowedRoles={['expert_team_leader', 'team_leader', 'admin', 'super_admin']}>
              <SuperAdminLeadDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'marketing']}>
              <SuperAdminLeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/leads"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <SuperAdminLeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/leads"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AgentLeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads/details/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <SuperAdminLeadDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/leads/details/:id"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <SuperAdminLeadDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/leads/details/:id"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <SuperAdminLeadDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/leads"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminLeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/leads"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminLeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/leads/details/:id"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminLeadDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/leads/details/:id"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminLeadDetails />
            </ProtectedRoute>
          }
        />

        {/* Consultations Module (Admins, Consultants, Operations) */}
        <Route
          path="/admin/consultations"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminConsultationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/consultations"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsConsultationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/consultations"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AgentConsultationList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/consultations/details/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminConsultationDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/consultations/details/:id"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsConsultationDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/consultations/details/:id"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AgentConsultationDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/consultations/calendar"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/consultations/calendar"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/consultations/calendar"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AgentCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/consultations"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminConsultationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/consultations"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminConsultationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/consultations/details/:id"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminConsultationDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/consultations/details/:id"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminConsultationDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/consultations/calendar"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/consultations/calendar"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminCalendarView />
            </ProtectedRoute>
          }
        />

        {/* Customers Module (Admins, Consultants, Operations, Team Leader, Expert TL) */}
        <Route path="/expert_team_leader/clients" element={<Navigate to="/expert_team_leader/customers" replace />} />
        <Route
          path="/expert_team_leader/customers"
          element={
            <ProtectedRoute allowedRoles={['expert_team_leader', 'team_leader', 'admin', 'super_admin']}>
              <SuperAdminClientList />
            </ProtectedRoute>
          }
        />
        <Route path="/expert_team_leader/clients/details/:id" element={<ClientDetailsRedirect />} />
        <Route
          path="/expert_team_leader/customers/details/:id"
          element={
            <ProtectedRoute allowedRoles={['expert_team_leader', 'team_leader', 'admin', 'super_admin']}>
              <SuperAdminClientDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/clients" element={<Navigate to="/admin/customers" replace />} />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminClientList />
            </ProtectedRoute>
          }
        />
        <Route path="/team_leader/clients" element={<Navigate to="/team_leader/customers" replace />} />
        <Route path="/team_leader/customers" element={<ProtectedRoute allowedRoles={['team_leader', 'super_admin']}><AgentClientList /></ProtectedRoute>} />
        <Route path="/operations/clients" element={<Navigate to="/operations/customers" replace />} />
        <Route
          path="/operations/customers"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsClientList />
            </ProtectedRoute>
          }
        />
        <Route path="/agent/clients" element={<Navigate to="/agent/customers" replace />} />
        <Route
          path="/agent/customers"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AgentClientList />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/clients/details/:id" element={<ClientDetailsRedirect />} />
        <Route
          path="/admin/customers/details/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminClientDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/operations/clients/details/:id" element={<ClientDetailsRedirect />} />
        <Route
          path="/operations/customers/details/:id"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsClientDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/agent/clients/details/:id" element={<ClientDetailsRedirect />} />
        <Route
          path="/agent/customers/details/:id"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AgentClientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/customers/details/:id"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AgentClientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/clients"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminClientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/clients"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminClientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/clients/details/:id"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminClientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/clients/details/:id"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminClientDetails />
            </ProtectedRoute>
          }
        />

        {/* Agents Module (Admins, Operations) */}
        <Route
          path="/admin/agents"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/agents"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents/performance"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminAgentsPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/agents/performance"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsAgentsPerformance />
            </ProtectedRoute>
          }
        />
        <Route path="/agents" element={<ProtectedRoute allowedRoles={['team_leader', 'super_admin']}><TeamList /></ProtectedRoute>} />
        <Route path="/agents/performance" element={<ProtectedRoute allowedRoles={['team_leader', 'super_admin']}><AllAgentsPerformance /></ProtectedRoute>} />
        <Route
          path="/agent/agents"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <Agents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/agents"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/agents"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/agents/performance"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AllAgentsPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/agents/performance"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AllAgentsPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/agents/performance"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AllAgentsPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/profile/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'operations', 'super_admin', 'consultant', 'finance', 'marketing']}>
              <StaffProfile />
            </ProtectedRoute>
          }
        />

        {/* Active Cases Processing Module (Admins, Operations) */}
        <Route
          path="/admin/active-cases"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminActiveCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/active-cases"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsActiveCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/closed-cases"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminClosedCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/closed-cases"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsClosedCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/documents/verify"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDocumentVerificationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/documents/verify"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsDocumentVerificationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/active-cases"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <ActiveCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/active-cases"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminActiveCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/active-cases"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminActiveCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/closed-cases"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <ClosedCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/closed-cases"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminClosedCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/closed-cases"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminClosedCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/documents/verify"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <AdminDocumentVerificationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/documents/verify"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminDocumentVerificationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/documents/verify"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminDocumentVerificationDashboard />
            </ProtectedRoute>
          }
        />

        {/* Marketing Campaigns Module (Admins, Operations, Marketing) */}
        <Route
          path="/admin/marketing"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'marketing']}>
              <SuperAdminMarketing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/marketing"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <SuperAdminMarketing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/marketing"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'super_admin']}>
              <SuperAdminMarketing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/marketing"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <SuperAdminMarketing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <SuperAdminMarketing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/marketing"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <SuperAdminMarketing />
            </ProtectedRoute>
          }
        />

        {/* Legacy specific routes commented out since we use dynamic :role routes
        <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminPaymentDashboard /></ProtectedRoute>} />
        <Route path="/finance/payments" element={<ProtectedRoute allowedRoles={['finance', 'super_admin']}><FinancePaymentDashboard /></ProtectedRoute>} />
        */}
        <Route
          path="/payments/invoices"
          element={
            <ProtectedRoute allowedRoles={['admin', 'finance', 'super_admin', 'operations', 'consultant', 'marketing']}>
              <InvoiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/invoice-details/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'finance', 'super_admin', 'operations', 'consultant', 'marketing']}>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />

        {/* Social Inbox (Admins, Consultants, Operations) */}
        <Route
          path="/admin/social-inbox"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'marketing']}>
              <AdminSocialInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/social-inbox"
          element={
            <ProtectedRoute allowedRoles={['operations', 'super_admin']}>
              <OperationsSocialInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/social-inbox"
          element={
            <ProtectedRoute allowedRoles={['consultant']}>
              <AgentSocialInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/social-inbox"
          element={
            <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
              <AdminSocialInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-manager/social-inbox"
          element={
            <ProtectedRoute allowedRoles={['marketing', 'super_admin']}>
              <AdminSocialInbox />
            </ProtectedRoute>
          }
        />

        {/* Integrations (Admin, Super Admin) */}
        <Route
          path="/integrations"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'operations', 'consultant', 'finance', 'marketing']}>
              <Integrations />
            </ProtectedRoute>
          }
        />

        {/* Settings (Admins, Finance, Operations) */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['admin', 'finance', 'operations', 'super_admin', 'marketing', 'consultant']}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
