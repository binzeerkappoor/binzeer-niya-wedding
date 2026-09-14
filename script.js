/* =====================================================
   MUSIC
===================================================== */

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const openBtn = document.getElementById("openBtn");

music.volume = 0.12;

let musicPlaying = false;


/* =====================================================
   OPEN INVITATION
===================================================== */

openBtn.addEventListener("click", async () => {

    const cover = document.getElementById("cover");
    const main = document.getElementById("main");

    cover.classList.add("hide");

    main.classList.add("active");

    musicBtn.classList.add("show");


    try {

        await music.play();

        musicPlaying = true;

        musicBtn.innerHTML = "♫";

    } catch (error) {

        musicPlaying = false;

        musicBtn.innerHTML = "🔇";

    }


    setTimeout(() => {

        cover.style.display = "none";

    }, 1200);

});


/* =====================================================
   MUSIC MUTE / UNMUTE
===================================================== */

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


/* =====================================================
   COUNTDOWN
===================================================== */

/*
    04 July 2027
    4:00 PM
    India Standard Time
*/

const weddingDate =
    new Date("2027-07-04T16:00:00+05:30").getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const distance = weddingDate - now;


    if (distance <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }


    const days =
        Math.floor(
            distance / (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (distance %
                (1000 * 60 * 60 * 24))
            /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (distance %
                (1000 * 60 * 60))
            /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (distance %
                (1000 * 60))
            /
            1000
        );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =====================================================
   GOOGLE CALENDAR
===================================================== */

const googleCalendar =
    document.getElementById("googleCalendar");


const eventTitle =
    "Binzeer & Niya Minha - Wedding Reception";


/*
   04 July 2027
   4:00 PM IST = 10:30 UTC
*/

const googleStart =
    "20270704T103000Z";


const googleEnd =
    "20270704T143000Z";


const eventLocation =
    "Safa Highlands International Convention Center, Nellikuth, Manjeri, Kerala";


const eventDescription =
    "Wedding Reception of Binzeer & Niya Minha.";


googleCalendar.href =
    "https://calendar.google.com/calendar/render" +
    "?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent(eventTitle) +
    "&dates=" +
    googleStart +
    "/" +
    googleEnd +
    "&details=" +
    encodeURIComponent(eventDescription) +
    "&location=" +
    encodeURIComponent(eventLocation);


/* =====================================================
   APPLE CALENDAR / ICS
===================================================== */

document
    .getElementById("appleCalendar")
    .addEventListener("click", () => {


        const ics =
`BEGIN:VCALENDAR
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


        const blob =
            new Blob(
                [ics],
                {
                    type: "text/calendar;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "Binzeer-NiyaMinha-Wedding.ics";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        URL.revokeObjectURL(url);

    });


/* =====================================================
   LOCAL WISHES DEMO
===================================================== */

const nameInput =
    document.getElementById("guestName");


const messageInput =
    document.getElementById("guestMessage");


const sendWish =
    document.getElementById("sendWish");


const wishList =
    document.getElementById("wishList");


function addWish(name, message) {

    const card =
        document.createElement("div");

    card.className =
        "wish-card";


    const guest =
        document.createElement("strong");

    guest.textContent =
        name;


    const wish =
        document.createElement("p");

    wish.textContent =
        message;


    card.appendChild(guest);

    card.appendChild(wish);

    wishList.prepend(card);

}


function loadWishes() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "binzeerNiyaWishes"
            ) || "[]"
        );


    saved.forEach(wish => {

        addWish(
            wish.name,
            wish.message
        );

    });

}


sendWish.addEventListener("click", () => {

    const name =
        nameInput.value.trim();


    const message =
        messageInput.value.trim();


    if (!name || !message) {

        alert(
            "Please enter your name and your wish."
        );

        return;
    }


    const saved =
        JSON.parse(
            localStorage.getItem(
                "binzeerNiyaWishes"
            ) || "[]"
        );


    saved.push({

        name: name,

        message: message

    });


    localStorage.setItem(
        "binzeerNiyaWishes",
        JSON.stringify(saved)
    );


    addWish(
        name,
        message
    );


    nameInput.value = "";

    messageInput.value = "";

});


loadWishes();


/* =====================================================
   SCROLL REVEAL
===================================================== */

const sections =
    document.querySelectorAll(
        ".section, .countdown-section, .calendar-section, .quote-section, .wishes-section"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


sections.forEach(section => {

    section.style.opacity = "0";

    section.style.transform =
        "translateY(35px)";

    section.style.transition =
        "opacity 1s ease, transform 1s ease";

    observer.observe(section);

});


const revealStyle =
document.createElement("style");


revealStyle.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;


document.head.appendChild(revealStyle);
