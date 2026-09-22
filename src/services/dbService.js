import {
  MOCK_LEADS,
  MOCK_CLIENTS,
  MOCK_CONSULTATIONS,
  MOCK_PAYMENTS,
  MOCK_DOCUMENTS,
  NOTIFICATIONS,
  EMAIL_TEMPLATES,
  WHATSAPP_TEMPLATES,
  SERVICES,
  PACKAGES,
  AGENTS
} from '../constants/mockData';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const loadState = (key, defaults) => {
  let saved = localStorage.getItem(key);
  if (!saved && key === 'crm-agents-list') {
    saved = localStorage.getItem('crm-consultants-list');
    if (saved) {
      localStorage.setItem('crm-agents-list', saved);
    }
  }
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && Array.isArray(defaults)) {
        let hasNew = false;
        // Merge missing mock items by id & update status/visaStatus if default mock changes
        const merged = parsed.map(savedItem => {
          const defaultItem = defaults.find(d => d && d.id === savedItem.id);
          if (defaultItem) {
            if (savedItem.status !== defaultItem.status || savedItem.visaStatus !== defaultItem.visaStatus) {
              hasNew = true;
              return { ...savedItem, status: defaultItem.status, visaStatus: defaultItem.visaStatus };
            }
          }
          return savedItem;
        });

        defaults.forEach(item => {
          if (item && item.id && !merged.some(m => m && m.id === item.id)) {
            merged.push(item);
            hasNew = true;
          }
        });
        if (hasNew) {
          localStorage.setItem(key, JSON.stringify(merged));
        }
        return merged;
      }
      return parsed;
    } catch (e) {
      console.warn('Error parsing state:', e);
    }
  }
  return defaults;
};

const saveState = (key, state) => {
  localStorage.setItem(key, JSON.stringify(state));
};

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv1',
    leadId: 'LD1001',
    name: 'Amelia Watson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    platform: 'whatsapp',
    unreadCount: 1,
    status: 'New Lead',
    email: 'amelia.w@example.com',
    phone: '+44 7911 123456',
    country: 'United Kingdom',
    preferredLanguage: 'English',
    serviceId: 'dnv',
    messages: [
      { sender: 'customer', text: 'Hello, I am interested in the Digital Nomad Visa for Spain. Can you guide me?', timestamp: '10:15 AM' },
      { sender: 'system', text: 'Hello Amelia! Thanks for reaching out to AAA Business Consultancy. One of our visa experts will be with you shortly. In the meantime, what is your current monthly remote income?', timestamp: '10:16 AM' },
      { sender: 'customer', text: 'It is about €3,800 per month, and I work for a UK tech company.', timestamp: '10:18 AM' },
      { sender: 'agent', text: "That is great! That exceeds the minimum requirement of €3,160. Let's schedule an expert consultation.", timestamp: '10:20 AM' },
      { sender: 'customer', text: 'Excellent, is there a booking link for the zoom call?', timestamp: '10:22 AM' }
    ]
  },
  {
    id: 'conv2',
    leadId: 'LD1003',
    name: 'Elena Petrova',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    platform: 'telegram',
    unreadCount: 0,
    status: 'Active',
    email: 'elena.p@example.com',
    phone: '+7 903 123-45-67',
    country: 'Russia',
    preferredLanguage: 'English',
    serviceId: 'study',
    messages: [
      { sender: 'customer', text: 'Spasibo, details sent via email.', timestamp: 'Yesterday' },
      { sender: 'agent', text: 'Thank you Elena, I will verify the translation.', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'conv3',
    leadId: 'LD1004',
    name: 'Markus Schmidt',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    platform: 'whatsapp',
    unreadCount: 0,
    status: 'New Lead',
    email: 'markus.s@example.com',
    phone: '+49 170 1234567',
    country: 'Germany',
    preferredLanguage: 'English',
    serviceId: 'self_employed',
    messages: [
      { sender: 'customer', text: 'Hey, can I set up an Autonomo business in Spain remotely?', timestamp: '3 days ago' },
      { sender: 'agent', text: 'Hi Markus! Yes, we can handle the registration of your self-employed residency remotely using a power of attorney.', timestamp: '3 days ago' },
      { sender: 'customer', text: 'Excellent, that sounds solid.', timestamp: '3 days ago' }
    ]
  }
];

export const dbService = {
  // LEADS
  getLeads: async () => {
    await delay();
    const leads = loadState('crm-leads', MOCK_LEADS);
    const c1Leads = leads.filter(l => l && l.assignedConsultantId === 'c1');
    if (c1Leads.length < 3 && leads.length >= 3) {
      if (leads[0]) leads[0].assignedConsultantId = 'c1';
      if (leads[1]) leads[1].assignedConsultantId = 'c1';
      if (leads[2]) leads[2].assignedConsultantId = 'c1';
      localStorage.setItem('crm-leads', JSON.stringify(leads));
    }
    return leads;
  },
  getLeadById: async (id) => {
    await delay();
    const leads = loadState('crm-leads', MOCK_LEADS);
    return leads.find(l => l.id === id);
  },
  createLead: async (lead) => {
    await delay();

    const settings = loadState('crm-settings-general', {
      companyName: 'AAA Business Consultancy LLC',
      phone: '+971 50 955 4142',
      email: 'info@aaabusinessconsultancy.com',
      address: 'Business Village, Block B, 4th Floor, Office F09, Deira, Dubai, UAE',
      vatRate: 5,
      autoAssignConsultant: true
    });
    const consultants = loadState('crm-agents-list', AGENTS);
    let assignedConsultantId = lead.assignedConsultantId || '';
    let autoAssignedEvent = null;

    // Auto assign logic if enabled and no manual assignment is passed
    if (settings.autoAssignConsultant && !assignedConsultantId && consultants.length > 0) {
      const preferredLang = lead.preferredLanguage || 'English';

      const matchingConsultants = consultants.filter(c =>
        c.languages && c.languages.some(l => l.toLowerCase() === preferredLang.toLowerCase())
      );

      let selectedConsultant = null;
      if (matchingConsultants.length > 0) {
        selectedConsultant = matchingConsultants.reduce((min, curr) =>
          (curr.casesCount || 0) < (min.casesCount || 0) ? curr : min
          , matchingConsultants[0]);
      } else {
        selectedConsultant = consultants.reduce((min, curr) =>
          (curr.casesCount || 0) < (min.casesCount || 0) ? curr : min
          , consultants[0]);
      }

      if (selectedConsultant) {
        assignedConsultantId = selectedConsultant.id;
        autoAssignedEvent = {
          date: new Date().toISOString(),
          event: `Assigned to ${selectedConsultant.name} automatically (Language match: ${preferredLang}).`,
          user: 'System'
        };

        const updatedAgents = consultants.map(c =>
          c.id === selectedConsultant.id ? { ...c, casesCount: (c.casesCount || 0) + 1 } : c
        );
        saveState('crm-agents-list', updatedAgents);
      }
    }

    const leads = loadState('crm-leads', MOCK_LEADS);
    const newLead = {
      id: 'LD' + (1000 + leads.length + 1),
      createdDate: new Date().toISOString(),
      assignedConsultantId,
      timeline: [
        { date: new Date().toISOString(), event: 'Lead created manually', user: 'System' }
      ],
      ...lead
    };

    if (autoAssignedEvent) {
      newLead.timeline.unshift(autoAssignedEvent);
    } else if (assignedConsultantId) {
      const selectedConsultant = consultants.find(c => c.id === assignedConsultantId);
      if (selectedConsultant) {
        newLead.timeline.unshift({
          date: new Date().toISOString(),
          event: `Assigned to ${selectedConsultant.name} manually.`,
          user: 'System'
        });
        const updatedAgents = consultants.map(c =>
          c.id === assignedConsultantId ? { ...c, casesCount: (c.casesCount || 0) + 1 } : c
        );
        saveState('crm-agents-list', updatedAgents);
      }
    }

    leads.unshift(newLead);
    saveState('crm-leads', leads);

    // Automatically generate a client account for this lead
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const clientId = 'CL2' + String(clients.length + 101).padStart(3, '0');
    const newClient = {
      id: clientId,
      firstName: newLead.firstName,
      lastName: newLead.lastName,
      email: newLead.email,
      phone: newLead.phone,
      nationality: newLead.nationality || 'Spain',
      preferredLanguage: newLead.preferredLanguage || 'English',
      serviceId: newLead.serviceId,
      packageId: 'full_process',
      applicantsCount: Number(lead.applicantsCount) || 1,
      assignedConsultantId: newLead.assignedConsultantId || '',
      status: 'New Lead',
      visaStatus: 'Not Started',
      onboardingDate: new Date().toISOString(),
      documentUploadAllowed: false, // Locked until first consultation is successful
      profileSummary: `Lead registered via intake. Awaiting consultation.`
    };
    clients.unshift(newClient);
    saveState('crm-clients', clients);

    // Save clientId in the lead object as well
    newLead.clientId = clientId;
    leads[0] = newLead;
    saveState('crm-leads', leads);

    // Automatically initialize WhatsApp conversation & send system welcome greeting
    const conversationId = 'conv_lead_' + newLead.id;
    const welcomeMsg = `👋 Hello ${newLead.firstName}! Thank you for reaching out to AAA Business Consultancy. We specialize in Spain residency and visa services. How can we assist you today?`;

    const conversations = loadState('crm-conversations', INITIAL_CONVERSATIONS);
    const newConv = {
      id: conversationId,
      leadId: newLead.id,
      name: `${newLead.firstName} ${newLead.lastName}`,
      avatar: '',
      platform: 'whatsapp',
      unreadCount: 0,
      status: newLead.status || 'New Lead',
      email: newLead.email,
      phone: newLead.phone,
      country: newLead.nationality || 'Spain',
      preferredLanguage: newLead.preferredLanguage || 'English',
      serviceId: newLead.serviceId,
      messages: [
        {
          sender: 'agent',
          text: welcomeMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    conversations.unshift(newConv);
    saveState('crm-conversations', conversations);

    // Trigger notification
    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'New Lead Added',
      message: `Lead ${newLead.firstName} ${newLead.lastName} has been added and assigned. Portal ID: ${clientId}`,
      type: 'lead',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return { ...newLead, clientId };
  },
  updateLead: async (lead) => {
    await delay();
    const leads = loadState('crm-leads', MOCK_LEADS);
    const updated = leads.map(l => l.id === lead.id ? { ...l, ...lead } : l);
    saveState('crm-leads', updated);
    return lead;
  },
  deleteLead: async (id) => {
    await delay();
    const leads = loadState('crm-leads', MOCK_LEADS);
    const filtered = leads.filter(l => l.id !== id);
    saveState('crm-leads', filtered);
    return id;
  },
  assignAgent: async (leadId, agentId) => {
    await delay();
    const leads = loadState('crm-leads', MOCK_LEADS);
    const updated = leads.map(l => l.id === leadId ? {
      ...l,
      assignedConsultantId: agentId,
      timeline: [{ date: new Date().toISOString(), event: 'Agent reassigned.', user: 'System' }, ...l.timeline]
    } : l);
    saveState('crm-leads', updated);
    return { leadId, agentId };
  },
  updateLeadStatus: async (leadId, status) => {
    await delay();
    const leads = loadState('crm-leads', MOCK_LEADS);
    const oldLead = leads.find(l => l.id === leadId);
    const updated = leads.map(l => l.id === leadId ? {
      ...l,
      status,
      timeline: [{ date: new Date().toISOString(), event: `Status changed from ${l.status} to ${status}`, user: 'System' }, ...l.timeline]
    } : l);
    saveState('crm-leads', updated);

    if (oldLead) {
      const conversations = loadState('crm-conversations', INITIAL_CONVERSATIONS);
      const updatedConvs = conversations.map(c => c.leadId === leadId ? { ...c, status } : c);
      saveState('crm-conversations', updatedConvs);
    }
    return { leadId, status };
  },

  // CLIENTS
  getClients: async () => {
    await delay();
    return loadState('crm-clients', MOCK_CLIENTS);
  },
  getClientById: async (id) => {
    await delay();
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    return clients.find(c => c.id === id);
  },
  createClient: async (client) => {
    await delay();
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const newClient = {
      id: 'CL' + (2000 + clients.length + 1),
      onboardingDate: new Date().toISOString(),
      visaStatus: 'Not Started',
      ...client
    };
    clients.unshift(newClient);
    saveState('crm-clients', clients);

    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'New Client Onboarded',
      message: `Client ${newClient.firstName} ${newClient.lastName} has been onboarded.`,
      type: 'client',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return newClient;
  },
  updateClient: async (client) => {
    await delay();
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const updated = clients.map(c => c.id === client.id ? { ...c, ...client } : c);
    saveState('crm-clients', updated);
    return client;
  },
  updateClientVisaStatus: async (clientId, visaStatus, status) => {
    await delay();
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const updated = clients.map(c => {
      if (c.id === clientId) {
        const updatedObj = { ...c };
        if (visaStatus) updatedObj.visaStatus = visaStatus;
        if (status) updatedObj.status = status;
        return updatedObj;
      }
      return c;
    });
    saveState('crm-clients', updated);
    return { clientId, visaStatus, status };
  },

  // CONSULTATIONS
  getConsultations: async () => {
    await delay();
    return loadState('crm-consultations', MOCK_CONSULTATIONS);
  },
  createConsultation: async (cons) => {
    await delay();
    const consultations = loadState('crm-consultations', MOCK_CONSULTATIONS);
    const newCons = {
      id: 'CS' + (3000 + consultations.length + 1),
      status: 'Scheduled',
      recordingUrl: '',
      outcome: null,
      meetingLink: 'https://zoom.us/j/' + Math.floor(100000000 + Math.random() * 900000000),
      ...cons
    };
    consultations.unshift(newCons);
    saveState('crm-consultations', consultations);

    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'Consultation Scheduled',
      message: `Consultation scheduled with ${newCons.clientName}.`,
      type: 'meeting',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return newCons;
  },
  updateConsultationStatus: async (consultationId, status) => {
    await delay();
    const consultations = loadState('crm-consultations', MOCK_CONSULTATIONS);
    const updated = consultations.map(c => c.id === consultationId ? { ...c, status } : c);
    saveState('crm-consultations', updated);
    return { consultationId, status };
  },
  completeConsultation: async (consultationId, outcome, notes) => {
    await delay();
    const consultations = loadState('crm-consultations', MOCK_CONSULTATIONS);
    const updated = consultations.map(c => c.id === consultationId ? {
      ...c,
      status: 'Completed',
      outcome,
      notes,
      recordingUrl: `https://storage.googleapis.com/aaa-consultancy-recordings/CS_REC_${consultationId}.mp3`
    } : c);
    saveState('crm-consultations', updated);

    // Check if we should auto-create client or update lead
    const consultation = consultations.find(c => c.id === consultationId);
    if (consultation && consultation.leadId) {
      const leads = loadState('crm-leads', MOCK_LEADS);
      const updatedLeads = leads.map(l =>
        l.id === consultation.leadId ? { ...l, status: 'Under Consultation' } : l
      );
      saveState('crm-leads', updatedLeads);
    }
    return { consultationId, outcome, notes };
  },

  // PAYMENTS & INVOICES
  getPayments: async () => {
    await delay();
    return loadState('crm-payments', MOCK_PAYMENTS);
  },
  createInvoice: async (invoice) => {
    await delay();
    const payments = loadState('crm-payments', MOCK_PAYMENTS);
    const newInvoice = {
      id: 'INV-2026-' + String(payments.length + 1).padStart(3, '0'),
      billingDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalPaid: 0,
      paymentMethod: '-',
      transactionId: '-',
      ...invoice
    };
    payments.unshift(newInvoice);
    saveState('crm-payments', payments);

    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'Invoice Created',
      message: `Invoice ${newInvoice.id} generated for ${newInvoice.clientName}.`,
      type: 'payment',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return newInvoice;
  },
  updatePaymentStatus: async (paymentId, status, paymentMethod, transactionId) => {
    await delay();
    const payments = loadState('crm-payments', MOCK_PAYMENTS);
    const updated = payments.map(p => {
      if (p.id === paymentId) {
        const updatedObj = { ...p, status };
        if (paymentMethod) updatedObj.paymentMethod = paymentMethod;
        if (transactionId) updatedObj.transactionId = transactionId;
        if (status === 'Paid') {
          updatedObj.totalPaid = p.amount - (p.discount || 0);
        }
        return updatedObj;
      }
      return p;
    });
    saveState('crm-payments', updated);

    // If paid, change client status to Under Process
    const payment = payments.find(p => p.id === paymentId);
    if (payment && payment.clientId && status === 'Paid') {
      const clients = loadState('crm-clients', MOCK_CLIENTS);
      const updatedClients = clients.map(c =>
        c.id === payment.clientId ? { ...c, status: 'Under Process', visaStatus: 'Document Preparation' } : c
      );
      saveState('crm-clients', updatedClients);
    }
    return { paymentId, status };
  },

  // DOCUMENTS
  getDocuments: async () => {
    await delay();
    return loadState('crm-documents', MOCK_DOCUMENTS);
  },
  uploadDocument: async (doc) => {
    await delay();
    const documents = loadState('crm-documents', MOCK_DOCUMENTS);
    const newDoc = {
      id: 'DOC' + (4000 + documents.length + 1),
      uploadedDate: new Date().toISOString(),
      status: 'Pending Review',
      comment: '',
      ...doc
    };
    documents.unshift(newDoc);
    saveState('crm-documents', documents);

    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'Document Uploaded',
      message: `${newDoc.clientName} uploaded a ${newDoc.category} document.`,
      type: 'document',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return newDoc;
  },
  reviewDocument: async (documentId, status, comment) => {
    await delay();
    const documents = loadState('crm-documents', MOCK_DOCUMENTS);
    const doc = documents.find(d => d.id === documentId);
    if (!doc) throw new Error('Document not found');

    const updated = documents.map(d =>
      d.id === documentId ? { ...d, status, comment: comment !== undefined ? comment : d.comment } : d
    );
    saveState('crm-documents', updated);

    // If client exists, update their timeline
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const client = clients.find(c => c.id === doc.clientId);
    if (client) {
      if (!client.timeline) client.timeline = [];
      client.timeline.unshift({
        date: new Date().toISOString(),
        event: `Document "${doc.name}" was reviewed: ${status}${comment ? ` - ${comment}` : ''}`,
        user: 'Operations/Admin'
      });
      // Save client update
      const updatedClients = clients.map(c => c.id === client.id ? client : c);
      saveState('crm-clients', updatedClients);
    }

    // Dispatch system notification
    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: `Document reviewed: ${status}`,
      message: `Document "${doc.name}" for client ${doc.clientName} is marked ${status}.${comment ? ` Comment: ${comment}` : ''}`,
      type: 'document',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return { documentId, status, comment };
  },
  submitClientIntake: async (clientId, details, uploadedFiles) => {
    await delay();
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const client = clients.find(c => c.id === clientId);
    if (!client) throw new Error('Client not found');

    // Update client profile details
    const updatedClient = {
      ...client,
      ...details,
      visaStatus: 'In Review',
      status: 'Under Process'
    };

    if (!updatedClient.timeline) updatedClient.timeline = [];
    updatedClient.timeline.unshift({
      date: new Date().toISOString(),
      event: 'Client Intake profiling and documents submitted via secure public portal.',
      user: 'Client'
    });

    const updatedClients = clients.map(c => c.id === clientId ? updatedClient : c);
    saveState('crm-clients', updatedClients);

    // Add uploaded files to documents collection
    const documents = loadState('crm-documents', MOCK_DOCUMENTS);
    uploadedFiles.forEach((file) => {
      const docId = 'DOC' + (4000 + documents.length + 1);
      const newDoc = {
        id: docId,
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        name: file.name,
        category: file.category,
        url: file.url || '#',
        size: file.size || '1.5 MB',
        uploadedDate: new Date().toISOString(),
        status: 'Pending Verification',
        comment: ''
      };
      documents.unshift(newDoc);
    });
    saveState('crm-documents', documents);

    // Dispatch notification
    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'Client Intake Portal Submission',
      message: `Client ${client.firstName} ${client.lastName} submitted profiling details and uploaded ${uploadedFiles.length} document(s).`,
      type: 'document',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return { client: updatedClient, documentsCount: uploadedFiles.length };
  },
  deleteDocument: async (id) => {
    await delay();
    const documents = loadState('crm-documents', MOCK_DOCUMENTS);
    const filtered = documents.filter(d => d.id !== id);
    saveState('crm-documents', filtered);
    return id;
  },

  // SETTINGS
  getSettings: async () => {
    await delay();
    return loadState('crm-settings-general', {
      companyName: 'AAA Business Consultancy LLC',
      phone: '+971 50 955 4142',
      email: 'info@aaabusinessconsultancy.com',
      address: 'Business Village, Block B, 4th Floor, Office F09, Deira, Dubai, UAE',
      vatRate: 5,
      autoAssignConsultant: true
    });
  },
  updateSettings: async (settings) => {
    await delay();
    saveState('crm-settings-general', settings);
    return settings;
  },
  getServices: async () => {
    await delay();
    return loadState('crm-services', SERVICES);
  },
  updateServices: async (services) => {
    await delay();
    saveState('crm-services', services);
    return services;
  },
  getPackages: async () => {
    await delay();
    return loadState('crm-packages', PACKAGES);
  },
  updatePackages: async (packages) => {
    await delay();
    saveState('crm-packages', packages);
    return packages;
  },
  getEmailTemplates: async () => {
    await delay();
    return loadState('crm-email-templates', EMAIL_TEMPLATES);
  },
  updateEmailTemplates: async (templates) => {
    await delay();
    saveState('crm-email-templates', templates);
    return templates;
  },
  getWhatsappTemplates: async () => {
    await delay();
    return loadState('crm-whatsapp-templates', WHATSAPP_TEMPLATES);
  },
  updateWhatsappTemplates: async (templates) => {
    await delay();
    saveState('crm-whatsapp-templates', templates);
    return templates;
  },

  // SOCIAL CHAT INBOX
  getConversations: async () => {
    await delay();
    return loadState('crm-conversations', INITIAL_CONVERSATIONS);
  },
  markConversationRead: async (id) => {
    await delay();
    const conversations = loadState('crm-conversations', INITIAL_CONVERSATIONS);
    const updated = conversations.map(c => c.id === id ? { ...c, unreadCount: 0 } : c);
    saveState('crm-conversations', updated);
    return id;
  },
  sendSocialMessage: async (conversationId, message) => {
    await delay();
    const conversations = loadState('crm-conversations', INITIAL_CONVERSATIONS);
    const updated = conversations.map(c => c.id === conversationId ? {
      ...c,
      messages: [...c.messages, message]
    } : c);
    saveState('crm-conversations', updated);
    return { conversationId, message };
  },
  receiveSocialMessage: async (conversationId, message, isActive) => {
    await delay();
    const conversations = loadState('crm-conversations', INITIAL_CONVERSATIONS);
    const updated = conversations.map(c => c.id === conversationId ? {
      ...c,
      messages: [...c.messages, message],
      unreadCount: isActive ? c.unreadCount : c.unreadCount + 1
    } : c);
    saveState('crm-conversations', updated);
    return { conversationId, message, isActive };
  },
  addConversation: async (conv) => {
    await delay();
    const conversations = loadState('crm-conversations', INITIAL_CONVERSATIONS);
    const alreadyExists = conversations.some(c => c.id === conv.id || (conv.leadId && c.leadId === conv.leadId));
    if (alreadyExists) return conv;
    conversations.push(conv);
    saveState('crm-conversations', conversations);
    return conv;
  },

  // NOTIFICATIONS
  getNotifications: async () => {
    await delay();
    return loadState('crm-notifications', NOTIFICATIONS);
  },
  addNotification: async (notif) => {
    await delay();
    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    const newNotif = {
      id: 'notif_' + Date.now(),
      read: false,
      time: 'Just now',
      ...notif
    };
    notifications.unshift(newNotif);
    saveState('crm-notifications', notifications);
    return newNotif;
  },
  markNotificationRead: async (id) => {
    await delay();
    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveState('crm-notifications', updated);
    return id;
  },
  markAllNotificationsRead: async () => {
    await delay();
    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveState('crm-notifications', updated);
    return true;
  },

  // AGENTS
  getAgents: async () => {
    await delay();
    let list = loadState('crm-agents-list', AGENTS);
    let migrated = false;
    list = list.map(a => {
      // Migrate old cached Wael Madi list item to Amir Hassan to separate list agents from Super Admin
      if (a.name === 'Wael Madi') {
        a.name = 'Amir Hassan';
        a.email = 'amir.h@aaabusinessconsultancy.com';
        a.bio = 'General Manager at AAA Business Consultancy. Oversees visa processing teams, client relations, and operational management.';
        a.role = 'admin';
        migrated = true;
      }
      if (!a.role) {
        migrated = true;
        if (a.name === 'Sofia Rodriguez') a.role = 'consultant';
        else if (a.name === 'Lucas Gomez') a.role = 'operations';
        else if (a.name === 'Amir Hassan') a.role = 'admin';
        else if (a.name === 'Elena Rostova') a.role = 'marketing';
        else if (a.name === 'David Vance') a.role = 'finance';
        else a.role = 'consultant';
      }
      return a;
    });
    if (migrated) {
      saveState('crm-agents-list', list);
    }
    return list;
  },
  createAgent: async (agent) => {
    await delay();
    const agents = loadState('crm-agents-list', AGENTS);
    const newAgent = {
      ...agent,
      id: 'c' + (agents.length + 1),
      avatar: agent.avatar || ('https://i.pravatar.cc/150?u=' + Date.now()),
      casesCount: 0,
      conversionRate: 0,
      revenueGenerated: 0,
      joiningDate: agent.joiningDate || new Date().toISOString().split('T')[0]
    };
    agents.unshift(newAgent);
    saveState('crm-agents-list', agents);

    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'New Agent Registered',
      message: `${newAgent.name} has been registered as an Agent.`,
      type: 'info',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);

    return newAgent;
  },
  updateAgentRole: async (id, role) => {
    await delay();
    const agents = loadState('crm-agents-list', AGENTS);
    const updated = agents.map(a => a.id === id ? { ...a, role } : a);
    saveState('crm-agents-list', updated);
    return updated.find(c => c.id === id);
  },
  updateAgent: async (agent) => {
    await delay();
    const agents = loadState('crm-agents-list', AGENTS);
    const updated = agents.map(a => a.id === agent.id ? { ...a, ...agent } : a);
    saveState('crm-agents-list', updated);
    return updated.find(c => c.id === agent.id);
  },
  deleteAgent: async (id) => {
    await delay();
    const agents = loadState('crm-agents-list', AGENTS);
    const filtered = agents.filter(a => a.id !== id);
    saveState('crm-agents-list', filtered);
    return id;
  },
  resetAgentPassword: async (id, newPassword) => {
    await delay();
    const agents = loadState('crm-agents-list', AGENTS);
    const updated = agents.map(a => a.id === id ? { ...a, password: newPassword } : a);
    saveState('crm-agents-list', updated);
    return { id, newPassword };
  },
  assignConsultation: async (consultationId, agentId) => {
    await delay();
    const consultations = loadState('crm-consultations', MOCK_CONSULTATIONS);
    const updated = consultations.map(c =>
      c.id === consultationId ? { ...c, assignedConsultantId: agentId } : c
    );
    saveState('crm-consultations', updated);
    return updated.find(c => c.id === consultationId);
  },
  getConsultants: async () => {
    return dbService.getAgents();
  },
  assignConsultant: async (leadId, agentId) => {
    return dbService.assignAgent(leadId, agentId);
  },
  createConsultant: async (agent) => {
    return dbService.createAgent(agent);
  },
  updateConsultantRole: async (id, role) => {
    return dbService.updateAgentRole(id, role);
  },

  // REFUNDS
  getRefundRequests: async () => {
    await delay();
    return loadState('crm-refund-requests', [
      {
        id: 'REF-001',
        clientId: 'CL2008',
        clientName: 'Olga Kuznetsova',
        category: 'Visa Rejection',
        amount: 900,
        reason: 'Spanish Consulate rejected visa application due to lack of local ties.',
        status: 'Approved',
        date: '2026-06-25',
        auditLogs: [
          { date: '2026-06-25T10:00:00Z', action: 'Refund requested automatically on visa rejection.', user: 'System' },
          { date: '2026-06-25T14:30:00Z', action: 'Refund reviewed and approved.', user: 'Wael Madi (CEO)' }
        ]
      }
    ]);
  },
  createRefundRequest: async (refund) => {
    await delay();
    const refunds = loadState('crm-refund-requests', []);
    const payments = loadState('crm-payments', MOCK_PAYMENTS);
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    
    const client = clients.find(c => c.id === refund.clientId);
    const clientName = client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
    
    let refundAmount = Number(refund.amount) || 0;
    
    // Automatic 50% Refund Calculation for Visa Rejections Only
    if (refund.category === 'Visa Rejection') {
      const clientPayments = payments.filter(p => p.clientId === refund.clientId && p.status === 'Paid');
      const totalPaid = clientPayments.reduce((acc, curr) => acc + (curr.totalPaid || curr.amount), 0);
      refundAmount = totalPaid * 0.5;
    }
    
    const newRefund = {
      id: 'REF-' + String(refunds.length + 101),
      clientName,
      amount: refundAmount,
      status: 'Pending Review',
      date: new Date().toISOString().split('T')[0],
      auditLogs: [
        { date: new Date().toISOString(), action: `Refund requested for category ${refund.category || 'General'}. Calculated amount: €${refundAmount}.`, user: 'System' }
      ],
      ...refund
    };
    
    refunds.unshift(newRefund);
    saveState('crm-refund-requests', refunds);
    return newRefund;
  },
  updateRefundStatus: async (refundId, status, user = 'Wael Madi (CEO)') => {
    await delay();
    const refunds = loadState('crm-refund-requests', []);
    const payments = loadState('crm-payments', MOCK_PAYMENTS);
    
    const updated = refunds.map(r => {
      if (r.id === refundId) {
        const auditLogs = [...(r.auditLogs || [])];
        auditLogs.push({ date: new Date().toISOString(), action: `Refund status updated to ${status}.`, user });
        
        // If processed, create negative payment entry
        if (status === 'Processed' && r.status !== 'Processed') {
          const newPayment = {
            id: 'REF-PAY-' + Date.now(),
            clientId: r.clientId,
            clientName: r.clientName,
            serviceId: 'refund',
            packageId: '-',
            amount: -r.amount,
            discount: 0,
            totalPaid: -r.amount,
            status: 'Refunded (50%)',
            billingDate: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Bank Transfer',
            transactionId: 'REF-TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
          };
          payments.unshift(newPayment);
          saveState('crm-payments', payments);
        }
        return { ...r, status, auditLogs };
      }
      return r;
    });
    
    saveState('crm-refund-requests', updated);
    return updated.find(r => r.id === refundId);
  },

  // COMMISSIONS
  getCommissionRates: async () => {
    await delay();
    return loadState('crm-commission-rates', [
      { agentId: 'c1', type: '10%', value: 10 },
      { agentId: 'c2', type: '5%', value: 5 },
      { agentId: 'c3', type: 'custom', value: 12 },
      { agentId: 'c4', type: 'fixed', value: 200 },
      { agentId: 'c5', type: '10%', value: 10 }
    ]);
  },
  updateCommissionRate: async (agentId, type, value) => {
    await delay();
    const rates = loadState('crm-commission-rates', [
      { agentId: 'c1', type: '10%', value: 10 },
      { agentId: 'c2', type: '5%', value: 5 },
      { agentId: 'c3', type: 'custom', value: 12 },
      { agentId: 'c4', type: 'fixed', value: 200 },
      { agentId: 'c5', type: '10%', value: 10 }
    ]);
    const exists = rates.some(r => r.agentId === agentId);
    let updated;
    if (exists) {
      updated = rates.map(r => r.agentId === agentId ? { agentId, type, value: Number(value) } : r);
    } else {
      updated = [...rates, { agentId, type, value: Number(value) }];
    }
    saveState('crm-commission-rates', updated);
    return updated.find(r => r.agentId === agentId);
  },
  getCommissionsReport: async () => {
    await delay();
    const payments = loadState('crm-payments', MOCK_PAYMENTS);
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const agents = loadState('crm-agents-list', AGENTS);
    const rates = loadState('crm-commission-rates', [
      { agentId: 'c1', type: '10%', value: 10 },
      { agentId: 'c2', type: '5%', value: 5 },
      { agentId: 'c3', type: 'custom', value: 12 },
      { agentId: 'c4', type: 'fixed', value: 200 },
      { agentId: 'c5', type: '10%', value: 10 }
    ]);
    
    // Find all paid payments (excluding refunds)
    const paidPayments = payments.filter(p => p.status === 'Paid' && p.amount > 0);
    
    const reports = paidPayments.map(pay => {
      // Find client
      const client = clients.find(c => c.id === pay.clientId);
      const agentId = client?.assignedConsultantId || 'unassigned';
      const agent = agents.find(a => a.id === agentId);
      const agentName = agent ? agent.name : 'Unassigned';
      
      // Find rate structure
      const rate = rates.find(r => r.agentId === agentId) || { type: '10%', value: 10 };
      
      let commissionEarned = 0;
      if (rate.type === '5%') {
        commissionEarned = pay.totalPaid * 0.05;
      } else if (rate.type === '10%') {
        commissionEarned = pay.totalPaid * 0.10;
      } else if (rate.type === 'custom') {
        commissionEarned = pay.totalPaid * (rate.value / 100);
      } else if (rate.type === 'fixed') {
        commissionEarned = rate.value;
      }
      
      // Mock payment tracking (e.g. invoices processed before June 15th are marked paid)
      const commissionPaid = new Date(pay.billingDate) < new Date('2026-06-15') ? commissionEarned : 0;
      
      return {
        id: 'COMM-' + pay.id,
        paymentId: pay.id,
        clientName: pay.clientName,
        serviceId: pay.serviceId,
        amountPaid: pay.totalPaid,
        agentId,
        agentName,
        structure: `${rate.type} (${rate.type === 'fixed' ? '€' + rate.value : rate.value + '%'})`,
        commissionEarned,
        commissionPaid,
        commissionPending: commissionEarned - commissionPaid,
        date: pay.billingDate
      };
    });
    
    return reports;
  },

  // AWS STORAGE BACKUPS
  getBackupLogs: async () => {
    await delay();
    return loadState('crm-aws-backups', [
      { id: 'BAK-001', name: 'INV-2026-001_receipt.pdf', size: '142 KB', category: 'Receipt Storage', status: 'Backed Up', timestamp: '2026-06-25T14:35:00Z' },
      { id: 'BAK-002', name: 'INV-2026-002_receipt.pdf', size: '138 KB', category: 'Receipt Storage', status: 'Backed Up', timestamp: '2026-06-25T14:35:00Z' },
      { id: 'BAK-003', name: 'financial_ledger_q2_2026.xlsx', size: '2.4 MB', category: 'Financial Document Storage', status: 'Backed Up', timestamp: '2026-06-26T08:00:00Z' }
    ]);
  },
  triggerAWSBackup: async (fileDetails) => {
    await delay();
    const backups = loadState('crm-aws-backups', []);
    const newBackup = {
      id: 'BAK-' + (backups.length + 101),
      status: 'Backed Up',
      timestamp: new Date().toISOString(),
      ...fileDetails
    };
    backups.unshift(newBackup);
    saveState('crm-aws-backups', backups);
    return newBackup;
  },

  // CLIENT PORTAL & MEETING SCHEDULER
  getAutoAssignSetting: async () => {
    await delay();
    const saved = localStorage.getItem('crm-settings-autoassign');
    return saved !== null ? JSON.parse(saved) : true;
  },
  toggleAutoAssignSetting: async () => {
    await delay();
    const current = localStorage.getItem('crm-settings-autoassign');
    const newVal = current !== null ? !JSON.parse(current) : false;
    localStorage.setItem('crm-settings-autoassign', JSON.stringify(newVal));
    return newVal;
  },
  bookClientConsultation: async ({ clientId, meetingDate, meetingTime, notes }) => {
    await delay();
    const consultations = loadState('crm-consultations', MOCK_CONSULTATIONS);
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const consultants = loadState('crm-agents-list', AGENTS);
    
    const client = clients.find(c => c.id === clientId);
    const clientName = client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
    
    // Check if auto assign setting is enabled
    const autoAssignSaved = localStorage.getItem('crm-settings-autoassign');
    const autoAssignEnabled = autoAssignSaved !== null ? JSON.parse(autoAssignSaved) : true;
    
    let assignedConsultantId = 'unassigned';
    let status = 'Pending Assignment';
    let meetingLink = '';
    
    if (autoAssignEnabled && consultants.length > 0) {
      // Find matching consultant by workload (lowest casesCount)
      const selected = consultants.reduce((min, curr) => 
        (curr.casesCount || 0) < (min.casesCount || 0) ? curr : min
      , consultants[0]);
      
      if (selected) {
        assignedConsultantId = selected.id;
        status = 'Scheduled';
        meetingLink = 'https://zoom.us/j/' + Math.floor(100000000 + Math.random() * 900000000);
        
        // Increment workload
        const updatedAgents = consultants.map(c => 
          c.id === selected.id ? { ...c, casesCount: (c.casesCount || 0) + 1 } : c
        );
        saveState('crm-agents-list', updatedAgents);
        
        // Update client assigned manager too
        if (client) {
          client.assignedConsultantId = selected.id;
          saveState('crm-clients', clients);
        }
      }
    }
    
    const newConsultation = {
      id: 'CS' + (3000 + consultations.length + 1),
      leadId: clientId,
      clientName,
      meetingDate,
      meetingTime,
      durationMinutes: 45,
      assignedConsultantId,
      status,
      meetingLink,
      notes: notes || 'Client scheduled free consultation from portal.',
      outcome: null
    };
    
    consultations.unshift(newConsultation);
    saveState('crm-consultations', consultations);
    
    // Trigger agent notification if scheduled
    if (status === 'Scheduled' && assignedConsultantId !== 'unassigned') {
      const notifications = loadState('crm-notifications', NOTIFICATIONS);
      notifications.unshift({
        id: 'notif_' + Date.now(),
        title: 'New Booking Assigned',
        message: `Consultation with ${clientName} scheduled for ${meetingDate} at ${meetingTime}.`,
        type: 'consultation',
        read: false,
        time: 'Just now'
      });
      saveState('crm-notifications', notifications);
    }
    
    return newConsultation;
  },
  assignAgentToConsultation: async (consultationId, agentId) => {
    await delay();
    const consultations = loadState('crm-consultations', MOCK_CONSULTATIONS);
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    const agents = loadState('crm-agents-list', AGENTS);
    
    const cons = consultations.find(c => c.id === consultationId);
    if (!cons) return null;
    
    const selectedAgent = agents.find(a => a.id === agentId);
    const agentName = selectedAgent ? selectedAgent.name : 'Unknown';
    
    const updatedCons = consultations.map(c => {
      if (c.id === consultationId) {
        return {
          ...c,
          assignedConsultantId: agentId,
          status: 'Scheduled',
          meetingLink: 'https://zoom.us/j/' + Math.floor(100000000 + Math.random() * 900000000)
        };
      }
      return c;
    });
    saveState('crm-consultations', updatedCons);
    
    // Increment workload
    const updatedAgents = agents.map(a => 
      a.id === agentId ? { ...a, casesCount: (a.casesCount || 0) + 1 } : a
    );
    saveState('crm-agents-list', updatedAgents);
    
    // Update client record
    const updatedClients = clients.map(cl => {
      if (cl.id === cons.leadId) {
        return { ...cl, assignedConsultantId: agentId };
      }
      return cl;
    });
    saveState('crm-clients', updatedClients);
    
    // Trigger notification
    const notifications = loadState('crm-notifications', NOTIFICATIONS);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'Consultation Assigned',
      message: `Meeting with ${cons.clientName} on ${cons.meetingDate} assigned to ${agentName}.`,
      type: 'consultation',
      read: false,
      time: 'Just now'
    });
    saveState('crm-notifications', notifications);
    
    return updatedCons.find(c => c.id === consultationId);
  },
  completeConsultationAndUnlockDocs: async (consultationId) => {
    await delay();
    const consultations = loadState('crm-consultations', MOCK_CONSULTATIONS);
    const clients = loadState('crm-clients', MOCK_CLIENTS);
    
    const cons = consultations.find(c => c.id === consultationId);
    if (!cons) return null;
    
    const updatedCons = consultations.map(c => {
      if (c.id === consultationId) {
        return {
          ...c,
          status: 'Completed',
          outcome: {
            clientRequestedService: 'Visa Relocation',
            aaaRecommendedService: 'Approved for Client onboarding',
            notes: 'Initial meeting successful. Client approved to upload documents.'
          }
        };
      }
      return c;
    });
    saveState('crm-consultations', updatedCons);
    
    // Unlock document upload permission for client
    const updatedClients = clients.map(cl => {
      if (cl.id === cons.leadId) {
        return {
          ...cl,
          status: 'Under Process',
          documentUploadAllowed: true
        };
      }
      return cl;
    });
    saveState('crm-clients', updatedClients);
    
    return updatedCons.find(c => c.id === consultationId);
  },

  // ROLE PERMISSIONS & UI CUSTOMIZATION
  getCustomizationSettings: async () => {
    await delay();
    const DEFAULT_CUSTOMIZATION = {
      allowAdminCustomOverrides: true,
      admin: {
        menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Customer 360', 'Calling System', 'Follow-ups', 'Quotes', 'Bookings', 'Payments', 'After-Sales', 'QA', 'Finance', 'Permission Control', 'Sales Dashboard', 'Social Inbox', 'Agents', 'Integrations'],
        cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Pending Payments', 'Total Revenue', 'Active Cases', 'Completed Cases', 'Lost Consultations', 'Revenue Today', 'Outstanding Revenue', 'Refunded (50% Rejections)']
      },
      team_leader: {
        menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Customer 360', 'Calling System', 'Follow-ups', 'Quotes', 'Lead Distribution', 'Lead Lifecycle', 'Duplicate Protection', 'Communication Hub', 'Calling & Softphone', 'Call Dispositions', 'Sales Dashboard', 'Bookings', 'Team Leader Dashboard', 'QA', 'SLA Management', 'Automation', 'Management Reports', 'Permission Control', 'Audit Trail', 'Social Inbox'],
        cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Active Cases', 'Completed Cases']
      },
      operations: {
        menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Customer 360', 'Calling System', 'Follow-ups', 'Lead Distribution', 'Lead Lifecycle', 'Duplicate Protection', 'Communication Hub', 'Calling & Softphone', 'Call Dispositions', 'After-Sales', 'Team Leader Dashboard', 'QA', 'SLA Management', 'Automation', 'Management Reports', 'Permission Control', 'Audit Trail', 'Social Inbox', 'Agents'],
        cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Active Cases', 'Completed Cases']
      },
      finance: {
        menus: ['Dashboard', 'Priority Roadmap', 'Payments', 'Finance', 'SLA Management', 'Automation', 'Management Reports', 'Permission Control', 'Audit Trail'],
        cards: ['Total Revenue', 'Pending Payments']
      },
      consultant: {
        menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Customer 360', 'Calling System', 'Follow-ups', 'Quotes', 'Lead Distribution', 'Lead Lifecycle', 'Duplicate Protection', 'Communication Hub', 'Calling & Softphone', 'Call Dispositions', 'Sales Dashboard', 'Bookings', 'SLA Management', 'Automation', 'Management Reports', 'Permission Control', 'Audit Trail', 'Social Inbox'],
        cards: ['Upcoming Meetings', 'Active Cases']
      },
      marketing: {
        menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Lead Distribution', 'Lead Lifecycle', 'Duplicate Protection', 'Communication Hub', 'Calling & Softphone', 'Call Dispositions', 'SLA Management', 'Automation', 'Management Reports', 'Permission Control', 'Audit Trail', 'Marketing Dashboard', 'Social Inbox'],
        cards: ['Total Consultations', 'Today\'s Consultations']
      }
    };
    const saved = localStorage.getItem('crm-customization-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If missing new modules like 'Permission Control' or 'Management Reports', update cached settings
        if (parsed && parsed.admin && (!parsed.admin.menus?.includes('Permission Control') || !parsed.admin.menus?.includes('Management Reports'))) {
          const updated = {
            ...parsed,
            admin: {
              ...parsed.admin,
              menus: Array.from(new Set([...(parsed.admin.menus || []), 'Permission Control', 'Management Reports', 'Priority Roadmap', 'SLA Management', 'Automation', 'Audit Trail']))
            }
          };
          localStorage.setItem('crm-customization-settings', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      } catch (e) {
        console.warn('Error parsing customization settings:', e);
      }
    }
    localStorage.setItem('crm-customization-settings', JSON.stringify(DEFAULT_CUSTOMIZATION));
    return DEFAULT_CUSTOMIZATION;
  },
  saveCustomizationSettings: async (settings) => {
    await delay();
    localStorage.setItem('crm-customization-settings', JSON.stringify(settings));
    return settings;
  },

  // LEAD & CLIENT CUSTOM LIFECYCLE STAGES
  getLeadStages: async () => {
    await delay();
    const DEFAULT_LEAD_STAGES = [
      { id: 'stage_new', name: 'NEW', type: 'lead', color: '#2196F3', emoji: '🆕' },
      { id: 'stage_contacted', name: 'CONTACTED', type: 'lead', color: '#03A9F4', emoji: '📞' },
      { id: 'stage_qualified', name: 'QUALIFIED', type: 'lead', color: '#00BCD4', emoji: '🎯' },
      { id: 'stage_quote_sent', name: 'QUOTE_SENT', type: 'lead', color: '#FF9800', emoji: '📄' },
      { id: 'stage_follow_up', name: 'FOLLOW_UP', type: 'lead', color: '#9C27B0', emoji: '📅' },
      { id: 'stage_booking_pending', name: 'BOOKING_PENDING', type: 'client', color: '#FF5722', emoji: '⏳' },
      { id: 'stage_converted', name: 'CONVERTED', type: 'client', color: '#4CAF50', emoji: '✅' },
      { id: 'stage_lost', name: 'LOST', type: 'lead', color: '#F44336', emoji: '❌' },
    ];
    let stages = loadState('crm-travel-lead-stages', DEFAULT_LEAD_STAGES);
    let migrated = false;
    stages = stages.map(s => {
      if (s.id === 'stage_waiting_payment' && s.type === 'universal') {
        s.type = 'client';
        migrated = true;
      }
      if (s.id === 'stage_cold_lead' && s.type === 'lost') {
        s.type = 'lead';
        migrated = true;
      }
      if (s.id === 'stage_lost_lead' && s.type === 'lost') {
        s.type = 'lead';
        migrated = true;
      }
      return s;
    });
    if (migrated) {
      saveState('crm-lead-stages', stages);
    }
    return stages;
  },
  saveLeadStages: async (stages) => {
    await delay();
    saveState('crm-lead-stages', stages);
    return stages;
  }
};
