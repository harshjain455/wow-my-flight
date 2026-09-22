// ============================================================================
// FLIGHT BOOKING CRM – ENTERPRISE FLEXIBLE PERMISSION & ACCESS CONTROL SERVICE
// Role-Based Access Control (RBAC) + Scope-Based Access (Own, Team, Dept, Branch, All)
// ============================================================================

export const ACCESS_SCOPES = [
  { key: 'own', label: 'Own Records', description: 'Only records created or assigned to logged-in user' },
  { key: 'team', label: 'Own Team', description: 'Records belonging to user\'s assigned team' },
  { key: 'department', label: 'Own Department', description: 'Records belonging to user\'s department' },
  { key: 'branch', label: 'Own Branch', description: 'Records from user\'s office / branch location' },
  { key: 'all', label: 'All Records', description: 'Full organization-wide access across all branches' }
];

export const PERMISSION_MODULES = [
  {
    id: 'leads',
    name: 'Lead Management',
    description: 'Lead generation, assignment, status tracking, duplicate protection & intake',
    permissions: [
      { key: 'leads_view', label: 'View Leads', defaultScope: 'own' },
      { key: 'leads_create', label: 'Create Lead', defaultScope: 'own' },
      { key: 'leads_edit', label: 'Edit Lead', defaultScope: 'own' },
      { key: 'leads_assign', label: 'Assign Lead', defaultScope: 'team' },
      { key: 'leads_reassign', label: 'Reassign Lead', defaultScope: 'team' },
      { key: 'leads_delete', label: 'Delete Lead', defaultScope: 'branch' },
      { key: 'leads_export', label: 'Export Leads', defaultScope: 'department' },
      { key: 'leads_merge', label: 'Merge Duplicate Leads', defaultScope: 'team' }
    ]
  },
  {
    id: 'customers',
    name: 'Customer 360',
    description: 'Customer profiles, travel history, documents & passport verifications',
    permissions: [
      { key: 'customers_view', label: 'View Customer Profile', defaultScope: 'department' },
      { key: 'customers_create', label: 'Create Customer', defaultScope: 'own' },
      { key: 'customers_edit', label: 'Edit Customer Details', defaultScope: 'own' },
      { key: 'customers_delete', label: 'Delete Customer Record', defaultScope: 'all' },
      { key: 'customers_docs_view', label: 'View Customer Documents', defaultScope: 'department' },
      { key: 'customers_docs_upload', label: 'Upload Customer Documents', defaultScope: 'own' }
    ]
  },
  {
    id: 'calls',
    name: 'Calling & Softphone',
    description: 'WebRTC softphone, call logs, disposition forms, audio recordings & call transfers',
    permissions: [
      { key: 'calls_make', label: 'Make Outbound Call', defaultScope: 'own' },
      { key: 'calls_receive', label: 'Receive Inbound Call', defaultScope: 'own' },
      { key: 'calls_transfer', label: 'Transfer Active Call', defaultScope: 'team' },
      { key: 'calls_recording_view', label: 'View Call Recording', defaultScope: 'team' },
      { key: 'calls_recording_download', label: 'Download Recording Audio', defaultScope: 'branch' },
      { key: 'calls_recording_delete', label: 'Delete Audio Recording', defaultScope: 'all' },
      { key: 'calls_schedule_callback', label: 'Schedule Callback', defaultScope: 'own' }
    ]
  },
  {
    id: 'quotes',
    name: 'Quotes & Itineraries',
    description: 'GDS flight quotes, WhatsApp itinerary dispatch, discount requests & approvals',
    permissions: [
      { key: 'quotes_view', label: 'View Quotes', defaultScope: 'own' },
      { key: 'quotes_create', label: 'Create Flight Quote', defaultScope: 'own' },
      { key: 'quotes_edit', label: 'Modify Quote Itinerary', defaultScope: 'own' },
      { key: 'quotes_discount_request', label: 'Request Special Discount', defaultScope: 'own' },
      { key: 'quotes_discount_approve', label: 'Approve Discount Override', defaultScope: 'team' },
      { key: 'quotes_delete', label: 'Delete Flight Quote', defaultScope: 'branch' }
    ]
  },
  {
    id: 'bookings',
    name: 'Booking Management',
    description: 'Active bookings, Sabre PNR tracking, itinerary changes & cancellation requests',
    permissions: [
      { key: 'bookings_view', label: 'View Booking Record', defaultScope: 'department' },
      { key: 'bookings_create', label: 'Create New Booking', defaultScope: 'own' },
      { key: 'bookings_modify', label: 'Modify Active Booking', defaultScope: 'own' },
      { key: 'bookings_cancel', label: 'Cancel Booking', defaultScope: 'team' },
      { key: 'bookings_approve_changes', label: 'Approve Booking Changes', defaultScope: 'team' }
    ]
  },
  {
    id: 'ticketing',
    name: 'Ticketing & GDS Issuance',
    description: 'Sabre/Amadeus e-ticket issuance, ticket voids, reissues & waiver code overrides',
    permissions: [
      { key: 'ticketing_view', label: 'View Ticket Queue', defaultScope: 'department' },
      { key: 'ticketing_issue', label: 'Issue E-Ticket', defaultScope: 'department' },
      { key: 'ticketing_void', label: 'Void E-Ticket (24h Same Day)', defaultScope: 'team' },
      { key: 'ticketing_reissue', label: 'Reissue Ticket / Voluntary Shift', defaultScope: 'team' },
      { key: 'ticketing_cancel', label: 'Cancel Ticketed PNR', defaultScope: 'branch' }
    ]
  },
  {
    id: 'payments',
    name: 'Payments & Refunds',
    description: 'Payment links, credit card auths, refund requests & supplier commissions',
    permissions: [
      { key: 'payments_view', label: 'View Payment Hub', defaultScope: 'department' },
      { key: 'payments_link_create', label: 'Create Payment Link', defaultScope: 'own' },
      { key: 'payments_record', label: 'Record Manual Payment', defaultScope: 'department' },
      { key: 'payments_refund_request', label: 'Request Customer Refund', defaultScope: 'own' },
      { key: 'payments_refund_approve', label: 'Approve Customer Refund', defaultScope: 'branch' },
      { key: 'payments_supplier_view', label: 'View Supplier Net Fares', defaultScope: 'department' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Financial ledger, net margin analytics, gross profit reporting & chargebacks',
    permissions: [
      { key: 'finance_view_dashboard', label: 'View Finance Dashboard', defaultScope: 'branch' },
      { key: 'finance_revenue_reports', label: 'View Revenue Reports', defaultScope: 'branch' },
      { key: 'finance_gross_profit', label: 'View Gross Profit & Net Margin', defaultScope: 'all' },
      { key: 'finance_export_reports', label: 'Export Finance Reports', defaultScope: 'all' },
      { key: 'finance_manage_chargebacks', label: 'Manage Bank Chargebacks', defaultScope: 'all' }
    ]
  },
  {
    id: 'qa_sla',
    name: 'QA Audits & SLA Engine',
    description: 'Booking QA audits, agent coaching checklists, SLA breaches & executive overrides',
    permissions: [
      { key: 'qa_view', label: 'View QA Audit Center', defaultScope: 'team' },
      { key: 'qa_checklist_complete', label: 'Complete QA Audit Checklist', defaultScope: 'team' },
      { key: 'qa_notes_edit', label: 'Edit QA Coaching Notes', defaultScope: 'team' },
      { key: 'sla_view', label: 'View SLA Monitoring', defaultScope: 'department' },
      { key: 'sla_override', label: 'Override SLA Countdown', defaultScope: 'branch' },
      { key: 'sla_reports_view', label: 'View SLA Breach Reports', defaultScope: 'branch' }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing & ROI',
    description: 'Ad campaign performance, CPL/CPB analytics, UTM parameters & retargeting',
    permissions: [
      { key: 'marketing_view_dashboard', label: 'View Marketing ROI Dashboard', defaultScope: 'department' },
      { key: 'marketing_campaign_manage', label: 'Create / Edit Campaigns', defaultScope: 'department' },
      { key: 'marketing_utm_builder', label: 'Configure UTM Tracking Links', defaultScope: 'department' },
      { key: 'marketing_export', label: 'Export Marketing ROI CSV', defaultScope: 'all' }
    ]
  },
  {
    id: 'automation',
    name: 'Workflow & Automation',
    description: 'Event triggers, automated WhatsApp/SMS sequences & lead routing rules',
    permissions: [
      { key: 'automation_view', label: 'View Automation Workflows', defaultScope: 'department' },
      { key: 'automation_create', label: 'Create Workflow Rule', defaultScope: 'branch' },
      { key: 'automation_toggle', label: 'Enable / Pause Automation Rules', defaultScope: 'branch' },
      { key: 'automation_routing_config', label: 'Configure Lead Routing Engine', defaultScope: 'all' }
    ]
  },
  {
    id: 'user_mgmt',
    name: 'User Management',
    description: 'Staff accounts, role assignments, custom permission overrides & password resets',
    permissions: [
      { key: 'users_view', label: 'View Staff Directory', defaultScope: 'department' },
      { key: 'users_create', label: 'Create New User Account', defaultScope: 'all' },
      { key: 'users_edit', label: 'Edit User Profile & Role', defaultScope: 'all' },
      { key: 'users_disable', label: 'Disable / Deactivate User', defaultScope: 'all' },
      { key: 'users_delete', label: 'Delete User Account', defaultScope: 'all' },
      { key: 'users_reset_password', label: 'Reset User Password', defaultScope: 'all' },
      { key: 'users_assign_roles', label: 'Assign Roles to Staff', defaultScope: 'all' },
      { key: 'users_configure_permissions', label: 'Configure User Permission Overrides', defaultScope: 'all' }
    ]
  },
  {
    id: 'system_settings',
    name: 'System & API Config',
    description: 'Sabre GDS API credentials, IVR phone routing, payment gateways & suppliers',
    permissions: [
      { key: 'system_api_config', label: 'Configure API Integrations (Sabre/Amadeus)', defaultScope: 'all' },
      { key: 'system_notification_rules', label: 'Configure System Notification Rules', defaultScope: 'all' },
      { key: 'system_sla_rules', label: 'Configure SLA Rule Benchmarks', defaultScope: 'all' },
      { key: 'system_ivr_config', label: 'Configure Softphone IVR Phone Tree', defaultScope: 'all' },
      { key: 'system_suppliers_manage', label: 'Manage Airline & Consolidator Suppliers', defaultScope: 'all' }
    ]
  },
  {
    id: 'audit_logs',
    name: 'Audit Trail & Security',
    description: 'System action logs, permission modification history & sensitive data audits',
    permissions: [
      { key: 'audit_view', label: 'View Audit Trail', defaultScope: 'all' },
      { key: 'audit_export', label: 'Export Audit Logs to CSV', defaultScope: 'all' },
      { key: 'audit_archive', label: 'Archive Historical Audit Logs', defaultScope: 'all' },
      { key: 'audit_sensitive_view', label: 'View Sensitive Financial / Permission Logs', defaultScope: 'all' }
    ]
  }
];

// ============================================================================
// STANDARD ROLES DEFINITION
// ============================================================================
export const INITIAL_ROLES = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Unrestricted organizational access across all branches, systems, APIs, and security controls.',
    isCustom: false,
    userCount: 2,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => ({ key: p.key, enabled: true, scope: 'all' }))
    )
  },
  {
    id: 'admin',
    name: 'General Manager (Admin)',
    description: 'Full operational authority over sales, ticketing, finance, staff and reports across all branches.',
    isCustom: false,
    userCount: 4,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => ({
        key: p.key,
        enabled: !p.key.startsWith('system_api') && !p.key.startsWith('audit_archive'),
        scope: 'all'
      }))
    )
  },
  {
    id: 'expert_team_leader',
    name: 'Expert Team Leader',
    description: 'Senior escalation authority for VIP clients, complex reissues, discount overrides & executive SLAs.',
    isCustom: false,
    userCount: 3,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => {
        const isAllowed = !p.key.startsWith('system_') && !p.key.startsWith('users_delete') && !p.key.startsWith('users_configure');
        return { key: p.key, enabled: isAllowed, scope: p.key.startsWith('leads_') || p.key.startsWith('quotes_') ? 'team' : 'branch' };
      })
    )
  },
  {
    id: 'team_leader',
    name: 'Team Leader',
    description: 'Operational team supervisor managing lead distribution, rep call barge-in, discount approvals & QA.',
    isCustom: false,
    userCount: 6,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => {
        const isAllowed = p.key.startsWith('leads_') || p.key.startsWith('customers_') || p.key.startsWith('calls_') || p.key.startsWith('quotes_') || p.key.startsWith('bookings_') || p.key.startsWith('qa_') || p.key.startsWith('sla_');
        return { key: p.key, enabled: isAllowed, scope: 'team' };
      })
    )
  },
  {
    id: 'consultant',
    name: 'Sales Agent',
    description: 'Frontline sales representative creating quotes, managing assigned leads, and handling softphone calls.',
    isCustom: false,
    userCount: 18,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => {
        const isAllowed = ['leads_view', 'leads_create', 'leads_edit', 'customers_view', 'customers_create', 'calls_make', 'calls_receive', 'calls_schedule_callback', 'quotes_view', 'quotes_create', 'quotes_edit', 'quotes_discount_request', 'bookings_view', 'bookings_create', 'payments_link_create'].includes(p.key);
        return { key: p.key, enabled: isAllowed, scope: 'own' };
      })
    )
  },
  {
    id: 'ticketing_agent',
    name: 'Ticketing Agent (GDS)',
    description: 'GDS specialist issuing electronic tickets, voiding same-day PNRs, and processing voluntary reissues.',
    isCustom: false,
    userCount: 5,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => {
        const isAllowed = p.key.startsWith('ticketing_') || p.key.startsWith('bookings_') || p.key.startsWith('customers_docs');
        return { key: p.key, enabled: isAllowed, scope: 'department' };
      })
    )
  },
  {
    id: 'finance',
    name: 'Finance & Accounts Agent',
    description: 'Financial accountant managing payment links, gross profit reports, refund approvals & chargebacks.',
    isCustom: false,
    userCount: 4,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => {
        const isAllowed = p.key.startsWith('payments_') || p.key.startsWith('finance_') || p.key.startsWith('bookings_view');
        return { key: p.key, enabled: isAllowed, scope: 'all' };
      })
    )
  },
  {
    id: 'qa_agent',
    name: 'QA & Compliance Auditor',
    description: 'Quality assurance officer auditing agent calls, fare rules compliance, and coaching checklists.',
    isCustom: false,
    userCount: 3,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => {
        const isAllowed = p.key.startsWith('qa_') || p.key.startsWith('sla_') || p.key.startsWith('calls_recording_view');
        return { key: p.key, enabled: isAllowed, scope: 'branch' };
      })
    )
  },
  {
    id: 'marketing',
    name: 'Marketing Manager',
    description: 'Marketing strategist managing campaigns, CPL/CPB metrics, UTM links, and automation sequences.',
    isCustom: false,
    userCount: 2,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => {
        const isAllowed = p.key.startsWith('marketing_') || p.key.startsWith('automation_') || p.key === 'leads_view';
        return { key: p.key, enabled: isAllowed, scope: 'department' };
      })
    )
  },
  {
    id: 'readonly',
    name: 'Read-Only Auditor',
    description: 'Observer role with view-only inspection access for external compliance & legal auditors.',
    isCustom: false,
    userCount: 1,
    permissions: PERMISSION_MODULES.flatMap(m =>
      m.permissions.map(p => ({ key: p.key, enabled: p.key.endsWith('_view') || p.key.startsWith('finance_view') || p.key.startsWith('leads_view'), scope: 'branch' }))
    )
  }
];

export const INITIAL_HIERARCHY = {
  company: 'WOW MY FLIGHT Travel Agency Group',
  branches: [
    {
      id: 'branch-newyork',
      name: 'New York HQ (USA)',
      code: 'NYC-HQ',
      departments: [
        {
          id: 'dept-sales-usa',
          name: 'North America Sales Dept',
          teams: [
            { id: 'team-alpha', name: 'Alpha Sales Team', leader: 'Michael Chang' },
            { id: 'team-beta', name: 'VIP Concierge Team', leader: 'Sofia Rodriguez' }
          ]
        },
        {
          id: 'dept-ops-usa',
          name: 'GDS Ticketing & Fulfillment Ops',
          teams: [
            { id: 'team-ticketing', name: 'Sabre Issuance Desk', leader: 'Alex Miller' }
          ]
        }
      ]
    },
    {
      id: 'branch-delhi',
      name: 'New Delhi Operational Center (India)',
      code: 'DEL-OPS',
      departments: [
        {
          id: 'dept-sales-india',
          name: 'International Sales & Support',
          teams: [
            { id: 'team-gamma', name: 'Global Direct Sales', leader: 'Sarah Jenkins' }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// LOCAL STORAGE KEYS & STORAGE HELPERS
// ============================================================================
const ROLES_STORAGE_KEY = 'crm-rbac-roles-v1';
const USER_OVERRIDES_KEY = 'crm-rbac-user-overrides-v1';
const AUDIT_LOGS_KEY = 'crm-rbac-audit-logs-v1';

export const permissionService = {
  // Get all roles
  getRoles: () => {
    try {
      const saved = localStorage.getItem(ROLES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error loading custom roles, resetting to initial dataset:', e);
    }
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(INITIAL_ROLES));
    return INITIAL_ROLES;
  },

  // Save single role (create or edit)
  saveRole: (roleData, modifierName = 'Super Admin') => {
    const roles = permissionService.getRoles();
    const existingIndex = roles.findIndex(r => r.id === roleData.id);
    let updatedRoles = [];

    if (existingIndex !== -1) {
      const oldRole = roles[existingIndex];
      updatedRoles = [...roles];
      updatedRoles[existingIndex] = { ...oldRole, ...roleData };
      permissionService.logAudit({
        targetType: 'Role',
        targetId: roleData.id,
        targetName: roleData.name,
        action: 'EDIT_ROLE',
        modifiedBy: modifierName,
        details: `Updated permissions/scopes for role "${roleData.name}"`,
        reason: 'Administrative RBAC Policy Update'
      });
    } else {
      const newRole = {
        id: roleData.id || `role_custom_${Date.now()}`,
        name: roleData.name,
        description: roleData.description || 'Custom configured role',
        isCustom: true,
        userCount: 0,
        permissions: roleData.permissions
      };
      updatedRoles = [...roles, newRole];
      permissionService.logAudit({
        targetType: 'Role',
        targetId: newRole.id,
        targetName: newRole.name,
        action: 'CREATE_ROLE',
        modifiedBy: modifierName,
        details: `Created new custom role "${newRole.name}" with ${newRole.permissions.filter(p => p.enabled).length} enabled permissions`,
        reason: 'New Custom Department / Team Onboarding'
      });
    }

    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updatedRoles));
    return updatedRoles;
  },

  // Clone an existing role
  cloneRole: (sourceRoleId, newRoleName, modifierName = 'Super Admin') => {
    const roles = permissionService.getRoles();
    const source = roles.find(r => r.id === sourceRoleId);
    if (!source) throw new Error('Source role not found');

    const clonedRole = {
      id: `role_clone_${Date.now()}`,
      name: newRoleName,
      description: `Cloned from ${source.name}. ${source.description}`,
      isCustom: true,
      userCount: 0,
      permissions: JSON.parse(JSON.stringify(source.permissions))
    };

    const updatedRoles = [...roles, clonedRole];
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updatedRoles));

    permissionService.logAudit({
      targetType: 'Role',
      targetId: clonedRole.id,
      targetName: clonedRole.name,
      action: 'CLONE_ROLE',
      modifiedBy: modifierName,
      details: `Cloned role "${source.name}" to create new role "${clonedRole.name}"`,
      reason: 'Role Cloning Strategy'
    });

    return clonedRole;
  },

  // Delete custom role
  deleteRole: (roleId, modifierName = 'Super Admin') => {
    const roles = permissionService.getRoles();
    const target = roles.find(r => r.id === roleId);
    if (!target) return roles;
    if (!target.isCustom) throw new Error('System built-in roles cannot be deleted.');

    const updatedRoles = roles.filter(r => r.id !== roleId);
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updatedRoles));

    permissionService.logAudit({
      targetType: 'Role',
      targetId: roleId,
      targetName: target.name,
      action: 'DELETE_ROLE',
      modifiedBy: modifierName,
      details: `Deleted custom role "${target.name}"`,
      reason: 'Deprecated Role Removal'
    });

    return updatedRoles;
  },

  // Get user-specific overrides
  getUserOverrides: () => {
    try {
      const saved = localStorage.getItem(USER_OVERRIDES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading user overrides:', e);
    }
    return {};
  },

  // Save specific user overrides
  saveUserOverride: (userId, userName, overrides, modifierName = 'Super Admin') => {
    const allOverrides = permissionService.getUserOverrides();
    
    allOverrides[userId] = overrides;
    localStorage.setItem(USER_OVERRIDES_KEY, JSON.stringify(allOverrides));

    permissionService.logAudit({
      targetType: 'UserOverride',
      targetId: userId,
      targetName: userName,
      action: 'USER_OVERRIDE_UPDATE',
      modifiedBy: modifierName,
      details: `Configured ${overrides.length} custom permission overrides for user ${userName}`,
      reason: 'Individual User Job Duty Expansion'
    });

    return allOverrides;
  },

  // Log Audit Entry
  logAudit: (entry) => {
    try {
      const saved = localStorage.getItem(AUDIT_LOGS_KEY);
      const logs = saved ? JSON.parse(saved) : [];
      const newLog = {
        id: `AUD-PERM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        formattedTime: new Date().toLocaleString(),
        ...entry
      };
      const updated = [newLog, ...logs].slice(0, 100);
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error logging permission audit entry:', e);
    }
  },

  // Get Audit Logs
  getAuditLogs: () => {
    try {
      const saved = localStorage.getItem(AUDIT_LOGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading permission audit logs:', e);
    }
    return [];
  },

  // Evaluate if user has specific permission & scope
  checkUserPermission: (user, permissionKey) => {
    if (!user) return { allowed: false, scope: 'none', reason: 'No authenticated user session' };
    
    // Super Admin has full unrestricted access
    if (user.role === 'super_admin') {
      return { allowed: true, scope: 'all', isSuperAdmin: true };
    }

    // 1. Check user-level overrides first
    const allOverrides = permissionService.getUserOverrides();
    const userOverrides = allOverrides[user.id] || [];
    const override = userOverrides.find(o => o.key === permissionKey);

    if (override) {
      return {
        allowed: !!override.enabled,
        scope: override.scope || 'own',
        isOverride: true,
        source: 'User Custom Override'
      };
    }

    // 2. Check base role permissions
    const roles = permissionService.getRoles();
    const role = roles.find(r => r.id === user.role);
    if (!role) {
      return { allowed: false, scope: 'none', reason: `User role "${user.role}" not found in system` };
    }

    const perm = role.permissions.find(p => p.key === permissionKey);
    if (!perm || !perm.enabled) {
      return { allowed: false, scope: 'none', source: `Role (${role.name})` };
    }

    return {
      allowed: true,
      scope: perm.scope || 'own',
      source: `Role (${role.name})`
    };
  },

  // Export Matrix Report to CSV string
  exportMatrixCSV: () => {
    const roles = permissionService.getRoles();
    const headers = ['Module', 'Permission Key', 'Permission Label', ...roles.map(r => r.name)];
    
    const rows = [headers.join(',')];

    PERMISSION_MODULES.forEach(mod => {
      mod.permissions.forEach(p => {
        const row = [
          `"${mod.name}"`,
          `"${p.key}"`,
          `"${p.label}"`
        ];
        roles.forEach(role => {
          const rolePerm = role.permissions.find(rp => rp.key === p.key);
          if (rolePerm && rolePerm.enabled) {
            row.push(`"ENABLED (${rolePerm.scope.toUpperCase()})"`);
          } else {
            row.push('"DISABLED"');
          }
        });
        rows.push(row.join(','));
      });
    });

    return rows.join('\n');
  }
};
