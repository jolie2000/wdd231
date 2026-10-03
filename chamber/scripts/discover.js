import { attractions } from "../data/attractions.mjs";

const menuButton = document.querySelector(".menu-button");
const primaryNavigation = document.querySelector("#primary-navigation");
const attractionGrid = document.querySelector("#attraction-grid");
const visitMessage = document.querySelector("#visit-message");
const detailsDialog = document.querySelector("#attraction-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogAddress = document.querySelector("#dialog-address");
const dialogDescription = document.querySelector("#dialog-description");
const dialogLink = document.querySelector("#dialog-link");

function createAttractionCard(place, index) {
  const card = document.createElement("article");
  card.className = "attraction-card";
  card.dataset.area = `place-${index + 1}`;

  const heading = document.createElement("h2");
  heading.textContent = place.name;

  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = `images/${place.image}`;
  image.alt = place.imageAlt;
  image.width = 300;
  image.height = 200;
  image.loading = "lazy";
  image.decoding = "async";
  const caption = document.createElement("figcaption");
  const credit = document.createElement("a");
  credit.href = place.imageSource;
  credit.target = "_blank";
  credit.rel = "noopener noreferrer";
  credit.textContent = `Photo: ${place.imageCredit}`;
  const license = document.createElement("a");
  license.href = place.imageLicenseUrl;
  license.target = "_blank";
  license.rel = "noopener noreferrer";
  license.textContent = place.imageLicense;
  caption.append(credit, document.createTextNode(" · "), license, document.createTextNode(" · cropped/resized"));
  if (place.imageNote) caption.append(document.createTextNode(` · ${place.imageNote}`));
  figure.append(image, caption);

  const address = document.createElement("address");
  address.textContent = place.address;

  const description = document.createElement("p");
  description.textContent = place.description;

  const button = document.createElement("button");
  button.className = "learn-more-button";
  button.type = "button";
  button.textContent = "Learn More";
  button.addEventListener("click", () => showDetails(place));

  const copy = document.createElement("div");
  copy.className = "attraction-copy";
  copy.append(heading, address, description, button);
  card.append(figure, copy);
  return card;
}

function showDetails(place) {
  dialogTitle.textContent = place.name;
  dialogAddress.textContent = place.address;
  dialogDescription.textContent = place.description;
  dialogLink.href = place.learnMoreUrl;
  detailsDialog.showModal();
}

function renderVisitMessage() {
  const storageKey = "kampala-chamber-discover-last-visit";
  const now = Date.now();

  try {
    const previousVisit = Number(localStorage.getItem(storageKey));
    if (!previousVisit || !Number.isFinite(previousVisit) || previousVisit > now) {
      visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
      const elapsed = now - previousVisit;
      if (elapsed < 24 * 60 * 60 * 1000) {
        visitMessage.textContent = "Back so soon! Awesome!";
      } else {
        const days = Math.floor(elapsed / (24 * 60 * 60 * 1000));
        visitMessage.textContent = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
      }
    }
    localStorage.setItem(storageKey, String(now));
  } catch (error) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  }
}

menuButton.addEventListener("click", () => {
  const isOpen = primaryNavigation.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

document.querySelectorAll(".dialog-close").forEach((button) => {
  button.addEventListener("click", () => detailsDialog.close());
});

detailsDialog.addEventListener("click", (event) => {
  if (event.target === detailsDialog) detailsDialog.close();
});

attractionGrid.replaceChildren(...attractions.map(createAttractionCard));
attractionGrid.setAttribute("aria-busy", "false");
renderVisitMessage();
document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;
