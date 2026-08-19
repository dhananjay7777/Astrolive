# Prototype implementation (final)

**What to build:** [Suggested-Directions.md](./Suggested-Directions.md) — **The Reading** (hero) + My Readings (supporting) + Store (given, **end of funnel**).  
**Screens:** [architecture.md](./architecture.md)  
**Rules:** [backendlogic.md](./backendlogic.md)

**Shape:** App UI in a phone frame. One page (SPA), split files. Not astrolive.app. Not many HTML pages.

Do phases in order. Phase 0 = audit vs live **phone app**. No `fetch`, no bundler unless the team already uses one.

## **Pitch reminder (do not implement the opposite):** Demo **opens** on Who for? **Both**. **Pauses** on the recap. Store is a **last tap** (Shop for Love / Shop remedies). Recap **Home** returns to consult Home — do not Back into ended chat. Never say “Session File” in the video. `SessionFile` is the object in `js/session.js`.

**Public URL:** [https://dhananjay7777.github.io/Astrolive/](https://dhananjay7777.github.io/Astrolive/) · **Deploy:** [deploy.md](./deploy.md)



## Phase tracker


| Phase | Name                           | What it does (plain words)                                                                                                                                                                          | Done? |
| ----- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 0     | **Audit**                      | Check the prototype looks and feels like the live AstroLive phone app — correct tabs, header, Home layout, purple style. Fix gaps before adding anything new.                                       | ✅     |
| 1     | **Shell + Store**              | Wire the Astro Store inside the app (header toggle, bag, Home card, Menu). Browse products, add to cart, fake checkout, cart survives refresh. Consult Home stays first.                            | ✅     |
| 2     | **Consultant list**            | Show a seeded list of astrologers. Tapping Chat or Call picks that astrologer and opens the Reading sheet.                                                                                          | ✅     |
| 3     | **Reading sheet + briefing**   | Topic chips (incl. **Not sure**), one-line question, recap opt-in. Then briefing — chart(s) visible, "not being charged yet" — before chat opens.                                        | ✅     |
| 4     | **Hero IN — Who for?**         | Add Me / Partner / Both to the sheet. Pick a saved partner kundli or **Add new Kundli**, or send a scripted invite. Both charts show on the pinned card.                                               | ✅     |
| 5     | **Hero live + recap + shop**   | Chat with the reading card pinned. After ending: recap (Home, Shop for {topic} / Shop remedies, Book again). **Demo pauses here.** | ✅     |
| 6     | **My Readings**                | Menu → list (demo-seeded if empty). Recap on each row. Book again prefilled. Follow-up 3d / 1w / 1m.                               | ✅     |
| 7     | **Second Opinion** *(stretch)* | Hand the same reading to a second astrologer at a reduced rate; static agree / differ comparison. Only if 0–6 are solid.                                                                            | ⬜     |


---



## 0. Target files

```
index.html       markup only
css/app.css      all styles
js/data.js       PRODUCTS, recap seeds by topic, READING_SEEDS, 4 INTENTIONS
js/store.js      reserved (cart/PDP still in app.js)
js/session.js    startConsult, confirmSession, startSession, saveRecap, rebook
js/app.js        navigateTo, Home | Store, wire buttons
asset/
docs/            not shipped as the demo
```

```html
<link rel="stylesheet" href="css/app.css">
…
<script src="js/data.js"></script>
<script src="js/store.js"></script>
<script src="js/session.js"></script>
<script src="js/app.js"></script>
```

CSS/JS are already split. Later phases **add** markup + `session.js`.

---



## Phase 0 — Audit: `index.html` vs live **app**

**Design source of truth = the mobile app**, not astrolive.app.

- [Android](https://play.google.com/store/apps/details?id=app.astrolive&hl=en_IN) · [iOS](https://apps.apple.com/in/app/astrolive-talk-to-astrologer/id6484162351)

**Not layout reference:** [astrolive.app](https://astrolive.app). Unstop URL = **phone-sized app mock**.

Save 3–5 in-app shots (Home, Consultant, chat, Menu) for the report. Chat shot in [docs/app-ui/Chat window.jpeg](./app-ui/Chat%20window.jpeg) = intake **bubble** (do not claim intake is missing).

### Checklist (tick in the report)


| Area                 | Live **app**                                    | Action                                                 |
| -------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| **Bottom tabs**      | Home · Live · Astro Hub · Consultant · Menu (5) | Must match. Store is **not** a 6th bottom tab.         |
| **Header**           | ASTROLIVE; search; wallet                         | Bag + **Home \| Store**; wallet (not bell)     |
| **Home first paint** | Consult / live / astrologers                    | Must look like **app Home**, not web Home              |
| **Chat start**       | Intake bubble (Name, DOB, TOC…)                 | Upgrade later (pin + Who for?); do not “invent intake” |
| **Store**            | Not a main app tab today                        | In-app shop screens, **not** the desktop shop          |
| **Copy**             | Chat, Call, Consultant, Astro Hub               | App labels only                                        |




### Allowed differences (intentional)

- Store in-app (header Store / bag / Home card / Menu)
- **The Reading:** Who for?, briefing, pin, recap, Shop for {topic}
- My Readings
- Phone mock on a URL; scripted chat

**Done when:** Judges see **AstroLive the app**. **Fix now:** 5 tabs + app-like Home.

**Do not:** Copy website IA; restyle Store like the desktop site.

---



## Phase 1 — Shell + keep Store

**Goal:** Shop works in-app. Consult Home stays first.


| Do                                      | Don’t                               |
| --------------------------------------- | ----------------------------------- |
| Keep `css/app.css` + `js/data.js` split | Create `store.html`                 |
| Home                                    | Store, bag, Home card, Menu → `ST1` |
| Cart + fake checkout                    | Open the **recorded demo** on Store |
| Home tab / header Home → `S1`           | Kidnap Home with Store              |


**Done when:** Open Store from header / bag / card / Menu; add to cart; fake checkout; refresh keeps cart; Home returns to consult.

**Pitch:** not yet. Plumbing + company-given shelf.

---



## Phase 2 — Consultant + Home Chat/Call

**Goal:** Pick an astrologer without going to Store.


| Do                                           | Don’t              |
| -------------------------------------------- | ------------------ |
| Seed 3 astrologers in `js/data.js`           | Filters/search     |
| `S4` + Home cards → `startConsult(id, 'chat' | 'call')`           |
| Live / Hub stub                              | Redesign Hub tools |


**Done when:** Chat/Call sets `session.astrologerId`. List looks like live Consultant (photo, name, rate, Chat/Call).

---



## Phase 3 — Reading sheet (Me) + briefing

**Files:** `S6` + `S6b` in `index.html`; `js/session.js`; show/hide in `js/app.js`.


| Do                                                                                                 | Don’t                        |
| -------------------------------------------------------------------------------------------------- | ---------------------------- |
| `S6`: self kundli (Aarav), topic chips, one-line question, **recap opt-in** (“Save a recap — ₹49”) | Put this in Astro Hub        |
| `assertSessionFileReady` — topic required                                                          | AI text                      |
| Hide tabs on `S6` / `S6b`                                                                          | Blank “Connecting…” spinner  |
| `S6b`: card visible + “going through your chart(s). You are not being charged yet.”                | Meter **on** during briefing |
| ~8–12 s auto-advance or **Start session** (astrologer toggle)                                      | Open-ended wait              |


Who for? may default **Me** until Phase 4.

**Done when:** No topic → Continue blocked. With topic → briefing (not a loader) → empty chat. Meter off until Start.

---



## Phase 4 — Hero IN: Who for?

**Same sheet** `S6`**.** This is **hero in**, not a side feature.


| Do                                                    | Don’t                                      |
| ----------------------------------------------------- | ------------------------------------------ |
| Who for? **Me / Partner / Both**                      | Family inbox / group chat                  |
| Pick saved kundli (Diya)                              | Real SMS                                   |
| Optional `S8`: Join this session                      | Two real logins / Hub Guna Milan rebuild   |
| Invite copy = into **this** consult, not Refer & Earn | Couples mini-app (new tabs, family thread) |


**Done when:** Partner/Both without chart or invite cannot Continue; names live on the reading. **Click path for the video:** Love + **Both**.

---



## Phase 5 — Hero live + recap + shop last

**This finishes the hero.** Demo both roles.


| Do                                                                                  | Don’t                                        |
| ----------------------------------------------------------------------------------- | -------------------------------------------- |
| `S9` pin: whoFor, chart name(s), topic, question — meter on                         | Live audio/video                             |
| `S10` same pin; “View as astrologer”                                                | Wallet meter                                 |
| 3–5 scripted bubbles; End → `endSession`                                            | RAG / real STT                               |
| `S9c` recap: who + 5 bullets + remedies + **Home** + Shop for {topic} / Shop remedies + Book again | Recap as a cut of ₹/min                      |
| Badge: `Saved · ₹49` or `Free preview` (no emoji wrap)                              | Force a purchase                             |
| `saveRecap` from seeded bullets in `js/data.js`                                     | Fake microphone pipeline                     |
| Shop this topic + For You + Home recos = `listRecommended(topic)`                   | Make Store the **first** screen of the video |


**Done when:** Same pinned card on seeker and astrologer. Recap after End. **Demo pauses on recap.** Then one tap Shop this topic → filtered Store (optional add to cart). Chat looks like in-app chat, not a website widget.

**Minimum demo bar:** Phases **0–5** (Both + briefing + recap; shop only as last tap).

---



## Phase 6 — Supporting: My Readings + follow-up


| Do                                                                    | Don’t                 |
| --------------------------------------------------------------------- | --------------------- |
| Menu → My Readings list + detail                                      | New tab               |
| Row: astrologer, date, topic, who for, question, **recap**, follow-up | Receipt or raw thread |
| Book again → `rebook` (prefilled `S6`, including Who for?)            | Clone minute buffer   |
| Follow-up 3d / 1w / 1m chip                                           | Push notifications    |
| Shop this topic → Store filter                                        | Force a purchase      |


**Done when:** End → recap → Menu row shows recap → Book again fills sheet (pair stays a pair).

**Target demo bar:** + Phase 6.

---



## Phase 7 — Stretch: Second Opinion

Only if 0–6 are solid. Skip without guilt.

---



## Demo click path (record this)

1. Home → Chat on an astrologer.
2. `S6`: topic **Love**, Who for? **Both**, Diya, recap opt-in. (Do not linger on DOB.) Optional: **Not sure** instead of Love.
3. `S6b` briefing, “not charged yet.”
4. Short chat, pin shows both names.
5. **End → recap. Pause.** Home icon exits to consult Home (not back to chat).
6. Shop for Love → Store For You (Love banner + products). Optional Add.
7. Menu → My Readings (seeded list if first visit) → same recap → Book again.
8. Optional 5s: Me + Career so it is not couples-only.

---

## Store as shipped (Phase 1 + later polish)

- Tabs: For You / Categories / Best Sellers. Intention chips **filter in place** (do not jump to Categories).
- Chips: Love, Career, Wealth, Peace & Wellness only.
- Intention banner: For You + Categories. Hidden on Best Sellers.
- Laptop: **click-and-drag** the chip row to scroll; tap to select (purple border + tint).

---



## Checklist per phase (copy)

After each phase:

- [ ] Still looks like the **AstroLive app** (Phase 0)
- [ ] Store cart still works (Phase 1 must never regress)
- [ ] One HTML page only; no new bottom tab
- [ ] Functions match [backendlogic.md](./backendlogic.md)
- [ ] Click through **Done when** once
- [ ] From Phase 5 on: recap exists; Store is not the open of the flow

---



## Suggested git / deploy

- Repo: [github.com/dhananjay7777/Astrolive](https://github.com/dhananjay7777/Astrolive)  
- Static host: **GitHub Pages** (`main` / root) — see [deploy.md](./deploy.md)  
- Public URL: [https://dhananjay7777.github.io/Astrolive/](https://dhananjay7777.github.io/Astrolive/)

---



## What not to implement

- Backend, auth, real payments, WebRTC  
- Real recording / STT / LLM recap  
- Bundler/React unless the team already uses it  
- Multi-file HTML or marketing-site layout  
- Putting UI back into one inlined `index.html`  
- Copying [astrolive.app](https://astrolive.app) nav or desktop shop  
- A sixth bottom tab named Store  
- A demo that **starts** on Store or that **names Session File**

