/* ================================================================
   RISHITA SRIYA — PORTFOLIO JAVASCRIPT
   All interactive features: scroll animations, nav, tabs, video
   ================================================================ */


/* ----------------------------------------------------------------
   1. NAVBAR — Adds a backdrop when scrolled
   ---------------------------------------------------------------- */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run once on load


/* ----------------------------------------------------------------
   2. MOBILE NAV TOGGLE
   ---------------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger to X
  navToggle.classList.toggle('active');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  }
});


/* ----------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS
   Elements with class "reveal" fade+slide in when visible
   ---------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing after reveal (saves performance)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,       // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px', // Slight offset from bottom
  }
);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});


/* ----------------------------------------------------------------
   4. PORTFOLIO CATEGORY TABS
   Click a tab to show the matching project grid
   ---------------------------------------------------------------- */
const tabs       = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');

    const targetId = 'tab-' + tab.dataset.tab;
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');

      // Re-trigger reveal animations for newly shown cards
      targetContent.querySelectorAll('.reveal').forEach((el) => {
        el.classList.remove('visible');
        setTimeout(() => revealObserver.observe(el), 20);
      });
    }
  });
});


/* ----------------------------------------------------------------
   5. VIDEO PLAY/PAUSE ON CLICK
   ---------------------------------------------------------------- */
document.querySelectorAll('.play-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const videoWrap = btn.closest('.video-wrap');
    const video     = videoWrap ? videoWrap.querySelector('.card-video') : null;

    if (!video) return;

    if (video.paused) {
      document.querySelectorAll('.card-video').forEach(v => {
        if (v !== video) {
          v.pause();
          v.closest('.video-wrap')?.querySelector('.play-btn path')
            ?.setAttribute('d', 'M8 5v14l11-7z');
        }
      });

      video.play();
      btn.querySelector('path').setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
    } else {
      video.pause();
      btn.querySelector('path').setAttribute('d', 'M8 5v14l11-7z');
    }
  });
});

document.querySelectorAll('.card-video').forEach((video) => {
  video.addEventListener('ended', () => {
    const btn = video.closest('.video-wrap')?.querySelector('.play-btn path');
    if (btn) btn.setAttribute('d', 'M8 5v14l11-7z');
  });
});


/* ----------------------------------------------------------------
   6. MOTION TYPE FILTER PILLS
   Filters .motion-card elements by data-motion-type attribute
   ---------------------------------------------------------------- */
const motionFilters = document.querySelectorAll('.motion-filter');

motionFilters.forEach((filterBtn) => {
  filterBtn.addEventListener('click', () => {
    // Update active pill
    motionFilters.forEach(f => f.classList.remove('active'));
    filterBtn.classList.add('active');

    const filterType = filterBtn.dataset.filter;
    const motionCards = document.querySelectorAll('.motion-card');

    motionCards.forEach((card) => {
      if (filterType === 'all' || card.dataset.motionType === filterType) {
        card.classList.remove('hidden');
        // Re-animate
        card.classList.remove('visible');
        setTimeout(() => revealObserver.observe(card), 20);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ----------------------------------------------------------------
   7. THUMBNAIL LIGHTBOX
   Click any thumbnail card to view full-size
   ---------------------------------------------------------------- */
function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 9999;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    backdrop-filter: blur(12px);
  `;
  lightbox.innerHTML = `
    <img id="lightbox-img" src="" alt="Full size preview"
      style="max-width:92vw; max-height:92vh; border-radius:12px;
             box-shadow:0 0 100px rgba(0,0,0,0.8); object-fit:contain;" />
  `;
  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

createLightbox();

// Attach click to thumbnail cards in the thumb tab
document.querySelectorAll('#tab-thumb .thumb-card').forEach((card) => {
  card.style.cursor = 'zoom-in';
  card.addEventListener('click', () => {
    const img      = card.querySelector('.card-img');
    const lightbox = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lightbox-img');

    if (img && img.src) {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
});


/* ----------------------------------------------------------------
   8. PAGE LOAD HERO ANIMATION
   Hero elements reveal with a stagger on first load
   ---------------------------------------------------------------- */
window.addEventListener('load', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
});


/* ----------------------------------------------------------------
   HOW TO ADD NEW FEATURES:
   
   - New video card: Copy a .card block in index.html, update src/poster/text
   - New thumbnail: Copy a .card block in #tab-thumb, update img src
   - New service: Copy a .service-card block, update icon/title/text
   - New "why" item: Copy a .why-item block, update emoji/title/text
   
   DEPLOYMENT:
   - GitHub Pages: Push files to repo, enable Pages in Settings
   - Netlify: Drag your project folder to netlify.com/drop
   ---------------------------------------------------------------- */
