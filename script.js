/* =====================================================
    MUSIC & COVER INTERACTION
===================================================== */

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const openBtn = document.getElementById("openBtn");

if (music) music.volume = 0.12;

let musicPlaying = false;


/* =====================================================
    OPEN INVITATION
===================================================== */

if (openBtn) {
    openBtn.addEventListener("click", async () => {
        const cover = document.getElementById("cover");
        const main = document.getElementById("main");

        if (cover) cover.classList.add("hide");
        if (main) main.classList.add("active");
        if (musicBtn) musicBtn.classList.add("show");

        if (music) {
            try {
                await music.play();
                musicPlaying = true;
                if (musicBtn) musicBtn.innerHTML = "♫";
            } catch (error) {
                musicPlaying = false;
                if (musicBtn) musicBtn.innerHTML = "🔇";
            }
        }

        if (cover) {
            setTimeout(() => {
                cover.style.display = "none";
            }, 1200);
        }
    });
}


/* =====================================================
    MUSIC MUTE / UNMUTE
===================================================== */

if (musicBtn && music) {
    musicBtn.addEventListener("click", () => {
        if (musicPlaying) {
            music.pause();
            musicPlaying = false;
            musicBtn.innerHTML = "🔇";
        } else {
            music.play();
            musicPlaying = true;
            musicBtn.innerHTML = "♫";
        }
    });
}


/* =====================================================
    COUNTDOWN
===================================================== */

const weddingDate = new Date("2027-07-04T16:00:00+05:30").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =====================================================
    GOOGLE CALENDAR
===================================================== */

const googleCalendar = document.getElementById("googleCalendar");
if (googleCalendar) {
    const eventTitle = "Binzeer & Niya Minha - Wedding Reception";
    const googleStart = "20270704T103000Z";
    const googleEnd = "20270704T143000Z";
    const eventLocation = "Safa Highlands International Convention Center, Nellikuth, Manjeri, Kerala";
    const eventDescription = "Wedding Reception of Binzeer & Niya Minha.";

    googleCalendar.href =
        "https://calendar.google.com/calendar/render" +
        "?action=TEMPLATE" +
        "&text=" + encodeURIComponent(eventTitle) +
        "&dates=" + googleStart + "/" + googleEnd +
        "&details=" + encodeURIComponent(eventDescription) +
        "&location=" + encodeURIComponent(eventLocation);
}


/* =====================================================
    APPLE CALENDAR / ICS
===================================================== */

const appleCalendarBtn = document.getElementById("appleCalendar");
if (appleCalendarBtn) {
    appleCalendarBtn.addEventListener("click", () => {
        const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BinzeerAndNiyaMinha//Wedding//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:binzeer-niya-minha-wedding-2027
DTSTAMP:20260914T000000Z
DTSTART:20270704T103000Z
DTEND:20270704T143000Z
SUMMARY:Binzeer & Niya Minha - Wedding Reception
DESCRIPTION:Wedding Reception of Binzeer & Niya Minha.
LOCATION:Safa Highlands International Convention Center, Nellikuth, Manjeri, Kerala
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "Binzeer-NiyaMinha-Wedding.ics";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}


/* =====================================================
    LOCAL WISHES DEMO
===================================================== */

const nameInput = document.getElementById("guestName");
const messageInput = document.getElementById("guestMessage");
const sendWish = document.getElementById("sendWish");
const wishList = document.getElementById("wishList");

function addWish(name, message) {
    if (!wishList) return;
    const card = document.createElement("div");
    card.className = "wish-card";

    const guest = document.createElement("strong");
    guest.textContent = name;

    const wish = document.createElement("p");
    wish.textContent = message;

    card.appendChild(guest);
    card.appendChild(wish);
    wishList.prepend(card);
}

function loadWishes() {
    const saved = JSON.parse(localStorage.getItem("binzeerNiyaWishes") || "[]");
    saved.forEach(wish => {
        addWish(wish.name, wish.message);
    });
}

if (sendWish && nameInput && messageInput) {
    sendWish.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            alert("Please enter your name and your wish.");
            return;
        }

        const saved = JSON.parse(localStorage.getItem("binzeerNiyaWishes") || "[]");
        saved.push({ name: name, message: message });
        localStorage.setItem("binzeerNiyaWishes", JSON.stringify(saved));

        addWish(name, message);
        nameInput.value = "";
        messageInput.value = "";
    });
}

loadWishes();


/* =====================================================
    SCROLL REVEAL
===================================================== */

const sections = document.querySelectorAll(
    ".section, .countdown-section, .calendar-section, .quote-section, .wishes-section"
);

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    { threshold: 0.12 }
);

sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(35px)";
    section.style.transition = "opacity 1s ease, transform 1s ease";
    observer.observe(section);
});

const revealStyle = document.createElement("style");
revealStyle.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyle);
