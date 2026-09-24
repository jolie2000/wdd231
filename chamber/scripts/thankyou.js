const menuButton = document.querySelector(".menu-button");
const primaryNavigation = document.querySelector("#primary-navigation");
const query = new URLSearchParams(window.location.search);

menuButton.addEventListener("click", () => {
  const isOpen = primaryNavigation.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

for (const field of ["firstName", "lastName", "email", "phone", "organization"]) {
  const output = document.querySelector(`[data-field="${field}"]`);
  output.textContent = query.get(field) || "Not provided";
}

const submittedAt = query.get("timestamp");
const timestampOutput = document.querySelector('[data-field="timestamp"]');
if (submittedAt) {
  const date = new Date(submittedAt);
  timestampOutput.textContent = Number.isNaN(date.getTime()) ? submittedAt : new Intl.DateTimeFormat("en-UG", { dateStyle: "long", timeStyle: "short" }).format(date);
} else {
  timestampOutput.textContent = "Not provided";
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;
