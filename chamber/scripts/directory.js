const directory = document.querySelector("#member-directory");
const memberCount = document.querySelector("#member-count");
const menuButton = document.querySelector(".menu-button");
const primaryNavigation = document.querySelector("#primary-navigation");
const viewButtons = document.querySelectorAll("[data-view]");

const membershipNames = { 1: "Member", 2: "Silver", 3: "Gold" };

function createMemberCard(member) {
  const level = membershipNames[member.membershipLevel] || "Member";
  const levelClass = level.toLowerCase();
  return `<article class="member-card">
    <img class="member-logo" src="images/${member.image}" width="600" height="270" alt="${member.name} logo" loading="lazy">
    <div class="member-content">
      <span class="member-level ${levelClass}">${level} member</span>
      <h3>${member.name}</h3>
      <p class="member-category">${member.category}</p>
      <address>${member.address}</address>
      <a href="tel:${member.phone.replace(/\s/g, "")}">${member.phone}</a>
      <a href="${member.website}" target="_blank" rel="noopener">Visit website<span class="sr-only">: ${member.name}</span></a>
    </div>
  </article>`;
}

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Unable to load member directory.");
    const members = await response.json();
    directory.innerHTML = members.map(createMemberCard).join("");
    memberCount.textContent = `${members.length} local businesses and organizations`;
  } catch (error) {
    console.error(error);
    directory.innerHTML = '<p class="message">We could not load the member directory. Please refresh the page and try again.</p>';
    memberCount.textContent = "Member directory unavailable";
  }
}

menuButton.addEventListener("click", () => {
  const isOpen = primaryNavigation.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isList = button.dataset.view === "list";
    directory.classList.toggle("member-list", isList);
    directory.classList.toggle("member-grid", !isList);
    viewButtons.forEach((viewButton) => {
      const active = viewButton === button;
      viewButton.classList.toggle("is-active", active);
      viewButton.setAttribute("aria-pressed", active);
    });
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;
getMembers();
