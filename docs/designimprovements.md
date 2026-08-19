# Design improvements — prototype vs live AstroLive app

**Source of truth:** the live **mobile app**, from `app-ui/1.jpeg` (Home top), `app-ui/2.jpeg` (Free Tools → Chat row), `app-ui/3.jpeg` (Chat + Call rows). Not [astrolive.app](https://astrolive.app).

**Current prototype:** `../index.html` Home inside an iPhone frame.

**How to read this file:** historical Home/Store visual brief from early build. **Current chrome:** header is search · bag · **wallet**; Store chips are Love / Career / Wealth / Peace; recap has Home + Shop for {topic}. Product freeze is [Suggested-Directions.md](./Suggested-Directions.md).

**Allowed differences (do not “fix” away):** Store **in the app** (company-given) via Home card + bag icon + Menu — **not** a sixth tab and **not** a header mode switch. Session File / partner / My Readings (our inserts). iPhone frame on a URL. Scripted chat.

---

## Locked: how Store enters the app (not a nav item, not a toggle)

**Problem:** Shop is a **company-given** requirement, but it does **not** exist in the live app (`app-ui/` screenshots). A **Home | Store** header toggle was the first insert. On first open it was easy to miss (it sat in chrome, next to search / wallet / bell). A **sixth bottom-tab** would make Store unmissable — and would be the wrong fix.

**Why not a 6th tab**

- The live bar is already five: Home · Live · AstroHub · Consultant · Menu. That is the product people recognise.
- Six items shrink tap targets. Labels like Consultant and AstroHub already barely fit.
- Adding a tab would make the prototype look like a **new app**, which the brief forbids.
- Chat | Call pills are the primary conversion control. Store must not compete with them in the same bar.

**Why not a header toggle**

- Header is utilities (search, wallet, bell), not destinations. People skip it.
- A segmented **Home | Store** control treats consult and shop as equal **modes**. That reads as a website switcher, not as AstroLive.
- It also made the purple header two rows tall — unlike the thin bar in `app-ui/`.

**What we ship instead (three ways in, still five tabs)**

| Path | Role | Why this shape |
|------|------|----------------|
| **Home \| Store tabs in the header** | Always-on switch | Same idea as before, but a **white bar + purple selected tab + NEW on Store** so it does not blend into chrome. Not a sixth bottom tab. |
| **Home “Astro Store” card + recos** | Proof in the scroll | Card + 3 product cards. Returning users: last reading. New users: Kundli hook. |
| **Header bag + Menu → Astro Store** | Return visit / backup | Bag on Store opens Cart. |

**What we still will not do:** sixth tab named Store · shop grid on first paint · opening the demo on Store.

**Rationale in one line:** Store must be **found once** (Home card) and stay **one tap away** (bag + Menu) without changing the five-tab app people already have.

---

## Priority

| P | Meaning |
|---|---------|
| **P0** | Judges will notice in the first 10 seconds. Do before feature phases. |
| **P1** | Makes Home feel like the real app, still cheap. |
| **P2** | Polish / later screens. Do after Phase 1 extract if time. |

---

## A. Do not copy from the live app

The screenshots show real product issues. Matching them would make *our* Home look broken.

| Live-app issue | What we should do instead | Rationale |
|----------------|---------------------------|-----------|
| Sticky **Chat / Call** pills cover Free Kundli, the Refer banner, and the Call-row buttons | Keep pills **above** the tab bar with a **small gap** (~8–12px). Scroll content must **clear** the pills (`padding-bottom` = tab bar + pill height + 12px, **no extra 100px** on the last section) | Overlap looks unfinished. Judges screenshot the bottom of Home. |
| Large empty band between last astrologer cards and the pills (when fully scrolled) | One spacer only. Last section padding stays ~16px | Double padding (`app-body` + last `.section`) is what created the dead lavender strip. |
| Live names truncated (`Tarot…`, `Elevat…`) | Short real names that fit (`Tarot`, `Elevate`) or two-line wrap | Truncation reads as unfinished data, not as “live now”. |
| Live-strip **View all** sits beside the circles, vertically misaligned | Same pattern as other sections: title row + `View all ›` on one baseline | The rest of the app already uses a header row. Mixing a floating link next to avatars looks accidental. |
| White tool-card titles on busy photos (Kundli’s Match hard to read) | Dark scrim or solid colour block behind the label | Contrast is a trust issue on a spiritual/consult product. |
| Chat yellow on cards vs a different yellow on the sticky pill | One Chat yellow (`#FFB020`–`#FF8C00`), one Call purple (`--purple`) | Colour is how Chat vs Call is recognised. Two yellows look like two products. |

---

## B. Home — match the live app (fidelity)

### B1. Hero banner — photo CTA, not a cartoon  **P0**

**Now:** Orange gradient + SVG saree silhouette + dark-purple **CONNECT NOW**. Three dots.

**Live:** Full-bleed photo of an astrologer (yellow outfit) filling the left; orange field on the right; **FREE** + **GET YOUR FIRST CONSULTATION FREE**; **CONNECT NOW** as a filled orange/dark pill; **two** carousel dots; card sits in a white rounded frame with modest inset.

**Change**

- Use a **photo-style** left panel (cropped stock / `asset/banners/` image), not an SVG blob.
- Keep copy: **FREE** chip + two-line headline + **CONNECT NOW**.
- CTA colour: dark fill (current) is more readable than live’s orange-on-orange; keep dark fill, or orange fill with **white** text and a 1px dark edge.
- Dots: **two** (or make the extra slides real later). Active = brand purple.
- Banner height ~150–170px, 16px screen inset, 18px corner radius.

**Rationale:** This is the first paint. A silhouette says “prototype”. A photo banner says “this is AstroLive”. First-consult free is also the live app’s main acquisition hook — the Session File later *attaches* to this CTA, so the banner must look native.

---

### B2. Wordmark and header chrome  **P0**

**Now:** Radial rainbow circle + `ASTROLIVE` in heavy 22px. Header is a thin purple bar (toggle removed).

**Live:** Small planet / eye mark; **ASTRO** white, **LIVE** pink-red; search · wallet · bell; header is a **thin** purple bar.

**Change**

- Draw a simple **planet + ring** (or reuse a 32px PNG) instead of the gradient disc.
- Wordmark: 18–20px, LIVE `#FF4D6A` (not pure `#ff4d4d`).
- Icons: search, **bag** (Store; cart badge), bell. Bag is our Store insert, not a live-app wallet clone.
- Keep the header **one row** — no Home | Store toggle.

**Rationale:** Logo + thin header is how people recognise the app in a 5-second glance. A tall header makes the prototype look like a **website inside a phone**, which the brief forbids.

---

### B3. Live strip — Instagram-story row, not a titled section  **P1**

**Now:** Section title **Live Now** + `View All ›` + three cartoon avatars + dashed **View all** circle. LIVE badge is **red**. Avatars 56px.

**Live:** No section title. A **horizontal row of circular photos** with a **blue “Live”** pill on the ring; names under; **View all** as purple text at the **end of the row**.

**Change**

- Drop **Live Now** (or keep a quiet 13px label only if judges need a caption).
- Avatars **64–68px**, **2.5px purple ring**, **blue Live** chip (`#3B82F6` / live-app blue), white 1.5px stroke.
- Real-looking circular photos (same treatment as B6).
- Last item: text **View all** (not a dashed empty circle).
- Names: 11px, one line, no ellipsis if we pick short names.

**Rationale:** Live is a distinct product surface (the Live tab). On Home it is a **status strip**, not a content module. Red LIVE fights the LIVE in the wordmark; the real app uses blue so “on air” ≠ brand wordmark.

---

### B4. Free Tools — five designed tiles  **P0**

**Now:** Five `<img>` paths under `asset/banners/` that **do not exist** in the repo (only `asset/product/placeholder-fallback.svg`). `onerror` paints a short gradient + emoji. Fifth tile is left-half only — good. Section title is **21px** (live is closer to 16–18px).

**Live:** 2×2 + one leftover: Love Calculator, Daily Horoscope, Today’s Panchang, Kundli’s Match, Free Kundli. Each is a **photo/illustration card** with a **white icon + title** on the image.

**Change**

- Create five **fixed-height** tiles (88–96px) as CSS + SVG (or real PNGs in `asset/banners/`). Do not depend on missing files.
- Always show **title + icon** on a dark 40% gradient at the bottom so text never sits on a photo.
- Equal corner radius **16px**, gap **12px**.
- Section title **17px**, same as Chat/Call rows.

**Rationale:** Missing banners make Home look half-built. Free tools are the habit loop the live app already owns; we must look like we **kept** them, not replaced them with emoji fallbacks.

---

### B5. Refer & Earn banner  **P1**

**Now:** Yellow sunburst, GET A / FREE / CHAT, Refer now — already close.

**Live:** Same idea; more illustration (stars), slightly flatter type, purple **Refer now**.

**Change**

- Slightly reduce italic + text-shadow so it does not look like a flyer.
- Keep purple **Refer now**. Wire later to the joint-reading copy (product), not a new layout.

**Rationale:** This is the live growth mechanic. Visual match tells judges we did not invent a new marketing strip.

---

### B6. Astrologer cards — photo cut-out, not SVG people  **P0**

**Now:** White card, **inset** 82px circle, cartoon SVG, then name / `Free | Exp: nYrs` / full-width Chat or Call.

**Live:** White card, **thin grey border**, **circular photo overlapping the top edge** of the card (cut-out), name, green **Free** + grey **Exp: 4Yrs**, orange **Chat** or purple **Call** pill.

**Change**

- Photo: `width: 72–80px`, `margin-top: -22px`, white 3px ring, `overflow: hidden` on the **circle only** (card `overflow: visible`).
- Replace SVGs with **photo placeholders** (neutral studio crop, consistent head size). Different people per card so the row scans as a roster.
- Card width ~118px so **~2.7 cards** peek — horizontal scroll is obvious.
- Meta: `Free` `#2FAE4E` · `|` · `Exp: 4Yrs` (no extra “Online · ₹/min” on Home; rates belong on Consultant).
- Buttons: Chat orange, Call purple, 20px radius, **12px** type, 36px min height.

**Rationale:** Trust in this category is **faces**. Cartoon heads read as a student mock. The overlapping photo is the live app’s signature card. Splitting Chat vs Call into **two rows** is already correct — keep that.

---

### B7. Sticky Chat | Call bar  **P0** (layout already partly fixed)

**Live:** Two equal pills, yellow Chat + purple Call, icons in a light circle, sit **flush-ish** on the tab bar (too flush).

**Change**

- `bottom` = tab-bar height + **10px**. Tab bar is ~72px with home-indicator padding → pills around **82px** from the screen bottom.
- `app-body` padding-bottom ≈ **tab + pill + 16px** (~140px), **not** 160px plus a 100px last section.
- Hide on Store and on PDP/cart (already).
- Icon + label optically centred (icon circle 20px, 6px gap).

**Rationale:** This bar is the live app’s primary conversion control. If it collides with tabs or leaves a lavender desert above it, the prototype fails the “this is the app” test even if every section is right.

---

### B8. Bottom tabs  **P1**

**Now:** Outline SVGs; Home purple when active; **AstroHub** label; extra bottom padding for the iPhone home indicator.

**Live:** Same five: Home · Live · AstroHub · Consultant · Menu. Active = **filled** purple house. Live = TV. AstroHub = planet. Consultant = **phone**. Menu = person.

**Change**

- Active tab: **filled** icon, not only stroke colour.
- Consultant = phone handset (already), not a chat bubble (chat is the yellow pill).
- Keep five tabs. Store is **not** a sixth tab.

**Rationale:** Tab icons are muscle memory. A chat-bubble Consultant tab fights the sticky Chat button.

---

### B9. Page background and type scale  **P1**

**Now:** `--bg: #f4f1fb` (lavender). Section titles 21px. Mixed 17px overrides.

**Live:** Near-**white** content (`#FFFFFF` / `#F7F7F8`), dark navy titles, purple only for links and brand.

**Change**

- Content canvas `#F7F5FA` or `#FFFFFF`; keep lavender only as a subtle page tint, not a purple wash.
- Type tokens: title 17px / 700, body 13px, meta 11px, `View all` 13px / 600 / `--purple`.
- One section padding: `16px 16px 0` (not 22px).

**Rationale:** Too much purple behind cards makes the prototype look themed, not like the production app (white lists, purple chrome).

---

## C. Images and placeholders (whole Home)

These are the same problem in three places: banner, live avatars, astrologer cards.

| Surface | Required look | Why |
|---------|---------------|-----|
| Banner left | Photographic, full-bleed, person facing camera | Matches `app-ui/1.jpeg` |
| Live circles | Cropped headshots, same circle size | “Who is on air” must be scannable |
| Chat/Call cards | Head-and-shoulders, consistent lighting | Roster, not clip-art |

**Practical rule for the hackathon:** one folder `asset/people/` with 8 JPGs (banner, 3 live, 6 cards — reuse OK). Until photos exist, use **neutral photo-style** CSS (soft studio gradient + simple face, **not** the current decorative SVG). Do not ship empty `onerror` tiles.

**Rationale:** Judges compare our URL to Play Store screenshots. Illustration vs photography is the fastest way to lose “this is AstroLive”.

---

## D. Store entry (implemented — see locked decision at top)

Do **not** revive the header toggle. Do **not** add a Store tab.

Keep the Home card after Free Tools, the bag icon, and Menu → Astro Store. Store screens use the **same** white cards, 16px radius, purple CTA as Home — not a desktop shop grid.

**Rationale:** Company requires Store **in the app**. If entry looks like a website switcher or a sixth tab, judges will think we built two products.

---

## E. Accessibility and tap quality  **P1**

| Issue | Change | Rationale |
|-------|--------|-----------|
| White text on bright Chat yellow | Darken Chat to `#E89400` or use `#241a3b` text on yellow | WCAG-ish contrast; yellow+white fails on a projector |
| 11px meta on cards | 12px minimum | Phone demo is often shown on a laptop |
| Banner CONNECT NOW ~12px | 13–14px, 40px height | Primary CTA |
| View all has no hit slop | `padding: 8px` on the text | Accidental misses look like dead UI |
| Sparkle `✦` on banner | Optional; remove if they fight the photo | Decoration that dates the mock |

---

## F. Phone chrome (demo, not the app)

**Now:** iPhone 14-ish frame, Dynamic Island, purple status bar.

**Live screenshots:** Android (15:17, 5G, system nav).

**Change (optional P2)**

- Keep the **iPhone frame** (Unstop URL + `implementation.md`).
- Status bar: time **left**, battery **right**, no 5G/WhatsApp clutter.
- Dynamic Island must not cover the time.
- Home-indicator padding on the tab bar is correct for iPhone; do not add a second Android nav.

**Rationale:** The frame is how we **show** the app. Fake Android icons inside an iPhone bezel is the one thing that looks more fake than SVG people.

---

## G. Later screens (after Home looks right)

Not Home, but they will sit in the same shell.

| Screen | Design note | Rationale |
|--------|-------------|-----------|
| Consultant | Same card language as Home Chat/Call, list not grid; Chat + Call on each row | Phase 2 must not invent a new card |
| Chat thread | Purple header, white bubbles / light-purple astrologer bubbles; Session File **pinned card** above messages | Hero insert must look native, not a modal from another app |
| Menu | Profile circle, wallet, orders, **My Readings** as one row | Readings is a journal, not a new tab |
| Store PDP | App product page (sticky Add to cart), not a desktop PDP | Company-given Store still in app chrome |

---

## H. Suggested order of work

Do these on `index.html` **before** Phase 1 CSS/JS split, so we do not extract the wrong visual.

1. **P0 layout:** sticky pill vs tab bar vs last-section padding (one spacer).
2. **P0 assets:** five Free Tools tiles that do not 404; photo placeholders for banner + 6 cards + 3 live.
3. **P0 cards:** overlapping circular photo, live-app meta line, Chat/Call colours unified.
4. **P1 chrome:** logo, live-strip layout, type scale, white canvas.
5. **P1 tabs:** filled active Home icon.
6. **P2:** banner carousel that actually pages, Android-free status bar, Store visual pass.

---

## I. Done when

A judge who has the Play Store listing open can look at our Home and say:

- Same **header, five tabs, Chat | Call bar**
- Same **section order:** banner → live faces → Free Tools → Refer → Chat row → Call row
- Same **card anatomy:** face, Free, Exp, coloured action
- **No** overlapping pills, **no** cartoon people, **no** missing tool images

Then we add Session File **into** that chrome, not around it.
