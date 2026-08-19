  /* =========================================================
     APP STATE
  ========================================================= */
  const state = {
    cart: JSON.parse(localStorage.getItem('astrolive_cart') || '[]'),
    storeTab: 'forYou',
    selectedIntention: 'career',
    selectedPayment: 'upi',
    selectedProductId: null,
    feedback: null,
    lastOrder: null,
    recoMode: 'returning'
  };

  function saveCart(){ localStorage.setItem('astrolive_cart', JSON.stringify(state.cart)); }

  /* =========================================================
     NAVIGATION / ROUTER
  ========================================================= */
  let screenStack = ['home'];
  function currentScreen(){ return screenStack[screenStack.length - 1]; }

  function navigateTo(id){
    if(id === currentScreen()) return;
    screenStack.push(id);
    renderScreen();
  }
  function goBack(){
    if(screenStack.length > 1){ screenStack.pop(); renderScreen(); }
  }
  function resetTo(stack){
    screenStack = stack;
    renderScreen();
  }

  const VIEW_IDS = ['homeView','storeView','menuView','productView','cartView','checkoutView','confirmationView','journeyView','retentionView','searchView','consultantView','readingView','briefingView','inviteView','chatView','astrologerView','recapView','readingsListView','readingDetailView'];
  const appHeader = document.getElementById('appHeader');
  const bottomNav = document.getElementById('bottomNav');
  const appBody = document.getElementById('appBody');

  function renderScreen(){
    const id = currentScreen();
    VIEW_IDS.forEach(v => { document.getElementById(v).style.display = 'none'; });

    if(id === 'home' || id === 'store' || id === 'menu' || id === 'consultant'){
      appHeader.style.display = '';
      bottomNav.style.display = '';
      appBody.classList.remove('compact-open');
      if(id === 'home') document.getElementById('homeView').style.display = '';
      if(id === 'store'){ document.getElementById('storeView').style.display = 'block'; renderStore(); }
      if(id === 'menu') document.getElementById('menuView').style.display = 'block';
      if(id === 'consultant'){ document.getElementById('consultantView').style.display = 'block'; renderConsultants(); }
      setBottomNavActive(id === 'store' ? 'home' : id);
      const modeTabs = document.getElementById('modeTabs');
      if(modeTabs){
        modeTabs.style.display = (id === 'home' || id === 'store') ? '' : 'none';
        modeTabs.querySelectorAll('.mode-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.mode === (id === 'store' ? 'store' : 'home'));
        });
      }
      const pill = document.getElementById('stickyPill');
      if(pill) pill.style.display = id === 'home' ? '' : 'none';
    } else {
      appHeader.style.display = 'none';
      bottomNav.style.display = 'none';
      const pill2 = document.getElementById('stickyPill');
      if(pill2) pill2.style.display = 'none';
      appBody.classList.add('compact-open');
      const map = { product:'productView', cart:'cartView', checkout:'checkoutView', confirmation:'confirmationView', journey:'journeyView', retention:'retentionView', search:'searchView', reading:'readingView', briefing:'briefingView', invite:'inviteView', chat:'chatView', astrologerView:'astrologerView', recap:'recapView', readingsList:'readingsListView', readingDetail:'readingDetailView' };
      if(map[id]){
        const viewEl = document.getElementById(map[id]);
        /* flex views must stay flex — inline display:block breaks sticky footer layout */
        viewEl.style.display = (id === 'chat' || id === 'astrologerView' || id === 'readingDetail') ? 'flex' : 'block';
      }
      if(id === 'product') renderProductDetail();
      if(id === 'cart') renderCart();
      if(id === 'checkout') renderCheckout();
      if(id === 'journey') renderJourney();
      if(id === 'retention') renderRetention();
      if(id === 'search') { document.getElementById('searchInput').value=''; renderSearchResults(''); }
      if(id === 'reading') renderReadingSheet();
      if(id === 'briefing') renderBriefingScreen();
      if(id === 'invite') renderInviteScreen();
      if(id === 'chat'){ appBody.classList.add('chat-open'); renderChatScreen(); }
      if(id === 'astrologerView'){ appBody.classList.add('chat-open'); renderAstrologerView(); }
      if(id === 'recap') renderRecapScreen();
      if(id === 'readingsList') renderReadingsList();
      if(id === 'readingDetail'){ appBody.classList.add('reading-detail-open'); renderReadingDetail(); }
      if(id !== 'chat' && id !== 'astrologerView') appBody.classList.remove('chat-open');
      if(id !== 'readingDetail') appBody.classList.remove('reading-detail-open');
    }
    appBody.scrollTop = 0;
  }

  function setBottomNavActive(navId){
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.nav === navId));
  }

  function onNavClick(navId){
    const pill = document.getElementById('stickyPill');
    if(navId === 'home'){
      resetTo(['home']);
      if(pill) pill.style.display = '';
      return;
    }
    if(navId === 'menu'){
      resetTo(['menu']);
      return;
    }
    if(pill) pill.style.display = 'none';
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.nav === navId);
    });
    if(navId === 'consultant'){
      resetTo(['consultant']);
    } else if(navId === 'live'){
      showToast('Live sessions — coming in Phase 3');
    } else if(navId === 'hub'){
      showToast('Astro Hub — coming soon');
    } else {
      showToast('Coming soon in the full app');
    }
  }

  /* =========================================================
     CONSULTANT VIEW — Phase 2
  ========================================================= */
  /* SVG avatar bodies reused from the home cards (ap1-ap6) */
  const AVATAR_SVG = {
    ap1: `<svg viewBox="0 0 68 78" fill="none"><ellipse cx="34" cy="22" rx="14" ry="16" fill="#e8a870"/><path d="M34 8 Q20 8 20 20 Q22 12 34 12 Q46 12 48 20 Q48 8 34 8Z" fill="#2a1a0a"/><rect x="28" y="36" width="12" height="10" rx="6" fill="#e8a870"/><path d="M8 78 C8 56 18 46 34 44 C50 46 60 56 60 78Z" fill="#d97020"/><path d="M8 58 Q2 50 6 42 Q14 48 18 60Z" fill="#e09030"/></svg>`,
    ap2: `<svg viewBox="0 0 68 78" fill="none"><ellipse cx="34" cy="22" rx="14" ry="16" fill="#f0c898"/><path d="M20 18 Q22 8 34 8 Q46 8 48 18 Q46 10 34 10 Q22 10 20 18Z" fill="#1a0a00"/><rect x="28" y="36" width="12" height="10" rx="6" fill="#f0c898"/><path d="M8 78 C8 56 18 46 34 44 C50 46 60 56 60 78Z" fill="#5080c0"/><path d="M60 58 Q66 50 62 42 Q54 48 50 60Z" fill="#6090d0"/></svg>`,
    ap3: `<svg viewBox="0 0 68 78" fill="none"><ellipse cx="34" cy="22" rx="14" ry="16" fill="#f4d0b8"/><path d="M20 16 Q24 6 34 6 Q44 6 48 16 Q44 8 34 8 Q24 8 20 16Z" fill="#3a1a08"/><rect x="28" y="36" width="12" height="10" rx="6" fill="#f4d0b8"/><path d="M8 78 C8 56 18 46 34 44 C50 46 60 56 60 78Z" fill="#cc3070"/><path d="M8 58 Q2 50 6 42 Q14 48 18 60Z" fill="#dd4080"/></svg>`,
    ap4: `<svg viewBox="0 0 68 78" fill="none"><ellipse cx="34" cy="22" rx="14" ry="16" fill="#e8a068"/><path d="M20 18 Q20 6 34 6 Q48 6 48 18 Q46 8 34 8 Q22 8 20 18Z" fill="#1e0e04"/><rect x="28" y="36" width="12" height="10" rx="6" fill="#e8a068"/><path d="M8 78 C8 56 18 46 34 44 C50 46 60 56 60 78Z" fill="#7a3fd6"/><path d="M60 58 Q66 50 62 42 Q54 48 50 60Z" fill="#8a4fe0"/></svg>`,
    ap5: `<svg viewBox="0 0 68 78" fill="none"><ellipse cx="34" cy="22" rx="14" ry="16" fill="#ecc8a8"/><path d="M20 16 Q22 6 34 6 Q46 6 48 16 Q46 8 34 8 Q22 8 20 16Z" fill="#2a1206"/><rect x="28" y="36" width="12" height="10" rx="6" fill="#ecc8a8"/><path d="M8 78 C8 56 18 46 34 44 C50 46 60 56 60 78Z" fill="#9a4f20"/><path d="M8 58 Q2 50 6 42 Q14 48 18 60Z" fill="#aa5f30"/></svg>`,
    ap6: `<svg viewBox="0 0 68 78" fill="none"><ellipse cx="34" cy="22" rx="14" ry="16" fill="#f0d8c8"/><path d="M20 16 Q24 4 34 4 Q44 4 48 16 Q44 6 34 6 Q24 6 20 16Z" fill="#3a2010"/><rect x="28" y="36" width="12" height="10" rx="6" fill="#f0d8c8"/><path d="M8 78 C8 56 18 46 34 44 C50 46 60 56 60 78Z" fill="#4060a0"/><path d="M60 58 Q66 50 62 42 Q54 48 50 60Z" fill="#5070b0"/></svg>`
  };

  function renderConsultants(){
    const container = document.getElementById('consultantList');
    if(!container) return;
    container.innerHTML = ASTROLOGERS.map(a => {
      const canChat = a.channel === 'chat' || a.channel === 'both';
      const canCall = a.channel === 'call' || a.channel === 'both';
      const chatRate = astrologerRateLabel(a, 'chat');
      const callRate = astrologerRateLabel(a, 'call');
      const dot = a.online
        ? `<span class="cons-online-dot"></span>`
        : `<span class="cons-offline-dot"></span>`;
      const chatOnclick = canChat ? `onclick="startConsult('${a.id}','chat')"` : 'disabled';
      const callOnclick = canCall ? `onclick="startConsult('${a.id}','call')"` : 'disabled';
      return `
        <div class="cons-card">
          <div class="cons-top-row">
            <div class="cons-avatar ${a.avatarClass}">
              ${AVATAR_SVG[a.avatarClass] || ''}
              ${dot}
            </div>
            <div class="cons-info">
              <div class="cons-name">${a.name}</div>
              <div class="cons-skills">${a.skills.join(' · ')}</div>
              <div class="cons-exp">Exp: ${a.exp} Yrs</div>
            </div>
          </div>
          <div class="cons-actions">
            <div class="cons-btn-wrap">
              <button class="cons-btn cons-btn-chat" ${chatOnclick}>Chat</button>
              <div class="cons-rate">${canChat ? astrologerRateLabel(a,'chat') : '—'}</div>
            </div>
            <div class="cons-btn-wrap">
              <button class="cons-btn cons-btn-call" ${callOnclick}>Call</button>
              <div class="cons-rate">${canCall ? astrologerRateLabel(a,'call') : '—'}</div>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  /* =========================================================
     S6 — READING SHEET render  (Phase 3)
  ========================================================= */
  function renderReadingSheet() {
    const sf = session.file;
    if (!sf) { resetTo(['consultant']); return; }

    const a = findAstrologer(sf.astrologerId);
    /* header */
    const nameEl = document.getElementById('rsAstrologerName');
    const chanEl = document.getElementById('rsChannelLabel');
    const avatarEl = document.getElementById('rsAstrologerAvatar');
    if (nameEl) nameEl.textContent = sf.astrologerName;
    if (chanEl) {
      chanEl.textContent = sf.channel === 'chat' ? '💬 Chat' : '📞 Call';
      chanEl.style.background = sf.channel === 'chat' ? 'rgba(255,184,32,0.35)' : 'rgba(255,255,255,0.22)';
    }
    if (avatarEl && a) avatarEl.innerHTML = AVATAR_SVG[a.avatarClass] || '';

    /* Who for? buttons */
    document.querySelectorAll('.rs-whofor-btn').forEach(b => {
      b.classList.toggle('selected', b.dataset.who === (sf.whoFor || 'me'));
    });
    const partnerSection = document.getElementById('rsPartnerSection');
    if (partnerSection) {
      partnerSection.style.display = (sf.whoFor === 'partner' || sf.whoFor === 'both') ? '' : 'none';
    }
    /* reset partner card display */
    const partnerDetails = document.getElementById('rsPartnerDetails');
    if (partnerDetails && sf.partnerSnapshot) {
      const p = sf.partnerSnapshot;
      partnerDetails.innerHTML = `<div class="rs-kundli-name">${p.name}</div>
        <div class="rs-kundli-dob">${p.dob} · ${p.tob} · ${p.pob}</div>`;
    } else if (partnerDetails) {
      partnerDetails.innerHTML = `<div class="rs-kundli-name" style="color:#9a9ab0;">Tap to pick a saved kundli</div>
        <div class="rs-kundli-dob" style="color:#c0b8d8;">Partner's birth details</div>`;
    }
    /* hide picker */
    const picker = document.getElementById('rsKundliPicker');
    if (picker) picker.style.display = 'none';

    /* topic chips */
    document.querySelectorAll('#rsTopicChips .rs-chip').forEach(c => {
      c.classList.toggle('selected', c.dataset.topic === sf.topic);
    });

    /* note */
    const noteEl = document.getElementById('rsNote');
    if (noteEl) noteEl.value = sf.note || '';

    /* recap toggle */
    const track = document.getElementById('rsToggleTrack');
    if (track) track.classList.toggle('on', !!sf.recapOptIn);

    /* CTA — delegate to session.js updateCta() */
    updateCta();
  }

  /* =========================================================
     S6b — BRIEFING SCREEN render  (Phase 3)
  ========================================================= */
  function renderBriefingScreen() {
    const sf = session.file;
    if (!sf) { resetTo(['consultant']); return; }

    const a = findAstrologer(sf.astrologerId);
    const TOPIC_LABELS = { career:'💼 Career', love:'❤️ Love', family:'🏠 Family', health:'🌿 Health', money:'💰 Money', spiritual:'🪷 Spiritual' };

    /* avatar */
    const avatarEl = document.getElementById('bfAvatar');
    if (avatarEl && a) avatarEl.innerHTML = AVATAR_SVG[a.avatarClass] || '';

    /* name + title */
    const nameEl = document.getElementById('bfAstrologerName');
    if (nameEl) nameEl.textContent = sf.astrologerName;

    const titleEl = document.getElementById('bfMsgTitle');
    if (titleEl) titleEl.textContent = 'Going through ' + (sf.whoFor === 'both' ? 'your charts' : 'your chart') + '…';

    /* kundli card */
    const nameDisplay = sf.whoFor === 'both' && sf.partnerSnapshot
      ? sf.selfSnapshot.name + ' & ' + sf.partnerSnapshot.name
      : sf.whoFor === 'partner' && sf.partnerSnapshot
        ? sf.partnerSnapshot.name
        : sf.selfSnapshot.name;
    const dobDisplay = sf.whoFor === 'partner' && sf.partnerSnapshot
      ? sf.partnerSnapshot.dob + ' · ' + sf.partnerSnapshot.tob + ' · ' + sf.partnerSnapshot.pob
      : sf.selfSnapshot.dob + ' · ' + sf.selfSnapshot.tob + ' · ' + sf.selfSnapshot.pob;
    document.getElementById('bfName').textContent = nameDisplay;
    document.getElementById('bfDob').textContent = dobDisplay;
    document.getElementById('bfTopic').textContent = TOPIC_LABELS[sf.topic] || sf.topic;
    document.getElementById('bfNote').textContent = sf.note || '—';

    /* reset progress */
    const bar = document.getElementById('bfProgressBar');
    const lbl = document.getElementById('bfProgressLabel');
    const btn = document.getElementById('bfStartBtn');
    if (bar) bar.style.width = '0%';
    if (lbl) lbl.textContent = 'Reviewing chart…';
    if (btn) btn.style.display = 'none';

    /* kick off the timer */
    startBriefingTimer();
  }

  /* =========================================================
     S9 — CHAT SCREEN render  (Phase 5)
  ========================================================= */
  const TOPIC_LABELS_CHAT = { career:'💼 Career', love:'❤️ Love', family:'🏠 Family', health:'🌿 Health', money:'💰 Money', spiritual:'🪷 Spiritual' };

  function buildPinText(sf) {
    const who = sf.whoFor === 'both' && sf.partnerSnapshot
      ? sf.selfSnapshot.name + ' & ' + sf.partnerSnapshot.name
      : sf.whoFor === 'partner' && sf.partnerSnapshot
        ? sf.partnerSnapshot.name
        : sf.selfSnapshot.name;
    const topic = TOPIC_LABELS_CHAT[sf.topic] || sf.topic || '—';
    const q = sf.note ? ' · "' + sf.note + '"' : '';
    return who + ' · ' + topic + q;
  }

  function renderChatScreen() {
    const sf = session.file;
    if (!sf) { resetTo(['consultant']); return; }
    const a = findAstrologer(sf.astrologerId);

    /* header */
    const nameEl = document.getElementById('chatAstroName');
    const avatarEl = document.getElementById('chatAstroAvatar');
    if (nameEl) nameEl.textContent = sf.astrologerName;
    if (avatarEl && a) avatarEl.innerHTML = AVATAR_SVG[a.avatarClass] || '';

    /* pinned card */
    const pinBody = document.getElementById('chatPinBody');
    if (pinBody) pinBody.textContent = buildPinText(sf);

    /* clear messages + seed scripted bubbles */
    const msgs = document.getElementById('chatMessages');
    const astroMsgs = document.getElementById('astroMessages');
    if (msgs) msgs.innerHTML = '';
    if (astroMsgs) astroMsgs.innerHTML = '';

    const seed = getRecapSeed(sf.topic);
    let delay = 400;
    seed.chatBubbles.forEach(b => {
      setTimeout(() => appendChatBubble(b.from, b.text), delay);
      delay += 1200;
    });
  }

  /* =========================================================
     S10 — ASTROLOGER VIEW render  (Phase 5)
  ========================================================= */
  function renderAstrologerView() {
    const sf = session.file;
    if (!sf) return;
    const pinBody = document.getElementById('astroPinBody');
    if (pinBody) pinBody.textContent = buildPinText(sf);
  }

  /* =========================================================
     S9c — RECAP SCREEN render  (Phase 5)
  ========================================================= */
  function renderRecapScreen() {
    const sf = session.file;
    if (!sf || !sf.recap) { resetTo(['home']); return; }
    const r = sf.recap;
    const TOPIC_MAP = { career:'💼 Career', love:'❤️ Love', family:'🏠 Family', health:'🌿 Health', money:'💰 Money', spiritual:'🪷 Spiritual' };

    /* meta */
    const metaEl = document.getElementById('recapMeta');
    const whoLabel = sf.whoFor === 'both' && sf.partnerSnapshot
      ? sf.selfSnapshot.name + ' & ' + sf.partnerSnapshot.name
      : sf.whoFor === 'partner' && sf.partnerSnapshot
        ? sf.partnerSnapshot.name : sf.selfSnapshot.name;
    if (metaEl) metaEl.innerHTML =
      `<strong>${TOPIC_MAP[r.topic] || r.topic}</strong> reading with <strong>${sf.astrologerName}</strong><br>
       <span style="font-size:12px;color:var(--text-mute);">For: ${whoLabel}${r.question ? ' · "' + r.question + '"' : ''}</span>`;

    /* bullets */
    const bulletsEl = document.getElementById('recapBullets');
    if (bulletsEl) bulletsEl.innerHTML = r.bullets.map((b, i) =>
      `<div class="recap-bullet"><span class="recap-bullet-num">${i+1}</span><span>${b}</span></div>`
    ).join('');

    /* remedies */
    const remEl = document.getElementById('recapRemedies');
    if (remEl) remEl.innerHTML = r.remedies.map(rem =>
      `<div class="recap-remedy">${rem}</div>`
    ).join('');

    /* paid badge */
    const badge = document.getElementById('recapPaidBadge');
    if (badge) {
      badge.textContent = r.paid ? 'Saved · ₹49' : 'Free preview';
    }

    const PLAIN_TOPIC = { career:'Career', love:'Love', family:'Family', health:'Health', money:'Money', spiritual:'Spiritual' };
    const shopBtnText = document.getElementById('recapShopBtnText');
    const topicPlain = PLAIN_TOPIC[r.topic] || r.topic || 'this topic';
    if (shopBtnText) shopBtnText.textContent = 'Shop for ' + topicPlain;
  }

  /* =========================================================
     S11 — MY READINGS LIST (Phase 6)
  ========================================================= */
  function renderReadingsList(){
    const container = document.getElementById('readingsList');
    if(!container) return;
    const readings = listReadings();

    if(!readings.length){
      container.innerHTML = `
        <div class="readings-empty">
          <div class="readings-empty-icon">📖</div>
          <div class="readings-empty-title">No readings yet</div>
          <div class="readings-empty-sub">Complete a consultation and your recap will appear here.</div>
        </div>`;
      return;
    }

    container.innerHTML = readings.map(r => {
      const topic = TOPIC_LABELS[r.topic] || r.topic || 'Reading';
      const who = whoForLabel(r.whoFor, r.selfName, r.partnerName);
      const preview = r.recap && r.recap.bullets && r.recap.bullets[0]
        ? r.recap.bullets[0]
        : 'Recap saved';
      const followTag = r.followUp
        ? `<span class="reading-tag followup">Follow-up · ${r.followUp.label}</span>`
        : '';
      return `
        <div class="reading-row" onclick="openReadingDetail('${r.id}')">
          <div class="reading-row-top">
            <span class="reading-row-astro">${r.astrologerName}</span>
            <span class="reading-row-date">${formatReadingDate(r.endedAt || r.createdAt)}</span>
          </div>
          <div class="reading-row-meta">
            <span class="reading-tag">${topic}</span>
            <span class="reading-tag">${who}</span>
            ${followTag}
          </div>
          <div class="reading-row-preview">${preview}</div>
        </div>`;
    }).join('');
  }

  /* =========================================================
     S12 — READING DETAIL (Phase 6)
  ========================================================= */
  function renderReadingDetail(){
    const body = document.getElementById('readingDetailBody');
    const footer = document.getElementById('readingDetailFooter');
    if(!body || !footer) return;
    const r = getReading(session.selectedReadingId);
    if(!r){ resetTo(['readingsList']); return; }

    const topic = TOPIC_LABELS[r.topic] || r.topic || 'Reading';
    const who = whoForLabel(r.whoFor, r.selfName, r.partnerName);
    const bullets = (r.recap && r.recap.bullets) || [];
    const remedies = (r.recap && r.recap.remedies) || [];

    const followChips = ['3d','1w','1m'].map(w => {
      const label = w === '3d' ? '3 days' : w === '1w' ? '1 week' : '1 month';
      const sel = r.followUp && r.followUp.window === w ? ' selected' : '';
      return `<button class="rd-follow-chip${sel}" onclick="setFollowUp('${r.id}','${w}')">${label}</button>`;
    }).join('');

    body.innerHTML = `
      <div class="rd-meta">
        <strong>${topic}</strong> with <strong>${r.astrologerName}</strong><br>
        <span style="font-size:12px;color:var(--text-mute);">
          ${formatReadingDate(r.endedAt || r.createdAt)} · For: ${who}
          ${r.question ? ' · "' + r.question + '"' : ''}
        </span>
      </div>

      <div class="rd-section-title">Key Insights</div>
      <div class="recap-bullets">
        ${bullets.map((b,i) => `
          <div class="recap-bullet">
            <span class="recap-bullet-num">${i+1}</span>
            <span>${b}</span>
          </div>`).join('')}
      </div>

      <div class="rd-section-title">Recommended Remedies</div>
      <div class="recap-remedies">
        ${remedies.map(rem => `<div class="recap-remedy">${rem}</div>`).join('')}
      </div>

      <div class="rd-section-title">Follow-up reminder</div>
      <div class="rd-followup-row">${followChips}</div>
      <div class="rd-follow-hint">Set a reminder to rebook in 3 days, 1 week, or 1 month.</div>`;

    footer.innerHTML = `
      <div class="rd-actions">
        <button class="rd-shop-btn" onclick="shopThisTopicFromReading('${r.id}')">Shop this topic</button>
        <button class="rd-rebook-btn" onclick="rebook('${r.id}')">Book again</button>
      </div>`;
  }

  /* =========================================================
     S8 — INVITE / JOIN SCREEN render  (Phase 4)
  ========================================================= */
  function renderInviteScreen() {
    const sf = session.file;
    if (!sf) { resetTo(['consultant']); return; }
    const TOPIC_LABELS = { career:'💼 Career', love:'❤️ Love', family:'🏠 Family', health:'🌿 Health', money:'💰 Money', spiritual:'🪷 Spiritual' };
    const el = id => document.getElementById(id);
    if (el('invAstrologer')) el('invAstrologer').textContent = sf.astrologerName;
    if (el('invTopic'))      el('invTopic').textContent = TOPIC_LABELS[sf.topic] || sf.topic || '—';
    if (el('invLink'))       el('invLink').textContent = 'astrolive.app/join/' + sf.id.replace('sf_','SF');
  }

  function setModeTab(target){
    if(target === 'store'){
      goToStoreTab(state.storeTab || 'forYou');
    } else {
      screenStack = ['home'];
      renderScreen();
      const pill = document.getElementById('stickyPill');
      if(pill) pill.style.display = '';
    }
  }

  function onBagClick(){
    if(currentScreen() === 'store') navigateTo('cart');
    else goToStoreTab(state.storeTab || 'forYou');
  }

  function syncForYouIntention(){
    const last = listReadings()[0];
    if(last && last.recap && last.recap.storeIntention) state.selectedIntention = last.recap.storeIntention;
  }

  function goToStoreTab(tab, intention){
    state.storeTab = tab;
    if(intention) state.selectedIntention = intention;
    else if(tab === 'forYou') syncForYouIntention();
    resetTo(['home','store']);
  }

  /* =========================================================
     TOAST
  ========================================================= */
  let toastTimer;
  function showToast(msg){
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  /* =========================================================
     CART LOGIC
  ========================================================= */
  function cartCount(){ return state.cart.reduce((s,i) => s + i.qty, 0); }
  function cartLineTotal(){
    return state.cart.reduce((sum,item) => {
      const p = findProduct(item.id);
      return p ? sum + p.price * item.qty : sum;
    }, 0);
  }
  function cartOldLineTotal(){
    return state.cart.reduce((sum,item) => {
      const p = findProduct(item.id);
      if(!p) return sum;
      return sum + (p.oldPrice || p.price) * item.qty;
    }, 0);
  }

  function updateCartBadge(animate){
    const count = cartCount();
    ['cartBadge','cartBadgePdp','storeCartBadge'].forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      el.textContent = count;
      el.classList.toggle('show', count > 0);
    });
    if(animate){
      const wrap = document.getElementById('cartIconWrap');
      if(wrap){ wrap.classList.remove('pop'); void wrap.offsetWidth; wrap.classList.add('pop'); }
    }
  }

  function addToCart(id, qty){
    qty = qty || 1;
    const existing = state.cart.find(i => i.id === id);
    if(existing) existing.qty += qty;
    else state.cart.push({ id, qty });
    saveCart();
    updateCartBadge(true);
    const p = findProduct(id);
    showToast((p ? p.name : 'Item') + ' added to cart');
    if(currentScreen() === 'cart') renderCart();
  }

  function removeFromCart(id){
    state.cart = state.cart.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function changeQty(id, delta){
    const item = state.cart.find(i => i.id === id);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0){ state.cart = state.cart.filter(i => i.id !== id); }
    saveCart();
    updateCartBadge();
    renderCart();
  }

  /* =========================================================
     HOME — RECOMMENDED FOR YOU
     Returning: last Session File topic. New: saved Kundli hook.
     Prototype is scripted — no real engine.
  ========================================================= */
  function recoConfig(){
    if(state.recoMode === 'new'){
      return {
        why: 'Matched to your Kundli · Capricorn lagna',
        ids: ['ring','rudraksh','pendant']
      };
    }
    return {
      why: 'Because of your Career reading',
      ids: ['rudraksh','yantra','tigereye']
    };
  }

  function setRecoMode(mode){
    state.recoMode = mode;
    renderRecommended();
  }

  function renderRecommended(){
    const row = document.getElementById('recoRow');
    const why = document.getElementById('recoWhy');
    const returningChip = document.getElementById('recoChipReturning');
    const newChip = document.getElementById('recoChipNew');
    if(!row) return;
    const cfg = recoConfig();
    if(why) why.textContent = cfg.why;
    if(returningChip) returningChip.classList.toggle('active', state.recoMode === 'returning');
    if(newChip) newChip.classList.toggle('active', state.recoMode === 'new');
    row.innerHTML = cfg.ids.map(id => {
      const p = findProduct(id);
      if(!p) return '';
      return `
        <div class="reco-card" onclick="openProduct('${p.id}')">
          <div class="reco-img ${p.imgClass}">${productImgTag(p)}</div>
          <div class="reco-info">
            <div class="reco-name">${p.name}</div>
            <div class="reco-price-row">
              <span class="reco-price">${money(p.price)}</span>
              ${p.oldPrice ? `<span class="reco-old-price">${money(p.oldPrice)}</span>` : ''}
            </div>
            <div class="reco-rating">★ ${p.rating}</div>
            <button class="reco-btn" onclick="event.stopPropagation();addToCart('${p.id}',1);">Add</button>
          </div>
        </div>`;
    }).join('');
  }
  renderRecommended();

  /* =========================================================
     STORE
  ========================================================= */
  function renderIntentions(){
    const row = document.getElementById('intentionRow');
    row.innerHTML = INTENTIONS.map(it => `
      <div class="intention-chip ${state.selectedIntention === it.id ? 'active' : ''}" data-intention="${it.id}">
        <div class="emo">${it.emoji}</div>
        <div class="lbl">${it.label}</div>
      </div>
    `).join('');
  }

  function selectIntention(id){
    state.selectedIntention = id;
    renderStore();
    const grid = document.getElementById('storeGrid');
    if(grid) grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function selectStoreTab(tab){
    state.storeTab = tab;
    if(tab === 'forYou') syncForYouIntention();
    renderStore();
  }

  const FOR_YOU_IDS = ['rudraksh','yantra'];

  function getForYouProducts(){
    const matched = PRODUCTS.filter(p => p.intention === state.selectedIntention);
    const featured = matched.filter(p => p.isBestSeller || p.recommendedReason);
    const list = (featured.length ? featured : matched).slice(0, 2);
    if(list.length) return list;
    return FOR_YOU_IDS.map(findProduct).filter(Boolean);
  }

  function getBestSellerProducts(){
    const filtered = PRODUCTS
      .filter(p => p.isBestSeller && p.intention === state.selectedIntention)
      .sort((a,b) => b.rating - a.rating);
    if(filtered.length) return filtered;
    return PRODUCTS.filter(p => p.isBestSeller).sort((a,b) => b.rating - a.rating);
  }

  function getStoreProducts(){
    if(state.storeTab === 'forYou') return getForYouProducts();
    if(state.storeTab === 'bestSellers') return getBestSellerProducts();
    return PRODUCTS.filter(p => p.intention === state.selectedIntention);
  }

  function getStoreTitle(){
    if(state.storeTab === 'forYou') return 'Recommended for You';
    if(state.storeTab === 'bestSellers') return 'Best Sellers';
    const intent = INTENTIONS.find(i => i.id === state.selectedIntention);
    return intent ? intent.label : 'All Products';
  }

  function getStoreSubtitle(){
    const intent = INTENTIONS.find(i => i.id === state.selectedIntention);
    if(state.storeTab === 'forYou') {
      return intent ? `Curated for ${intent.label}` : 'Based on your recent consultation';
    }
    if(state.storeTab === 'bestSellers') {
      return intent ? `Top picks in ${intent.label}` : 'Loved by AstroLive seekers';
    }
    return '';
  }

  function renderServiceCard(){
    return `
      <div class="product-card" onclick="navigateTo('retention')">
        <div class="product-img" style="background:radial-gradient(circle at 50% 40%,#c9a8ff,#6a2fd6);">
          ${FOLLOWUP_SERVICE.emoji}
        </div>
        <div class="product-info">
          <div class="product-name">${FOLLOWUP_SERVICE.name}</div>
          <div class="product-meta">
            <span class="product-price">${money(FOLLOWUP_SERVICE.price)}</span>
          </div>
          <div class="product-rating">★ ${FOLLOWUP_SERVICE.rating} (${FOLLOWUP_SERVICE.reviews})</div>
          <button class="add-cart-btn" onclick="event.stopPropagation();showToast('Consultation request sent to your astrologer');">Book</button>
        </div>
      </div>`;
  }

  function renderProductCard(p){
    return `
      <div class="product-card" onclick="openProduct('${p.id}')">
        <div class="product-img ${p.imgClass}">
          ${productImgTag(p)}
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          ${p.isBestSeller ? `<span class="bestseller-badge">BESTSELLER</span>` : ''}
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-meta">
            <span class="product-price">${money(p.price)}</span>
            ${p.oldPrice ? `<span class="product-old-price">${money(p.oldPrice)}</span>` : ''}
          </div>
          <div class="product-rating">★ ${p.rating} (${p.reviews})</div>
          <button class="add-cart-btn" onclick="event.stopPropagation();addToCart('${p.id}',1);">🛒 Add</button>
        </div>
      </div>`;
  }

  function renderStore(){
    document.querySelectorAll('.store-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === state.storeTab));
    renderIntentions();
    document.getElementById('storeGridTitle').textContent = getStoreTitle();

    const subtitleEl = document.getElementById('storeGridSubtitle');
    const subtitle = getStoreSubtitle();
    subtitleEl.textContent = subtitle;
    subtitleEl.style.display = subtitle ? 'block' : 'none';

    const bannerEl = document.getElementById('intentionBanner');
    const showBanner = state.storeTab === 'categories' || state.storeTab === 'forYou';
    const bannerSrc = showBanner ? BANNER_ASSETS[state.selectedIntention] : null;
    if(bannerSrc){
      bannerEl.src = bannerSrc;
      bannerEl.alt = getStoreTitle() + ' banner';
      bannerEl.style.display = 'block';
    } else {
      bannerEl.style.display = 'none';
    }

    const list = getStoreProducts();
    const grid = document.getElementById('storeGrid');
    let cardsHtml = list.map(renderProductCard).join('');
    if(state.storeTab === 'forYou') cardsHtml += renderServiceCard();
    grid.innerHTML = list.length
      ? cardsHtml
      : `<div class="store-empty">More remedies coming soon for this category. 🙏</div>`;
  }

  document.getElementById('storeTabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.store-tab');
    if(tab) selectStoreTab(tab.dataset.tab);
  });

  document.getElementById('intentionRow').addEventListener('click', (e) => {
    const chip = e.target.closest('.intention-chip');
    if(chip && chip.dataset.intention) selectIntention(chip.dataset.intention);
  });

  /* =========================================================
     PRODUCT DETAIL
  ========================================================= */
  function openProduct(id){
    state.selectedProductId = id;
    navigateTo('product');
  }

  function renderProductDetail(){
    const p = findProduct(state.selectedProductId);
    if(!p) return;

    const pdpImageEl = document.getElementById('pdpImage');
    pdpImageEl.src = productImageSrc(p.id);
    pdpImageEl.alt = p.name;
    const gallery = document.getElementById('pdpGallery');
    gallery.className = 'pdp-gallery ' + p.imgClass;
    const badgeEl = document.getElementById('pdpBadgeLg');
    if(p.badge){ badgeEl.textContent = p.badge; badgeEl.style.display = 'block'; }
    else { badgeEl.style.display = 'none'; }

    document.getElementById('pdpCategory').textContent = p.category;
    document.getElementById('pdpTitle').textContent = p.name;
    document.getElementById('pdpRating').textContent = p.rating;
    document.getElementById('pdpRatingCount').textContent = '(' + p.reviews.toLocaleString('en-IN') + ' reviews)';
    document.getElementById('pdpPrice').textContent = money(p.price);

    const oldPriceEl = document.getElementById('pdpOldPrice');
    const discountEl = document.getElementById('pdpDiscount');
    if(p.oldPrice){
      oldPriceEl.textContent = money(p.oldPrice);
      oldPriceEl.style.display = 'inline';
      const pct = Math.round((1 - p.price / p.oldPrice) * 100);
      discountEl.textContent = pct + '% OFF';
      discountEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
      oldPriceEl.textContent = '';
      discountEl.style.display = 'none';
      discountEl.textContent = '';
    }

    const reasonEl = document.getElementById('pdpReason');
    if(p.recommendedReason){
      document.getElementById('pdpReasonText').textContent = p.recommendedReason;
      reasonEl.style.display = 'flex';
    } else {
      reasonEl.style.display = 'none';
    }

    document.getElementById('pdpHighlights').innerHTML = p.benefits.map(h => `<li>${h}</li>`).join('');
    document.getElementById('pdpOffers').innerHTML = p.offers.map(o => `<div class="pdp-offer"><span class="tag">🏷️</span><span>${o}</span></div>`).join('');
    document.getElementById('pdpDescription').textContent = p.description;

    document.getElementById('pdpReviewNum').textContent = p.rating;
    document.getElementById('pdpReviewCount').textContent = p.reviews.toLocaleString('en-IN') + ' reviews';
    document.getElementById('pdpReviewBars').innerHTML = p.reviewBars
      .map((pct, i) => `<div class="pdp-bar-row"><span>${5 - i}★</span><div class="pdp-bar"><div style="width:${pct}%"></div></div></div>`).join('');

    document.getElementById('pdpDeliveryDate').textContent = formatDate(addDays(new Date(), 3));
    updateCartBadge();
  }

  function checkPincode(){
    const val = (document.getElementById('pdpPincodeInput').value || '').trim();
    if(/^\d{6}$/.test(val)){
      showToast('Delivery available to this pincode');
    } else {
      showToast('Enter a valid 6-digit pincode');
    }
  }

  function addToCartFromPdp(){
    if(state.selectedProductId) addToCart(state.selectedProductId, 1);
  }
  function buyNowFromPdp(){
    if(!state.selectedProductId) return;
    addToCart(state.selectedProductId, 1);
    navigateTo('checkout');
  }

  /* =========================================================
     CART SCREEN
  ========================================================= */
  function renderCart(){
    document.getElementById('cartHeaderTitle').textContent = 'My Cart (' + cartCount() + ')';
    const body = document.getElementById('cartBody');

    if(state.cart.length === 0){
      body.innerHTML = `
        <div class="cart-empty">
          <div class="big">🛒</div>
          <div>Your cart is empty.</div>
          <button class="cta" onclick="goToStoreTab('forYou')">Browse Store</button>
        </div>`;
      return;
    }

    let itemsHtml = state.cart.map(item => {
      const p = findProduct(item.id);
      if(!p) return '';
      return `
        <div class="cart-item">
          <div class="cart-thumb ${p.imgClass}">${productImgTag(p)}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${money(p.price)}</div>
          </div>
          <div class="cart-item-right">
            <button class="cart-remove" onclick="removeFromCart('${p.id}')">✕</button>
            <div class="qty-stepper">
              <button onclick="changeQty('${p.id}',-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button onclick="changeQty('${p.id}',1)">+</button>
            </div>
          </div>
        </div>`;
    }).join('');

    const inCartIds = state.cart.map(i => i.id);
    const recoProducts = PRODUCTS.filter(p => !inCartIds.includes(p.id)).slice(0,2);
    const recoHtml = recoProducts.map(p => `
      <div class="cart-reco-card">
        <div class="cart-reco-img ${p.imgClass}">${productImgTag(p)}</div>
        <div class="cart-reco-name">${p.name}</div>
        <div class="cart-reco-price">${money(p.price)}</div>
        <button class="cart-reco-add" onclick="addToCart('${p.id}',1)">+ Add</button>
      </div>
    `).join('');

    const subtotal = cartLineTotal();
    const oldSubtotal = cartOldLineTotal();
    const discount = Math.max(0, oldSubtotal - subtotal);
    const total = subtotal;

    body.innerHTML = `
      ${itemsHtml}
      ${recoProducts.length ? `
        <div class="section-title" style="font-size:14.5px;margin:18px 0 10px;">You may also like</div>
        <div class="cart-reco-row">${recoHtml}</div>
      ` : ''}
      <div class="cart-summary">
        <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="summary-row"><span>Discount</span><span class="discount">${discount > 0 ? '-' + money(discount) : '₹0'}</span></div>
        <div class="summary-row"><span>Shipping</span><span class="free">FREE</span></div>
        <div class="summary-row total"><span>Total</span><span>${money(total)}</span></div>
        <button class="checkout-btn" onclick="navigateTo('checkout')">Proceed to Checkout</button>
      </div>
    `;
  }

  /* =========================================================
     CHECKOUT
  ========================================================= */
  const PAYMENT_METHODS = [
    { id:'upi', icon:'📱', label:'UPI', sub:'GPay, PhonePe, Paytm & more' },
    { id:'card', icon:'💳', label:'Card', sub:'Visa, Mastercard, RuPay' },
    { id:'netbanking', icon:'🏦', label:'Net Banking', sub:'All major banks' },
    { id:'cod', icon:'💵', label:'Cash on Delivery', sub:'Pay when it arrives' }
  ];

  function renderPaymentOptions(){
    const wrap = document.getElementById('paymentOptions');
    wrap.innerHTML = PAYMENT_METHODS.map(m => `
      <div class="payment-option ${state.selectedPayment === m.id ? 'selected' : ''}" onclick="selectPayment('${m.id}')">
        <div class="radio-dot"></div>
        <div class="payment-icon">${m.icon}</div>
        <div>
          <div class="payment-label">${m.label}</div>
          <div class="payment-sub">${m.sub}</div>
        </div>
      </div>
    `).join('');
  }
  function selectPayment(id){
    state.selectedPayment = id;
    renderPaymentOptions();
  }

  function renderCheckout(){
    const isEmpty = state.cart.length === 0;
    document.getElementById('checkoutEmpty').style.display = isEmpty ? 'block' : 'none';
    document.getElementById('checkoutContent').style.display = isEmpty ? 'none' : 'block';
    if(isEmpty) return;

    renderPaymentOptions();
    const subtotal = cartLineTotal();
    const oldSubtotal = cartOldLineTotal();
    const discount = Math.max(0, oldSubtotal - subtotal);
    const total = subtotal;
    document.getElementById('checkoutSummary').innerHTML = `
      <div class="summary-row"><span>Total Items</span><span>${cartCount()}</span></div>
      <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="summary-row"><span>Discount</span><span class="discount">${discount > 0 ? '-' + money(discount) : '₹0'}</span></div>
      <div class="summary-row"><span>Shipping</span><span class="free">FREE</span></div>
      <div class="summary-row total"><span>Total</span><span>${money(total)}</span></div>
    `;
  }

  function placeOrder(){
    if(state.cart.length === 0){ showToast('Your cart is empty'); return; }
    const orderId = 'ALive' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date();
    const deliveryDate = addDays(orderDate, 3);
    const firstProduct = findProduct(state.cart[0].id);

    state.lastOrder = {
      id: orderId,
      date: orderDate,
      deliveryDate: deliveryDate,
      total: cartLineTotal(),
      items: JSON.parse(JSON.stringify(state.cart)),
      productName: firstProduct ? firstProduct.name : 'your AstroLive product'
    };

    state.cart = [];
    saveCart();
    updateCartBadge();
    resetTo(['home','confirmation']);
  }

  function goToJourneyFromConfirmation(){
    resetTo(['home','journey']);
  }

  /* =========================================================
     CONFIRMATION
  ========================================================= */
  function renderConfirmation(){
    const o = state.lastOrder;
    if(!o) return;
    document.getElementById('confOrderId').textContent = o.id;
    document.getElementById('confOrderDate').textContent = formatDate(o.date, true);
    document.getElementById('confOrderTotal').textContent = money(o.total);
    document.getElementById('confDeliveryDate').textContent = formatDate(o.deliveryDate);
  }

  /* =========================================================
     ASTRO JOURNEY
  ========================================================= */
  function renderJourney(){
    const o = state.lastOrder;
    const productName = o ? o.productName : '5 Mukhi Rudraksh Mala';
    const orderId = o ? o.id : 'ALive482913';
    document.getElementById('journeyProductName').textContent = productName;
    document.getElementById('journeyOrderId').textContent = orderId;
  }

  /* =========================================================
     RETENTION / FOLLOW-UP
  ========================================================= */
  function renderRetention(){
    const o = state.lastOrder;
    document.getElementById('feedbackProductQ').textContent =
      'How is your experience with ' + (o ? o.productName : 'your recent AstroLive purchase') + '?';
    document.querySelectorAll('.feedback-opt').forEach(el => el.classList.toggle('selected', el.dataset.val === state.feedback));
    document.getElementById('feedbackThanks').classList.toggle('show', !!state.feedback);
  }
  function selectFeedback(val){
    state.feedback = val;
    renderRetention();
  }

  /* =========================================================
     SEARCH
  ========================================================= */
  function openSearch(){ navigateTo('search'); }

  function renderSearchResults(query){
    const q = query.trim().toLowerCase();
    const hint = document.getElementById('searchHint');
    const results = document.getElementById('searchResults');

    if(!q){
      hint.style.display = 'block';
      results.innerHTML = '';
      return;
    }
    hint.style.display = 'none';

    const matches = PRODUCTS.filter(p => {
      const intentLabel = (INTENTIONS.find(i => i.id === p.intention) || {}).label || '';
      const haystack = (p.name + ' ' + p.category + ' ' + p.intention + ' ' + intentLabel).toLowerCase();
      return haystack.includes(q);
    });

    results.innerHTML = matches.length
      ? matches.map(p => `
          <div class="search-result-row" onclick="openProduct('${p.id}')">
            <div class="search-thumb ${p.imgClass}">${productImgTag(p)}</div>
            <div>
              <div class="search-result-name">${p.name}</div>
              <div class="search-result-cat">${p.category}</div>
            </div>
            <div class="search-result-price">${money(p.price)}</div>
          </div>
        `).join('')
      : `<div class="store-empty">No products found for "${query}"</div>`;
  }

  /* =========================================================
     DATE HELPERS
  ========================================================= */
  function addDays(date, days){
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  function formatDate(date, withTime){
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let str = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    if(withTime){
      let h = date.getHours(), m = date.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      str += ', ' + h + ':' + String(m).padStart(2,'0') + ' ' + ampm;
    } else {
      str = days[date.getDay()] + ', ' + str;
    }
    return str;
  }

  /* Patch renderScreen to also cover confirmation render (needs order data already set before display) */
  const _origRenderScreen = renderScreen;
  renderScreen = function(){
    _origRenderScreen();
    if(currentScreen() === 'confirmation') renderConfirmation();
  };

  /* =========================================================
     INIT
  ========================================================= */
  updateCartBadge();
  renderScreen();
