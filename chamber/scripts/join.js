const menuButton = document.querySelector(".menu-button");
const primaryNavigation = document.querySelector("#primary-navigation");
const timestampField = document.querySelector("#timestamp");

menuButton.addEventListener("click", () => {
  const isOpen = primaryNavigation.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

timestampField.value = new Date().toISOString();

document.querySelectorAll("[data-dialog]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const dialog = document.getElementById(link.dataset.dialog);
    if (!dialog || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    dialog.showModal();
  });
});

document.querySelectorAll(".benefit-dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;
