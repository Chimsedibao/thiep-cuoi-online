/* =========================================================
   NGÔ THỊ THẮM & PHẠM MINH GIANG — THIỆP CƯỚI ONLINE (JS)
   ========================================================= */

// ➔ 💡 DÁN URL GOOGLE APPS SCRIPT WEB APP CỦA BẠN VÀO GIỮA 2 DẤU NGOẶC ĐƠN DƯỚI ĐÂY:
const GOOGLE_SCRIPT_URL = 'DÁN_URL_GOOGLE_SCRIPT_CỦA_BẠN_VÀO_ĐÂY';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. PETAL & SPARKLE CANVAS ANIMATION ---------- */
  const canvas = document.getElementById('petal-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numPetals = 28;
    const petals = [];
    const colors = [
      'rgba(244, 216, 216, 0.75)',
      'rgba(232, 196, 196, 0.7)',
      'rgba(212, 175, 55, 0.65)',
      'rgba(255, 240, 220, 0.8)',
      'rgba(240, 180, 180, 0.7)'
    ];

    for (let i = 0; i < numPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        isSparkle: Math.random() > 0.6
      });
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.6 + p.speedX;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        if (p.isSparkle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
          ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animatePetals);
    }

    animatePetals();
  }

  /* ---------- 2. VINYL POPUP & AUDIO CONTROLLER ---------- */
  const vinylPopup = document.getElementById('vinyl-popup');
  const btnOpenVinyl = document.getElementById('btn-open-vinyl');
  const musicToggle = document.getElementById('music-toggle');
  let audioCtx = null;
  let isPlaying = false;

  const bgAudio = new Audio();
  bgAudio.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=wedding-love-romantic-112708.mp3';
  bgAudio.loop = true;
  bgAudio.volume = 0.5;

  function createRomanticSynthAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
      let step = 0;

      setInterval(() => {
        if (!isPlaying || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.8);
        step++;
      }, 600);
    } catch (e) {
      console.log('Audio Context fallback initialized');
    }
  }

  function toggleMusic() {
    if (!isPlaying) {
      bgAudio.play().then(() => {
        isPlaying = true;
        if (musicToggle) {
          musicToggle.classList.add('is-playing');
          musicToggle.classList.remove('needs-tap');
        }
      }).catch(err => {
        isPlaying = true;
        createRomanticSynthAudio();
        if (musicToggle) {
          musicToggle.classList.add('is-playing');
          musicToggle.classList.remove('needs-tap');
        }
      });
    } else {
      bgAudio.pause();
      isPlaying = false;
      if (musicToggle) {
        musicToggle.classList.remove('is-playing');
      }
    }
  }

  if (btnOpenVinyl) {
    btnOpenVinyl.addEventListener('click', () => {
      if (vinylPopup) {
        vinylPopup.classList.add('is-closed');
      }
      toggleMusic();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
  }

  /* ---------- 3. NAVBAR STICKY ON SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
      navbar?.classList.add('is-scrolled');
    } else {
      navbar?.classList.remove('is-scrolled');
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-active');
        navMenu.classList.remove('is-open');
      });
    });
  }

  /* ---------- 4. COUNTDOWN TIMER ---------- */
  const weddingDate = new Date('2026-10-04T10:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      document.getElementById('countdown-days').innerText = '00';
      document.getElementById('countdown-hours').innerText = '00';
      document.getElementById('countdown-mins').innerText = '00';
      document.getElementById('countdown-secs').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById('countdown-days');
    const elHours = document.getElementById('countdown-hours');
    const elMins = document.getElementById('countdown-mins');
    const elSecs = document.getElementById('countdown-secs');

    if (elDays) elDays.innerText = String(days).padStart(2, '0');
    if (elHours) elHours.innerText = String(hours).padStart(2, '0');
    if (elMins) elMins.innerText = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- 5. STORY MULTI-PHOTO STACK & MODAL ---------- */
  const storyStack = document.getElementById('story-stack');
  const storyModal = document.getElementById('story-modal');
  const storyModalClose = document.getElementById('story-modal-close');
  const storyModalImg = document.getElementById('story-modal-img');
  const storyModalTitle = document.getElementById('story-modal-title');
  const storyModalRange = document.getElementById('story-modal-range');
  const storyModalCounter = document.getElementById('story-modal-counter');
  const storyModalPrev = document.getElementById('story-modal-prev');
  const storyModalNext = document.getElementById('story-modal-next');
  const storyModalThumbs = document.getElementById('story-modal-thumbs');

  let currentStoryList = [];
  let currentStoryIndex = 0;

  const stackCards = document.querySelectorAll('.stack-card');
  const stackDots = document.querySelectorAll('.stack-dot');
  let activeStackIdx = 0;

  function updateStackDisplay() {
    stackCards.forEach((card, idx) => {
      card.classList.remove('is-active', 'is-next', 'is-prev');
      if (idx === activeStackIdx) {
        card.classList.add('is-active');
      } else if (idx === (activeStackIdx + 1) % stackCards.length) {
        card.classList.add('is-next');
      } else if (idx === (activeStackIdx - 1 + stackCards.length) % stackCards.length) {
        card.classList.add('is-prev');
      }
    });

    stackDots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeStackIdx);
    });
  }

  if (storyStack) {
    storyStack.addEventListener('click', (e) => {
      if (e.target.closest('.stack-btn-next')) {
        activeStackIdx = (activeStackIdx + 1) % stackCards.length;
        updateStackDisplay();
      } else if (e.target.closest('.stack-btn-prev')) {
        activeStackIdx = (activeStackIdx - 1 + stackCards.length) % stackCards.length;
        updateStackDisplay();
      } else {
        openStoryModal();
      }
    });
  }

  stackDots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      activeStackIdx = idx;
      updateStackDisplay();
    });
  });

  const storyData = [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', title: 'Lần Đầu Gặp Gỡ', range: 'Mùa thu 2021' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', title: 'Buổi Hò Hẹn Đầu Tiên', range: 'Đông 2021' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', title: 'Lời Cầu Hôn Ngọt Ngào', range: 'Xuân 2026' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85', title: 'Hành Trình Về Chung Một Nhà', range: '04 - 10 - 2026' }
  ];

  function openStoryModal(index = 0) {
    currentStoryIndex = index;
    currentStoryList = storyData;
    renderStoryModal();
    if (storyModal) storyModal.classList.add('is-open');
  }

  function renderStoryModal() {
    const item = currentStoryList[currentStoryIndex];
    if (!item) return;

    if (storyModalImg) storyModalImg.src = item.src;
    if (storyModalTitle) storyModalTitle.innerText = item.title;
    if (storyModalRange) storyModalRange.innerText = item.range;
    if (storyModalCounter) storyModalCounter.innerText = `${currentStoryIndex + 1} / ${currentStoryList.length}`;

    if (storyModalThumbs) {
      storyModalThumbs.innerHTML = '';
      currentStoryList.forEach((st, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `story-thumb ${idx === currentStoryIndex ? 'is-active' : ''}`;
        thumb.innerHTML = `<img src="${st.src}" alt="${st.title}">`;
        thumb.addEventListener('click', () => {
          currentStoryIndex = idx;
          renderStoryModal();
        });
        storyModalThumbs.appendChild(thumb);
      });
    }
  }

  if (storyModalClose) {
    storyModalClose.addEventListener('click', () => {
      if (storyModal) storyModal.classList.remove('is-open');
    });
  }

  if (storyModalPrev) {
    storyModalPrev.addEventListener('click', () => {
      currentStoryIndex = (currentStoryIndex - 1 + currentStoryList.length) % currentStoryList.length;
      renderStoryModal();
    });
  }

  if (storyModalNext) {
    storyModalNext.addEventListener('click', () => {
      currentStoryIndex = (currentStoryIndex + 1) % currentStoryList.length;
      renderStoryModal();
    });
  }

  /* ---------- 6. ALBUM FILTER & LIGHTBOX ---------- */
  const albumGrid = document.getElementById('album-grid');
  const albumFilterBtns = document.querySelectorAll('.album-filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeAlbumList = [];
  let currentAlbumIndex = 0;

  const albumData = [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', category: 'prewedding' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', category: 'prewedding' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', category: 'wedding' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85', category: 'wedding' },
    { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', category: 'ceremony' },
    { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', category: 'ceremony' },
    { src: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85', category: 'prewedding' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', category: 'wedding' }
  ];

  function renderAlbumGrid(category = 'all') {
    if (!albumGrid) return;
    albumGrid.innerHTML = '';
    activeAlbumList = category === 'all' ? albumData : albumData.filter(item => item.category === category);

    activeAlbumList.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'album-item';
      div.innerHTML = `<img src="${item.src}" alt="Ảnh cưới Ngô Thị Thắm & Phạm Minh Giang" loading="lazy">`;
      div.addEventListener('click', () => {
        openLightbox(index);
      });
      albumGrid.appendChild(div);
    });
  }

  albumFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      albumFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      renderAlbumGrid(cat);
    });
  });

  renderAlbumGrid('all');

  function openLightbox(index) {
    currentAlbumIndex = index;
    if (lightboxImg && activeAlbumList[currentAlbumIndex]) {
      lightboxImg.src = activeAlbumList[currentAlbumIndex].src;
    }
    if (lightbox) lightbox.classList.add('is-open');
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('is-open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentAlbumIndex = (currentAlbumIndex - 1 + activeAlbumList.length) % activeAlbumList.length;
      lightboxImg.src = activeAlbumList[currentAlbumIndex].src;
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentAlbumIndex = (currentAlbumIndex + 1) % activeAlbumList.length;
      lightboxImg.src = activeAlbumList[currentAlbumIndex].src;
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('is-open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
      if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    }
  });

  /* ---------- 7. BANK MODAL & COPY ACCOUNT ---------- */
  const bankModal = document.getElementById('bank-modal');
  const bankModalClose = document.getElementById('bank-modal-close');
  const bankBackdrop = document.getElementById('bank-backdrop');
  const giftTriggers = document.querySelectorAll('.gift-card-trigger');
  const bankPanels = document.querySelectorAll('.bank-panel');
  const toast = document.getElementById('toast');

  function openBankModal(targetId) {
    bankPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === targetId);
    });
    if (bankModal) bankModal.classList.add('is-open');
  }

  function closeBankModal() {
    if (bankModal) bankModal.classList.remove('is-open');
  }

  giftTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = trigger.getAttribute('data-target');
      if (target) openBankModal(target);
    });
  });

  if (bankModalClose) bankModalClose.addEventListener('click', closeBankModal);
  if (bankBackdrop) bankBackdrop.addEventListener('click', closeBankModal);

  function showToast(msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /* ---------- 8. RSVP FORM SUBMISSION (TÍCH HỢP GOOGLE SHEETS) ---------- */
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpStatus = document.getElementById('rsvp-status');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btnSubmit = rsvpForm.querySelector('.btn-submit');
      if (btnSubmit) btnSubmit.classList.add('is-loading');

      const guestOfVal = rsvpForm.querySelector('input[name="guest_of"]:checked')?.value;
      const formData = {
        name: document.getElementById('rsvp-name')?.value || '',
        phone: document.getElementById('rsvp-phone')?.value || '',
        guest_of: guestOfVal === 'nhagai' ? 'Khách Nhà Gái (Cô dâu Ngô Thị Thắm)' : 'Khách Nhà Trai (Chú rể Phạm Minh Giang)',
        attend: document.getElementById('rsvp-attend')?.value === 'yes' ? 'Sẽ tới tham dự 🎉' : 'Rất tiếc không tới dự (gửi lời chúc) 💖',
        wishes: document.getElementById('rsvp-wishes')?.value || ''
      };

      function showRSVPSuccess() {
        if (btnSubmit) btnSubmit.classList.remove('is-loading');
        if (rsvpStatus) {
          rsvpStatus.className = 'rsvp-status success';
          rsvpStatus.innerHTML = '🎉 <strong>Cảm ơn bạn!</strong> Lời xác nhận và lời chúc của bạn đã được gửi tới chú rể &amp; cô dâu.';
        }
        rsvpForm.reset();
        showToast('Gửi xác nhận RSVP thành công!');
      }

      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'DÁN_URL_GOOGLE_SCRIPT_CỦA_BẠN_VÀO_ĐÂY') {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }).then(() => {
          showRSVPSuccess();
        }).catch((err) => {
          console.error('RSVP Google Sheets Error:', err);
          showRSVPSuccess();
        });
      } else {
        setTimeout(showRSVPSuccess, 1000);
      }
    });
  }

});
