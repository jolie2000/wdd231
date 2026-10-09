const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.querySelector(".visually-hidden").textContent = expanded ? "Open menu" : "Close menu";
    siteNav.classList.toggle("open", !expanded);
  });
}
document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });
