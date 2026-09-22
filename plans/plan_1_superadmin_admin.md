# 🛫 Travel Agency CRM — Implementation Plan 1 of 4

## Roles Covered: `super_admin` + `admin`

---

## 🏷️ Global Branding (Affects All Roles)

| Location | Old | New |
|---|---|---|
| Sidebar logo text (DashboardLayout.jsx L684) | `AAA CONSULTANCY` | `WOW MY FLIGHT` |
| Sidebar subtitle (L688) | `SPAIN IMMIGRATION` | `TRAVEL AGENCY CRM` |
| Sidebar logo box (L671) | `A³` | `✈` |
| Browser tab title (index.html) | `AAA CRM` | `WOW MY FLIGHT CRM` |
| Login page title (AuthLayout.jsx) | `AAA Business Consultancy` | `WOW MY FLIGHT` |
| mockData.js — Agent emails | `@aaabusinessconsultancy.com` | `@wowmyflight.com` |

---

---

# 👑 ROLE 1: `super_admin` — CEO / Owner

---

## Sidebar Menu (super_admin sees ALL items)

```
WORKSPACE
  ✅ Dashboard          → /super_admin/dashboard
  ✅ Leads              → /leads
  ✅ Customers          → /clients
  🔄 Flight Requests    → /consultations  [rename label only]

TRAVEL OPERATIONS
  ✅ Flight Requests    → /flights
  ✅ Quotes             → /quotes
  ✅ Bookings           → /bookings
  ✅ PNR / Tracking     → /flight-alerts
  ✅ Ticketing          → /ticketing

FINANCE
  ✅ Payments           → /payments
  ✅ Invoices           → /payments/invoices
  ✅ Refunds            → /payments/refund-commission

MANAGEMENT
  ✅ Team               → /agents
  ✅ Suppliers          → /suppliers
  ✅ Reports            → /agents/performance

COMMUNICATION
  ✅ Social Inbox       → /social-inbox
    └ WhatsApp
    └ Facebook
    └ Instagram
    └ Telegram
    └ (others if connected)

ADMINISTRATION
  ✅ Users (RBAC)       → /active-cases
  ✅ Documents          → /documents/verify
  ✅ Settings           → /super_admin/customization
```

## SuperAdmin Dashboard — `SuperAdminDashboard.jsx`

### TOP ROW — KPI STAT CARDS (Replace Spain immigration stats)

| Widget | Old | New | Data Source |
|---|---|---|---|
| Card 1 | Cases Filed | **Gross Sales Volume** `$1,250,000` ↑ | Sum of all booking selling prices |
| Card 2 | Approvals | **Total Net Revenue** `$185,000` ↑ | Sales - Net Fares |
| Card 3 | Conversion | **Lead-to-Sale Conversion Rate** `22%` | Leads converted / total leads |
| Card 4 | — | **Net Profit Margin** `14.8%` | Revenue / Gross Sales |
| Card 5 | — | **Average Order Value (AOV)** `$2,100` | Total Sales / Bookings count |
| Card 6 | — | **Lead Waste %** `5%` | Wasted leads / total leads |
| Card 7 | — | **Avg Lead Reaction Time** `3 min` | Avg time agent picks up lead |

### MIDDLE ROW — CHARTS

| Widget | Old | New |
|---|---|---|
| Line chart | Spain visa pipeline | **Revenue Trend** (Jan-Jun, monthly) |
| Bar chart | Visa type breakdown | **Lead Waste by Month** bar chart |
| Gauge | — | **Conversion Rate** gauge (22%) |

### RIGHT PANEL — COMMUNICATION ANALYTICS

```
Communication Analytics Section:
┌─────────────────────────────────────────┐
│ Total Calls     13,235   Every day      │
│ SMS              2,368   Weekly         │
│ Emails          99,922   Monthly        │
│ WhatsApp     1,885,235   Monthly        │
└─────────────────────────────────────────┘
```

### BOTTOM — QUICK ACTION BUTTONS

```
[ Manage Users (RBAC) ]   [ API Integrations ]
[ System Settings      ]   [ Data Export      ]
```

### REMOVE from current SuperAdmin dashboard:
- ❌ Spain visa type breakdown
- ❌ NIE/TIE/DNV/NLV stats
- ❌ Immigration case pipeline

---

## Leads Page (`/leads`) — super_admin view

### Lead Card / Row Fields:
```
Is Day | Labels           | First Name | Last Name | Verified Phone | Verified Email | Assigned | Actions
  ☀️   | 🔥 Hot Lead      | Karan      | Singh     | +1 212 *** 78  | k@email.com    | Agent    | [Call][SMS][Chat][...]
       | 🇺🇸 VIP          |            |           |                |                |          |
       | 💲 Price Sensitive|            |           |                |                |          |
```

### Lead Detail Panel (right side on click):
```
Personal Data:
  Country:    India
  Time Zone:  UTC-05:00 Eastern Time
  City:       Columbus

Flight Request:
  Origin:     DEL (Delhi)
  Destination: LHR (London Heathrow)
  Travel Date: 15 Oct 2026
  Return Date: 22 Oct 2026
  Cabin Class: Business
  Passengers:  2 Adults

Registration Data:
  Email:      karan@example.com
  Phone:      +1 212 555 0199
  Source:     Google Ads

Activity History:
  Timestamp    Agent       Status       Comments
  16:16:23:03  agent1      New Dialed   —
  16:36:23:01  agent1      Follow-up    Interested in business class
```

### Lead Form (Add New Lead):
```
PERSONAL INFO:
  First Name *
  Last Name *
  Email *
  Phone * (with country code)
  Country
  City
  Time Zone (auto-detect or select)

FLIGHT REQUEST:
  Origin Airport * (searchable: DEL, JFK, DXB...)
  Destination Airport * (searchable: LHR, JFK...)
  Travel Date *
  Return Date (optional)
  Cabin Class * [Economy / Premium Economy / Business / First]
  Adults * [1-9]
  Children [0-6]
  Infants [0-4]
  Flexibility? [Exact Dates / ±3 days / ±7 days / Flexible]
  Budget Range * ($500-$1000 / $1000-$2000 / $2000+ / No limit)
  Special Requirements (textarea)

LEAD INFO:
  Source [Google Ads / Facebook / WhatsApp / Instagram / Referral / Walk-in]
  Labels [Hot Lead / VIP / Price Sensitive / Corporate / Urgent]
  Priority [High / Medium / Low]
  Assigned To (agent dropdown)
  Notes (textarea)
```

### Lead Status Flow:
```
New → Contacted → Qualified → Quote Sent → Negotiating → Won (Booking) / Lost / Wasted
```

---

## Customers Page (`/clients`) — super_admin view

### Customer Profile Fields:

```
PERSONAL DATA:
  Full Name
  Email
  Phone (with country code)
  Country / Nationality
  City
  Time Zone
  Language Preference

PASSPORT / TRAVEL DOCS:
  Passport Number
  Passport Expiry Date
  Nationality (for visa check)
  Other Nationalities held
  
TRAVEL PREFERENCES:
  Preferred Cabin Class
  Frequent Flyer Numbers (airline-wise)
  Preferred Airlines
  Seat Preference (Window/Aisle/Any)
  Meal Preference
  Special Assistance needs

BOOKING HISTORY:
  Table: Booking Ref | Route | Date | Class | Amount | Status

PAYMENT HISTORY:
  Table: Invoice # | Amount | Method | Status | Date

COMMUNICATION LOG:
  All calls, SMS, emails, WhatsApp shown chronologically
```

---

## Bookings Page (`/bookings`) — super_admin view

### Booking Card / Row:
```
Booking Ref | Customer | Route         | Travel Date | Class    | Pax | Amount    | Status
BK-001      | K. Singh  | DEL → LHR    | 15 Oct 26   | Business | 2   | $10,350   | Confirmed
BK-002      | A. Lee    | JFK → DXB    | 20 Nov 26   | Economy  | 4   | $3,200    | Ticketed
```

### Booking Detail / Form:
```
BOOKING INFO:
  Booking Reference (auto-generated: BK-XXXX)
  Lead/Customer (linked)
  Created By (agent)
  Created Date

FLIGHT DETAILS:
  Airline *
  Flight Number *
  Origin Airport * → Destination Airport *
  Departure Date + Time *
  Arrival Date + Time *
  Return Flight (if round trip)
  Cabin Class *
  Sabre PNR *
  GDS Booking Ref

PASSENGERS:
  [Add passenger rows]
  Name | DOB | Passport No | Expiry | Nationality

PRICING:
  Net Fare (Cost) *        $____
  Manual Markup %          ___%
  Fixed Markup USD         $____
  ─────────────────────────────
  Selling Price (calc)     $____
  Amount Paid              $____
  Balance Due              $____
  Net Profit Margin        $____

E-TICKET:
  E-Ticket Number(s) (13-digit, one per pax)
  Ticket Issue Date
  Ticket Issued By

STATUS FLOW:
  [Quoted] → [Confirmed] → [PNR Created] → [Payment Received] → [Ticketed] → [Dispatched] → [Completed]
  or → [Cancelled] → [Refunded]
```

---

## Quotes Page (`/quotes`) — super_admin view

### Quote Row:
```
Quote ID | Customer | Route | Options | Validity | Agent | Status | Actions
QT-001   | K. Singh | DEL→LHR| 3     | 24h      | Alex  | Sent   | [View] [Convert] [Resend]
```

### Quote Detail / Form:
```
QUOTE FOR:
  Customer (linked to lead/client)
  Flight Request Reference
  Created By (auto)
  Validity Period (12h / 24h / 48h / Custom)

FLIGHT OPTIONS (add up to 3):
  Option 1:
    Airline + Flight No.
    Route: Origin → Destination
    Departure + Arrival DateTime
    Stops: Direct / 1 Stop / 2 Stops
    Cabin Class
    Baggage: XX kg included
    Net Fare:     $____
    Markup %:     __%
    Selling Price: $____ (auto-calculated)
    Profit:        $____ (auto-shown)
    Notes

QUOTE STATUS FLOW:
  Draft → Sent → Viewed → Accepted → Rejected → Expired

ACTIONS:
  [Save Draft] [Send to Customer] [Convert to Booking]
```

---

## Payments Page (`/payments`) — super_admin view

### Payment Pipeline Section:
```
Transaction Link               Status
https://payment.co/tx/001      GENERATED
https://payment.co/tx/002      VIEWED
https://payment.co/tx/003      PAID        ← green highlight
https://payment.co/tx/004      DECLINED    ← red
https://payment.co/tx/005      REFUNDED    ← orange
```

### Transaction Table:
```
Transaction ID | Customer    | Booking Ref | Amount  | Method  | Risk Score | Actions
OFF132350      | K. Singh    | BK-001      | $10,350 | Card    | HIGH 🔴    | [Review] [Refund] [Auth Form]
OFF132360      | A. Lee      | BK-002      | $3,200  | Card    | LOW 🟢     | [Review]
```

### Actions & Tools:
```
[ Generate Payment Link ]  → Opens modal: Amount + Customer + Booking Ref + Link type
[ Create E-Sign Auth ]     → Opens e-signature authorization form
[ Refur Refund ]           → Opens refund workflow
```

---

## Reports Page (`/agents/performance`) — super_admin view

### Report Sections:
```
SALES REPORTS:
  Total Gross Sales | Net Revenue | Profit Margin
  Bookings by Route (top 10 routes)
  Bookings by Cabin Class (Economy/Business/First %)
  Monthly Revenue Trend (chart)

LEAD REPORTS:
  Total Leads | Converted | Wasted | Conversion Rate
  Lead Source Breakdown (Google/Facebook/WhatsApp...)
  Lead Reaction Time (avg by agent)
  Lead Waste by Agent

AGENT PERFORMANCE:
  Rank | Agent | Calls | Leads Closed | Revenue | Reaction Time

FLIGHT REPORTS:
  Top Airlines | Top Routes | Top Destinations
  Avg Profit per Booking

PAYMENT REPORTS:
  Payment Method Breakdown
  Chargeback Rate | Refund Rate
  Avg Order Value (AOV)
```

---
---

# 🟠 ROLE 2: `admin` — General Manager

---

## Sidebar Menu (admin sees):

```
WORKSPACE
  ✅ Dashboard        → /dashboard  (AdminDashboard.jsx)
  ✅ Leads            → /leads
  ✅ Customers        → /clients
  ❌ Consultations    → REMOVE (not relevant for admin in travel agency)

TRAVEL OPERATIONS
  ✅ Quotes           → /quotes
  ✅ Bookings         → /bookings

FINANCE
  ✅ Payments         → /payments
  ✅ Invoices         → /payments/invoices
  ✅ Refunds          → /payments/refund-commission

MANAGEMENT
  ✅ Team             → /agents
  ✅ Reports          → /agents/performance

COMMUNICATION
  ✅ Social Inbox     → /social-inbox

ADMINISTRATION
  ✅ Users            → /active-cases
  ✅ Documents        → /documents/verify
  
  [No Settings — super_admin only]
```

## Admin Dashboard — `AdminDashboard.jsx`

### TOP ROW — Stat Cards:
```
Card 1: Today's New Leads          [number] ↑
Card 2: Bookings This Month        [number]
Card 3: Revenue This Month         $[amount] ↑
Card 4: Pending Payments           [number] + $[amount]
Card 5: Open Quotes                [number] (expiring soon alert)
Card 6: Team Active Now            [number] agents online
```

### MIDDLE — Booking Pipeline:
```
Status         Count    Value
Quoted         12       $48,000
Confirmed      8        $32,000
PNR Created    6        $25,000
Payment Recv   5        $22,000
Ticketed       4        $18,000
Dispatched     3        $12,000
```

### MIDDLE — Charts:
```
Left: Weekly Booking Volume (bar chart - this week vs last week)
Right: Cabin Class Distribution (pie: Economy 60% / Business 35% / First 5%)
```

### BOTTOM — Today's Activity Feed:
```
[10:32] Agent Sofia created new lead — K. Singh (DEL→LHR, Business)
[10:45] Quote QT-001 sent to K. Singh — $10,350
[11:02] Payment received — BK-001, $10,350, PAID ✅
[11:15] Ticket issued — BK-001, E-Ticket: 0172345678901
```

### REMOVE from AdminDashboard:
- ❌ Spain visa stats
- ❌ NIE/TIE/DNV case counts
- ❌ Immigration consultation calendar widget

---

## All Other Pages for Admin Role:
> Same as Super Admin pages above — same forms, same fields.  
> **Difference:** Admin cannot see Suppliers and Settings menus.  
> Admin CAN approve discounts, manage team, view all bookings.

---

## Documents Page (`/documents/verify`) — admin + super_admin

### Document Types (New):
```
Type              | Purpose
──────────────────|──────────────────────────────
Passport          | Identity + travel eligibility
E-Ticket (PDF)    | Flight ticket file
Official Itinerary| Formatted trip details
Travel Insurance  | Coverage document
Visa Copy         | Destination visa if required
Hotel Voucher     | If hotel booked as package
Auth Form         | E-sign authorization for payment
```

### Document Status Flow:
```
Pending Upload → Uploaded → Under Review → Verified → Expired
```

---

## Team Page (`/agents`) — admin + super_admin

### Agent Card / Row:
```
Avatar | Name          | Role          | Status      | Calls | Leads | Revenue     | Conversion | Action
       | Sofia Rodriguez| Sales Agent  | 🟢 On Call  | 15    | 8/33  | $138,650    | 68%        | [Edit] [View]
       | Carlos GDS     | Flight Expert| 🟡 Away     | —     | 12    | $95,000     | —          | [Edit] [View]
```

### Agent Profile (New Fields Added):
```
PERSONAL:
  Name, Email, Phone, Role, Department
  Joining Date, Status (Active/Inactive)

PERFORMANCE (Travel-specific):
  Calls Today / This Month
  SMS Sent / Emails Sent
  Leads Assigned / Leads Closed
  Bookings Confirmed
  Revenue Generated
  Average Lead Reaction Time
  Average Call Duration
  Conversion Rate

SKILLS:
  GDS Proficiency (Sabre/Amadeus/Galileo)
  Languages Spoken
  Specialized Routes/Regions
  Flight Classes expertise
```

---

# 📌 Summary — Plan 1 of 4

| Component | Change Type | File |
|---|---|---|
| Branding (sidebar) | Minor edit | DashboardLayout.jsx |
| Super Admin Dashboard | Major rewrite | SuperAdminDashboard.jsx |
| Admin Dashboard | Major rewrite | AdminDashboard.jsx |
| Leads form + fields | Major update | pages/leads/* |
| Customers profile fields | Medium update | pages/clients/* |
| Bookings form + fields | Major update | pages/bookings/* |
| Quotes form + pricing | Major update | pages/quotes/* |
| Payments + pipeline | Medium update | pages/payments/* |
| Documents types | Medium update | pages/documents/* |
| Team agent profile | Medium update | pages/team/* |
| Reports sections | Medium update | pages/reports/* |
| mockData.js data | Major rewrite | constants/mockData.js |
