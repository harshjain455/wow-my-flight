# 🛫 Travel Agency CRM — Implementation Plan 4 of 4

## Roles Covered: `finance` + `marketing` + mockData.js Overhaul

---

# 💰 ROLE 7: `finance` — Finance / Payment Manager

---

## Sidebar Menu (Finance sees):

```
WORKSPACE
  ✅ Dashboard        → /finance/dashboard   (FinanceDashboard.jsx)

FINANCE
  ✅ Payments         → /finance/payments
  ✅ Invoices         → /finance/payments/invoices
  ✅ Refunds          → /finance/payments/refund-commission

MANAGEMENT
  ✅ Reports          → /agents/performance   (Financial reports section)
```

> Finance cannot see: Leads, Customers, Bookings (detail), Team management, Social Inbox, Settings.

---

## Finance Dashboard — `FinanceDashboard.jsx` (Major Update)

### TOPBAR TABS (New):
```
[📊 Dashboard]  [👁 Monitoring]  [📦 Main Modules]  [⚙ Overview]
```

### LAYOUT — 3 Column:

```
[LEFT COLUMN - 25%]              [CENTER COLUMN - 45%]           [RIGHT COLUMN - 30%]
Payment Pipeline                 Chargeback Risk Radar            Actions & Tools
                                 Transaction Table                Refunds & Cancellations
```

---

### LEFT COLUMN — PAYMENT PIPELINE:

```
PAYMENT PIPELINE
Real-time feed of transaction links

Status
──────
https://transaction.co...    GENERATED
  Transaction link/0000005

https://transaction.co...    VIEWED
  Transaction link/042525

https://transaction.co...    PAID        ← 🟢 green highlight
  Transaction link/333333

https://transaction.co...    DECLINED    ← 🔴 red
  Transaction link/6050751

https://transaction.co...    DECLINED    ← 🔴 red
  Transaction link/6060751

https://transaction.co...    REFUNDED    ← 🟡 orange
  Transaction link/2050910

https://transaction.co...    REFUNDED    ← 🟡 orange
  Transaction link/A233315
```

**Payment Link Statuses:**
- `GENERATED` — Link created, not yet opened
- `VIEWED` — Customer opened link
- `PAID` — Payment completed ✅
- `DECLINED` — Card declined ❌
- `REFUNDED` — Money returned 🔄
- `EXPIRED` — Link expired ⏰
- `CHARGEBACK` — Dispute raised ⚠️

---

### CENTER COLUMN — CHARGEBACK RISK RADAR:

```
CHARGEBACK RISK RADAR
AI-driven risk analysis of recent transactions

[Risk Heatmap Matrix]:
          Low    Medium    High
High   |       |          | OFF132316 🔴 |
       |       |          | OFF372313 🔴 |
Medium |       | OFF152753 🟡 |           |
Low    | OFF132523 🟢 |   |              |

Risk Factors:
🔴 OFF132316 — Card Billing vs. Passenger Country Mismatch
🔴 OFF372313 — AVS Fail
🟡 OFF152753 — 3D Secure Not Verified
🟢 OFF132523 — 3D Secure Not Verified (Low risk)
```

**Risk Score Factors:**
- Card billing country ≠ Passenger country → HIGH
- AVS (Address Verification) fail → HIGH
- 3D Secure not completed → MEDIUM
- New customer, large amount → MEDIUM
- Returning customer, verified → LOW

---

### CENTER COLUMN — TRANSACTION TABLE:

```
Transaction ID | Client Name      | Booking Ref | Amount ($) | Payment Method | Risk Score | Actions
OFF132350      | Culast Garner    | OF395735    | $120.00    | Payment        | High 🔴    | [Review] [Issue Refund] [Send Auth Form]
OFF132360      | Itim Sthoer      | OF132373    | $130.00    | Payment        | High 🔴    | [Issue Refund] [Send Auth Form]
OFF132370      | Brach Name       | OF382327    | $120.00    | Payment        | High 🔴    | [Issue Refund] [Send Auth Form]
OFF132550      | Auth Devan       | OF392576    | $79.00     | Payment        | Low 🟢     | [Review]
OFF122510      | Josen Name       | OF383338    | $130.00    | Payment        | Low 🟢     | [Review]
```

**Transaction Actions:**
- `Review` → View full transaction detail
- `Issue Refund` → Opens refund flow
- `Send Auth Form` → Sends e-sign authorization to customer

---

### RIGHT COLUMN — ACTIONS & TOOLS:

```
ACTIONS & TOOLS
Generate payment payment link

┌────────────────────────────────────┐
│    GENERATE PAYMENT LINK           │  ← big green button
└────────────────────────────────────┘

┌────────────────────────────────────┐
│    CREATE E-SIGN AUTHORIZATION     │
└────────────────────────────────────┘
```

**Generate Payment Link → Modal:**
```
Generate Payment Link
──────────────────────
Customer:     [search/select]
Booking Ref:  [BK-XXXX]
Amount:       $[______]
Currency:     [USD ▾]
Description:  [Flight DEL→LHR for Karan Singh]
Expiry:       [24h / 48h / 7 days]
Send via:     [Email] [WhatsApp] [SMS] [Copy Link]

[Generate & Send]  [Cancel]
```

**Create E-Sign Authorization → Modal:**
```
E-Sign Authorization Form
──────────────────────────
Customer Name:  [________]
Amount:         $[________]
For:            [Booking BK-XXXX, Flight DEL→LHR]
Authorization:  "I authorize WOW MY FLIGHT to charge..."
Send to:        [customer@email.com]
Method:         [DocuSign / Manual Upload / In-person]

[Send for Signature]  [Cancel]
```

---

### RIGHT COLUMN — REFUNDS & CANCELLATIONS:

```
REFUNDS & CANCELLATIONS
Process refund cancellations

┌──────────────────┐
│   REFUR REFUND   │   ← button (initiate refund)
└──────────────────┘
```

**Refund Flow:**
```
1. Select Booking to refund
2. Enter refund reason: [Cancellation by customer / Flight cancelled / Overbooking / Other]
3. Calculate refund amount:
     Total Paid:           $10,350
     Airline Cancellation:  -$200 (supplier fee)
     Our Service Fee:       -$100
     ──────────────────────────────
     Refundable Amount:    $10,050
4. Refund Method: [Original Card / Bank Transfer / Credit Note]
5. Timeline: [Immediate / 3-5 days / 7-10 days]
6. [Process Refund] [Cancel]
7. → Booking status → Cancelled/Refunded
8. → Auto-notify customer
```

---

## Finance — Payments Page (`/finance/payments`)

```
FILTERS:
  Status: [All / Generated / Paid / Declined / Refunded / Chargeback]
  Date Range: [Today / This Week / Custom]
  Risk Level: [All / High / Medium / Low]
  Amount Range: [$0 to $999 / $1000-$4999 / $5000+]

SUMMARY BAR:
  Total Collected: $185,000   Pending: $24,000   Declined: $3,200   Refunded: $8,500

PAYMENT LIST:
  Same as Transaction Table above (with full filters)
```

---

## Finance — Invoices Page (`/finance/payments/invoices`)

```
Invoice List:

INV-001 | Karan Singh | BK-001 | DEL→LHR Business | $10,350 | Paid ✅ | 15 Oct 26 | [View PDF] [Resend]
INV-002 | Ankit Sharma| BK-002 | JFK→DXB Economy  | $3,200  | Paid ✅ | 20 Nov 26 | [View PDF] [Resend]
INV-003 | Rita Verma  | BK-003 | DEL→SIN Economy  | $2,800  | Pending⏳| 05 Dec 26 | [Send Link] [Remind]

[+ Create Invoice]
```

**Invoice PDF contains:**
- WOW MY FLIGHT logo + contact
- Invoice number + date
- Customer name + email
- Booking reference
- Flight details (Route, Date, Class, Pax)
- Itemized pricing (Base fare + Taxes + Service fee)
- Payment method + date paid
- Terms & conditions

---

## Finance — Refunds Page (`/finance/payments/refund-commission`)

```
Refund/Commission Tracker:

REF-001 | Karan Singh | BK-001 | $10,050 refund | Card Refund | Processing 🟡 | 09/18 | [View]
REF-002 | Ankit Sharma| BK-002 | $100 commission| Agent Credit | Paid ✅       | 09/15 | [View]

[+ New Refund Request]
[+ Log Agent Commission]
```

---
---

# 📢 ROLE 8: `marketing` — Marketing Manager

---

## Sidebar Menu (Marketing sees):

```
WORKSPACE
  ✅ Dashboard        → /marketing-manager/dashboard   (MarketingDashboard.jsx)
  ✅ Leads            → /marketing-manager/leads       (All leads + sources)

COMMUNICATION
  ✅ Social Inbox     → /social-inbox
    └ WhatsApp
    └ Facebook  
    └ Instagram
    └ Telegram
    └ LinkedIn
    └ (others)
```

> Marketing cannot see: Bookings, Finance, Team, Ticketing, Settings.

---

## Marketing Dashboard — `MarketingDashboard.jsx` (Update Labels)

### Stat Cards (Update):
| Old | New |
|---|---|
| Spain visa inquiries | Flight inquiries this month |
| Immigration services | Popular destinations |
| Visa approval rate | Lead-to-booking conversion |
| Campaign clicks | Campaign clicks (same) |

### Lead Source Chart (Keep + Update labels):
```
Lead Sources:
  Google Ads       → 35%
  Facebook Ads     → 25%
  Instagram        → 20%
  WhatsApp Organic → 10%
  Referral         → 7%
  Walk-in / Other  → 3%
```

### Campaign Performance (Update context):
```
Old: "Spain Digital Nomad Visa Campaign"
New: "Dubai to London Business Class Deal"
     "Maldives Holiday Package — Economy"
     "JFK to DEL — Festival Season Promo"
```

### New Section — Flight Deal Broadcasts:
```
ACTIVE FLIGHT DEALS (for broadcast)
  ✈ DEL → LHR | Business Class | $4,500 | Valid 48h | [Broadcast on WhatsApp] [Post on Instagram]
  ✈ JFK → DXB | Economy       | $799   | Valid 24h | [Broadcast on WhatsApp] [Post on Facebook]
  
  [+ Add New Flight Deal]
```

---

## Marketing — Leads Page (Marketing view)

Marketing sees all leads with **source tracking focus**:

```
LEAD SOURCE ANALYTICS:
  [Google Ads: 142 leads → 31 booked → 22% conversion]
  [Facebook: 89 leads → 14 booked → 16% conversion]
  [Instagram: 67 leads → 12 booked → 18% conversion]
  [WhatsApp: 45 leads → 15 booked → 33% conversion ← best!]
  
  Best performing source: WhatsApp Organic
  Cost per Lead (Google): $24
  Cost per Booking (Google): $109
```

---
---

# 🗂️ GLOBAL — mockData.js Complete Overhaul

**File:** `src/constants/mockData.js`

### REMOVE (Spain immigration specific):
```javascript
// DELETE these completely:
export const SERVICES = [...] // Spain visa services
export const RELOCATION_SERVICES = [...] // NIE, TIE, Empadronamiento etc.
export const PACKAGES = [...] // Full Process, Premium packages
```

### ADD (Travel Agency specific):
```javascript
// NEW: Cabin classes
export const CABIN_CLASSES = [
  { id: 'economy', name: 'Economy', code: 'Y', multiplier: 1.0 },
  { id: 'premium_eco', name: 'Premium Economy', code: 'W', multiplier: 1.5 },
  { id: 'business', name: 'Business Class', code: 'J', multiplier: 2.5 },
  { id: 'first', name: 'First Class', code: 'F', multiplier: 4.0 },
];

// NEW: Popular routes
export const POPULAR_ROUTES = [
  { origin: 'JFK', destination: 'LHR', originCity: 'New York', destCity: 'London' },
  { origin: 'DEL', destination: 'LHR', originCity: 'Delhi', destCity: 'London' },
  { origin: 'DXB', destination: 'JFK', originCity: 'Dubai', destCity: 'New York' },
  ...
];

// NEW: Airlines
export const AIRLINES = [
  { code: 'AA', name: 'American Airlines' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AI', name: 'Air India' },
  { code: 'EK', name: 'Emirates' },
  ...
];

// NEW: Lead labels
export const LEAD_LABELS = [
  { id: 'hot_lead', name: 'Hot Lead', emoji: '🔥', color: '#FF6B35' },
  { id: 'vip', name: 'VIP', emoji: '🇺🇸', color: '#2563EB' },
  { id: 'price_sensitive', name: 'Price Sensitive', emoji: '💲', color: '#6B7280' },
  { id: 'corporate', name: 'Corporate', emoji: '🏢', color: '#7C3AED' },
  { id: 'urgent', name: 'Urgent', emoji: '🚨', color: '#DC2626' },
];

// NEW: Travel add-ons (upsells)
export const TRAVEL_ADDONS = [
  { id: 'seat_upgrade', name: 'Seat Upgrade', description: 'Extra legroom / Exit row' },
  { id: 'extra_baggage', name: 'Extra Baggage', description: '23kg add-on' },
  { id: 'travel_insurance', name: 'Travel Insurance', description: 'Comprehensive coverage' },
  { id: 'airport_transfer', name: 'Airport Transfer', description: 'Private car service' },
  { id: 'hotel', name: 'Hotel', description: 'Partner hotel booking' },
];

// UPDATE: AGENTS (keep same structure, update bios + roles + expertise)
export const AGENTS = [
  {
    id: 'c1',
    name: 'Sofia Rodriguez',
    email: 'sofia.r@wowmyflight.com',
    role: 'consultant',
    // Update bio:
    bio: 'Senior Flight Sales Executive with 5 years expertise in Business Class bookings.',
    // Add:
    department: 'Sales',
    gdsSkills: [],
    specializedRoutes: ['US-UK', 'India-UK', 'Middle East-Europe'],
  },
  {
    id: 'fe1',
    name: 'Carlos GDS Expert',
    email: 'carlos.gds@wowmyflight.com',
    role: 'flight_expert',
    bio: 'GDS Expert with Sabre & Amadeus proficiency. 8 years international routing experience.',
    department: 'GDS/Pricing',
    gdsSkills: ['Sabre', 'Amadeus', 'Galileo'],
    specializedRoutes: ['Transatlantic', 'Asia-Pacific'],
  },
  ...
];

// UPDATE: Booking status flow
export const BOOKING_STATUSES = [
  'Quoted', 'Confirmed', 'PNR Created', 
  'Payment Received', 'Ticketed', 'Dispatched', 
  'Completed', 'Cancelled', 'Refunded'
];

// UPDATE: Lead statuses
export const LEAD_STATUSES = [
  'New', 'Contacted', 'Qualified', 
  'Quote Sent', 'Negotiating', 'Won', 
  'Lost', 'Wasted'
];

// UPDATE: Document types
export const DOCUMENT_TYPES = [
  'Passport', 'E-Ticket PDF', 'Official Itinerary',
  'Travel Insurance', 'Visa Copy', 'Hotel Voucher', 
  'E-Sign Authorization'
];
```

---

# 📌 Summary — Plan 4 of 4

| Component | Change Type | File |
|---|---|---|
| FinanceDashboard | Major update | FinanceDashboard.jsx |
| Payment Pipeline widget | New component | New PaymentPipeline.jsx |
| Chargeback Risk Radar | New component | New ChargebackRadar.jsx |
| Generate Payment Link modal | New component | New PaymentLinkModal.jsx |
| E-Sign Authorization modal | New component | New ESignModal.jsx |
| Refund workflow | Update | pages/payments/refund |
| Transaction table | New component | New TransactionTable.jsx |
| MarketingDashboard | Minor update | MarketingDashboard.jsx |
| Flight Deal Broadcasts | New section | MarketingDashboard.jsx |
| mockData.js | Major rewrite | constants/mockData.js |
| AGENTS data update | Update bios + fields | constants/mockData.js |
| SERVICES → CABIN_CLASSES | Complete replace | constants/mockData.js |
| PACKAGES → TRAVEL_ADDONS | Complete replace | constants/mockData.js |

---

# 🏁 COMPLETE MASTER CHECKLIST

## Phase 1 — Foundation
- [ ] Branding in DashboardLayout.jsx (logo, title, subtitle)
- [ ] mockData.js complete overhaul
- [ ] Lead labels add (Hot Lead, VIP, Price Sensitive)
- [ ] Booking status flow update
- [ ] Terminology update in all labels

## Phase 2 — Dashboards
- [ ] SuperAdminDashboard.jsx — Travel KPIs
- [ ] AdminDashboard.jsx — Booking pipeline
- [ ] AgentDashboard.jsx — Dual Clock + Priority Leads + Dialer + Daily Stats
- [ ] TeamLeaderDashboard.jsx — Agent Feed + Leaderboard + Reallocation
- [ ] FlightExpertDesk.jsx — GDS Parsing + Margin Calculator + Upsell
- [ ] TicketingIssuance.jsx — Issuance Queue + Controls + PNR Tracker
- [ ] FinanceDashboard.jsx — Payment Pipeline + Chargeback Radar
- [ ] MarketingDashboard.jsx — Travel context update

## Phase 3 — Pages
- [ ] Leads page — Flight request fields + labels
- [ ] Clients page — Passport + travel preference fields
- [ ] Bookings page — PNR, E-ticket, route, pricing fields
- [ ] Quotes page — Multi-option flight quotes with pricing
- [ ] Payments page — Payment pipeline + risk radar
- [ ] Documents page — Travel document types
- [ ] Reports page — Travel-specific reports
- [ ] PNR Tracking page — Live tracker

## Phase 4 — Sidebar + Routing
- [ ] Remove "Consultations" from admin + sales agent sidebar
- [ ] Rename "Consultations" label to "Flight Requests" where visible
- [ ] Verify all role-based route access is correct
