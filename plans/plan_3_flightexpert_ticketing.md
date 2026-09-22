# 🛫 Travel Agency CRM — Implementation Plan 3 of 4

## Roles Covered: `flight_expert` (GDS Desk) + `ticketing_agent`

---

# 🔵 ROLE 5: `flight_expert` — Flight Expert / GDS Desk

---

## Sidebar Menu (Flight Expert sees):

```
WORKSPACE
  ✅ Dashboard        → /flight_expert/dashboard  (FlightExpertDesk.jsx)

TRAVEL OPERATIONS
  ✅ Flight Requests  → /flights           (Incoming from sales agents)
  ✅ Quotes           → /quotes            (Quotes created by GDS expert)
  ✅ Bookings         → /bookings          (View confirmed bookings only)
```

> Flight Expert cannot see: Leads, Customers, Finance, Team, Social Inbox, Settings.

---

## Flight Expert Dashboard — `FlightExpertDesk.jsx` (Complete Build)

### TOPBAR:
```
Flight Expert / GDS Desk                  Dual Clocks: Agent Local: 14:00 | Client Local: 09:00 EST
```

### LAYOUT — 2 Column Split:

```
[LEFT COLUMN - 35%]              [RIGHT COLUMN - 65%]
Flight Request Queue             GDS PNR Parsing & Margin Calculator
```

---

### LEFT COLUMN — FLIGHT REQUEST QUEUE:

```
FLIGHT REQUEST QUEUE
Incoming requests forwarded by sales agents.

┌────────────────────────────────────────────────────────┐
│ Request #FE-4591                   Assigned: Sarah J.(SE)│
│ Origin: JFK          Destination: LHR                   │
│ Dates: 15OCT-22OCT   Class: 2        Pax: 2            │
│                                                         │
│                               [View/Parse ▶]            │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ Request #FE-4592                   Assigned: Sarah J.(SE)│
│ Origin: JFK          Destination: LHR                   │
│ Dates: 15OCT-22OCT   Class: 2        Pax: 2            │
│                                                         │
│                               [View/Parse ▶]            │
└────────────────────────────────────────────────────────┘

[more requests...]

[🔍 Search requests...]
```

**Request Card Fields:**
- Request # (auto-generated: FE-XXXX)
- Origin Airport code
- Destination Airport code
- Date range (in GDS format: 15OCT-22OCT)
- Class (1=First/2=Business/3=Premium Eco/4=Economy)
- Pax count
- Assigned Sales Agent name
- Priority badge (if urgent)

**Request Status:**
```
New → In Progress → Quote Ready → Sent to Agent → Completed
```

---

### RIGHT COLUMN — GDS PNR PARSING & MARGIN CALCULATOR:

#### Section 1: SABRE / GDS PARSING BOX

```
┌─────────────────────────────────────────────────────────┐
│ SABRE / GDS PARSING BOX                                 │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Paste raw GDS PNR text here (Ctrl+V)             │   │
│  │                                                  │   │
│  │ 1 AA 100 J 15OCT JFK LHR 1830 0730+1           │   │
│  │ 1 AA 100 J 15OCT JFK LHR 1830 0730+1           │   │
│  │ 1 AA 100 J 15OCT JFK LHR 1830 0730             │   │
│  │ 1 AA 100 J 15OCT JFK LHR 1830 0730             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  [Parse Itinerary]  [Validate Codes]  [Import Parsed Data]│
└─────────────────────────────────────────────────────────┘
```

**After Parse → Shows structured itinerary:**
```
Flight 1: AA 100 | JFK → LHR | 15OCT | Dep: 18:30 | Arr: 07:30+1
Class: J (Business) | PNR: ABC12D | Carrier: AFA | Fare Basis: JOWUS
```

---

#### Section 2: NET vs. SELLING PRICE CALCULATOR

```
┌─────────────────────────────────────────────────────────────────────────┐
│ NET vs. SELLING PRICE CALCULATOR                                        │
├─────────────────────────────────────────────────────┬───────────────────┤
│ Parsed Flights Table:                               │                   │
│  ●  1 AA 100 J  15OCT  LHR  1830  0730+1   [✕]    │ Net Fare (Cost):  │
│     Airline Flight Airline                          │   USD 4,500.00    │
│     Carrier: AFA 1 CPR                              │                   │
│     Carrier: Essenall Details                       │ Manual Markup %   │
│                                                     │   [___15___] %    │
│  ●  1 AA 100 J  15OCT  LHR  1830  0730+1   [✕]    │   [====●====]     │
│     Airline Flight Airline                          │                   │
│                                                     │ Fixed Markup USD   │
│  ●  1 AA 100 J  15OCT  LHR  1830  0730+1   [✕]    │   [___USD____]    │
│     Carrier: AFA 1 CPR                              │                   │
│                                                     │ Selling Price:    │
│                                                     │   USD 5,175.00    │
│                                                     │                   │
│                                                     │ NET PROFIT MARGIN:│
│                                                     │   USD 675.00 🟢   │
│                                                     │                   │
│                            [Generate & Publish Quote to Client Profile] │
└─────────────────────────────────────────────────────────────────────────┘
```

**Calculator Logic:**
```
Selling Price = Net Fare × (1 + Markup%)   [if % used]
Selling Price = Net Fare + Fixed USD        [if fixed used]
Net Profit = Selling Price - Net Fare
Profit % = (Net Profit / Net Fare) × 100
```

**"Generate & Publish Quote" click →**
- Creates Quote record linked to the Flight Request
- Sets quote status to "Ready for Agent"
- Notifies assigned Sales Agent
- Net fare hidden from agent view

---

#### Section 3: UPSELL SUGGESTIONS ENGINE

```
┌─────────────────────────────────────────────────────┐
│ UPSELL SUGGESTIONS ENGINE                           │
│                                                     │
│ • Recommend premium seat selection — to one,        │
│   increase USD 4,500. (potential revenue increases) │
│                                                     │
│ • Extra baggage comment/sign with                   │
│   potential revenue increases.                      │
│                                                     │
│ • Flexible booking was ummning, with                │
│   potential revenue increases.                      │
└─────────────────────────────────────────────────────┘
```

**Upsell Items to Show:**
- Seat selection upgrade (Extra legroom / Exit row)
- Extra baggage (23kg / 32kg add-on)
- Travel insurance (recommended amount based on booking value)
- Hotel (if destination has partner hotels)
- Airport transfer (if available)
- Priority check-in

---

#### Section 4: FARE RULES VIEW

```
┌─────────────────────────────────────┐
│ FARE RULES VIEW                     │
│ Quick access here the flight regnons│
│                                     │
│ [View Full Fare Rules →]            │
└─────────────────────────────────────┘
```

Shows: Refund rules, change fees, min/max stay, advance purchase requirements.

---

## Flight Expert — Flight Requests Page (`/flights`)

Full queue of all flight requests assigned to this expert:

```
Filters:
  Status: [All / New / In Progress / Completed]
  Cabin Class: [Economy / Business / First]
  Route Region: [Americas / Europe / Middle East / Asia / All]
  Date: [Today / This Week / Custom]
  Priority: [Urgent / Normal]

Request List:
  #FE-4591 | JFK→LHR | 15OCT | Business | 2 Pax | Sara J. | 🟡 In Progress | [Open]
  #FE-4592 | JFK→LHR | 15OCT | Business | 2 Pax | Sara J. | 🔴 New        | [Open]
  #FE-4593 | DEL→DXB | 20NOV | Economy  | 4 Pax | Alex R. | 🟢 Completed  | [View]
```

---

## Flight Expert — Quotes Page (`/quotes`)

Expert sees ALL quote details including net fare and profit:

```
Quote QT-001
  For: Karan Singh (via Sara J.)
  Route: JFK → LHR | Business | 2 Pax | 15 Oct
  Option 1: AA 100 | $9,800 net | $11,270 sell | $1,470 profit (15%)
  Option 2: BA 117 | $8,500 net | $9,775 sell  | $1,275 profit (15%)
  Status: Sent to Agent ✅
  
  [Edit Quote] [Republish] [Archive]
```

---

---

# 🟣 ROLE 6: `ticketing_agent` — Ticketing Team

---

## Sidebar Menu (Ticketing Agen00t sees):

```
WORKSPACE
  ✅ Dashboard        → /ticketing_agent/dashboard  (TicketingIssuance.jsx)

TRAVEL OPERATIONS
  ✅ Bookings         → /bookings           (Confirmed bookings to ticket)
  ✅ PNR / Tracking   → /flight-alerts      (Live PNR tracker)
  ✅ Ticketing        → /ticketing          (Main work queue)
```

> Ticketing Agent cannot see: Leads, Customers, Quotes, Finance, Team, Social Inbox.

---

## Ticketing Dashboard — `TicketingIssuance.jsx` (Complete Build)

### TOPBAR:
```
Ticketing Team - Issuance & Tracking           Dual Clocks: Agent Local: 14:00 | Client Local: 09:00 EST
```

### LAYOUT — 3 Column Split:

```
[LEFT COLUMN - 30%]              [CENTER COLUMN - 40%]       [RIGHT COLUMN - 30%]
Ready-for-Issuance Queue         Ticket Issuance Controls     Flight PNR Auto-Tracker
```

---

### LEFT COLUMN — READY-FOR-ISSUANCE QUEUE:

```
READY-FOR-ISSUANCE QUEUE              12 Leads Ready ▾
Paid leads are awaiting ticket generation.

┌────────────────────────────────────────────────┐
│ Lead #TK-451 - M. Chen                         │
│ ✈ JFK → LHR                                   │
│ ✅ Payment Confirmed ($200.00)                  │
│ ⊙ Sabre PNR: ABC12D                            │
│                                                │
│  [Issue E-Ticket]   [Review Details]           │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Lead #TK-452 - M. Chen                         │
│ ✈ JFK → LHR                                   │
│ ✅ Payment Confirmed ($200.00)                  │
│ ⊙ Sabre PNR: ABC12D                            │
│                                                │
│  [Issue E-Ticket]   [Review Details]           │
└────────────────────────────────────────────────┘

[more leads...]
```

**Lead Card Shows:**
- Lead/Booking reference (#TK-XXX)
- Customer name
- Route (Origin → Destination)
- Payment Confirmed status + amount
- Sabre PNR code

**Queue Badge:** "12 Leads Ready" — updates in real-time as payments come in.

---

### CENTER COLUMN — TICKET ISSUANCE CONTROLS:

```
┌───────────────────────────────────────────────────────┐
│ Ticket Issuance Controls                              │
│ Agents input the cantmatnor, run the 13-digit        │
│ e-ticket codes from your notes.                       │
│                                                       │
│  Enter PNR:                                           │
│  ┌────────────────────────────────────────────────┐   │
│  │ ABC12D                                    ▾    │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  Enter 13-Digit E-Ticket Number(s):                   │
│  ┌────────────────────────────────────────────────┐   │
│  │ 0172345678901                                  │   │
│  │ 0172345678902   ← (one per line, per pax)      │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │         Submit & Notify Client                 │   │
│  └────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

**"Submit & Notify Client" flow:**
1. E-ticket numbers saved to booking record
2. Booking status → `Ticketed`
3. Auto-generate official itinerary PDF
4. Auto-notify customer via:
   - Email (PDF attached)
   - WhatsApp (if connected)
   - SMS (ticket number confirmation)
5. Lead moved out of issuance queue
6. PNR added to auto-tracker

---

### RIGHT COLUMN — FLIGHT PNR AUTO-TRACKER (LIVE):

```
FLIGHT PNR AUTO-TRACKER              LIVE ▾

Active Tracker Feed:

🔴 PNR XYZ34E - J. Smith
   (Schedule Change Alert - Reschedule Needed)
   ─────────────────────────────────
   [Discuss Tracker Event]

✅ PNR LMN78F - A. Lee
   (Ticketed & Dispatched - PDF Itinerary Sent)
   FlanosIt · 10h ago

✅ PNR LMN78F - A. Lee
   (Ticketed & Dispatched - PDF Itinerary Sent)

🟡 PNR QRS90G - S. Williams
   (Flight Delay - Delayed 2 Hours)
   ─────────────────────────────────
   [Discuss Tracker Event]

✅ PNR QRS38F - J. Smith
   (Ticketed & Dispatched - Spent)
   Poore PNR · 14h ago
   ─────────────────────────────────

[Dispatch Official Itinerary]
[Process Schedule Change]
[Process Schedule Change]
```

**Alert Color Codes:**
- 🔴 Red card: Schedule Change Alert (action needed — reschedule)
- 🟡 Orange card: Flight Delay (notify customer)
- 🟢 Green / ✅: Ticketed & Dispatched (done)
- ⚪ Grey: Being tracked (no issues yet)

**Tracker Event Actions:**
- `Discuss Tracker Event` → Opens internal note/chat about this PNR
- `Dispatch Official Itinerary` → Re-sends itinerary PDF to client
- `Process Schedule Change` → Opens reschedule workflow

---

## Ticketing Agent — Bookings Page (`/bookings`) — ticketing view

Ticketing agent sees only **confirmed + payment received** bookings:

```
Filters:
  Status: [Payment Received / Ticketed / Dispatched]
  Date: [Today / This Week]
  
BK-001 | K. Singh | JFK→LHR | 15 Oct | Business | 2 pax | Payment Received ✅ | [Issue Ticket]
BK-002 | A. Lee   | DEL→SIN | 20 Nov | Economy  | 1 pax | Ticketed ✅          | [View]
BK-003 | R. Verma | DXB→LHR | 05 Dec | Business | 3 pax | Dispatched ✅        | [View]
```

---

## Ticketing Agent — PNR Tracking Page (`/flight-alerts`)

Full PNR tracker expanded view:

```
ACTIVE PNR TRACKER — LIVE FEED

Search: [Enter PNR or Customer Name...]

Filter: [All / Alerts / Confirmed / Delayed / Changed / Dispatched]

PNR       Customer    Route      Date    Status                   Last Updated
XYZ34E    J. Smith    JFK→LHR   15 Oct  🔴 Schedule Change        2h ago  [Action]
LMN78F    A. Lee      DEL→SIN   20 Nov  ✅ Dispatched             10h ago [View]
QRS90G    S. Williams DXB→CDG   05 Dec  🟡 Delayed 2h             1h ago  [Action]
QRS38F    J. Smith    LHR→JFK   22 Oct  ✅ Ticketed               14h ago [View]

[+ Add PNR to Tracker]
```

**Action Modal (for alerts):**
```
PNR XYZ34E — Schedule Change Alert

Original: AA 100 | 15OCT | 18:30 → 07:30+1
New:      AA 100 | 16OCT | 09:00 → 22:00  

Action Required:
  [Accept Change — Notify Customer] 
  [Request Reschedule]
  [Request Refund]
  [Contact Airline Directly]
  
Internal Note: [textarea]
[Save & Notify]
```

---

# 📌 Summary — Plan 3 of 4

| Component | Change Type | File |
|---|---|---|
| FlightExpertDesk | Complete build | FlightExpertDesk.jsx |
| GDS PNR Parsing Box | New component | New GDSParsingBox.jsx |
| Margin Calculator | New component | New MarginCalculator.jsx |
| Upsell Suggestions | New component | New UpsellEngine.jsx |
| Flight Request Queue | New component | FlightExpertDesk.jsx |
| TicketingIssuance | Complete build | TicketingIssuance.jsx |
| Issuance Queue | New component | New IssuanceQueue.jsx |
| Ticket Issuance Controls | New component | New TicketControls.jsx |
| PNR Auto-Tracker | New component | New PNRTracker.jsx |
| PNR Tracking Page | Build out | pages/flight-alerts/* |
| Schedule Change Modal | New component | New ScheduleChange.jsx |
