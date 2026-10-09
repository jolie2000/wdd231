import "./site.js";

const grid = document.querySelector("#lesson-layout");
const search = document.querySelector("#lesson-search");
const instrument = document.querySelector("#instrument-filter");
const results = document.querySelector("#results-count");
const savedButton = document.querySelector("#saved-toggle");
const savedCount = document.querySelector("#saved-count");
const dialog = document.querySelector("#lesson-dialog");
const dialogContent = document.querySelector("#dialog-content");
const storageKey = "guitar-piano-saved-lessons";
let lessons = [];
let savedOnly = false;
let saved = [];
try { const value = JSON.parse(localStorage.getItem(storageKey) ?? "[]"); saved = Array.isArray(value) ? value : []; } catch { saved = []; }

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = lessons.filter((lesson) => `${lesson.instrument} ${lesson.type} ${lesson.title} ${lesson.notes} ${lesson.shape}`.toLowerCase().includes(query)
    && (instrument.value === "all" || lesson.instrument === instrument.value)
    && (!savedOnly || saved.includes(lesson.id)));
  results.textContent = `${visible.length} ${visible.length === 1 ? "reference" : "references"}${savedOnly ? " saved" : ""}`;
  grid.innerHTML = visible.length ? visible.map((lesson) => `
    <article class="lesson-card">
      <div class="lesson-card-top"><span class="instrument-tag">${lesson.instrument}</span><button class="save-button" data-save="${lesson.id}" type="button" aria-label="${saved.includes(lesson.id) ? "Unsave" : "Save"} ${lesson.title}" aria-pressed="${saved.includes(lesson.id)}">${saved.includes(lesson.id) ? "★" : "☆"}</button></div>
      <p class="lesson-type">${lesson.type}</p><h3>${lesson.title}</h3><div class="shape-display">${lesson.shape}</div><p class="lesson-notes"><strong>Notes:</strong> ${lesson.notes}</p><button class="details-button" data-details="${lesson.id}" type="button">See playing tip <span aria-hidden="true">→</span></button>
    </article>`).join("") : '<p class="empty-state">No references match. Try another instrument or search term.</p>';
  savedCount.textContent = saved.length;
}

search.addEventListener("input", render);
instrument.addEventListener("change", render);
savedButton.addEventListener("click", () => { savedOnly = !savedOnly; savedButton.setAttribute("aria-pressed", String(savedOnly)); render(); });
grid.addEventListener("click", (event) => {
  const saveControl = event.target.closest("[data-save]");
  const detailControl = event.target.closest("[data-details]");
  if (saveControl) {
    const id = saveControl.dataset.save;
    saved = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    localStorage.setItem(storageKey, JSON.stringify(saved));
    render();
  }
  if (detailControl) {
    const lesson = lessons.find((item) => item.id === detailControl.dataset.details);
    if (!lesson) return;
    dialogContent.innerHTML = `<h2 id="dialog-title">${lesson.title} · ${lesson.instrument}</h2><p>${lesson.tip}</p><dl class="dialog-meta"><div><dt>Type</dt><dd>${lesson.type}</dd></div><div><dt>Notes</dt><dd>${lesson.notes}</dd></div><div><dt>Shape</dt><dd>${lesson.shape}</dd></div><div><dt>Level</dt><dd>${lesson.level}</dd></div></dl>`;
    dialog.showModal();
  }
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

try {
  const response = await fetch("data/lessons.json");
  if (!response.ok) throw new Error(`Lesson data request failed: ${response.status}`);
  lessons = await response.json();
  if (!Array.isArray(lessons)) throw new Error("Lesson data is not a list.");
  render();
} catch (error) {
  console.error(error);
  results.textContent = "The chord library could not load.";
  grid.innerHTML = '<p class="empty-state">Open this project through a web server to load the lesson library.</p>';
}
