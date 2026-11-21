// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Draggable stickers ----------
// Drag with mouse or touch. Positions aren't saved — refresh to reset.
let topZ = 40;
document.querySelectorAll(".sticker").forEach((el) => {
  let startX, startY, baseX = 0, baseY = 0, downX, downY;

  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.classList.add("is-dragging");
    el.style.zIndex = ++topZ;
    startX = e.clientX - baseX;
    startY = e.clientY - baseY;
    downX = e.clientX;
    downY = e.clientY;
  });

  el.addEventListener("pointermove", (e) => {
    if (!el.hasPointerCapture(e.pointerId)) return;
    baseX = e.clientX - startX;
    baseY = e.clientY - startY;
    el.style.translate = `${baseX}px ${baseY}px`;
  });

  el.addEventListener("pointerup", (e) => {
    el.classList.remove("is-dragging");
    // A press that barely moved is a click, not a drag → open the close-up view
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (moved < 6 && el.hasAttribute("data-zoom")) openZoom(el);
  });
  el.addEventListener("pointercancel", () => el.classList.remove("is-dragging"));
});

// ---------- Click-to-zoom close-up ----------
const zoom = document.createElement("div");
zoom.className = "zoom";
zoom.setAttribute("role", "dialog");
zoom.setAttribute("aria-modal", "true");
zoom.innerHTML = '<img alt="" /><button class="zoom__close" aria-label="Close">×</button>';
document.body.appendChild(zoom);
const zoomImg = zoom.querySelector("img");

function openZoom(el) {
  zoomImg.src = el.src;
  zoomImg.alt = el.alt;
  zoom.classList.add("is-open");
  zoom.querySelector(".zoom__close").focus({ preventScroll: true });
}
function closeZoom() { zoom.classList.remove("is-open"); }
zoom.addEventListener("click", closeZoom);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeZoom(); });

// ---------- Reveal-on-scroll ----------
const revealables = document.querySelectorAll(".paper, .stamp, .ticket, .label, .ransom");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-visible");
        io.unobserve(en.target);
      }
    }),
    { threshold: 0.12 }
  );
  revealables.forEach((el) => {
    // Only animate things that start below the fold; anything already visible shows immediately.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal");
    io.observe(el);
  });
}

// ---------- Active nav link ----------
const links = [...document.querySelectorAll(".nav ul a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
const setActive = () => {
  const y = window.scrollY + window.innerHeight * 0.35;
  let current = -1;
  sections.forEach((s, i) => { if (s && s.offsetTop <= y) current = i; });
  links.forEach((a, i) => a.classList.toggle("is-active", i === current));
};
window.addEventListener("scroll", setActive, { passive: true });
setActive();
