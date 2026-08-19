# Phase 0 Audit — `index.html` vs AstroLive mobile app

**Date:** 19 Aug 2026 (audit) · **Chrome update:** header **wallet** replaced the notification bell in later build.

**Reference:** Live Android/iOS app (not astrolive.app website)

---

## Gap table

| Area | Live app (expected) | `index.html` before | Match? | Resolution |
|------|---------------------|---------------------|:------:|------------|
| **Page title** | "AstroLive" | "AstroLive - Personalized Commerce Prototype" | ❌ | **Fixed** → `<title>AstroLive</title>` |
| **Bottom tabs (5)** | Home · Live · Astro Hub · Consultant · Menu | Same 5 labels | ✅ | Keep |
| **Menu tab icon** | Person/profile icon | Plain letter "P" | ❌ | **Fixed** → SVG person icon |
| **Notification bell** | Standard bell | Bell with "no signal" crossed line | ❌ | **Fixed** → clean bell + red dot badge |
| **Header** | ASTROLIVE wordmark, search, cart/wallet, bell | ✅ Same + Home\|Store toggle | ✅ | Keep (toggle is company-given) |
| **Home first paint** | Astrologers, live, consult — not a shop | ✅ Banner → Reco → Tools → Astrologers | ✅ | Keep |
| **Astrologer cards** | Photo, name, specialty, online status, ₹/min rate | Avatar only, no names or rates | ❌ | **Fixed** → Priya Sharma ₹15/min, Ravi Joshi ₹20/min, Meena Iyer ₹12/min + online dots |
| **"View All" astrologers** | Goes to Consultant tab | Dead / no action | ❌ | **Fixed** → `onNavClick('consultant')` |
| **Chat / Call buttons** | Active (open chat thread) | Dead | ⚠️ | Noted — Phase 2 wires real flow |
| **Consultant tab** | List of astrologers | Empty stub | ❌ | Phase 2 gap |
| **Live tab** | Live sessions / streams | Empty stub | ❌ | Phase 3 gap |
| **Chat thread** | In-app message thread | Missing | ❌ | Phase 5 gap |
| **Menu tab** | Profile, wallet, history, orders | Empty stub | ❌ | Phase 6 gap |
| **Colour palette** | Purple brand, red LIVE badge, compact lists | ✅ `--purple` + `.live` red | ✅ | Keep |
| **Free Tools (4)** | Daily Horoscope, Kundli, Panchang, Love Calc | ✅ Same 4 tiles with banners | ✅ | Keep |
| **Refer & Earn banner** | In-app refer banner | ✅ Present and styled | ✅ | Keep |
| **Store** | Shop mostly on web; company wants in-app | ✅ Full working store via toggle | ✅ | Keep (intentional — company given) |
| **Phone chrome** | iOS/Android device | ✅ iPhone 14 Pro frame + Dynamic Island | ✅ | Keep |

---

## Summary

### Keep (already correct)
- 5-tab bottom nav with correct app labels
- ASTROLIVE header with search, cart (with badge), bell
- Home\|Store toggle (company-given — allowed)
- Home leads with consultation content, not a shop grid
- Purple brand colour, red LIVE accent
- Free Tools 4-tile grid
- Refer & Earn banner
- iPhone frame for browser demo
- In-app Store (company requirement)

### Fixed now
1. `<title>` — removed "Personalized Commerce Prototype"
2. Menu tab icon — plain "P" → SVG person/profile icon
3. Bell icon — broken "no-signal" SVG → clean bell with red notification dot
4. Astrologer cards — added names, online status, ₹/min rates, colour variety
5. "View All" on astrologer section — now navigates to Consultant tab

### Fix in later phases
- **Phase 2:** Consultant tab astrologer list; Chat/Call buttons open session flow
- **Phase 3:** Live tab
- **Phase 4:** Session File (Lite Briefing Packet)
- **Phase 5:** Chat thread screen
- **Phase 6:** Menu / profile / My Readings
- **Phase 7:** Shareable Kundli card, Rebook button

### Intentional differences (do not "fix")
- Home\|Store header toggle — company-given requirement
- Session File sheet, partner booking, My Readings — our inserts (Phases 4–6)
- iPhone frame on a browser URL — hackathon requirement (Unstop needs a URL)
- Scripted/faked chat — no live video in prototype

---

**Phase 0 complete.** Prototype was judged as the AstroLive app, not a commerce demo.

### Current chrome (later than this audit)

Phases 1–6 shipped. Header utility is now **wallet** (not bell). Consultant, chat, recap, My Readings, and in-app Store are live. See [architecture.md](./architecture.md) “As shipped”.
