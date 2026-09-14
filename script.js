/* =====================================================
   BINZEER & NIYA MINHA — WEDDING RECEPTION
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- EVENT DATE ----------
     04 July 2027, 4:00 PM (Asia/Kolkata) */
  const EVENT_DATE = new Date('2027-07-04T16:00:00+05:30');

  /* ---------- COVER OPEN ---------- */
  const cover   = document.getElementById('cover');
  const openBtn = document.getElementById('openBtn');
  const main    = document.getElementById('main');
  const music   = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicBtn');

  openBtn.addEventListener('click', () => {
    cover.classList.add('is-open');
    main.classList.add('is-visible');
    document.body.style.overflow = 'auto';

    // try to start the music the moment the user has interacted
    music.volume = 0.5;
    music.play().then(() => {
      musicBtn.classList.add('playing');
    }).catch(() => { /* autoplay blocked, user can tap the music button */ });

    setTimeout(() => cover.style.display = 'none', 1200);
  });

  document.body.style.overflow = 'hidden';

  /* ---------- MUSIC TOGGLE ---------- */
  musicBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play().catch(() => {});
      musicBtn.classList.add('playing');
      musicBtn.textContent = '♪';
    } else {
      music.pause();
      musicBtn.classList.remove('playing');
      musicBtn.textContent = '♫';
    }
  });

  /* ---------- COUNTDOWN ---------- */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCountdown(){
    const diff = EVENT_DATE - new Date();
    if (diff <= 0){
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    daysEl.textContent  = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent  = pad(m);
    secsEl.textContent  = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- CALENDAR LINKS ---------- */
  const googleCal = document.getElementById('googleCalendar');
  const appleCal  = document.getElementById('appleCalendar');

  function toUTCString(date){
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const evtStart = EVENT_DATE;
  const evtEnd   = new Date(EVENT_DATE.getTime() + 3 * 60 * 60 * 1000); // +3 hours

  googleCal.href =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('Binzeer & Niya Minha — Wedding Reception') +
    '&dates=' + toUTCString(evtStart) + '/' + toUTCString(evtEnd) +
    '&details=' + encodeURIComponent('Wedding Reception of Binzeer & Niya Minha') +
    '&location=' + encodeURIComponent('Safa Highlands International Convention Center, Nellikuth, Manjeri, Kerala');

  appleCal.addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:' + toUTCString(evtStart),
      'DTEND:' + toUTCString(evtEnd),
      'SUMMARY:Binzeer & Niya Minha — Wedding Reception',
      'LOCATION:Safa Highlands International Convention Center, Nellikuth, Manjeri, Kerala',
      'DESCRIPTION:Wedding Reception of Binzeer & Niya Minha',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'binzeer-niya-wedding.ics';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  /* ---------- SCROLL REVEAL (single, subtle) ---------- */
  const revealTargets = document.querySelectorAll(
    'h2, .description, .event-card, .family-card, .arabic-quote, .quote-section p, ' +
    '.wish-form, .calendar-buttons, .contact-buttons, .main-names, .arabic-dua'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  /* ---------- WISHES & DUAS ---------- */
  const nameInput = document.getElementById('guestName');
  const msgInput  = document.getElementById('guestMessage');
  const sendBtn   = document.getElementById('sendWish');
  const wishList  = document.getElementById('wishList');

  // Wishes live for this browsing session only. To keep wishes permanently
  // across visits and devices, connect this form to a small backend or a
  // service like Google Sheets / Firebase and post the entries there instead.
  const wishes = [];

  function renderWishes(){
    if (wishes.length === 0){
      wishList.innerHTML = '<p class="wish-empty">Be the first to leave a wish.</p>';
      return;
    }
    wishList.innerHTML = wishes
      .slice()
      .reverse()
      .map(w => `
        <div class="wish-item">
          <strong>${w.name}</strong>
          <p>${w.message}</p>
        </div>
      `).join('');
  }

  function escapeHTML(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  sendBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !message){
      nameInput.style.borderColor = name ? 'rgba(201,161,90,0.35)' : '#d97757';
      msgInput.style.borderColor = message ? 'rgba(201,161,90,0.35)' : '#d97757';
      return;
    }

    wishes.push({ name: escapeHTML(name), message: escapeHTML(message) });
    renderWishes();

    nameInput.value = '';
    msgInput.value = '';
    nameInput.style.borderColor = 'rgba(201,161,90,0.35)';
    msgInput.style.borderColor = 'rgba(201,161,90,0.35)';
  });

  renderWishes();

});
