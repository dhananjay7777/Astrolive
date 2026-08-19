# Deploy AstroLive to GitHub Pages

This project is a **static site** (HTML, CSS, JS, images). No build step or server is required. GitHub Pages can host it directly from the repository.

**Live URL after deploy:**

`https://pjbhakii.github.io/Astrolive-Proto/`

*(Replace `pjbhakii` / `Astrolive-Proto` if you fork or rename the repo.)*

---

## Before you start

- A [GitHub](https://github.com) account
- [Git](https://git-scm.com/downloads) installed on your machine
- This folder pushed to a GitHub repository

---

## Step 1 — Add a `.gitignore` (recommended)

Do **not** upload `node_modules/` (Playwright is dev-only and not needed on Pages).

Create a file named `.gitignore` in the project root:

```gitignore
node_modules/
.DS_Store
Thumbs.db
*.log
.cursor/
```

---

## Step 2 — Commit and push to GitHub

Open a terminal in the project folder:

```bash
cd "d:\IIM Sirmaur\Astrolive"

git add index.html css/ js/ asset/ docs/
git add .gitignore

git commit -m "Prepare AstroLive prototype for GitHub Pages"

git push -u origin main
```

If the remote is not set yet:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Turn on GitHub Pages

1. Open the repo on GitHub:  
   `https://github.com/pjbhakii/Astrolive-Proto`
2. Go to **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
4. Set:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**.

GitHub will build and publish the site (usually 1–3 minutes).

---

## Step 4 — Open the live site

When deployment finishes, GitHub shows the public URL on the same **Pages** settings screen.

Default project-site URL:

```
https://pjbhakii.github.io/Astrolive-Proto/
```

Open it on a phone or desktop browser. The app should load with Home, Store, Consultant flow, and My Readings.

---

## Step 5 — Update after code changes

Each time you change the prototype:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

GitHub Pages redeploys automatically from `main`. Refresh the live URL after a minute or two (hard refresh: `Ctrl+Shift+R` / `Cmd+Shift+R`).

---

## What gets deployed

| Included | Purpose |
|----------|---------|
| `index.html` | App shell |
| `css/app.css` | Styles |
| `js/*.js` | App logic |
| `asset/` | Banners & product images |

| Not needed on Pages | Why |
|---------------------|-----|
| `node_modules/` | Playwright tests only |
| `tests/` | Local E2E only |
| `docs/` | Internal docs (optional to commit) |

---

## Troubleshooting

### Blank page or missing styles

- Confirm `index.html` is at the **repository root**, not inside a subfolder.
- In **Settings → Pages**, the folder must be **`/ (root)`**, not `/docs`.

### Images or JS not loading

- Paths in this project are **relative** (`css/app.css`, `asset/...`), which works on GitHub Pages project URLs.
- Do not change links to absolute paths like `/css/app.css` unless you add a `<base>` tag for the repo name.

### “My Readings” is empty on first visit

- Demo readings seed into `localStorage` in the browser. Clear site data or use a private window to see the empty state again.

### Pages build failed

- Check **Actions** or **Pages** settings for errors.
- Ensure the default branch name matches what you selected (`main`).

---

## Optional — Custom domain

1. **Settings → Pages → Custom domain** → enter your domain (e.g. `astrolive-demo.example.com`).
2. Add the DNS records GitHub shows (usually `CNAME` to `pjbhakii.github.io`).
3. Enable **Enforce HTTPS** when available.

---

## Optional — Deploy with GitHub Actions

Only needed if you later add a build step. For the current static prototype, **Deploy from branch** (Step 3) is enough.

---

## Quick checklist

- [ ] `.gitignore` excludes `node_modules/`
- [ ] Code pushed to `main`
- [ ] **Settings → Pages** → branch `main`, folder `/ (root)`
- [ ] Live URL opens and shows the AstroLive phone frame
- [ ] Store images and My Readings load correctly
