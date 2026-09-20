const embedParams = new URLSearchParams(window.location.search);
const isEmbeddedView = embedParams.get("embed") === "1" || embedParams.get("modo") === "sem-menu";

if (isEmbeddedView) {
  document.body.classList.add("embedded-view");
}
document.querySelector(".menu-toggle")?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".side-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("menu-open")) return;
  if (event.target.closest(".sidebar") || event.target.closest(".menu-toggle")) return;
  document.body.classList.remove("menu-open");
  document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
});

document.querySelector('[data-action="top"]')?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector('[data-action="print"]')?.addEventListener("click", () => window.print());

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".side-nav a")];

const setActiveNavLink = () => {
  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 160)
    .at(-1);

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current?.id ?? "inicio"}`);
  });
};

setActiveNavLink();
document.addEventListener("scroll", setActiveNavLink, { passive: true });

