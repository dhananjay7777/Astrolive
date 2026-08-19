# AstroHack 2026 — What we will build

**Hackathon:** [AstroHack 2026: Build the Next Universe (AstroLive)](https://unstop.com/competitions/astrohack-2026-build-the-next-universe-astrolive-1719172)  
**App today:** [Play Store](https://play.google.com/store/apps/details?id=app.astrolive&hl=en_IN) · [App Store](https://apps.apple.com/in/app/astrolive-talk-to-astrologer/id6484162351)  
**Screen plan:** [architecture.md](./architecture.md) · **Logic (no server):** [backendlogic.md](./backendlogic.md) · **Build:** [implementation.md](./implementation.md)

---

## Read this first (if you are new to this file)

This is the **product freeze** for our hackathon prototype. It answers three questions only:

1. What does the live AstroLive **phone app** already do?
2. What **one product** are we adding on top of that? (what a judge would *name* after the demo)
3. What else ships because it hangs off that product, or because the company required it?

**How to read the rest**

| Section | What you get |
|---------|----------------|
| Brief needs | The five pillars Unstop/AstroLive asked for |
| Live app already has | Do not rebuild these. Includes the **intake chat bubble** we must not pretend is missing |
| The problem | The hole in one paragraph |
| Hero / supporting / Store | The locked set, written so you can explain each piece to a judge |
| How they fit | One walkthrough of a single consult |
| Stretch / metrics / checklist | What we are *not* building, and how we know the demo worked |

**Hard constraint:** We are designing the **mobile app UI**, not [astrolive.app](https://astrolive.app). Inserts go into the current **AstroLive app** (5 tabs: Home, Live, Astro Hub, Consultant, Menu). No new app, no sixth tab. Unstop needs a **public URL**, so the prototype is a webpage that **looks and behaves like the iPhone/Android app** (phone frame) — it is not a clone of the marketing site (Horoscope, Blogs, desktop nav). No real backend.

**Company-given:** **Astro Store must be in the app.** It is required infrastructure, not a second hero. The demo **leads with the Reading** (partner in, recap out). Store is always reachable; do not open the video on the shop.

**Rule:** keep the mechanic, drop the AI. Scripted screens are fine. We do **not** build real call recording or speech-to-text in this prototype.

**Locked set:** **1 hero + 1 supporting + Store (given).**

| Layer | Name | Say this to a judge? |
|-------|------|----------------------|
| **Hero (pitch)** | **The Reading** — consult together, walk out with a recap | **Yes.** This is the poster. |
| **Hero — in** | Book this session **for / with a partner** (Me / Partner / Both) | **Yes.** This is the beat the live app does not have. |
| **Hero — out** | **Paid recap** after the session | **Yes.** This is the pause in the video. |
| **Hero — chrome** | Unmetered briefing (astrologer reads charts **before** ₹/min) | Short proof beat. Not a spinner. Not a fifth feature. |
| **Supporting** | **My Readings** + follow-up in days | Shelf + Book again. Not the poster. |
| **Given** | **Astro Store** in the app | Required. Not the story. |
| **Mechanism (internal)** | `SessionFile` in code / [architecture.md](./architecture.md) | **No.** Do not say “Session File” in the pitch. It sounds like plumbing. It is how the Reading is stored. |

**Locked hero, in one sentence:** Other apps dump your chart into chat and you book **alone**. We let you **bring someone into this session**, the astrologer reads the chart(s) **before the clock**, and you **leave with a recap** you can open next week.

**Why we do not call the hero “Session File”.** A file is a container. Judges hear *file* and think a form we save. A hero is something a user would open the app **to do**. The container still exists in the prototype (`S6`, `js/session.js`). It is not the name on the slide.

---

## What the brief needs

| Pillar | In plain words |
|--------|----------------|
| Bottleneck | A real day-to-day waste in how the app works |
| Growth | People bring people (not only ads) |
| Habit | People come back without a crisis |
| New revenue | Money beyond pay-per-minute |
| USP | A reason to pick AstroLive over other talk-to-astrologer apps |

Working **public URL** of the **app mock** (phone UI) + **report ≥ 8 pages**. Not a clone of the marketing website.

---

## What the live app already has (do not rebuild)

Checked against Play Store, App Store changelog, in-app behaviour, and the chat screenshot in [docs/app-ui/Chat window.jpeg](./app-ui/Chat%20window.jpeg). Use [astrolive.app](https://astrolive.app) only to confirm **features exist** (kundli, shop, pooja) — **not** as the visual or IA source.

| Already there | So we must not “invent” it |
|---------------|----------------------------|
| Chat / audio / video, ₹/min, free first consults | Core marketplace |
| Home, Live, Astro Hub, Consultant, Menu | Keep this bar |
| Free Kundli, PDF, Kundli match / partner report | Hub **tools**. Match is not “this Chat/Call is for two people” |
| **Multiple Kundli** (self, friends, family) | Saved charts — **not** attached as Partner / Both on the *paid session* |
| Filter astrologers by domain / language | Picks a *person*, not a *reading* you can reopen |
| **Intake as first chat message** | After “Chat started”, a purple bubble already lists Name, Gender, DOB, TOB, POB, and **TOC** (e.g. Career & Business). Do not pitch “they have no intake” |
| Header **history** on chat | Past threads with *this* astrologer, not a journal of takeaways |
| **Buffer window** (restart same session in **minutes**) | Not a 7-day follow-up |
| **Order history**, chat threads, PDF as a “record” | Payments/history, not a reading with a recap |
| Voice notes from astrologer | Async ping, not a dated check-in |
| Refer & Earn | Invites to the *app*, not into *this* call |
| Wallet, **shop on web**, pooja, horoscope, panchang | Shop must **also live in the app** (company-given) |
| Instant Chat/Call connect | Meter starts when the thread opens. There is **no** named “chart review” window before billed time |

**What the intake bubble is.** The live app *does* glue birth details + a topic category onto Chat. It does that by **posting a message in the thread**. That message scrolls away. It is always **this user’s** chart. It has a category (TOC), not the actual question. It is not pinned. It is not a partner. It is not a recap. **Do not pitch “AstroLive has no intake.”** Pitch: they already collect this card; you still **book alone**; then the advice **disappears**.

**The hole:** love/family questions are two-person problems, but Chat/Call is one-person. After hangup there is **no takeaway**. Chart-reading happens **on billed time**. Shop is on the website today; the company wants Store **inside the app**.

---

## The problem

You pay per minute. The app already knows your birth details and a topic — it dumps them as the first chat message. You still book **alone**, even when the question is about a partner. The astrologer hunts that bubble **on the clock**. After a **call**, there is nothing to re-read. After **chat**, the answer is buried; **history** is just more chat with that astrologer. Remedies stay as talk; the shop sits on the website.

We are not inventing “tell us your date of birth.” We are inventing **a reading**: you can do it **with someone**, the charts are read **off the meter**, and you **walk out with a recap**.

---

## 1 hero + 1 supporting + Store (given)

Three things ship. Only one is the story.

- **Hero = The Reading.** Consult **together** (in). Walk out with a **paid recap** (out). Solo Career is the same product with Who for? = **Me** — show it in 5 seconds; do not open the demo on it.
- **Supporting = My Readings + follow-up in days.** The shelf where readings live. Book again. Not the poster.
- **Store = given.** Always in the app. For You follows the last reading’s topic. Not the pitch.
- **Mechanism (do not pitch):** one `SessionFile` object holds who, topic, question, briefing, recap. Partner and recap are not two heroes; they are two ends of **one** reading.

If you only remember one sentence: **they already attach the chart to the chat; you still consult alone; they do not attach the advice to anything. We do both.**

---

### Hero — The Reading (together in, recap out)

Think of one consult as two pages of **one** product. Do not name this “Session File” to a judge.

```
THE READING  (this consult, with this astrologer)
  IN   — who is this for?  Me / Partner / Both
         + topic + one-line question
         + charts pinned, read OFF the meter
  OUT  — paid recap: what was said, what to do next
```

Without **in**, a recap is a random note next to chat **history**. Without **out**, “book with a partner” is a kundli picker and My Readings is a list of forms. Together they are a **reading**. The object in code is still `SessionFile` — that is plumbing.

#### Why this is the hero (and “Session File” is not)

| If we named the hero… | Judges would say |
|------------------------|------------------|
| **Session File** | “That is a form. Supporting, not a product.” |
| Intake sheet + pin | “That is today’s first bubble with better chrome.” |
| Recap / AI summary alone | “Every team has ChatGPT notes.” |
| Partner invite alone | “A couples mini-app. What about Career?” |
| **The Reading** (partner in + recap out) | “I can bring someone into *this* session, they read the charts before I pay, and I walk out with something I can open next week.” |

**Demo order**

1. Chat/Call → **Who is this for? Both** (Love). Pick saved partner kundli or scripted invite. ~20 seconds. **This is the open.** Do not linger on Name/DOB — they already saw that bubble.
2. Continue → **briefing** (charts visible, “not charged yet,” Start session). Short proof. Not the climax.
3. Short chat, **both charts pinned**.
4. End → **paid recap** (names whose charts were on the reading). **Pause here.**
5. Menu → My Readings → that recap → Book again / Shop this topic.
6. Optional 5 seconds: same flow with **Me** + Career, so it is not a couples-only product.

**Never say in the video:** Session File, packet, CRM, “we persist a JSON.”

**Pillars it hits:** growth (invite into *this* session), bottleneck (alone on a two-person question; advice evaporates; chart-reading on the meter), USP (a reading, not a thread), new revenue (paid recap). Habit is Supporting (My Readings). Store is the company checkbox.

---

#### Hero IN — Book this session for / with a partner

**The waste it removes.** Love, family, and match questions are two-person problems. The live app already lets people save multiple kundlis. Refer & Earn already invites people *to the app*. Hub already has Kundli match. **None of those puts a second person on this paid Chat/Call.** The seeker still books alone, then reads out the partner’s birth details on the clock.

That is why this is the **in** of the hero, not a side control. After the chat screenshot, DOB + TOC is table stakes. **Me / Partner / Both on this minute** is what the live app does not do.

**What it is.** On the sheet before connect, one control: **Who is this for?**

| Choice | Meaning |
|--------|---------|
| **Me** | Default. This reading is about the seeker. Same product; quieter demo. |
| **Partner** | Reading uses a saved non-self kundli (prototype seed: Diya). The consult is *about* that person. |
| **Both** | Self + partner charts. Compatibility / joint reading. **Lead the demo with this.** |

If no partner kundli is saved, **Invite to this session** — a scripted share. They are joining **this consult**, not downloading the app in general. That is the difference from Refer & Earn.

Birth details + topic chip + one optional line still sit on this sheet (reuse the live intake; add the real *ask*, e.g. “Should we wait to get married?”). Do not invent a kundli calculator. **Do not make Name/DOB the hero moment.**

Then: **unmetered briefing** (below) → chat/call with the **same card pinned** (one or two charts). Recap later names whose charts were on the reading.

**Where it lives.** Only on the pre-connect sheet (`S6` in [architecture.md](./architecture.md)). No extra tab, no “couples app,” no family inbox.

**What the seeker does (in)**

1. Tap Chat or Call.
2. Topic + one-line question + recap opt-in (see OUT).
3. **Who is this for?** Me / Partner / Both. Pick a saved kundli **or** send the invite.
4. Continue → briefing (meter off) → chat/call, card pinned (meter on).

**What the astrologer does (in)**

1. Briefing: they see **who** the reading is for (one chart or two), topic, one-line ask — **before** billed time.
2. Tap **Start session**.
3. Same card **pinned** on chat. They do not hunt the first bubble and they do not ask for a second DOB on the clock.

**What it is not**

- Not a new Hub match / Guna Milan tool.
- Not a persistent family thread or group chat.
- Not a rewrite of Refer & Earn.
- Not a second hero. Recap is still the **out**. Without recap, this is only a picker.

**Pillars:** growth, bottleneck (stop dictating a second DOB).

---

#### Briefing window (chrome on IN — not a loading screen)

**The waste it removes.** Even with today’s intake bubble, the astrologer reads Name / DOB / TOC **while the seeker is already paying**. Two charts makes that worse. “Please wait” with the meter on is hold music.

**What it is.** Named state between “reading confirmed” and “chat/call live.” Copy in the spirit of: **“Neelam is going through your chart(s). You are not being charged yet.”** Show the **same card** (Me / Partner / Both), not an empty spinner.

| Loading screen (do not build) | Briefing window (build this) |
|-------------------------------|------------------------------|
| Empty spinner; feels like the app stalled | Named: astrologer is reading **this** reading |
| Unclear who pays | **Meter off** until **Start session** (or a short cap) |
| Wait for its own sake | Card on screen so the wait has a job |
| Open-ended | Cap **30–45 seconds**. Prototype: **~8–12 seconds** plus Ready |

**Why this is not a new hero.** One beat on IN. Recap is still the pause. Briefing *proves* the charts are used, not only collected.

**What it is not:** generic Connecting…; billed hold; a long lobby; fake “studying your chart” if the astrologer view is not looking at the card. Prototype: short scripted wait. A paid briefing fee for the astrologer is stretch, not this freeze.

---

#### Hero OUT — paid recap (the pause in the video)

**The waste it removes.** You paid for advice. A **call** leaves nothing. **Chat** leaves a long thread; header **history** is more of that thread. People in this industry are told to *ask for a bullet list* because the apps do not produce one.

**What it is.** A **paid recap** written onto **this reading** when the session ends. Not a new tab. Not a chatbot. Not a full transcript as the main screen.

The recap card shows:

- Who it was for (Me / Partner / Both) + topic + the one-line question  
- **5 bullets** — what was concluded (scripted in the prototype)  
- Remedies / next step  
- **Book again** and **Shop this topic**  
- A paid badge (e.g. ₹49–99 add-on, or first recap free then paid)

**How we get there in the prototype.** We **do not** record the call, run speech-to-text, or call an LLM. User **opts in** on the sheet (“Save a recap — ₹49”) → session ends → recap with **scripted** bullets that match topic + question + whoFor. Chat can be framed as “summarize this thread.” Call uses the **same recap UI** plus a consent toggle. Judges will not believe a fake microphone pipeline.

**Where it lives.** End-of-session screen, then the My Readings row. Opening the row shows the recap, not a receipt and not the raw chat.

**What the seeker does (out)**

1. Opt in to recap on the sheet (paid).
2. End Chat or Call.
3. Recap card — **pause the demo**.
4. Later: Menu → My Readings → same recap → Book again or Shop this topic.

**What it is not**

- Not a second hero and not a replacement for “consult together.”
- Not real recording / STT / AI in this build.
- Not a cut of the ₹/min bill — a **small add-on** or first recap free.
- Not auto-record.

---

### Supporting — My Readings + follow-up in days

**The waste it removes.** After the call, output is buried in a thread or an order row. Header **history** is “messages with Neelam,” not “here is what was concluded.” The **buffer window** restarts the *same* session within **minutes** if it drops — connection retry, not a follow-up.

**What it is.** The **shelf** for done Readings. Without the recap, this shelf is weak (only the form). With the recap, each row is an actual reading.

**A. My Readings (Menu)**  
Each row: astrologer, date, topic, who for (Me / Partner / Both), one-line question, recap status, **Book again**. Tapping opens the **recap**, not a receipt.

**B. Follow-up in days**  
Chip: **3 days / 1 week / 1 month**. Prototype does **not** send a push. Shows a dated reason to return.

**Where it lives.** **Menu → My Readings.** Book again reuses Chat/Call + the same sheet (including Who for?). No calendar product.

**What it is not:** minute buffer; order history; chat **history**; a booking grid.

**Why it is supporting, not hero.** A list is not a product. The Reading is the product; this is where it lives. Habit + rebook revenue.

---

### Given — Astro Store (in the app)

**Why it is here.** The company listed Store as a **given**. Shop exists on the website; it is not in the live phone app. Put Store **inside the same five-tab app**, looking like an app screen, not like astrolive.app. Not the idea we are pitching.

**Where it lives.** Same app shell. **No sixth bottom tab.** Home | Store in the header, header bag, Home card, Menu → Astro Store. Cart from the bag when already in Store. Home tab returns to consult Home.

**What it is.** Scripted shop (no real pay): For You / Categories / Best Sellers; shop by intention; product; cart; fake checkout.

**Thin join to the hero.** **For You** reads the **last reading’s topic**. Recap and My Readings may show **Shop this topic**. Do not rebuild a remedies marketplace.

**What it is not:** the hackathon hero; a website clone; seller tools.

**Pillars (honestly):** new revenue beyond ₹/min, and the company checkbox.

---

### How the pieces fit (read this once)

A seeker taps Chat. They start **a Reading**: Who for? **Both** (or Me), topic, question, optional paid recap. **Briefing** — charts read, meter off. Chat with the card **pinned**, meter on. Session ends → **recap**. That reading lands in **My Readings**. **Store** follows the topic.

**The Reading is the product. Partner is how you walk in. Recap is how you walk out. My Readings is the shelf. Session File is the code name. Store is required.**

---

## How they sit in the current app

```
Header:  ASTROLIVE · Home | Store · search · bag · bell
Tabs:    Home · Live · Hub · Consultant · Menu   (still 5)

Header Home | Store → Home consult vs Store home (ST1)
Home / bag / Menu → Store (GIVEN)

Consultant or Home → Chat / Call
  → Who is this for? Me / Partner / Both     HERO IN  (demo opens here)
  → topic + one-line question + recap opt-in
  → Briefing (meter OFF, chart(s) visible)   HERO chrome (not a loader)
  → chat, card PINNED, meter ON
  → Recap card                               HERO OUT / climax
  → Menu → My Readings → Book again          SUPPORTING
  → Shop this topic / Store For You          GIVEN
```

---

## Stretch only (do not build unless the Reading demo is done)

| Extra | Why it waits |
|-------|----------------|
| **Real recording + transcript + LLM summary** | Dual consent, STT, Hindi/English; prototype recap is **scripted** |
| **Paid briefing fee for the astrologer** | Prototype briefing is short and unpaid |
| **Second Opinion** | Needs a reading (and a recap) to hand to a second astrologer |
| Share / Wrapped card | Partner invite already covers growth |
| AI chatbot, new referral, daily pulse, subscription | Out of scope |
| Couples mini-app / family inbox | Stop if Who for? becomes its own product |

---

## Two users (report)

| Seeker | Astrologer |
|--------|------------|
| Chat → Who for? (lead with Both) → recap opt-in | Briefing: sees **whose** charts, meter off |
| Briefing: “not charged yet” | Taps **Start session** |
| Chat/call, card pinned | Does not hunt the first bubble; does not ask a second DOB on the clock |
| Recap → My Readings → Book again | May suggest 3d / 1w / 1m |
| Store For You / Shop this topic | May point to a remedy; we do not require in-chat selling |

---

## Success metrics (report)

1. **% of sessions that are Partner or Both** (hero in)
2. **% of paid sessions that opt into recap** (hero out)
3. **% of sessions that pass through unmetered briefing**
4. **Time-to-first-advice** vs repeating DOB(s) **on the clock**
5. **Reopen recap / Book again from My Readings**
6. **Store reachable in-app**; For You or Shop this topic reflects last reading topic (bonus, not the pitch)

---

## One-line pitch

Same AstroLive app — including Store, as required — but **this consult is a reading**: you can do it **with a partner**, the chart(s) are read **before you pay**, and you **leave with a recap** you can open again in days. Shop follows the topic. The shop is not the story. **Do not call it a Session File.**

---

## Submission checklist

- [ ] Prototype **looks like** current AstroLive (5 tabs; Store in-app, not a 6th tab)
- [ ] Honest vs live app: we do **not** claim intake is missing; we **do** claim you still book alone and walk out with nothing
- [ ] Pitch **never** leads with “Session File”; it leads with **The Reading**
- [ ] Hero **in:** Who is this for? Me / Partner / Both + invite into *this* session; card pinned; **unmetered briefing** (not a blank loader)
- [ ] Demo **opens on Both** (Love), not on Name/DOB; 5-second Me/Career so it is not couples-only
- [ ] Hero **out:** paid recap card (scripted; no real recording/STT)
- [ ] Demo **pauses on the recap**; does **not** open on the shop
- [ ] Supporting: Menu → My Readings shows the recap + Book again + day-scale follow-up
- [ ] **Store in the app:** browse, PDP, cart, checkout; For You / Shop this topic tied to last reading topic
- [ ] Links public; report ≥ 8 pages; cite sources and AI
