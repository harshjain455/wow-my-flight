const fs = require('fs');
const path = require('path');

const filesToCopy = [
  { src: 'src/pages/leads/AdminLeadList.jsx', dest: 'src/pages/leads/SuperAdminLeadList.jsx' },
  { src: 'src/pages/leads/AdminLeadDetails.jsx', dest: 'src/pages/leads/SuperAdminLeadDetails.jsx' },
  { src: 'src/pages/clients/AdminClientList.jsx', dest: 'src/pages/clients/SuperAdminClientList.jsx' },
  { src: 'src/pages/clients/AdminClientDetails.jsx', dest: 'src/pages/clients/SuperAdminClientDetails.jsx' },
  { src: 'src/pages/clients/AdminClosedCases.jsx', dest: 'src/pages/clients/SuperAdminClosedCases.jsx' },
  { src: 'src/pages/documents/AdminDocumentVerificationDashboard.jsx', dest: 'src/pages/documents/SuperAdminDocumentVerificationDashboard.jsx' },
  { src: 'src/pages/team/AdminAgents.jsx', dest: 'src/pages/team/SuperAdminAgents.jsx' },
  { src: 'src/pages/team/AdminActiveCases.jsx', dest: 'src/pages/team/SuperAdminActiveCases.jsx' },
  { src: 'src/pages/team/AdminAgentsPerformance.jsx', dest: 'src/pages/team/SuperAdminAgentsPerformance.jsx' },
  { src: 'src/pages/marketing/AdminMarketing.jsx', dest: 'src/pages/marketing/SuperAdminMarketing.jsx' },
  { src: 'src/pages/social/AdminSocialInbox.jsx', dest: 'src/pages/social/SuperAdminSocialInbox.jsx' },
  { src: 'src/pages/consultations/AdminConsultationList.jsx', dest: 'src/pages/consultations/SuperAdminConsultationList.jsx' },
  { src: 'src/pages/consultations/AdminConsultationDetails.jsx', dest: 'src/pages/consultations/SuperAdminConsultationDetails.jsx' },
  { src: 'src/pages/consultations/AdminCalendarView.jsx', dest: 'src/pages/consultations/SuperAdminCalendarView.jsx' },
  { src: 'src/pages/payments/AdminPaymentDashboard.jsx', dest: 'src/pages/payments/SuperAdminPaymentDashboard.jsx' }
];

filesToCopy.forEach(({ src, dest }) => {
  const srcPath = path.resolve(__dirname, src);
  const destPath = path.resolve(__dirname, dest);

  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${src}`);
    return;
  }

  let content = fs.readFileSync(srcPath, 'utf8');

  // Replace component name references: e.g. AdminLeadList -> SuperAdminLeadList
  const baseNameSrc = path.basename(src, '.jsx');
  const baseNameDest = path.basename(dest, '.jsx');
  content = content.split(baseNameSrc).join(baseNameDest);

  // Replace route URLs: e.g. /admin/leads -> /super_admin/leads
  content = content.split("'/admin/").join("'/super_admin/");
  content = content.split('"/admin/').join('"/super_admin/');
  content = content.split('`/admin/').join('`/super_admin/');

  // Replace /admin with /super_admin in other general navigation strings
  content = content.split("'/admin'").join("'/super_admin'");
  content = content.split('"/admin"').join('"/super_admin"');
  content = content.split('`/admin`').join('`/super_admin`');

  // Fix auth role checks: destructure isSuperAdmin and use it where isAdmin is used
  if (content.includes('isAdmin') && !content.includes('isSuperAdmin')) {
    content = content.replace(/isAdmin\b/g, 'isAdmin, isSuperAdmin');
    // Change checks like !isAdmin or isAdmin to include isSuperAdmin
    content = content.replace(/\b!isAdmin\b/g, '(!isAdmin && !isSuperAdmin)');
    content = content.replace(/\bisAdmin\b/g, '(isAdmin || isSuperAdmin)');
    // Fix double-destructuring that might happen from the first replacement
    content = content.replace(/isAdmin,\s*isSuperAdmin,\s*isSuperAdmin/g, 'isAdmin, isSuperAdmin');
    // Fix expressions like (isAdmin || isSuperAdmin) || isSuperAdmin
    content = content.replace(/\(isAdmin \|\| isSuperAdmin\) \|\| isSuperAdmin/g, '(isAdmin || isSuperAdmin)');
  }

  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`Successfully generated: ${dest}`);
});

console.log('All Super Admin pages created successfully!');
