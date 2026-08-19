/* =========================================================
     DATA MODEL
  ========================================================= */
  const PRODUCTS = [
    {
      id:'rudraksh', name:'5 Mukhi Rudraksh Mala', category:'Rudraksh & Mala', intention:'career',
      imgClass:'rudraksh', emoji:'📿', badge:'-25%', price:899, oldPrice:1199, rating:4.8, reviews:234, isBestSeller:true,
      recommendedReason:'Recommended based on your recent consultation for career stability, focus and removing obstacles.',
      benefits:['Enhances concentration &amp; focus','Promotes mental peace','Supports career growth','Adjustable thread, suitable for daily wear'],
      description:'This sacred 5 Mukhi Rudraksh Mala is sourced from the Himalayan region and traditionally worn to support focus, calm and steady career growth. Each bead is checked for authenticity before dispatch.',
      offers:['Bank Offer: 10% off on HDFC Credit Cards, up to ₹150','No cost EMI on orders above ₹999','Buy 2 get a free astro consultation'],
      reviewBars:[70,20,6,2,2]
    },
    {
      id:'yantra', name:'Career Yantra', category:'Yantra', intention:'career',
      imgClass:'yantra', emoji:'🔯', badge:null, price:1199, oldPrice:1649, rating:4.7, reviews:156, isBestSeller:true,
      recommendedReason:'Suggested for seekers focusing on career growth and removing professional obstacles.',
      benefits:['Pure brass, hand-engraved','Energized as per Vedic ritual','Traditionally supports career clarity','Compact size for desk or altar'],
      description:'A traditional brass Career Yantra, energized as per Vedic practice. Placed on your work desk or home temple, it is traditionally used to invite clarity, discipline and forward momentum in your career.',
      offers:['No cost EMI on orders above ₹999','Free puja muhurat consultation with purchase'],
      reviewBars:[85,10,3,1,1]
    },
    {
      id:'tigereye', name:'Tiger Eye Bracelet', category:'Bracelet', intention:'career',
      imgClass:'tigereye', emoji:'📿', badge:null, price:749, oldPrice:899, rating:4.6, reviews:98, isBestSeller:false,
      recommendedReason:null,
      benefits:['Natural tiger eye gemstone beads','Traditionally linked to confidence &amp; willpower','Elastic fit, one size fits most','Comes in a gift pouch'],
      description:'Tiger Eye is traditionally worn for grounding and confidence. This hand-strung bracelet uses natural stones and is finished with a durable elastic cord for everyday wear.',
      offers:['Flat ₹50 off on first order','Free gift wrap included'],
      reviewBars:[60,25,9,4,2]
    },
    {
      id:'ring', name:'Blue Sapphire Ring (Neelam)', category:'Ring', intention:'career',
      imgClass:'ring', emoji:'💍', badge:'-20%', price:1999, oldPrice:2499, rating:4.8, reviews:210, isBestSeller:true,
      recommendedReason:'Popular among seekers exploring remedies for career stability and material progress.',
      benefits:['Natural certified gemstone','Astrologer-recommended setting','Available in adjustable sizes','Lab certificate included'],
      description:'A certified Blue Sapphire (Neelam) set in a silver-tone astrological ring. Neelam is traditionally associated with discipline, ambition and material progress when worn as advised by an astrologer.',
      offers:['Bank Offer: 5% cashback on Astro Wallet','No cost EMI available','Free gemstone energization on request'],
      reviewBars:[80,14,4,1,1]
    },
    {
      id:'amethyst', name:'Amethyst Bracelet', category:'Bracelet', intention:'peace',
      imgClass:'amethyst', emoji:'📿', badge:'New', price:649, oldPrice:null, rating:4.5, reviews:120, isBestSeller:false,
      recommendedReason:null,
      benefits:['Natural amethyst crystal beads','Traditionally associated with calm &amp; clarity','Elastic fit, one size fits most','Comes in a gift pouch'],
      description:'A calming amethyst crystal bracelet, traditionally associated with clarity and inner peace. Lightweight and comfortable for daily wear or meditation.',
      offers:['Flat ₹50 off on first order','Free gift wrap included'],
      reviewBars:[60,25,9,4,2]
    },
    {
      id:'citrine', name:'Citrine Bracelet', category:'Bracelet', intention:'wealth',
      imgClass:'citrine', emoji:'📿', badge:null, price:399, oldPrice:null, rating:4.4, reviews:80, isBestSeller:false,
      recommendedReason:null,
      benefits:['Natural citrine gemstone chips','Traditionally associated with abundance','Elastic fit, one size fits most','Lightweight, everyday wear'],
      description:"Citrine is traditionally referred to as the merchant's stone, associated with abundance and positivity. A light, everyday bracelet crafted from natural citrine chips.",
      offers:['Bank Offer: 5% cashback on Astro Wallet'],
      reviewBars:[55,28,10,4,3]
    },
    {
      id:'mala', name:'Rose Quartz Mala', category:'Rudraksh & Mala', intention:'love',
      imgClass:'mala', emoji:'📿', badge:'-15%', price:749, oldPrice:899, rating:4.4, reviews:140, isBestSeller:false,
      recommendedReason:null,
      benefits:['Natural rose quartz beads, 108+1 count','Traditionally associated with love &amp; harmony','Hand-knotted, durable thread','Suitable for japa meditation'],
      description:'A hand-knotted 108 bead mala made from natural rose quartz, traditionally known as the stone of love and harmony. Ideal for meditation, japa practice or as a delicate everyday accessory.',
      offers:['Bank Offer: 5% cashback on Astro Wallet','Buy 2 get free astro consultation'],
      reviewBars:[68,21,7,2,2]
    },
    {
      id:'pendant', name:'Evil Eye Pendant', category:'Pendant', intention:'protection',
      imgClass:'pendant', emoji:'🔱', badge:null, price:399, oldPrice:549, rating:4.5, reviews:874, isBestSeller:false,
      recommendedReason:null,
      benefits:['Handmade protection pendant','Comes with adjustable chain','Traditionally wards off negative energy','Lightweight, everyday wear'],
      description:'A handmade Evil Eye pendant, traditionally worn for protection from negative energy. Comes with an adjustable chain, suitable for everyday wear.',
      offers:['Bank Offer: 10% off on HDFC Credit Cards, up to ₹150','Buy 1 Get 1 on select pendants'],
      reviewBars:[65,22,8,3,2]
    }
  ];

  const FOLLOWUP_SERVICE = {
    id:'followup-consult', name:'Follow-up Consultation', emoji:'🔮', price:299, rating:4.8, reviews:410
  };

  /* Intention banners — For You + Categories (not Best Sellers).
     Same centralized-mapping pattern as PRODUCT_ASSETS. */
  const BANNER_ASSETS = {
    career: 'asset/banners/career-success-banner.png',
    love: 'asset/banners/love-relationships-banner.png',
    wealth: 'asset/banners/wealth-prosperity-banner.png',
    peace: 'asset/banners/peace-wellness-banner.png'
  };

  const INTENTIONS = [
    {id:'love', label:'Love & Relationships', emoji:'❤️'},
    {id:'career', label:'Career & Success', emoji:'💼'},
    {id:'wealth', label:'Wealth & Prosperity', emoji:'💰'},
    {id:'peace', label:'Peace & Wellness', emoji:'🪷'}
  ];

  /* =========================================================
     ASTROLOGERS  (seed data — Phase 2)
     channel: 'chat' | 'call' | 'both'
  ========================================================= */
  const ASTROLOGERS = [
    { id:'neelam',   name:'Neelam',   skills:['Vedic','Tarot'],          rateChat:15, rateCall:20, exp:11, online:true,  channel:'both', avatarClass:'ap2' },
    { id:'chavvi',   name:'Chavvi',   skills:['Numerology','KP System'], rateChat:0,  rateCall:0,  exp:4,  online:true,  channel:'chat', avatarClass:'ap1' },
    { id:'kamakshi', name:'Kamakshi', skills:['Vedic','Palmistry'],      rateChat:0,  rateCall:18, exp:7,  online:true,  channel:'both', avatarClass:'ap2' },
    { id:'urva',     name:'Urva',     skills:['Tarot','Angel Cards'],    rateChat:12, rateCall:0,  exp:5,  online:false, channel:'chat', avatarClass:'ap3' },
    { id:'kalpana',  name:'Kalpana',  skills:['Vedic','Nadi'],           rateChat:20, rateCall:25, exp:13, online:true,  channel:'both', avatarClass:'ap4' },
    { id:'raha',     name:'Raha',     skills:['KP System','Prashna'],    rateChat:10, rateCall:15, exp:6,  online:true,  channel:'both', avatarClass:'ap5' },
    { id:'misha',    name:'Misha',    skills:['Vedic','Vastu'],          rateChat:18, rateCall:22, exp:9,  online:false, channel:'call', avatarClass:'ap6' }
  ];

  function findAstrologer(id){ return ASTROLOGERS.find(a => a.id === id); }

  function astrologerRateLabel(a, channel){
    const rate = channel === 'chat' ? a.rateChat : a.rateCall;
    return rate === 0 ? 'Free' : '₹' + rate + '/min';
  }

  /* =========================================================
     RECAP SEEDS  (Phase 5) — scripted bullets per topic
     Map topic → { bullets[], remedies[], chatBubbles[] }
  ========================================================= */
  const RECAP_SEEDS = {
    career: {
      chatBubbles: [
        { from:'astrologer', text:'I can see Saturn is transiting your 10th house right now — this is significant for career.' },
        { from:'user',       text:'Yes, I\'ve been feeling stuck at work for a while now.' },
        { from:'astrologer', text:'Jupiter aspects your natal Moon in March, which opens a window for a job change or promotion. Don\'t initiate — let the opportunity come to you.' },
        { from:'user',       text:'Should I apply for that new role I saw?' },
        { from:'astrologer', text:'Wait until after the 15th. Before that, wear your Tiger Eye bracelet on the right wrist — it strengthens willpower during Saturn transits.' },
      ],
      bullets: [
        'Saturn transiting 10th house is creating temporary friction — this lifts after March.',
        'Jupiter aspect on natal Moon (March window) is your best moment to accept, not initiate, a change.',
        'Current planetary period favours steady effort over bold moves — avoid job hops before July.',
        'Rahu in the 6th house suggests a hidden competitor at work; stay transparent with your manager.',
        'Career peak period begins mid-year — document your wins now to negotiate from strength.',
      ],
      remedies: ['Wear Tiger Eye on right wrist on Sundays', 'Chant Shani mantra 108 times on Saturdays', 'Donate black sesame seeds on Saturdays'],
      storeIntention: 'career'
    },
    love: {
      chatBubbles: [
        { from:'astrologer', text:'Venus is debilitated in your chart right now — this is why relationships feel effortful.' },
        { from:'user',       text:'We\'ve been arguing a lot lately, both of us.' },
        { from:'astrologer', text:'For Diya, the Moon in Scorpio creates emotional intensity. She needs reassurance, not solutions.' },
        { from:'user',       text:'That makes a lot of sense actually.' },
        { from:'astrologer', text:'February 14 to March 3 is an excellent window for a fresh start. Rose quartz near your bed space helps soften Venus energy for both of you.' },
      ],
      bullets: [
        'Venus debilitation in Aarav\'s chart creates emotional distance — this lifts after February.',
        'Diya\'s Moon in Scorpio needs emotional validation; avoid logical responses during conflicts.',
        'Combined chart shows strong long-term compatibility (7th house alignment) — current friction is transient.',
        'Feb 14–Mar 3 is an auspicious window for any important relationship decision or commitment.',
        'Communication planet Mercury goes direct on Jan 18 — have the important conversation after that date.',
      ],
      remedies: ['Keep Rose Quartz near your shared space', 'Recite Shukra mantra on Fridays', 'Offer white flowers to Venus on Fridays'],
      storeIntention: 'love'
    },
    family: {
      chatBubbles: [
        { from:'astrologer', text:'The 4th house in your chart shows some ancestral tension that carries into family dynamics.' },
        { from:'user',       text:'My parents and I have been at odds since last year.' },
        { from:'astrologer', text:'Ketu in the 4th is separating you from roots — this is temporary and actually spiritual in nature.' },
        { from:'user',       text:'How long will this last?' },
        { from:'astrologer', text:'About 6 more months. An amethyst placed in the home\'s east corner helps Ketu energy settle.' },
      ],
      bullets: [
        'Ketu in 4th house creates emotional distance from family — a spiritual phase, not a permanent rift.',
        'Saturn aspects the 4th lord — a parent figure may be going through their own period of stress.',
        'Resolution window opens in 6–8 months when Ketu moves out of the 4th house.',
        'Avoid major financial decisions involving family property until after June.',
        'A shared ritual or prayer with family (even brief) will strengthen the 4th house bond.',
      ],
      remedies: ['Place Amethyst in east corner of home', 'Light a diya at home entrance every evening', 'Recite Ganesh mantra before family conversations'],
      storeIntention: 'peace'
    },
    health: {
      chatBubbles: [
        { from:'astrologer', text:'Mars rules your 6th house of health — and it\'s conjunct Rahu right now, which spikes stress.' },
        { from:'user',       text:'I\'ve been having trouble sleeping and feel anxious.' },
        { from:'astrologer', text:'This is a classic Rahu-Mars pattern. It affects the nervous system first. Grounding practices help enormously.' },
        { from:'user',       text:'Any specific remedies?' },
        { from:'astrologer', text:'Amethyst on the left wrist, and a 10-minute barefoot walk on grass every morning. Simple, but effective for this transit.' },
      ],
      bullets: [
        'Mars-Rahu conjunction in your chart is the root cause of current sleep and anxiety issues.',
        'The 6th house activation peaks in February — manage energy expenditure carefully this month.',
        'Avoid stimulants (caffeine, screens after 9pm) during this transit period for better results.',
        'Venus rules your digestive system — add cooling foods and cut spicy/fried intake.',
        'Health stabilises significantly from April onward as Mars separates from Rahu.',
      ],
      remedies: ['Wear Amethyst on left wrist', 'Barefoot walk on grass 10 min daily', 'Donate red lentils on Tuesdays'],
      storeIntention: 'peace'
    },
    money: {
      chatBubbles: [
        { from:'astrologer', text:'Jupiter rules your 2nd house of wealth and it\'s retrograde — savings feel stalled, right?' },
        { from:'user',       text:'Yes, despite earning decently I never seem to accumulate.' },
        { from:'astrologer', text:'Jupiter retrograde in the natal 2nd creates a pattern of earning and spending equally. It corrects when Jupiter goes direct in May.' },
        { from:'user',       text:'What can I do until then?' },
        { from:'astrologer', text:'Citrine bracelet on the right wrist attracts Lakshmi energy. More practically — start a SIP on a Thursday, Jupiter\'s day.' },
      ],
      bullets: [
        'Jupiter retrograde in 2nd house is blocking wealth accumulation — this corrects from May onward.',
        'Rahu in the 11th house inflates income desires; focus on consistent saving over windfalls.',
        'Avoid new debt or large financial commitments until Jupiter goes direct in May.',
        'Property or gold investment after June 2025 is strongly favoured by your chart.',
        'Starting a disciplined savings habit (SIP, fixed deposit) on a Thursday activates Jupiter positively.',
      ],
      remedies: ['Wear Citrine bracelet on right wrist', 'Start savings/SIP on a Thursday', 'Keep a copper coin in your wallet'],
      storeIntention: 'wealth'
    },
    spiritual: {
      chatBubbles: [
        { from:'astrologer', text:'Ketu in your 12th house is a powerful placement for spiritual seeking — you may feel "called" lately.' },
        { from:'user',       text:'Yes, I\'ve felt drawn to meditation and have been questioning a lot.' },
        { from:'astrologer', text:'This is authentic. Ketu here dissolves ego boundaries. The questioning is the path, not a problem.' },
        { from:'user',       text:'Is there a practice you\'d suggest?' },
        { from:'astrologer', text:'A 108-bead mala practice at dawn aligns beautifully with your 12th house Ketu. Rose quartz also helps anchor the higher heart during this period.' },
      ],
      bullets: [
        'Ketu in 12th house is a rare and powerful placement for spiritual growth — honour the calling.',
        'Neptune aspects your Moon, heightening intuition and dream activity — keep a dream journal.',
        'This is a period for inner work, not outer achievement — reduce distractions, not ambitions.',
        'Meditation, chanting or pranayama practices started now will have lasting impact on your chart.',
        'A pilgrimage or spiritual retreat between March and May is strongly supported by your transits.',
      ],
      remedies: ['108-bead mala practice at dawn', 'Rose Quartz near your meditation space', 'Light incense and offer water to the rising sun daily'],
      storeIntention: 'peace'
    },
    unsure: {
      chatBubbles: [
        { from:'astrologer', text:'That is completely fine — many seekers come in without a single question. I will read what the chart is highlighting first.' },
        { from:'user',       text:'I just wanted someone to look at the overall picture.' },
        { from:'astrologer', text:'Saturn is asking for patience in work, Venus is asking for softer conversations at home. We can start with whichever feels louder to you.' },
        { from:'user',       text:'The home part actually resonates more right now.' },
        { from:'astrologer', text:'Then we stay there. Keep rose quartz near your bed space this month, and we can go deeper on career next time if you want.' },
      ],
      bullets: [
        'You did not need a topic to start — the chart already shows two loud themes: work pressure and home conversations.',
        'Saturn transits favour steady effort over big leaps until mid-year; do not force a career move this month.',
        'Venus energy is asking for reassurance at home — small check-ins matter more than big talks right now.',
        'This is a good window to name one priority after the session rather than solving everything at once.',
        'A follow-up in 1–2 weeks can go deep on whichever theme felt strongest today.',
      ],
      remedies: ['Keep Rose Quartz near your bed space', 'Light a diya at home entrance every evening', 'Wear Tiger Eye on the right wrist on Sundays'],
      storeIntention: 'peace'
    }
  };

  function getRecapSeed(topic){ return RECAP_SEEDS[topic] || RECAP_SEEDS.career; }

  /* Demo readings — pre-loaded when My Readings is empty (hackathon shelf) */
  const READING_SEEDS = [
    {
      id: 'sf_seed_love_both',
      astrologerId: 'neelam',
      astrologerName: 'Neelam',
      channel: 'chat',
      topic: 'love',
      question: 'We have been arguing a lot lately — will things improve?',
      whoFor: 'both',
      selfName: 'Aarav Sharma',
      selfSnapshot: { name: 'Aarav Sharma', dob: '15 Mar 1992', tob: '06:30 AM', pob: 'Jaipur, Rajasthan' },
      partnerName: 'Diya Sharma',
      partnerSnapshot: { name: 'Diya Sharma', dob: '22 Jun 1994', tob: '10:15 AM', pob: 'Mumbai, Maharashtra' },
      recap: {
        topic: 'love',
        question: 'We have been arguing a lot lately — will things improve?',
        whoFor: 'both',
        bullets: RECAP_SEEDS.love.bullets,
        remedies: RECAP_SEEDS.love.remedies,
        storeIntention: 'love',
        paid: true,
        createdAt: '2026-08-17T14:30:00.000Z'
      },
      followUp: null,
      createdAt: '2026-08-17T14:00:00.000Z',
      endedAt: '2026-08-17T14:30:00.000Z'
    },
    {
      id: 'sf_seed_career_me',
      astrologerId: 'chavvi',
      astrologerName: 'Chavvi',
      channel: 'chat',
      topic: 'career',
      question: 'Should I wait for the promotion or look for a new role?',
      whoFor: 'me',
      selfName: 'Aarav Sharma',
      selfSnapshot: { name: 'Aarav Sharma', dob: '15 Mar 1992', tob: '06:30 AM', pob: 'Jaipur, Rajasthan' },
      partnerName: null,
      partnerSnapshot: null,
      recap: {
        topic: 'career',
        question: 'Should I wait for the promotion or look for a new role?',
        whoFor: 'me',
        bullets: RECAP_SEEDS.career.bullets,
        remedies: RECAP_SEEDS.career.remedies,
        storeIntention: 'career',
        paid: true,
        createdAt: '2026-08-10T11:00:00.000Z'
      },
      followUp: { window: '1w', followUpAt: '2026-08-17T11:00:00.000Z', label: '1 week' },
      createdAt: '2026-08-10T10:30:00.000Z',
      endedAt: '2026-08-10T11:00:00.000Z'
    },
    {
      id: 'sf_seed_family_partner',
      astrologerId: 'kamakshi',
      astrologerName: 'Kamakshi',
      channel: 'call',
      topic: 'family',
      question: 'Tension with parents since last year — how long will this last?',
      whoFor: 'partner',
      selfName: 'Aarav Sharma',
      selfSnapshot: { name: 'Aarav Sharma', dob: '15 Mar 1992', tob: '06:30 AM', pob: 'Jaipur, Rajasthan' },
      partnerName: 'Diya Sharma',
      partnerSnapshot: { name: 'Diya Sharma', dob: '22 Jun 1994', tob: '10:15 AM', pob: 'Mumbai, Maharashtra' },
      recap: {
        topic: 'family',
        question: 'Tension with parents since last year — how long will this last?',
        whoFor: 'partner',
        bullets: RECAP_SEEDS.family.bullets,
        remedies: RECAP_SEEDS.family.remedies,
        storeIntention: 'peace',
        paid: false,
        createdAt: '2026-08-03T09:15:00.000Z'
      },
      followUp: null,
      createdAt: '2026-08-03T08:45:00.000Z',
      endedAt: '2026-08-03T09:15:00.000Z'
    }
  ];

  function findProduct(id){ return PRODUCTS.find(p => p.id === id); }
  function money(n){ return '₹' + n.toLocaleString('en-IN'); }

  /* =========================================================
     PRODUCT IMAGE ASSETS
     Centralized path mapping — every card/detail/cart/search
     view below resolves through productImageSrc()/productImgTag()
     so a future asset swap only needs to change this block.
  ========================================================= */
  const PRODUCT_ASSETS = {
    rudraksh: 'asset/product/rudraksh-mala.png',
    yantra: 'asset/product/career-yantra.png',
    tigereye: 'asset/product/tiger-eye-bracelet.png',
    ring: 'asset/product/blue-sapphire-ring.png',
    amethyst: 'asset/product/amethyst-bracelet.png',
    citrine: 'asset/product/citrine-bracelet.png',
    mala: 'asset/product/rose-quartz-mala.png',
    pendant: 'asset/product/evil-eye-pendant.png'
  };
  const PRODUCT_IMAGE_FALLBACK = 'asset/product/placeholder-fallback.svg';

  function productImageSrc(id){ return PRODUCT_ASSETS[id] || PRODUCT_IMAGE_FALLBACK; }

  function productImgTag(product, extraClass){
    const cls = 'product-thumb-img' + (extraClass ? ' ' + extraClass : '');
    return `<img class="${cls}" src="${productImageSrc(product.id)}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='${PRODUCT_IMAGE_FALLBACK}';">`;
  }
