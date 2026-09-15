(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     Opening screen: closed invitation -> gold reveal -> curtain
     open into the main site
     ========================================================= */
  var opening = document.getElementById("opening");
  var openingCard = document.getElementById("openingCard");
  var openingBurst = document.getElementById("openingBurst");
  var tapBtn = document.getElementById("tapToOpen");
  var site = document.getElementById("site");
  var music = document.getElementById("bg-music");
  var musicToggle = document.getElementById("musicToggle");
  var hasOpened = false;

  function playMusic() {
    if (!music) return;
    music.volume = 0.11;
    var playPromise = music.play();
    if (playPromise && playPromise.then) {
      playPromise
        .then(function () {
          if (musicToggle) {
            musicToggle.classList.add("is-playing");
            musicToggle.setAttribute("aria-pressed", "true");
            musicToggle.setAttribute("aria-label", "Mute background music");
          }
        })
        .catch(function () {
          // Autoplay blocked or music.mp3 missing — keep UI in "muted" state,
          // the visitor can press the button to try again.
          if (musicToggle) musicToggle.classList.remove("is-playing");
        });
    }
  }

  // small burst of gold dust radiating out from the seal
  function spawnOpeningBurst() {
    if (!openingBurst || reduceMotion) return;
    var count = 16;
    for (var i = 0; i < count; i++) {
      var spark = document.createElement("span");
      spark.className = "opening-spark";
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      var dist = 70 + Math.random() * 60;
      var bx = (Math.cos(angle) * dist).toFixed(1) + "px";
      var by = (Math.sin(angle) * dist).toFixed(1) + "px";
      spark.style.setProperty("--bx", bx);
      spark.style.setProperty("--by", by);
      spark.style.animationDelay = (Math.random() * 0.15).toFixed(2) + "s";
      openingBurst.appendChild(spark);
      window.setTimeout(function (el) {
        return function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        };
      }(spark), 1500);
    }
  }

  function openSite() {
    if (!opening || hasOpened) return;
    hasOpened = true;

    // Stage 1: break the seal, lift the invitation card, and open the envelope flap.
    if (openingCard) openingCard.classList.add("is-open");
    spawnOpeningBurst();
    playMusic();

    var revealHoldMs = reduceMotion ? 0 : 1900;

    // Stage 2: after the envelope opens, the burgundy curtains part and the site appears.
    window.setTimeout(function () {
      opening.classList.add("is-closing");
      if (site) {
        site.hidden = false;
        // allow the browser to paint the unhidden state before animating in
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            site.classList.add("is-visible");
          });
        });
      }
      startParticles();
      initRevealObserver();
      initParallax();

      window.setTimeout(function () {
        if (opening) opening.setAttribute("hidden", "");
      }, reduceMotion ? 0 : 1150);
    }, revealHoldMs);
  }

  if (tapBtn) {
    tapBtn.addEventListener("click", openSite);
  }

  /* =========================================================
     Music mute / unmute (fixed button)
     ========================================================= */
  if (musicToggle && music) {
    musicToggle.addEventListener("click", function () {
      if (music.paused) {
        music.volume = 0.11;
        music
          .play()
          .then(function () {
            musicToggle.classList.add("is-playing");
            musicToggle.setAttribute("aria-pressed", "true");
            musicToggle.setAttribute("aria-label", "Mute background music");
          })
          .catch(function () {
            /* music.mp3 missing or blocked — fail silently, site keeps working */
          });
      } else {
        music.pause();
        musicToggle.classList.remove("is-playing");
        musicToggle.setAttribute("aria-pressed", "false");
        musicToggle.setAttribute("aria-label", "Play background music");
      }
    });

    music.addEventListener("error", function () {
      // Keep the music control visible even if the audio file is missing.
      // The button can be used as soon as music.mp3 is added beside index.html.
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
      musicToggle.setAttribute("aria-label", "Play background music");
    });
  }

  /* =========================================================
     Ambient gold particles
     ========================================================= */
  var particlesLayer = document.getElementById("particles");
  var particlesStarted = false;

  function startParticles() {
    if (particlesStarted || !particlesLayer || reduceMotion) return;
    particlesStarted = true;

    var count = window.innerWidth < 560 ? 10 : 16;
    for (var i = 0; i < count; i++) {
      spawnParticle(true);
    }
  }

  function spawnParticle(initial) {
    if (!particlesLayer) return;
    var p = document.createElement("span");
    p.className = "particle";
    var size = (Math.random() * 3 + 2).toFixed(1) + "px";
    var dur = (Math.random() * 12 + 18).toFixed(1) + "s";
    var delay = initial ? (Math.random() * 14).toFixed(1) + "s" : "0s";
    var drift = (Math.random() * 70 - 35).toFixed(0) + "px";
    p.style.setProperty("--size", size);
    p.style.setProperty("--dur", dur);
    p.style.setProperty("--delay", delay);
    p.style.setProperty("--drift", drift);
    p.style.left = (Math.random() * 100).toFixed(1) + "vw";
    particlesLayer.appendChild(p);

    // recycle: remove after animation so the DOM doesn't grow forever
    var lifetime = (parseFloat(dur) + parseFloat(delay || "0")) * 1000 + 500;
    window.setTimeout(function () {
      if (p.parentNode) p.parentNode.removeChild(p);
      if (particlesStarted) spawnParticle(false);
    }, lifetime);
  }

  /* =========================================================
   Touch / click gold sparkle + falling glitter effect
   ========================================================= */

var sparkleLayer = document.getElementById("sparkleLayer");

function makeSparkle(x, y) {
  if (!sparkleLayer || reduceMotion) return;

  /* Existing sparkle effect */
  var s = document.createElement("span");
  s.className = "sparkle";
  s.style.left = x + "px";
  s.style.top = y + "px";
  sparkleLayer.appendChild(s);

  s.addEventListener("animationend", function () {
    if (s.parentNode) s.parentNode.removeChild(s);
  });

  window.setTimeout(function () {
    if (s.parentNode) s.parentNode.removeChild(s);
  }, 900);


  /* New golden glitter falling downward */

  var glitterCount = 12;

  for (var i = 0; i < glitterCount; i++) {

    var glitter = document.createElement("span");
    glitter.className = "touch-glitter";

    glitter.style.left = x + (Math.random() * 70 - 35) + "px";
    glitter.style.top = y + (Math.random() * 20 - 10) + "px";

    glitter.style.setProperty(
      "--gx",
      (Math.random() * 100 - 50).toFixed(0) + "px"
    );

    glitter.style.setProperty(
      "--gy",
      (45 + Math.random() * 90).toFixed(0) + "px"
    );

    glitter.style.setProperty(
      "--gdelay",
      (Math.random() * 0.18).toFixed(2) + "s"
    );

    glitter.style.setProperty(
      "--gsize",
      (2 + Math.random() * 3).toFixed(1) + "px"
    );

    sparkleLayer.appendChild(glitter);

    window.setTimeout(function (el) {
      return function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      };
    }(glitter), 1300);
  }
}


/* =========================================================
   Premium tiny golden hearts on touch / mouse hold
   ========================================================= */

var heartTimer = null;
var heartActive = false;
var lastTouchX = 0;
var lastTouchY = 0;

function createGoldenHeart(x, y) {
  if (!sparkleLayer || reduceMotion) return;

  var heart = document.createElement("span");
  heart.className = "touch-heart";

  /* Very small random movement */
  var driftX = (Math.random() * 34 - 17).toFixed(0) + "px";
  var driftY = (-18 - Math.random() * 28).toFixed(0) + "px";
  var rotate = (Math.random() * 30 - 15).toFixed(0) + "deg";

  heart.style.left =
    (x + Math.random() * 18 - 9).toFixed(0) + "px";

  heart.style.top =
    (y + Math.random() * 14 - 7).toFixed(0) + "px";

  heart.style.setProperty("--heart-x", driftX);
  heart.style.setProperty("--heart-y", driftY);
  heart.style.setProperty("--heart-rotate", rotate);

  sparkleLayer.appendChild(heart);

  window.setTimeout(function () {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart);
    }
  }, 1100);
}

function startHeartEffect(x, y) {
  if (reduceMotion || heartActive) return;

  heartActive = true;
  lastTouchX = x;
  lastTouchY = y;

  createGoldenHeart(lastTouchX, lastTouchY);

  heartTimer = window.setInterval(function () {
    if (!heartActive) return;

    createGoldenHeart(lastTouchX, lastTouchY);
  }, 90);
}

function updateHeartPosition(x, y) {
  lastTouchX = x;
  lastTouchY = y;
}

function stopHeartEffect() {
  heartActive = false;

  if (heartTimer) {
    window.clearInterval(heartTimer);
    heartTimer = null;
  }
}

document.addEventListener(
  "pointerdown",
  function (e) {
    startHeartEffect(e.clientX, e.clientY);
  },
  { passive: true }
);

document.addEventListener(
  "pointermove",
  function (e) {
    if (heartActive) {
      updateHeartPosition(e.clientX, e.clientY);
    }
  },
  { passive: true }
);

document.addEventListener(
  "pointerup",
  function () {
    stopHeartEffect();
  },
  { passive: true }
);

document.addEventListener(
  "pointercancel",
  function () {
    stopHeartEffect();
  },
  { passive: true }
);

  /* =========================================================
     Scroll reveal animations
     ========================================================= */
  function initRevealObserver() {
    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach(function (t) {
        t.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach(function (t) {
      observer.observe(t);
    });
  }

  /* =========================================================
     Very subtle parallax on the "04" Save the Date numeral
     ========================================================= */
  var saveDateNum = document.getElementById("saveDateNum");
  var parallaxTicking = false;

  function applyParallax() {
    parallaxTicking = false;
    if (!saveDateNum || reduceMotion) return;
    var rect = saveDateNum.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    // progress: -1 (above viewport) .. 0 (centered) .. 1 (below viewport)
    var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
    var offset = Math.max(-1, Math.min(1, progress)) * -14;
    saveDateNum.style.transform = "translateY(" + offset.toFixed(1) + "px)";
  }

  function onScrollParallax() {
    if (parallaxTicking) return;
    parallaxTicking = true;
    window.requestAnimationFrame(applyParallax);
  }

  function initParallax() {
    if (!saveDateNum || reduceMotion) return;
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    applyParallax();
  }

  /* =========================================================
     Countdown to 04 July 2027, 4:00 PM IST
     ========================================================= */
  var WEDDING_DATE_ISO = "2027-07-04T16:00:00+05:30";

  function setCountdownValue(el, value) {
    if (!el) return;
    if (el.textContent !== value) {
      el.textContent = value;
      if (!reduceMotion) {
        el.classList.remove("tick");
        // restart the CSS animation
        void el.offsetWidth;
        el.classList.add("tick");
      }
    }
  }

  function updateCountdown() {
    var target = new Date(WEDDING_DATE_ISO).getTime();
    var now = Date.now();
    var diff = target - now;

    var elDays = document.getElementById("cd-days");
    var elHours = document.getElementById("cd-hours");
    var elMinutes = document.getElementById("cd-minutes");
    var elSeconds = document.getElementById("cd-seconds");
    if (!elDays) return;

    if (diff <= 0) {
      setCountdownValue(elDays, "00");
      setCountdownValue(elHours, "00");
      setCountdownValue(elMinutes, "00");
      setCountdownValue(elSeconds, "00");
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    setCountdownValue(elDays, String(days).padStart(2, "0"));
    setCountdownValue(elHours, String(hours).padStart(2, "0"));
    setCountdownValue(elMinutes, String(minutes).padStart(2, "0"));
    setCountdownValue(elSeconds, String(seconds).padStart(2, "0"));
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  /* =========================================================
     Google Calendar link
     ========================================================= */
  var googleCalBtn = document.getElementById("googleCalBtn");
  if (googleCalBtn) {
    var startUTC = "20270704T103000Z"; // 4:00 PM IST
    var endUTC = "20270704T143000Z"; // 8:00 PM IST
    var details = encodeURIComponent(
      "Please join us as we celebrate the wedding reception of Binzeer & Niya Minha."
    );
    var location = encodeURIComponent(
      "Safa Highlands International Convention Center, Nellikuth, Manjeri, Kerala"
    );
    var text = encodeURIComponent("Binzeer & Niya Minha — Wedding Reception");
    var url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + text +
      "&dates=" + startUTC + "/" + endUTC +
      "&details=" + details +
      "&location=" + location +
      "&sf=true&output=xml";
    googleCalBtn.href = url;
  }

/* =========================================================
   Wishes & Duas — Firebase Firestore
   ========================================================= */

var wishForm = document.getElementById("wishForm");
var wishList = document.getElementById("wishList");

function renderWishes(wishes) {

  if (!wishList) return;

  wishList.innerHTML = "";

  wishes.forEach(function (w) {

    var card = document.createElement("div");
    card.className = "wish-card";

    var name = document.createElement("p");
    name.className = "wish-card__name";
    name.textContent = w.name || "";

    var text = document.createElement("p");
    text.className = "wish-card__text";
    text.textContent = w.text || "";

    card.appendChild(name);
    card.appendChild(text);

    wishList.appendChild(card);

  });
}


/* Load wishes from Firebase */

function loadWishes() {

  if (!wishList) return;

  db.collection("wishes")
    .orderBy("ts", "desc")
    .onSnapshot(
      function (snapshot) {

        var wishes = [];

        snapshot.forEach(function (doc) {
          wishes.push(doc.data());
        });

        renderWishes(wishes);

      },
      function (error) {

        console.error("Error loading wishes:", error);

        wishList.innerHTML =
          '<p class="wishes__error">Unable to load wishes right now.</p>';

      }
    );
}


/* Submit new wish */

if (wishForm) {

  wishForm.addEventListener("submit", function (e) {

    e.preventDefault();

    var nameInput = document.getElementById("wishName");
    var textInput = document.getElementById("wishText");

    var name = (nameInput.value || "").trim();
    var text = (textInput.value || "").trim();

    if (!name || !text) return;


    /* Disable button while sending */

    var submitBtn = wishForm.querySelector("button[type='submit']");

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }


    /* Save to Firebase */

    db.collection("wishes")
      .add({
        name: name,
        text: text,
        ts: Date.now()
      })
      .then(function () {

        wishForm.reset();

      })
      .catch(function (error) {

        console.error("Error saving wish:", error);

        alert("Sorry, your wish could not be sent. Please try again.");

      })
      .finally(function () {

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Wish";
        }

      });

  });

}


/* Start loading wishes */

loadWishes();

  /* =========================================================
     Small phones: if the opening card overflows viewport height,
     allow internal scrolling (handled in CSS via max-height + overflow-y)
     ========================================================= */
})();
