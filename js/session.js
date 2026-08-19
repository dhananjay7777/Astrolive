/* =========================================================
   SESSION FILE / READING APIs  —  Phase 3
   See docs/backendlogic.md for full spec.
========================================================= */

const session = {
  file: null,          // active SessionFile
  briefingTimer: null, // setTimeout handle for auto-advance
  selectedReadingId: null
};

const READINGS_KEY = 'astrolive_readings';

const TOPIC_LABELS = {
  career:'💼 Career', love:'❤️ Love', family:'🏠 Family',
  health:'🌿 Health', money:'💰 Money', spiritual:'🪷 Spiritual',
  unsure:'Not sure'
};

function formatReadingDate(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

function whoForLabel(who, selfName, partnerName){
  if(who === 'both' && partnerName) return selfName + ' & ' + partnerName;
  if(who === 'partner' && partnerName) return partnerName;
  return selfName || 'Me';
}

function listReadings(){
  return JSON.parse(localStorage.getItem(READINGS_KEY) || '[]');
}

function getReading(id){
  return listReadings().find(r => r.id === id) || null;
}

function updateReading(id, patch){
  const readings = listReadings();
  const idx = readings.findIndex(r => r.id === id);
  if(idx === -1) return null;
  readings[idx] = Object.assign({}, readings[idx], patch);
  localStorage.setItem(READINGS_KEY, JSON.stringify(readings));
  return readings[idx];
}

function setFollowUp(readingId, window){
  const days = window === '3d' ? 3 : window === '1w' ? 7 : 30;
  const followUpAt = new Date(Date.now() + days * 86400000).toISOString();
  const label = window === '3d' ? '3 days' : window === '1w' ? '1 week' : '1 month';
  updateReading(readingId, { followUp: { window, followUpAt, label } });
  showToast('Follow-up set for ' + label);
  if(currentScreen() === 'readingDetail') renderReadingDetail();
  if(currentScreen() === 'readingsList') renderReadingsList();
}

function openMyReadings(){
  navigateTo('readingsList');
}

function openReadingDetail(id){
  session.selectedReadingId = id;
  navigateTo('readingDetail');
}

/* ---- Entry point (Phase 2+): pick astrologer & channel ---- */
function startConsult(astrologerId, channel) {
  const astrologer = findAstrologer(astrologerId);
  if (!astrologer) { showToast('Astrologer not found'); return; }

  session.file = {
    id: 'sf_' + Date.now(),
    astrologerId,
    astrologerName: astrologer.name,
    channel,
    topic: null,
    note: '',
    whoFor: 'me',
    selfSnapshot: { name: 'Aarav Sharma', dob: '15 Mar 1992', tob: '06:30 AM', pob: 'Jaipur, Rajasthan' },
    partnerSnapshot: null,
    recapOptIn: false,
    status: 'draft',
    createdAt: new Date().toISOString()
  };

  navigateTo('reading');
}

/* ---- Phase 3 + 4: reading sheet interactions ---- */

const SAVED_KUNDLIS = {
  diya: { name: 'Diya Sharma', dob: '22 Jun 1994', tob: '10:15 AM', pob: 'Mumbai, Maharashtra' }
};

function selectTopic(topic) {
  if (!session.file) return;
  session.file.topic = topic;
  document.querySelectorAll('#rsTopicChips .rs-chip').forEach(c => {
    c.classList.toggle('selected', c.dataset.topic === topic);
  });
  updateCta();
}

function toggleRecapOptIn() {
  if (!session.file) return;
  session.file.recapOptIn = !session.file.recapOptIn;
  const track = document.getElementById('rsToggleTrack');
  if (track) track.classList.toggle('on', session.file.recapOptIn);
}

/* Phase 4 — Who for? */
function selectWhoFor(who) {
  if (!session.file) return;
  session.file.whoFor = who;

  document.querySelectorAll('.rs-whofor-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.who === who);
  });

  const partnerSection = document.getElementById('rsPartnerSection');
  if (partnerSection) {
    partnerSection.style.display = (who === 'partner' || who === 'both') ? '' : 'none';
  }

  /* If switching away from partner/both, clear partner snapshot */
  if (who === 'me') session.file.partnerSnapshot = null;

  updateCta();
}

function selectPartnerKundli() {
  /* toggle the picker dropdown */
  const picker = document.getElementById('rsKundliPicker');
  if (picker) picker.style.display = picker.style.display === 'none' ? '' : 'none';
}

function pickPartner(key) {
  const k = SAVED_KUNDLIS[key];
  if (!k || !session.file) return;
  session.file.partnerSnapshot = k;

  /* update card UI */
  const details = document.getElementById('rsPartnerDetails');
  if (details) {
    details.innerHTML = `<div class="rs-kundli-name">${k.name}</div>
      <div class="rs-kundli-dob">${k.dob} · ${k.tob} · ${k.pob}</div>`;
  }
  /* hide picker */
  const picker = document.getElementById('rsKundliPicker');
  if (picker) picker.style.display = 'none';

  updateCta();
}

function showAddKundliForm() {
  const picker = document.getElementById('rsKundliPicker');
  const form   = document.getElementById('rsAddKundliForm');
  if (picker) picker.style.display = 'none';
  if (form)   form.style.display = '';
  /* clear fields */
  ['akName','akDob','akTob','akPob'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function hideAddKundliForm() {
  const form = document.getElementById('rsAddKundliForm');
  if (form) form.style.display = 'none';
}

function saveNewKundli() {
  const name = (document.getElementById('akName')?.value || '').trim();
  const dob  = (document.getElementById('akDob')?.value  || '').trim();
  const tob  = (document.getElementById('akTob')?.value  || '').trim();
  const pob  = (document.getElementById('akPob')?.value  || '').trim();

  if (!name) { showToast('Please enter a name'); return; }
  if (!dob)  { showToast('Please enter date of birth'); return; }

  /* add to runtime seed map */
  const key = 'custom_' + Date.now();
  SAVED_KUNDLIS[key] = { name, dob, tob: tob || '—', pob: pob || '—' };

  /* inject into picker list so it persists this session */
  const picker = document.getElementById('rsKundliPicker');
  if (picker) {
    const addRow = picker.querySelector('.rs-picker-add');
    const newRow = document.createElement('div');
    newRow.className = 'rs-picker-item';
    newRow.onclick = () => pickPartner(key);
    newRow.innerHTML = `<span class="rs-picker-name">${name}</span>
      <span class="rs-picker-dob">${dob}${tob ? ' · ' + tob : ''}${pob ? ' · ' + pob : ''}</span>`;
    picker.insertBefore(newRow, addRow);
  }

  /* auto-select the new kundli */
  pickPartner(key);
  hideAddKundliForm();
}

function updateCta() {
  const sf = session.file;
  if (!sf) return;
  const cta = document.getElementById('rsCta');
  const hint = document.getElementById('rsCtaHint');

  const needsPartner = (sf.whoFor === 'partner' || sf.whoFor === 'both') && !sf.partnerSnapshot;
  const noTopic = !sf.topic;

  if (cta) cta.disabled = noTopic || needsPartner;
  if (hint) {
    if (noTopic) hint.textContent = 'Select a topic to continue';
    else if (needsPartner) hint.textContent = 'Pick a partner kundli to continue';
    else hint.textContent = '';
  }
}

/* Called when user taps Continue → */
function confirmReadingSheet() {
  if (!session.file) return;
  const sf = session.file;
  const noteEl = document.getElementById('rsNote');
  if (noteEl) sf.note = noteEl.value.trim();
  sf.status = 'ready';

  if (sf.whoFor === 'both') {
    /* show S8 invite screen first */
    navigateTo('invite');
  } else {
    navigateTo('briefing');
  }
}

/* S8 — proceed from invite to briefing */
function proceedToBriefing() {
  navigateTo('briefing');
}

function copyInviteLink() {
  showToast('Link copied! (scripted demo)');
}

/* ---- Phase 3: briefing screen ---- */
const BRIEFING_STEPS = [
  { pct: 20, label: 'Loading your birth chart…' },
  { pct: 50, label: 'Mapping planetary positions…' },
  { pct: 75, label: 'Reviewing your question…' },
  { pct: 95, label: 'Almost ready…' }
];

function startBriefingTimer() {
  if (session.briefingTimer) clearTimeout(session.briefingTimer);
  let step = 0;

  function advance() {
    if (step >= BRIEFING_STEPS.length) {
      /* done — show Start button */
      const bar = document.getElementById('bfProgressBar');
      const lbl = document.getElementById('bfProgressLabel');
      const btn = document.getElementById('bfStartBtn');
      if (bar) bar.style.width = '100%';
      if (lbl) lbl.textContent = 'Ready! Tap below to begin.';
      if (btn) btn.style.display = '';
      return;
    }
    const s = BRIEFING_STEPS[step++];
    const bar = document.getElementById('bfProgressBar');
    const lbl = document.getElementById('bfProgressLabel');
    if (bar) bar.style.width = s.pct + '%';
    if (lbl) lbl.textContent = s.label;
    session.briefingTimer = setTimeout(advance, 2500);
  }
  advance();
}

/* Called by "Start Session →" button */
function startSession() {
  if (!session.file) return;
  session.file.status = 'live';
  session.file.startedAt = new Date().toISOString();
  if (session.briefingTimer) { clearTimeout(session.briefingTimer); session.briefingTimer = null; }
  navigateTo('chat');
}

/* ---- Phase 5: chat + end + recap ---- */

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  appendChatBubble('user', text);
}

function appendChatBubble(from, text) {
  const container = document.getElementById('chatMessages');
  const mirror    = document.getElementById('astroMessages');
  if (!container) return;

  const a = session.file ? findAstrologer(session.file.astrologerId) : null;
  const avatarHtml = a ? (AVATAR_SVG[a.avatarClass] || '') : '';
  const userAvatar = `<svg viewBox="0 0 68 78" fill="none"><ellipse cx="34" cy="22" rx="14" ry="16" fill="#a080e0"/><rect x="28" y="36" width="12" height="10" rx="6" fill="#a080e0"/><path d="M8 78 C8 56 18 46 34 44 C50 46 60 56 60 78Z" fill="#7a1fd6"/></svg>`;

  const wrap = document.createElement('div');
  wrap.className = 'chat-bubble-wrap' + (from === 'user' ? ' user' : '');
  wrap.innerHTML = `
    <div class="chat-bubble-avatar">${from === 'user' ? userAvatar : avatarHtml}</div>
    <div class="chat-bubble ${from}">${text}</div>`;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;

  if (mirror) {
    const wrap2 = wrap.cloneNode(true);
    mirror.appendChild(wrap2);
    mirror.scrollTop = mirror.scrollHeight;
  }
}

function endSession() {
  if (!session.file) { resetTo(['home']); return; }
  session.file.status = 'ended';
  session.file.endedAt = new Date().toISOString();
  saveRecap();
  navigateTo('recap');
}

function saveRecap() {
  const sf = session.file;
  if (!sf) return;
  const seed = getRecapSeed(sf.topic);
  sf.recap = {
    topic: sf.topic,
    question: sf.note || '',
    whoFor: sf.whoFor,
    bullets: seed.bullets,
    remedies: seed.remedies,
    storeIntention: seed.storeIntention,
    paid: sf.recapOptIn,
    createdAt: new Date().toISOString()
  };

  /* persist to localStorage so Phase 6 (My Readings) can show it */
  const readings = listReadings();
  /* avoid duplicate if endSession called twice */
  if(readings.some(r => r.id === sf.id)) return;
  readings.unshift({
    id: sf.id,
    astrologerId: sf.astrologerId,
    astrologerName: sf.astrologerName,
    channel: sf.channel,
    topic: sf.topic,
    question: sf.note || '',
    whoFor: sf.whoFor,
    selfName: sf.selfSnapshot.name,
    selfSnapshot: sf.selfSnapshot,
    partnerName: sf.partnerSnapshot ? sf.partnerSnapshot.name : null,
    partnerSnapshot: sf.partnerSnapshot || null,
    recap: sf.recap,
    followUp: null,
    createdAt: sf.createdAt,
    endedAt: sf.endedAt || new Date().toISOString()
  });
  localStorage.setItem(READINGS_KEY, JSON.stringify(readings.slice(0, 20)));
}

function shopThisTopicFromReading(readingId){
  const r = getReading(readingId);
  const intention = r && r.recap ? r.recap.storeIntention : 'career';
  goToStoreTab('forYou', intention);
}

function shopThisTopic() {
  if(session.selectedReadingId) return shopThisTopicFromReading(session.selectedReadingId);
  const intention = session.file && session.file.recap
    ? session.file.recap.storeIntention
    : 'career';
  goToStoreTab('forYou', intention);
}

function rebook(readingId){
  const src = readingId ? getReading(readingId) : null;
  const sf = src || session.file;
  if(!sf) return;

  if(readingId) session.selectedReadingId = readingId;

  /* restore partner snapshot for older saved readings */
  let partnerSnapshot = sf.partnerSnapshot || null;
  if(!partnerSnapshot && sf.partnerName && (sf.whoFor === 'partner' || sf.whoFor === 'both')){
    partnerSnapshot = Object.values(SAVED_KUNDLIS).find(k => k.name === sf.partnerName)
      || { name: sf.partnerName, dob: '—', tob: '—', pob: '—' };
  }

  session.file = {
    id: 'sf_' + Date.now(),
    astrologerId: sf.astrologerId,
    astrologerName: sf.astrologerName,
    channel: sf.channel,
    topic: sf.topic,
    note: sf.question || sf.note || '',
    whoFor: sf.whoFor || 'me',
    selfSnapshot: sf.selfSnapshot || { name: 'Aarav Sharma', dob: '15 Mar 1992', tob: '06:30 AM', pob: 'Jaipur, Rajasthan' },
    partnerSnapshot,
    recapOptIn: false,
    status: 'draft',
    createdAt: new Date().toISOString()
  };

  const prev = currentScreen();
  if(prev === 'readingDetail' || (readingId && getReading(readingId))){
    resetTo(['readingsList', 'readingDetail', 'reading']);
  } else if(prev === 'recap'){
    resetTo(['recap', 'reading']);
  } else {
    resetTo(['consultant', 'reading']);
  }
}

function rebookSession() {
  rebook(session.selectedReadingId || (session.file && session.file.id));
}

function seedReadingsIfEmpty(){
  if(listReadings().length) return;
  localStorage.setItem(READINGS_KEY, JSON.stringify(READING_SEEDS));
}

seedReadingsIfEmpty();
