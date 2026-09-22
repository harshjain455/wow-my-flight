import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { permissionService } from '../services/permissionService';

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [roles, setRoles] = useState(() => permissionService.getRoles());
  const [userOverrides, setUserOverrides] = useState(() => permissionService.getUserOverrides());
  const [auditLogs, setAuditLogs] = useState(() => permissionService.getAuditLogs());

  // Function to refresh state across components
  const refreshPermissions = useCallback(() => {
    setRoles(permissionService.getRoles());
    setUserOverrides(permissionService.getUserOverrides());
    setAuditLogs(permissionService.getAuditLogs());
  }, []);

  // Sync on mount & storage events
  useEffect(() => {
    const handleStorageChange = () => {
      refreshPermissions();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshPermissions]);

  // Main evaluation helper: hasPermission(permissionKey)
  const hasPermission = useCallback((permissionKey) => {
    return permissionService.checkUserPermission(currentUser, permissionKey);
  }, [currentUser]);

  const value = {
    roles,
    userOverrides,
    auditLogs,
    refreshPermissions,
    hasPermission,
    checkUserPermission: (user, permKey) => permissionService.checkUserPermission(user, permKey),
    saveRole: (roleData) => {
      const res = permissionService.saveRole(roleData, currentUser?.name || 'Admin');
      refreshPermissions();
      return res;
    },
    cloneRole: (sourceRoleId, newRoleName) => {
      const res = permissionService.cloneRole(sourceRoleId, newRoleName, currentUser?.name || 'Admin');
      refreshPermissions();
      return res;
    },
    deleteRole: (roleId) => {
      const res = permissionService.deleteRole(roleId, currentUser?.name || 'Admin');
      refreshPermissions();
      return res;
    },
    saveUserOverride: (userId, userName, overrides) => {
      const res = permissionService.saveUserOverride(userId, userName, overrides, currentUser?.name || 'Admin');
      refreshPermissions();
      return res;
    }
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
