import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { currentUser, isAuthenticated, login, logout, changeRole, refreshUser } = useAuthContext();

  const hasRole = (allowedRoles) => {
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isSalesAgent = currentUser?.role === 'sales_agent' || currentUser?.role === 'consultant'; // Keep consultant fallback for existing mock data
  const isFinance = currentUser?.role === 'finance';
  const isOperations = currentUser?.role === 'operations';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isMarketing = currentUser?.role === 'marketing';
  const isTeamLeader = currentUser?.role === 'team_leader';
  const isFlightExpert = currentUser?.role === 'flight_expert';
  const isTicketingAgent = currentUser?.role === 'ticketing_agent';

  return {
    currentUser,
    isAuthenticated,
    hasRole,
    changeRole,
    logout,
    login,
    refreshUser,
    isAdmin,
    isSalesAgent,
    isConsultant: isSalesAgent, // Fallback alias
    isFinance,
    isOperations,
    isSuperAdmin,
    isMarketing,
    isTeamLeader,
    isFlightExpert,
    isTicketingAgent
  };
};

export default useAuth;
