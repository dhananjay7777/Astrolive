/**
 * AstroLive prototype — smoke + flow tests (Playwright)
 * Run: node tests/e2e.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PORT = 8765;
const BASE = `http://127.0.0.1:${PORT}`;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg'
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let path = req.url.split('?')[0];
      if (path === '/') path = '/index.html';
      const file = join(ROOT, path.replace(/^\//, '').replace(/\.\./g, ''));
      try {
        const data = readFileSync(file);
        res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

const results = { pass: [], fail: [] };

function ok(name) { results.pass.push(name); }
function bad(name, err) { results.fail.push({ name, err: String(err) }); }

async function pageEval(page, fn, ...args) {
  return page.evaluate(fn, ...args);
}

async function run() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  try {
    await page.goto(BASE);
    await page.waitForFunction(() => typeof renderScreen === 'function');

    /* --- Shell --- */
    const homeVisible = await page.isVisible('#homeView');
    if (homeVisible) ok('Home loads'); else bad('Home loads', 'homeView hidden');

    await page.click('.mode-tab[data-mode="store"]');
    await page.waitForTimeout(200);
    const storeVisible = await pageEval(page, () => currentScreen() === 'store');
    if (storeVisible) ok('Header Store tab'); else bad('Header Store tab', 'not on store');

    await page.click('.mode-tab[data-mode="home"]');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'home')) ok('Header Home tab');
    else bad('Header Home tab', 'not on home');

    /* --- Consultant + reading flow --- */
    await page.click('[data-nav="consultant"]');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'consultant')) ok('Consultant tab');
    else bad('Consultant tab', 'wrong screen');

    await pageEval(page, () => startConsult('neelam', 'chat'));
    await page.waitForTimeout(200);
    if (await page.isVisible('#readingView')) ok('Reading sheet opens');
    else bad('Reading sheet opens', 'readingView hidden');

    await pageEval(page, () => {
      selectWhoFor('both');
      pickPartner('diya');
      selectTopic('love');
      document.getElementById('rsNote').value = 'Test question';
    });
    await page.click('#rsCta');
    await page.waitForTimeout(300);
    if (await pageEval(page, () => currentScreen() === 'invite')) ok('Both → invite screen');
    else bad('Both → invite screen', await pageEval(page, () => currentScreen()));

    await page.click('button[onclick="proceedToBriefing()"]');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'briefing')) ok('Briefing screen');
    else bad('Briefing screen', await pageEval(page, () => currentScreen()));

    await pageEval(page, () => startSession());
    await page.waitForTimeout(400);
    if (await pageEval(page, () => currentScreen() === 'chat')) ok('Chat session');
    else bad('Chat session', await pageEval(page, () => currentScreen()));

    const footerVisible = await page.isVisible('.chat-footer');
    if (footerVisible) ok('Chat footer sticky');
    else bad('Chat footer sticky', 'footer not visible');

    await pageEval(page, () => endSession());
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'recap')) ok('Recap after end');
    else bad('Recap after end', await pageEval(page, () => currentScreen()));

    const readingCount = await pageEval(page, () => listReadings().length);
    if (readingCount >= 1) ok('Reading saved to localStorage');
    else bad('Reading saved', 'empty readings');

    /* --- My Readings --- */
    await pageEval(page, () => openMyReadings());
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'readingsList')) ok('My Readings list');
    else bad('My Readings list', await pageEval(page, () => currentScreen()));

    await page.click('.reading-row');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'readingDetail')) ok('Reading detail');
    else bad('Reading detail', await pageEval(page, () => currentScreen()));

    const detailFooter = await page.isVisible('#readingDetailFooter .rd-actions');
    if (detailFooter) ok('Detail CTAs visible');
    else bad('Detail CTAs visible', 'footer missing');

    /* --- Rebook + back --- */
    await page.click('.rd-rebook-btn');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'reading')) ok('Book again → reading sheet');
    else bad('Book again', await pageEval(page, () => currentScreen()));

    await page.click('.rs-back');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'readingDetail')) ok('Back from rebook → detail');
    else bad('Back from rebook', await pageEval(page, () => currentScreen()));

    /* --- Store cart --- */
    await pageEval(page, () => resetTo(['home', 'store']));
    await page.waitForTimeout(200);
    await pageEval(page, () => addToCart('rudraksh', 1));
    const count = await pageEval(page, () => state.cart.reduce((s, i) => s + i.qty, 0));
    if (count >= 1) ok('Add to cart');
    else bad('Add to cart', 'count 0');

    await page.click('#storeCartBtn');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'cart')) ok('Store cart icon');
    else bad('Store cart icon', await pageEval(page, () => currentScreen()));

    /* --- Shop this topic from detail --- */
    await pageEval(page, () => {
      const r = listReadings()[0];
      openReadingDetail(r.id);
    });
    await page.waitForTimeout(200);
    await page.click('.rd-shop-btn');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'store')) ok('Shop this topic → store');
    else bad('Shop this topic', await pageEval(page, () => currentScreen()));

    /* --- For You banner; Best Sellers no banner --- */
    await page.click('.store-tab[data-tab="forYou"]');
    await page.waitForTimeout(200);
    const forYouBanner = await pageEval(page, () => {
      const el = document.getElementById('intentionBanner');
      return el && el.style.display !== 'none' && !!el.src;
    });
    if (forYouBanner) ok('For You tab shows intention banner');
    else bad('For You banner', 'hidden');

    await page.click('.intention-row .intention-chip[data-intention="love"]');
    await page.waitForTimeout(200);
    const forYouLove = await pageEval(page, () => ({
      tab: state.storeTab,
      intention: state.selectedIntention,
      subtitle: document.getElementById('storeGridSubtitle').textContent,
      products: document.querySelectorAll('#storeGrid .product-card').length
    }));
    if (forYouLove.tab === 'forYou' && forYouLove.intention === 'love' && forYouLove.products >= 1)
      ok('For You intention chip filters in place');
    else bad('For You intention chip', JSON.stringify(forYouLove));

    await page.click('.store-tab[data-tab="bestSellers"]');
    await page.waitForTimeout(200);
    const bsBannerHidden = await pageEval(page, () => {
      const el = document.getElementById('intentionBanner');
      return !el || el.style.display === 'none';
    });
    if (bsBannerHidden) ok('Best Sellers hides intention banner');
    else bad('Best Sellers banner', 'should be hidden');

    await page.click('.intention-row .intention-chip[data-intention="wealth"]');
    await page.waitForTimeout(200);
    const bsWealth = await pageEval(page, () => ({
      tab: state.storeTab,
      intention: state.selectedIntention,
      subtitle: document.getElementById('storeGridSubtitle').textContent
    }));
    if (bsWealth.tab === 'bestSellers' && bsWealth.intention === 'wealth')
      ok('Best Sellers intention chip filters in place');
    else bad('Best Sellers intention chip', JSON.stringify(bsWealth));

    /* --- Me-only reading (skips invite) --- */
    await pageEval(page, () => {
      resetTo(['consultant']);
      startConsult('chavvi', 'chat');
      selectWhoFor('me');
      selectTopic('career');
      document.getElementById('rsNote').value = 'Career path';
    });
    await page.click('#rsCta');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'briefing')) ok('Me-only → briefing (no invite)');
    else bad('Me-only path', await pageEval(page, () => currentScreen()));

    /* --- Call channel --- */
    await pageEval(page, () => {
      resetTo(['consultant']);
      startConsult('kalpana', 'call');
    });
    await page.waitForTimeout(200);
    const channelLabel = await pageEval(page, () => document.getElementById('rsChannelLabel')?.textContent || '');
    if (channelLabel.toLowerCase().includes('call')) ok('Call channel label');
    else bad('Call channel', channelLabel);

    /* --- Add new Kundli form --- */
    await pageEval(page, () => {
      selectWhoFor('partner');
      showAddKundliForm();
      document.getElementById('akName').value = 'Test Partner';
      document.getElementById('akDob').value = '01 Jan 1995';
      saveNewKundli();
    });
    await page.waitForTimeout(200);
    const partnerName = await pageEval(page, () => session.file?.partnerSnapshot?.name || '');
    if (partnerName === 'Test Partner') ok('Add new Kundli');
    else bad('Add new Kundli', partnerName);

    /* --- Menu + search --- */
    await pageEval(page, () => resetTo(['menu']));
    await page.waitForTimeout(100);
    if (await pageEval(page, () => currentScreen() === 'menu')) ok('Menu screen');
    else bad('Menu screen', await pageEval(page, () => currentScreen()));

    await pageEval(page, () => openSearch());
    await page.waitForTimeout(100);
    if (await pageEval(page, () => currentScreen() === 'search')) ok('Search screen');
    else bad('Search screen', await pageEval(page, () => currentScreen()));

    await page.fill('#searchInput', 'rudraksh');
    await page.waitForTimeout(200);
    const searchHits = await pageEval(page, () => document.querySelectorAll('#searchResults .search-result-row').length);
    if (searchHits >= 1) ok('Search returns products');
    else bad('Search results', '0 hits');

    /* --- Store PDP → checkout → confirmation → journey --- */
    await pageEval(page, () => { resetTo(['home', 'store']); openProduct('rudraksh'); });
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'product')) ok('Product detail');
    else bad('Product detail', await pageEval(page, () => currentScreen()));

    await pageEval(page, () => buyNowFromPdp());
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'checkout')) ok('Buy now → checkout');
    else bad('Buy now checkout', await pageEval(page, () => currentScreen()));

    await pageEval(page, () => placeOrder());
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'confirmation')) ok('Place order → confirmation');
    else bad('Confirmation', await pageEval(page, () => currentScreen()));

    await pageEval(page, () => goToJourneyFromConfirmation());
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'journey')) ok('Astro Journey screen');
    else bad('Journey', await pageEval(page, () => currentScreen()));

    await pageEval(page, () => navigateTo('retention'));
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'retention')) ok('Retention screen');
    else bad('Retention', await pageEval(page, () => currentScreen()));

    /* --- Chat astrologer view toggle --- */
    await pageEval(page, () => {
      resetTo(['consultant']);
      startConsult('neelam', 'chat');
      selectWhoFor('me');
      selectTopic('love');
      confirmReadingSheet();
      startSession();
    });
    await page.waitForTimeout(300);
    await pageEval(page, () => navigateTo('astrologerView'));
    await page.waitForTimeout(200);
    const astroVisible = await page.isVisible('#astrologerView');
    if (astroVisible) ok('Astrologer view toggle');
    else bad('Astrologer view', 'hidden');

    /* --- Recap CTAs --- */
    await pageEval(page, () => endSession());
    await page.waitForTimeout(200);
    const recapShop = await page.isVisible('.recap-shop-btn');
    const recapRebook = await page.isVisible('.recap-rebook-btn');
    if (recapShop && recapRebook) ok('Recap CTAs visible');
    else bad('Recap CTAs', JSON.stringify({ recapShop, recapRebook }));

    if (consoleErrors.length === 0) ok('No console errors');
    else bad('Console errors', consoleErrors.join(' | '));

    /* --- Partner-only path (skips invite) --- */
    await pageEval(page, () => {
      resetTo(['consultant']);
      startConsult('kamakshi', 'chat');
      selectWhoFor('partner');
      pickPartner('diya');
      selectTopic('family');
    });
    await page.click('#rsCta');
    await page.waitForTimeout(200);
    if (await pageEval(page, () => currentScreen() === 'briefing')) ok('Partner-only → briefing (no invite)');
    else bad('Partner-only path', await pageEval(page, () => currentScreen()));

    /* --- Follow-up chip --- */
    await pageEval(page, () => {
      resetTo(['menu']);
      openMyReadings();
      const r = listReadings()[0];
      openReadingDetail(r.id);
      setFollowUp(r.id, '1w');
    });
    await page.waitForTimeout(200);
    const followSet = await pageEval(page, () => {
      const r = getReading(listReadings()[0].id);
      return r.followUp && r.followUp.window === '1w';
    });
    if (followSet) ok('Follow-up chip (1 week)');
    else bad('Follow-up chip', 'not saved');

    /* --- Cart persists after reload --- */
    await pageEval(page, () => { state.cart = []; addToCart('amethyst', 2); });
    await page.reload();
    await page.waitForFunction(() => typeof cartCount === 'function');
    const persisted = await pageEval(page, () => cartCount());
    if (persisted >= 2) ok('Cart persists in localStorage');
    else bad('Cart persistence', persisted);

  } catch (e) {
    bad('Unexpected crash', e);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n=== AstroLive E2E Results ===\n');
  results.pass.forEach(n => console.log('  PASS  ' + n));
  results.fail.forEach(f => console.log('  FAIL  ' + f.name + ' — ' + f.err));
  console.log(`\n${results.pass.length} passed, ${results.fail.length} failed\n`);
  process.exit(results.fail.length ? 1 : 0);
}

run();
