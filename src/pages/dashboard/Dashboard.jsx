import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Dashboard = () => {
  const { isAdmin, isOperations, isConsultant, isFinance, isSuperAdmin, isMarketing, isTeamLeader, isFlightExpert, isTicketingAgent } = useAuth();
  const location = useLocation();

  const getRolePrefix = () => {
    if (isSuperAdmin) return 'super_admin';
    if (isMarketing) return 'marketing-manager';
    if (isAdmin) return 'admin';
    if (isOperations) return 'operations';
    if (isConsultant) return 'agent';
    if (isFinance) return 'finance';
    if (isTeamLeader) return 'team_leader';
    if (isFlightExpert) return 'flight_expert';
    if (isTicketingAgent) return 'ticketing_agent';
    return '';
  };

  const prefix = getRolePrefix();

  if (!prefix) {
    return <Navigate to="/login" replace state={location.state} />;
  }

  // Determine the target sub-route based on where they came from
  const currentPath = location.pathname;
  
  if (currentPath.startsWith('/clients')) {
    if (isFinance) return <Navigate to="/finance/dashboard" replace state={location.state} />;
    if (isSuperAdmin) return <Navigate to="/super_admin/clients" replace state={location.state} />;
    if (isAdmin) return <Navigate to="/admin/clients" replace state={location.state} />;
    return <Navigate to={`/${prefix}/clients`} replace state={location.state} />;
  }
  
  if (currentPath.startsWith('/leads')) {
    if (isFinance) return <Navigate to="/finance/dashboard" replace state={location.state} />;
    if (isSuperAdmin) return <Navigate to="/super_admin/leads" replace state={location.state} />;
    if (isAdmin) return <Navigate to="/admin/leads" replace state={location.state} />;
    return <Navigate to={`/${prefix}/leads`} replace state={location.state} />;
  }

  // Default is dashboard redirect
  if (isSuperAdmin) return <Navigate to="/super_admin/dashboard" replace state={location.state} />;
  if (isMarketing) return <Navigate to="/marketing-manager/dashboard" replace state={location.state} />;
  if (isTeamLeader) return <Navigate to="/team_leader/dashboard" replace state={location.state} />;
  if (isFlightExpert) return <Navigate to="/flight_expert/dashboard" replace state={location.state} />;
  if (isTicketingAgent) return <Navigate to="/ticketing_agent/dashboard" replace state={location.state} />;
  return <Navigate to={`/${prefix}/dashboard`} replace state={location.state} />;
};

export default Dashboard;

