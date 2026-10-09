import "./site.js";

const minutesInput = document.querySelector("#minutes");
const display = document.querySelector("#timer-display");
const status = document.querySelector("#timer-status");
const startButton = document.querySelector("#timer-start");
let remaining = Number(minutesInput.value) * 60;
let intervalId = null;

function paintTimer() {
  display.textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
}
function stopTimer(message) { window.clearInterval(intervalId); intervalId = null; startButton.textContent = "Start timer"; status.textContent = message; }
minutesInput.addEventListener("change", () => {
  if (intervalId) return;
  const minutes = Math.min(60, Math.max(1, Number(minutesInput.value) || 1));
  minutesInput.value = minutes;
  remaining = minutes * 60;
  paintTimer();
  status.textContent = "Ready when you are.";
});
startButton.addEventListener("click", () => {
  if (intervalId) { stopTimer("Timer paused. Pick up where you left off."); return; }
  startButton.textContent = "Pause timer";
  status.textContent = "Your practice session is underway.";
  intervalId = window.setInterval(() => {
    remaining -= 1;
    paintTimer();
    if (remaining <= 0) stopTimer("Session complete. Nice work showing up to practice!");
  }, 1000);
});
document.querySelector("#timer-reset").addEventListener("click", () => {
  stopTimer("Timer reset. Ready when you are.");
  remaining = Number(minutesInput.value) * 60;
  paintTimer();
});

const goalForm = document.querySelector("#goal-form");
const goalStatus = document.querySelector("#goal-status");
const goalKey = "guitar-piano-practice-goal";
try {
  const savedGoal = JSON.parse(localStorage.getItem(goalKey) ?? "null");
  if (savedGoal) {
    goalForm.elements.instrument.value = savedGoal.instrument;
    goalForm.elements.goal.value = savedGoal.goal;
    goalStatus.textContent = `Saved goal: ${savedGoal.instrument} — ${savedGoal.goal}`;
  }
} catch { goalStatus.textContent = "Your saved goal could not be read on this device."; }
goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const goal = { instrument: goalForm.elements.instrument.value, goal: goalForm.elements.goal.value.trim() };
  localStorage.setItem(goalKey, JSON.stringify(goal));
  goalStatus.textContent = `Saved goal: ${goal.instrument} — ${goal.goal}`;
});

paintTimer();
