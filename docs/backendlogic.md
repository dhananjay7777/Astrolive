# Backend logic (spec only — no server in the prototype)

**Status:** Prototype is **front-end only**. Do **not** integrate a real backend, database, auth, wallet, or chat infra now.

This file is the **source of truth for rules**. The clickable demo should *behave* as if these rules exist. Later, a real API can implement the same logic.

**Product:** [Suggested-Directions.md](./Suggested-Directions.md)  
**Screens:** [architecture.md](./architecture.md)  
**Build:** [implementation.md](./implementation.md)

---

## 1. How the prototype fakes the backend

| Real later | Prototype now |
|------------|----------------|
| REST/WebSocket APIs | JavaScript functions in the page |
| Postgres / existing AstroLive DB | `localStorage` + in-memory seed data |
| Auth / two real devices | One browser; **role toggle** (seeker / astrologer) or a second phone *frame* |
| Push / SMS invite | Scripted “link sent” → `S8` Join |
| Meter, wallet, video | Not simulated beyond a fake “connecting” state |
| **Unmetered briefing** (astrologer reads file before billing) | Scripted ~10 s wait on `S6b`; “not charged yet” copy; auto-advance or astrologer-role Start button |
| **Recording + STT + LLM recap** | Scripted recap bullets keyed to `topic` + `note` — no real mic, no real API |
| Cron for 3d / 1w / 1m reminders | Store `followUp` + `followUpAt`; show a chip. Do not send real notifications |

**Storage key (suggested):** `astrolive_proto_v1`

```text
{
  currentUserId: "seeker-aarav",
  kundlis: [ ... ],
  astrologers: [ ... ],
  session: SessionFile | null,
  readings: [ SessionFile ],
  role: "seeker" | "astrologer",
  products: [ ... ],            // seed; company-given Store
  cart: [{ productId, qty }],
  orders: [ Order ]
}
```

All “API” names below are **logical**. In the prototype they are local functions, e.g. `createSessionFile(payload)`.

---

## 2. Entities

### 2.1 KundliProfile (already exists in live app)

```text
KundliProfile
  id: string
  ownerUserId: string
  relation: self | partner | family | friend
  name: string
  dob: date            // required
  tob: time | null     // optional but shown if present
  pob: string          // place of birth
```

**Rules**

- Seeker’s **self** profile is required before Chat/Call can open a Session File.
- Partner booking only lists profiles where `ownerUserId = current user` and `relation != self`.
- Prototype seed: Aarav (self), Diya (partner). Do not build a kundli calculator.

### 2.2 Astrologer (already exists)

```text
Astrologer
  id, name, photo, skills[], rateChat, rateCall, online: boolean
```

Consultant list is seed data. No matching engine.

### 2.2b Product / Cart / Order (Store — company-given)

Already sketched in `index.html`. Keep in the prototype. No payment API.

```text
Product
  id, name, intention, price, oldPrice, rating, ...
  // intention ≈ Session File topic: career, love, wealth, peace, protection, planetary

CartLine { productId, qty }
Order { id, items[], total, createdAt, status: placed | delivered }
```

**Join to hero:** `listRecommended(topic)` returns products whose `intention` maps from last done (or live) Session File `topic`. If no file, return bestsellers.

| topic | intention (store) |
|-------|-------------------|
| Career | career |
| Love | love |
| Family | peace (or love) |
| Health | peace |
| Money | wealth |

### 2.3 SessionFile (hero — new)

The unit of work. One file per consult attempt.

```text
SessionFile
  id: string
  seekerId: string
  astrologerId: string
  channel: chat | call                 // from the button they tapped

  topic: Career | Love | Family | Health | Money     // required
  note: string                         // optional, max ~140 chars
  whoFor: Me | Partner | Both          // default Me

  selfSnapshot: KundliSnapshot         // copy at create time
  partnerSnapshot: KundliSnapshot | null

  invite: {
    status: none | sent | joined | expired
    token: string | null
    invitedKundliId: string | null
  }

  keyLine: string                      // topic label, or starred takeaway
  followUp: null | 3d | 1w | 1m
  followUpAt: datetime | null

  briefingAt: datetime | null       // set when S6b starts; meter off until startedAt
  recapOptIn: boolean               // user opted in on S6; default false
  recap: RecapCard | null           // filled by saveRecap on done

  status: draft | ready | briefing | live | done | cancelled
  createdAt, briefingAt, startedAt, endedAt

  // stretch only
  parentFileId: string | null          // second opinion copies this file
  compare: { agree: string[], differ: string[] } | null
```

**KundliSnapshot** = `{ kundliId, name, dob, tob, pob }` copied at confirm so later profile edits do not rewrite history.

**RecapCard** = scripted in the prototype; structure for the real product:
```text
RecapCard
  topic: string              // from file.topic
  question: string           // from file.note (or empty)
  bullets: string[]          // 5 scripted takeaways keyed to topic + note
  remedies: string[]         // 1-2 remedy lines
  paid: boolean              // true if recapOptIn was true
  createdAt: datetime
```
Prototype: seed one `RecapCard` per topic in `js/data.js`. No real STT/LLM.

### 2.4 Reading (supporting 2)

A **reading** is a SessionFile with `status = done`. My Readings = `readings` where `seekerId = current user`, newest first.

Do **not** merge with order/payment history.

---

## 3. Status machine (Session File)

```text
                create from Chat/Call
                        │
                        ▼
                     draft  ──cancel──► cancelled
                        │
          topic required; whoFor validated
                        │
                        ▼
                     ready  ── “Continue” ──► briefing  (meter OFF; `S6b`)
                                                       │
                                  astrologer Start / cap ──► live
                        │                       │
                        │                       ├── star takeaway
                        │                       ├── set follow-up
                        │                       └── end session
                        ▼                       ▼
                     (rebook copies            done  → My Readings
                      into a new draft)
```

| From | Event | To | Logic |
|------|--------|-----|--------|
| — | `POST /session-files` (Chat or Call) | `draft` | Attach `astrologerId`, `channel`, snapshot **self** kundli |
| `draft` | Save topic / note / whoFor | `draft` | Validate (below) |
| `draft` | Confirm Continue | `ready` then `briefing` | Block if invalid; set `briefingAt` |
| `briefing` | Astrologer Start / scripted cap | `live` | Set `startedAt`; meter starts here |
| `live` | End | `done` | Set `endedAt`, `keyLine` default = topic if empty; append to `readings` |
| `done` | Book again | **new** `draft` | Copy topic, note, whoFor, snapshots, astrologer; **new** `id`; invite reset to `none` |
| `draft` | Cancel / back | `cancelled` or discard | Prototype may just pop the sheet |

Prototype may skip persisting `cancelled`.

---

## 4. Validation (must run on Continue)

Call this `assertSessionFileReady(file)` in the prototype before `S9`.

```text
FAIL if astrologerId missing
FAIL if topic missing
FAIL if selfSnapshot missing (no self kundli)
FAIL if whoFor is Partner or Both AND partnerSnapshot is null
     AND invite.status is not sent and not joined
FAIL if note length > 140
PASS otherwise
```

**Defaults**

- `whoFor = Me` → `partnerSnapshot = null`, `invite.status = none`
- Topic **Love** or **Family** → UI may set `whoFor = Both` (user can change). Backend only stores what they confirm.
- `keyLine` on create = empty; on end = `topic` if still empty.

**Health:** store the chip only. No medical claims, no diagnosis fields.

---

## 5. Logical APIs (implement as local functions)

Prefix: all scoped to `currentUserId` unless noted.

### 5.1 Existing-app reads (seed in prototype)

| Logic name | Returns | Prototype |
|------------|---------|-----------|
| `listAstrologers()` | Consultant cards | Static array |
| `getSelfKundli()` | Self profile | Seed Aarav |
| `listPartnerKundlis()` | Non-self saved charts | Seed Diya |
| `getAstrologer(id)` | One astrologer | Lookup seed |

### 5.2 Hero — Session File

| Logic name | Input | Behaviour |
|------------|--------|-----------|
| `startConsult(astrologerId, channel)` | Chat or Call tap | Create `draft` SessionFile; snapshot self kundli |
| `updateSessionFile(id, { topic, note, whoFor })` | Sheet edits | Patch draft; if `whoFor = Me` clear partner + invite |
| `attachPartnerKundli(id, kundliId)` | Saved chart pick | Snapshot that kundli into `partnerSnapshot`; `invite.status = none` |
| `confirmSession(id)` | Continue | `assertSessionFileReady`; set `ready` → `briefing`; set `briefingAt` |
| `startSession(id)` | Astrologer Start / briefing cap | `briefing` → `live`; set `startedAt`. This is when ₹/min begins. |
| `saveRecap(id)` | End session (if `recapOptIn`) | Create `RecapCard` from scripted seed keyed to `topic` + `note`; attach to file. Prototype: always scripted. |
| `getSessionFile(id)` | Chat pin / astrologer view | Same object for seeker and astrologer (**one file**) |
| `endSession(id)` | End | `done`; default `keyLine`; push onto `readings` |

**Pin rule:** `S9` and `S10` only render `getSessionFile`. Do not give the astrologer a different payload.

### 5.3 Supporting 1 — Partner

| Logic name | Input | Behaviour |
|------------|--------|-----------|
| `invitePartner(sessionId)` | Invite CTA | Require `whoFor` in {Partner, Both}. Create `token`. `invite.status = sent`. Prototype: no SMS. |
| `previewInvite(token)` | `S8` | Return file summary (names, topic, astrologer). No wallet. |
| `acceptInvite(token)` | Join | If `status = sent` → `joined`; if already `live`/`done`/`expired` → reject. Set `partnerSnapshot` from invited kundli if still null (prototype: use Diya). |

**WhoFor vs invite**

| whoFor | partnerSnapshot | invite | Continue allowed? |
|--------|-----------------|--------|-------------------|
| Me | null | none | Yes |
| Partner or Both | set (saved kundli) | none | Yes (partner not in the live call; charts still on the card) |
| Partner or Both | null | sent | Yes in prototype (show “waiting”) **or** wait for Join — pick one and stick to it. **Recommend:** allow Continue after `sent` so the seeker is not blocked; card shows “Invite sent”. |
| Partner or Both | null | none | **No** |

**Not in scope:** partner wallet, two real logins, family group thread.

### 5.4 Supporting 2 — Readings + follow-up

| Logic name | Input | Behaviour |
|------------|--------|-----------|
| `listReadings()` | Menu | `readings` for current seeker, `endedAt` desc |
| `getReading(id)` | Detail | One done file |
| `rebook(readingId)` | Book again | `startConsult` with **same** astrologer + copy topic, note, whoFor, snapshots. New session id. |
| `starTakeaway(sessionId, text)` | Astrologer stars a line | Set `keyLine` (max ~140). Allowed in `live` or `done`. |
| `setFollowUp(sessionId, window)` | `3d` \| `1w` \| `1m` | Allowed in `live` or `done`. `followUpAt = now + window`. Idempotent replace. |
| `clearFollowUp(sessionId)` | Optional | `followUp = null` |

**Follow-up vs existing buffer**

| | Buffer (live app) | This logic |
|--|-------------------|------------|
| Window | Minutes, same session | 3 / 7 / 30 **days** |
| Action | Restart same live thread | Reminder to **rebook** (new Session File via `rebook`) |
| Prototype | Do not fake the buffer | Store `followUpAt`; show chip. No alarm. |

`dueFollowUps()` (later): `followUpAt <= now` and reading not rebooked. Prototype: if `followUp` is set, show “Follow-up suggested: 1 week” on the row.

### 5.5 Stretch — Second Opinion (do not build until 1+2 work)

| Logic name | Behaviour |
|------------|-----------|
| `requestSecondOpinion(readingId, newAstrologerId)` | New SessionFile with `parentFileId`; copy topic, note, whoFor, snapshots; **do not** copy first astrologer’s messages |
| `saveCompare(parentId, { agree[], differ[] })` | Scripted bullets on the parent reading |

Second astrologer `getSessionFile` sees the **packet only**, not the first transcript.

### 5.6 Store (given — local only)

| Logic name | Behaviour |
|------------|-----------|
| `listProducts(tab, intention)` | For You / categories / best sellers |
| `listRecommended(topic)` | Map topic → intention; if `topic` null, bestsellers |
| `addToCart` / `updateQty` / `removeFromCart` | Mutate `cart` in `localStorage` |
| `placeOrder()` | Build `Order`, clear cart; no payment |
| `shopThisTopic(readingId)` | `listRecommended(reading.topic)` then UI opens Store |

Do not require an in-chat purchase to complete the hero demo.

---

## 6. Confirm / Continue (hero path)

```text
function confirmSession(file):
  assertSessionFileReady(file)
  file.status = "live"
  file.startedAt = now()
  return file          // both roles subscribe to this id
```

Meter start in production = this moment. Prototype: go to `S9` immediately.

---

## 7. Rebook copy map

Copy onto the **new** draft:

- `astrologerId`, `topic`, `note`, `whoFor`, `selfSnapshot`, `partnerSnapshot`

Do **not** copy:

- `id`, `status`, `invite` (reset `none`), `keyLine`, `followUp`, `startedAt`/`endedAt`, `parentFileId`, `compare`, messages

---

## 8. What we reuse later vs what is new

When a real backend exists, **call into AstroLive**; do not recreate:

- Users, kundlis, astrologer catalogue, chat/call channel, wallet, order history, buffer, Refer & Earn, **in-app Store catalogue** (company-given; not the desktop site layout)

**New tables / fields (later):**

- `session_files` (+ snapshots, invite token, follow_up, key_line, parent_file_id)
- `reading` can be a view on `session_files` where `status = done`

Prototype: one `SessionFile` object in `localStorage` is enough.

---

## 9. Errors the UI should handle (even if fake)

| Code | When | UI |
|------|------|-----|
| `NO_SELF_KUNDLI` | No self profile | “Add your birth details” (seed so this does not happen in demo) |
| `TOPIC_REQUIRED` | Continue without chip | Disable button / toast |
| `PARTNER_REQUIRED` | Partner/Both without chart or invite | Toast: pick a saved kundli or invite |
| `INVITE_EXPIRED` | Join too late | “Ask them to send a new invite” |
| `ASTROLOGER_OFFLINE` | Optional | Prototype: all seed astrologers `online: true` |

---

## 10. What this file does **not** include

- Real HTTP, auth, payments, video/WebRTC  
- AI / RAG / auto summaries  
- Outcome matching / accuracy scores  
- Family Circle group billing  
- Notification workers  
- Kundli calculation or Guna Milan (already in the live app)  
- Real payment gateway (Store checkout is scripted)

---

## 11. Prototype function checklist

Implement these as JS only (no fetch):

- [ ] `listAstrologers` / `getSelfKundli` / `listPartnerKundlis`
- [ ] `startConsult` → `updateSessionFile` → `assertSessionFileReady` → `confirmSession` → `startSession`
- [ ] `saveRecap` (scripted; keyed to topic); attach to `SessionFile.recap`
- [ ] `attachPartnerKundli` / `invitePartner` / `acceptInvite`
- [ ] `getSessionFile` shared by seeker + astrologer views
- [ ] `starTakeaway` / `setFollowUp` / `endSession`
- [ ] `listReadings` / `getReading` / `rebook`
- [ ] Store: `listProducts` / `listRecommended` / cart / `placeOrder` (reuse existing proto store)

Seed on first load if `localStorage` is empty. That is the entire “backend” for the hackathon demo.
