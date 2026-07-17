
let is24 = false;

const tzName = document.getElementById("timezone");
const time = document.getElementById("time");
const date = document.getElementById("date");

function update() {
    const now = new Date();

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
    tzName.textContent = zone;

    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    let suffix = "";

    if (!is24) {
        suffix = h >= 12 ? " pm" : " am";
        h = h % 12 || 12;
    }

    const hh = String(h).padStart(2, "0");
    time.textContent = `${hh}:${m}:${s}${suffix}`;

    date.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

time.addEventListener("click", () => {
    is24 = !is24;
    update();
});

update();
setInterval(update, 1000);

const favicon = document.getElementById("favicon");

function updateFavicon() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const radius = 30;

  // Black gradient background
  const gradient = ctx.createRadialGradient(
    center, center, 5,
    center, center, radius
  );

  gradient.addColorStop(0, "#444");
  gradient.addColorStop(0.5, "#111");
  gradient.addColorStop(1, "#000");

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Clock border
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Time
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Draw hands function
  function hand(angle, length, width, color) {
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(
      center + Math.cos(angle) * length,
      center + Math.sin(angle) * length
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // Convert clock values to radians
  const hourAngle =
    ((hours + minutes / 60) * 30 - 90) * Math.PI / 180;

  const minuteAngle =
    ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;

  const secondAngle =
    (seconds * 6 - 90) * Math.PI / 180;

  // Hands
  hand(hourAngle, 14, 4, "#fff");
  hand(minuteAngle, 21, 3, "#ccc");
  hand(secondAngle, 24, 1, "#888");

  // Center dot
  ctx.beginPath();
  ctx.arc(center, center, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Update favicon
  favicon.href = canvas.toDataURL("image/png");
}

updateFavicon();
setInterval(updateFavicon, 1000);

// Screen Wake API
let wakeLock = null;

async function keepScreenAwake() {
    if (!("wakeLock" in navigator)) return;

    try {
        wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
        console.log(err);
    }
}

document.addEventListener("click", keepScreenAwake, { once: true });

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        keepScreenAwake();
    }
});
