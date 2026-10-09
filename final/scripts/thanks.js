import "./site.js";
const params = new URLSearchParams(window.location.search);
const fields = [["Name", params.get("name")], ["Email", params.get("email")], ["Instrument", params.get("instrument")], ["Learning goal", params.get("goal")]];
const output = document.querySelector("#submitted-data");
if (fields.some(([, value]) => value)) {
  output.innerHTML = fields.map(([label, value]) => `<dt>${label}</dt><dd>${value ? value.replace(/[<>]/g, "") : "Not provided"}</dd>`).join("");
} else {
  document.querySelector("#submission-message").textContent = "There is no learning goal to display yet. Use the form on the practice page to add one.";
  output.remove();
}
