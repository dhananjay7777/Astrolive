# AstroLive — The Reading (Hackathon Prototype)

A **phone-framed SPA** for [AstroHack 2026: Build the Next Universe (AstroLive)](https://unstop.com/competitions/astrohack-2026-build-the-next-universe-astrolive-1719172). It extends the live AstroLive **mobile app** with one new product: **The Reading** — consult together, walk out with a recap.

**Live demo:** [https://dhananjay7777.github.io/Astrolive/](https://dhananjay7777.github.io/Astrolive/)  
**Repo:** [github.com/dhananjay7777/Astrolive](https://github.com/dhananjay7777/Astrolive)

---

## What we built

| Layer | Feature | In plain words |
|-------|---------|----------------|
| **Hero** | **The Reading** | Who for? (Me / Partner / Both) → briefing off the meter → chat with pinned card → **recap** |
| **Supporting** | **My Readings** | Shelf of past recaps (demo-seeded), Book again, follow-up (3d / 1w / 1m) |
| **Given** | **Astro Store** | In-app shop: For You / Categories / Best Sellers, four intention chips, cart, checkout (scripted) |

The live app already attaches birth details to chat as a bubble. This prototype adds **booking with a partner**, **chart review before billing**, and a **takeaway recap** you can reopen next week.

---

## Demo path (2 minutes)

1. **Consultant** → Chat with Neelam  
2. Reading sheet: **Both**, Diya, topic **Love** (or **Not sure**), one-line question  
3. Invite → **Briefing** (“not charged yet”) → **Start Session**  
4. Short chat → **End Session** → **Recap** *(pause here)*  
5. Recap **Home** exits to consult Home; **Shop for Love** / **Shop remedies** opens Store For You  
6. **Menu → My Readings** → open recap → **Book again**

Store is the **last tap**, not the open. Never say “Session File” in the video.

---

## What judges will notice (current UI)

- **Topics:** Career, Love, Family, Health, Money, Spiritual, plus **Not sure — let the astrologer guide**  
- **Recap:** Home (not Back — session is already over), badge `Saved · ₹49` or `Free preview`, **Shop for {topic}** / **Shop remedies**, Book again  
- **Store:** four Shop by Intention chips (Love, Career, Wealth, Peace). Click to select; **click-and-drag** (laptop) or swipe to scroll. Banners on For You + Categories; hidden on Best Sellers  
- **My Readings:** three demo readings if `localStorage` is empty  

---

## Tech stack

- **HTML / CSS / JavaScript** — single page, no bundler, no backend  
- **localStorage** — cart (`astrolive_cart`) and saved readings (`astrolive_readings`)  
- **Static hosting** — GitHub Pages  

Script load order: `data.js` → `store.js` → `session.js` → `app.js`

---

## Run locally

```bash
git clone https://github.com/dhananjay7777/Astrolive.git
cd Astrolive
```

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or: python -m http.server 8080
```

Then visit `http://localhost:8080` (or the port shown).

### E2E tests (optional)

```bash
npm install playwright
node tests/e2e.mjs
```

---

## Project structure

```
Astrolive/
├── index.html          # App markup (phone frame + all screens)
├── css/app.css         # Styles
├── js/
│   ├── data.js         # Products, astrologers, recap + reading seeds
│   ├── store.js        # Reserved (cart/PDP live in app.js)
│   ├── session.js      # Reading lifecycle (start, recap, rebook)
│   └── app.js          # Navigation, store, rendering
├── asset/              # Banners and product images
├── docs/               # Product, architecture, deploy
├── tests/e2e.mjs       # Playwright smoke tests
├── README.md
└── .gitignore
```

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [Suggested-Directions.md](docs/Suggested-Directions.md) | Product freeze & pitch |
| [architecture.md](docs/architecture.md) | Screen map & routing |
| [userflow-and-system-design.md](docs/userflow-and-system-design.md) | User flows & system design |
| [backendlogic.md](docs/backendlogic.md) | Data model & rules (no server) |
| [implementation.md](docs/implementation.md) | Build checklist (phases 0–6 done) |
| [deploy.md](docs/deploy.md) | GitHub Pages deployment |
| [phase0-audit.md](docs/phase0-audit.md) | Early UI audit vs live app |
| [designimprovements.md](docs/designimprovements.md) | Historical Home/Store design notes |

---

## Deploy

See [docs/deploy.md](docs/deploy.md). Summary:

1. Push to `main`  
2. **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**  
3. Site: [https://dhananjay7777.github.io/Astrolive/](https://dhananjay7777.github.io/Astrolive/)

Hard-refresh after a push (`Ctrl+Shift+R`).

---

## Scope & limits

**In scope:** Scripted chat/recap, partner kundli picker + add kundli, invite stub, Not sure topic, Store funnel from recap, demo reading seeds, fake checkout.

**Out of scope:** Real video/audio, wallet, STT/LLM, payment gateway, second device for partner, Second Opinion (stretch), sixth bottom tab.

---

## License

Hackathon prototype for AstroHack 2026. Not affiliated with AstroLive production systems.
