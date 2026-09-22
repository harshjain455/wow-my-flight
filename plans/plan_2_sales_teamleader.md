# 🛫 Travel Agency CRM — Implementation Plan 2 of 4

## Roles Covered: `consultant` (Sales Executive) + `team_leader`

---

# 🟡 ROLE 3: `consultant` → **Sales Executive**

---

## WORKSPACE
  ✅ Dashboard        → /agent/dashboard   (AgentDashboard.jsx)
  ✅ Leads            → /agent/leads       ("My Leads")
  ✅ Customers        → /agent/clients     ("My Customers")
  ❌ Consultations    → REMOVE

TRAVEL OPERATIONS
  ✅ Quotes           → /agent/quotes      (Request flight quotes)
  ✅ Bookings         → /agent/bookings    (My bookings)

COMMUNICATION
  ✅ Social Inbox     → /social-inbox
    └ WhatsApp
    └ Facebook
    └ Instagram
    └ Telegram
```

> **Nota:** Sales agent ko Flight Requests, PNR Tracking, Ticketing, Finance, Team nahi dikhega.

---

## Sales Executive Dashboard — `AgentDashboard.jsx` (Major Rewrite)

### TOPBAR — Dual Clock:
```
┌──────────────────────────────────────────────────────────────┐
│  WOW MY FLIGHT                Agent (IST): 17:38    Client (EST): 07:38    ☀️ DAYTIME   │
└──────────────────────────────────────────────────────────────┘
```
- Agent timezone: Auto from browser / profile setting
- Client timezone: Auto-detect from selected lead's country/city
- Day/Night indicator based on client's local time

---

### LAYOUT — 3 Column Split:

```
[LEFT COLUMN]           [CENTER COLUMN]          [RIGHT COLUMN]
Lead Queue              Client Detail Panel       TELNYX Dialer
──────────────          ───────────────────       ──────────────
```

---

### LEFT COLUMN — HIGH PRIORITY LEADS:

```
HIGH PRIORITY LEADS (5)              ✅ Verified by OTP

Is Day | Labels          | First Name | Last Name | Verified Phone | Verified Email | Assigned | Actions
  ☀️   | 🔥 Hot Lead     | Karan      | Singh     | +1 212 *** 78  | k@email.com    | me       | [📞][💬][✉][...]
       | 🇺🇸 VIP         |            |           |                |                |          |
       | 💲 Price Sensitive|           |           |                |                |          |

  ☀️   | 🔥 Hot Lead     | Ankit      | Sharma    | +1 212 *** 78  | a@email.com    | me       | [📞][💬][✉][...]
       | 🇺🇸 VIP         |            |           |                |                |          |

  [row 3...]
  [row 4...]
  [row 5...]
```

**Lead Labels (multi-select badges):**
- 🔥 `Hot Lead` — orange badge
- 🇺🇸 `VIP` — blue badge  
- 💲 `Price Sensitive` — yellow/grey badge
- 🏢 `Corporate` — purple badge
- 🚨 `Urgent` — red badge

**Action Icons per row:**
- 📞 Call (opens dialer)
- 💬 WhatsApp/SMS
- ✉️ Email
- `...` More options

---

### CENTER COLUMN — Client Detail Panel (on lead click):

```
Karan Singh — CLIENT ID: 463522372
───────────────────────────────────

Personal Data:
  Country:    India
  Time Zone:  UTC-05:00 Eastern Time
  City:       Columbus

Flight Request:
  Origin:     DEL (Delhi Indira Gandhi)
  Destination: LHR (London Heathrow)
  Travel Date: 15 Oct 2026
  Return:      22 Oct 2026
  Class:       Business
  Pax:         2 Adults

Registration Data:
  Email:      karan@example.com
  Phone:      +1 212 555 0199
  Source:     Google Ads

Activity History:
  Timestamp    Agent       Status        Comments
  16:16:23:03  agent1      New Dialed    —
  16:36:23:01  agent1      Call Back     Interested, wants price
  17:02:15:44  me          Quote Sent    Sent Option 1 & 2
  ─────────────────────────────────────────────────────────────
  [Add comment field...]             [Add comment] button

QUICK ACTIONS:
  [Request Quote from GDS]  [Create Booking]  [Send Payment Link]
```

---

### RIGHT COLUMN — TELNYX WEBRTC DIALER:

```
┌─────────────────────────────────────┐
│  TELNYX WEBRTC DIALER          ···  │
├─────────────────────────────────────┤
│  Status: ON CALL — 00:03:12         │
│                                     │
│  Karan Singh                        │
│  +1 212 555 0199                    │
│                                     │
│  [🔇 Mute] [⏸ Hold] [↔ Transfer] [📨 VM Drop] │
│                                     │
│  [1]  [2 ABC]  [3 DEF]             │
│  [4 GHI] [5 JKL] [6 MNO]          │
│  [7 PQRS][8 TUV] [9 WXYZ]         │
│  [*]  [0]      [#]                 │
│                                     │
│  [📞 CALL]              [✕]        │
│                                     │
│  Wow My Flight                      │
└─────────────────────────────────────┘

Personal Daily Stats:
  Calls: 15   |  SMS: 4   |  Emails: 2
  Lead Reaction Time: 2:30 min
  Leads Taken: 8  |  Leads Closed: 2
  Leads Wasted: 1
```

**Dialer States:**
- `IDLE` — grey, ready to dial
- `DIALING` — blue, ringing animation
- `ON CALL — 00:03:12` — green with live timer
- `HOLD` — yellow
- `CALL ENDED` — brief flash then reset

---

## Sales Agent — Leads Page (`/agent/leads`)

### Filter Options:
```
[My Leads] [All Team Leads - if TL allows]

Filters:
  Status: [All / New / Contacted / Qualified / Quote Sent / Won / Lost]
  Priority: [All / High / Medium / Low]
  Labels: [Hot Lead / VIP / Price Sensitive]
  Date Range: [Today / This Week / This Month / Custom]
  Route: [Origin] → [Destination]
  Cabin Class: [Economy / Business / First]
```

### Lead List View:
Same as described in Plan 1 (Leads Page) but filtered to agent's own leads.

### Lead Actions per agent:
- ✅ View lead detail
- ✅ Add/edit comments
- ✅ Change status
- ✅ Log call/SMS/email activity
- ✅ Request flight quote (sends to Flight Expert)
- ✅ Send payment link
- ❌ Cannot: Delete lead, reassign to other agent (TL only), see other agents' leads

---

## Sales Agent — Quotes Page (`/agent/quotes`)

### What agent can do:
```
1. Create Flight Request:
   - Fill in: Route, Dates, Class, Pax, Budget
   - Submit to Flight Expert queue

2. View received quotes:
   - Option 1 / Option 2 / Option 3 comparison
   - Net fare HIDDEN (only selling price visible to agent — profit protected)
   - Send quote to customer (WhatsApp/Email/SMS)

3. Follow up on quotes:
   - Resend
   - Request revision
   - Mark as Accepted / Rejected
```

### Quote Card (agent view):
```
Quote QT-001 for Karan Singh
  Route: DEL → LHR | Business | 2 Pax
  Option 1: Air India AI-101 | 15 Oct | $10,350 | Direct ✈️
  Option 2: British Airways BA-117 | 15 Oct | $9,800 | 1 Stop
  Validity: Expires in 18 hours ⏰
  Status: 👁️ Viewed by customer
  
  [Send to Customer ↗] [Mark Accepted ✅] [Mark Rejected ❌] [Request Revision 🔄]
```

---

## Sales Agent — Bookings Page (`/agent/bookings`)

### Booking status visible to agent:
```
BK-001 | Karan Singh | DEL→LHR | 15 Oct | Business | Ticketed ✅
BK-002 | Ankit Sharma | JFK→DXB | 20 Nov | Economy  | Quote Sent 📤
BK-003 | Rita Verma  | DEL→SIN | 05 Dec | Economy  | Payment Pending ⏳
```

### Agent cannot see: Net fare, profit margin (only sees selling price & status)

---

---

# 🟢 ROLE 4: `team_leader` — Team Leader

---

## Sidebar Menu (Team Leader sees):

```
WORKSPACE
  ✅ Dashboard        → /team_leader/dashboard  (TeamLeaderDashboard.jsx)
  ✅ Leads            → /team_leader/leads       (All team leads)
  ✅ Customers        → /team_leader/clients     (All team customers)

TRAVEL OPERATIONS
  ✅ Quotes           → /quotes                  (View all team quotes)
  ✅ Bookings         → /bookings                (View all team bookings)

MANAGEMENT
  ✅ Team             → /agents                  (Manage own team)
  ✅ Reports          → /agents/performance      (Team performance)

COMMUNICATION
  ✅ Social Inbox     → /social-inbox
```

> Team Leader ko: Finance, Suppliers, Settings, Ticketing, PNR Tracker visible nahi.

---

## Team Leader Dashboard — `TeamLeaderDashboard.jsx` (Almost Completely New)

### TOPBAR:
```
Team Leader Dashboard                  Dual Clocks: Agent Local: 14:00 | Client Local: 09:00 EST
```

### LAYOUT — 3 Column:
```
[LEFT COLUMN]                [CENTER COLUMN]                [RIGHT COLUMN]
Real-Time Agent Feed         Team Performance Metrics       Lead Management Options
Leadership Tools             Lead Queue Status              Lead Reallocation Tool
```

---

### LEFT COLUMN — REAL-TIME AGENT ACTIVITY FEED:

```
REAL-TIME AGENT ACTIVITY FEED             [LIVE CALL ▾]

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 👩 Maria S.     │  │ 👨 John D.      │  │ 👨 Ken T.       │  │ 👩 Sara K.      │
│ 🟢 On Call      │  │ 🟡 Idle • 12m   │  │ 🔴 Away-Break   │  │ 🟢 On Call      │
│ ⏱ 00:2:44      │  │ ⏱ 00: 12m       │  │ ⏱ 00:02:40     │  │ ⏱ 00:14h       │
│ Recent: 23min   │  │ Recent Activity │  │ Recent Activity │  │ Recent: 27min   │
│                 │  │                 │  │                 │  │                 │
│ LEADERSHIP:     │  │ LEADERSHIP:     │  │ LEADERSHIP:     │  │ LEADERSHIP:     │
│ [Barge/Whisper▾]│  │ [Barge/Whisper▾]│  │ [Barge/Whisper▾]│  │ [Barge/Whisper▾]│
│ [Recycle Leads▾]│  │ [Recycle Leads▾]│  │ [Recycle Leads▾]│  │ [Recycle Leads▾]│
│ [Override Disc▾]│  │ [Override Disc▾]│  │ [Override Disc▾]│  │ [Override Disc▾]│
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Agent Status Colors:**
- 🟢 Green: On Call (live)
- 🟡 Yellow: Idle (with timer how long)
- 🔴 Red: Away / On Break
- ⚫ Grey: Offline

**Leadership Tool Dropdowns per agent:**
- `Barge/Whisper` → [Barge Into Call] [Whisper to Agent] [Listen Only]
- `Recycle Leads` → [Recycle All / Recycle Today's / Select Leads]
- `Override Discount` → [Allow 5% off] [Allow 10% off] [Custom]

---

### LEFT COLUMN — LEAD QUEUE STATUS:

```
LEAD QUEUE STATUS                       [LIVE SUMMARY]

┌────────────────────┬────────────────────┬──────────────────────────────┐
│ Unassigned Leads   │ New Inbound        │ HIGH REACTION TIME ⚠️        │
│       15           │       8            │          23min               │
└────────────────────┴────────────────────┴──────────────────────────────┘

Lead Queue Table:
  Lead Type          Source         Assigned Time
  Neglected Lead     Apps           09/18 09:00
  Neglected Lead     Google Data    09/18 09:00
  Hot VIP Lead       Original Time  09/18 09:00
  New Inbound        Google Data    09/18 20:03
  Neglected Lead     Original Time  09/18 19:33
```

---

### CENTER COLUMN — TEAM PERFORMANCE METRICS:

```
TEAM PERFORMANCE METRICS

CONVERSION RATE              TEAM REVENUE TREND
     8.1%                    (USD 225k)
   [gauge]                   [line chart Jan-Jun]
   $25k level
   $20k level ...

Avg Call Duration    Calls Today    SMS Sent
    63 min              14           449
```

---

### CENTER COLUMN — TOP AGENTS LEADERBOARD:

```
TOP AGENTS LEADERBOARD

#  Agent          Closed Sales  Revenue      Lead Turnaround Time
1  👩 Maria S.   33            $138.65k     22min
   On Call
2  👨 John D.    26            $138.20k     13min
   Idle · 12m
3  👨 Ken T.     21            $134.15k     23min
   Away · Break
4  👩 Sara K.    7             $123.20k     23min
   On Call
5  👨 Han R.     10            $134.10k     33min
   On Break
```

---

### RIGHT COLUMN — LEAD MANAGEMENT OPTIONS:

```
LEAD MANAGEMENT OPTIONS

[✅ Assign Leads (Round-Robin)  ]  ← primary green button
[   Manual Reallocation         ]
[   Discounts Approval Queue    ]
[   Wasted Leads Cooldown       ]
```

**Round-Robin Assignment:** Auto-distributes new inbound leads equally among active agents.

**Discounts Approval Queue:**
```
Agent Sofia requested 10% discount for Karan Singh (DEL→LHR, $10,350)
[Approve ✅] [Reject ❌] [Counter-offer: 5% 🔄]
```

---

### RIGHT COLUMN — LEAD REALLOCATION TOOL:

```
LEAD REALLOCATION TOOL

Lead Attention    Current Agent    Lead Importance    Action
Need read         Alex R.          Hot Lead           [Reassign]
Need read         Alex R.          Hot Lead           [Reassign]
Lead Lead         Alex R.          Lead Lead          [Reassign]
NeedLead          Alex R.          VIP                [Reassign]
Lead Lead         Alex R.          VIP                [Reassign]
NeedLead          Alex R.          VIP                [Reassign]
Lead Lead         Alex R.          Hot Lead           [Reassign]
Lead Lead         Alex T.          Hot Lead           [Reassign]
Lead Lead         Hen T.           Hot Lead           [Reassign]
```

**Reassign Click → Modal:**
```
Reassign Lead to:
  [Agent Dropdown — only active/online agents shown]
  Reason (optional): [textarea]
  [Confirm Reassign] [Cancel]
```

---

## Team Leader — Leads Page (`/team_leader/leads`)

### Extra powers vs Sales Agent:
- ✅ See ALL team members' leads (not just own)
- ✅ Reassign any lead to any agent
- ✅ Approve/reject discount requests
- ✅ Recycle wasted leads back to pool
- ✅ Edit lead priority + labels
- ✅ Manually change lead status
- ❌ Cannot: Access finance, ticketing, settings

### Additional filters:
```
[Filter by Agent] ← Team Leader extra filter
[Show: All / My Leads / Unassigned / Neglected / Overdue]
```

---

## Team Leader — Team Page (`/agents`)

### Team Leader sees only their own team members (not all company agents).

### Team Member Card:
```
👩 Sofia Rodriguez
Role: Sales Executive
Status: 🟢 On Call (2:44)
Today: Calls 15 | Leads 8 | Closed 2 | Revenue $15,000
[View Stats] [Manage] [Reassign Leads] [Message]
```

---

# 📌 Summary — Plan 2 of 4

| Component | Change Type | File |
|---|---|---|
| AgentDashboard | Major rewrite | AgentDashboard.jsx |
| Dual Clock widget | New component | New DualClock.jsx |
| Priority Lead labels | Update | pages/leads/* |
| Client detail panel | New component | New ClientPanel.jsx |
| Telnyx Dialer panel | New component | New DialerPanel.jsx |
| Agent daily stats | New widget | AgentDashboard.jsx |
| TeamLeaderDashboard | Almost complete rewrite | TeamLeaderDashboard.jsx |
| Agent activity feed | New component | New AgentActivityFeed.jsx |
| Lead queue status | New widget | TeamLeaderDashboard.jsx |
| Top agents leaderboard | New component | New Leaderboard.jsx |
| Lead reallocation tool | New component | New ReallocationTool.jsx |
| Leadership tools | New dropdowns | New LeadershipTools.jsx |
| Quotes (agent view) | Update (hide net fare) | pages/quotes/* |
