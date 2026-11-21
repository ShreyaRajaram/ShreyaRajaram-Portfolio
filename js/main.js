// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Draggable stickers ----------
// Drag with mouse or touch. Positions aren't saved — refresh to reset.
let topZ = 40;
document.querySelectorAll(".sticker").forEach((el) => {
  let startX, startY, baseX = 0, baseY = 0;

  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.classList.add("is-dragging");
    el.style.zIndex = ++topZ;
    startX = e.clientX - baseX;
    startY = e.clientY - baseY;
  });

  el.addEventListener("pointermove", (e) => {
    if (!el.hasPointerCapture(e.pointerId)) return;
    baseX = e.clientX - startX;
    baseY = e.clientY - startY;
    el.style.translate = `${baseX}px ${baseY}px`;
  });

  const drop = () => el.classList.remove("is-dragging");
  el.addEventListener("pointerup", drop);
  el.addEventListener("pointercancel", drop);
});

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
