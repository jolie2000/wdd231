const menuButton = document.querySelector(".menu-button");
const primaryNavigation = document.querySelector("#primary-navigation");
const weatherPanel = document.querySelector("#weather-panel");
const spotlightGrid = document.querySelector("#spotlight-grid");

// Add a personal OpenWeatherMap API key here to enable the live weather panels.
const OPENWEATHER_API_KEY = " ";
const KAMPALA = { latitude: 0.3476, longitude: 32.5825 };
const membershipNames = { 2: "Silver", 3: "Gold" };

menuButton.addEventListener("click", () => {
  const isOpen = primaryNavigation.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createSpotlight(member) {
  const level = membershipNames[member.membershipLevel];
  const phone = member.phone.replace(/[^\d+]/g, "");
  return `<article class="spotlight-card">
    <img class="spotlight-logo" src="images/${encodeURIComponent(member.image)}" width="600" height="270" alt="${escapeHTML(member.name)} logo" loading="lazy">
    <div class="spotlight-content">
      <span class="spotlight-level ${level.toLowerCase()}">${level} member</span>
      <h3>${escapeHTML(member.name)}</h3>
      <address>${escapeHTML(member.address)}</address>
      <a href="tel:${phone}">${escapeHTML(member.phone)}</a>
      <a href="${escapeHTML(member.website)}" target="_blank" rel="noopener noreferrer">Visit website<span class="sr-only">: ${escapeHTML(member.name)}</span></a>
    </div>
  </article>`;
}

async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Member data could not be loaded.");
    const members = await response.json();
    const eligible = members.filter((member) => [2, 3].includes(Number(member.membershipLevel)));
    const selected = shuffle(eligible).slice(0, Math.min(3, eligible.length));
    if (selected.length < 2) throw new Error("Not enough silver or gold members are available.");
    spotlightGrid.innerHTML = selected.map(createSpotlight).join("");
  } catch (error) {
    console.error("Spotlight loading error:", error);
    spotlightGrid.innerHTML = '<p class="spotlight-status">Member spotlights are temporarily unavailable.</p>';
  }
}

function formatDay(timestamp, timezoneOffset) {
  const localDate = new Date((timestamp + timezoneOffset) * 1000);
  return new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(localDate);
}

function weatherIcon(code, description) {
  const iconCode = code.replace("n", "d");
  return `<img class="weather-icon" src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${escapeHTML(description)}" width="100" height="100">`;
}

async function loadWeather() {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    weatherPanel.innerHTML = '<p class="weather-status">Add your OpenWeatherMap API key in <code>scripts/home.js</code> to show current conditions and the three-day forecast.</p>';
    return;
  }

  const params = `lat=${KAMPALA.latitude}&lon=${KAMPALA.longitude}&units=metric&appid=${encodeURIComponent(OPENWEATHER_API_KEY)}`;
  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`)
    ]);
    if (!currentResponse.ok || !forecastResponse.ok) throw new Error("Weather service returned an error.");
    const [current, forecast] = await Promise.all([currentResponse.json(), forecastResponse.json()]);
    const byDay = new Map();
    forecast.list.forEach((reading) => {
      const localDay = new Date((reading.dt + forecast.city.timezone) * 1000).toISOString().slice(0, 10);
      if (!byDay.has(localDay)) byDay.set(localDay, []);
      byDay.get(localDay).push(reading);
    });
    const localToday = new Date((current.dt + current.timezone) * 1000).toISOString().slice(0, 10);
    const days = [...byDay.entries()].filter(([date]) => date > localToday).slice(0, 3);
    const forecastHTML = days.map(([date, readings]) => {
      const temperatures = readings.map((reading) => reading.main.temp);
      const noon = readings.find((reading) => reading.dt_txt.includes("12:00:00")) || readings[Math.floor(readings.length / 2)];
      const dateTimestamp = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000);
      return `<div class="forecast-day"><strong>${formatDay(dateTimestamp, 0)} ${date.slice(5, 10).replace("-", "/")}</strong><span>${Math.round(Math.min(...temperatures))}° / ${Math.round(Math.max(...temperatures))}°C</span><span>${escapeHTML(noon.weather[0].description)}</span></div>`;
    }).join("");

    weatherPanel.innerHTML = `<div class="weather-now">
      ${weatherIcon(current.weather[0].icon, current.weather[0].description)}
      <div><p class="weather-temperature">${Math.round(current.main.temp)}°C</p><p class="weather-description">${escapeHTML(current.weather[0].description)}</p></div>
      <p class="weather-location">Kampala, Uganda</p>
    </div><div class="forecast" aria-label="Three-day temperature forecast">${forecastHTML || '<p>Forecast unavailable.</p>'}</div>`;
  } catch (error) {
    console.error("Weather loading error:", error);
    weatherPanel.innerHTML = '<p class="weather-status">Weather data is temporarily unavailable. Please check your API key and try again.</p>';
  }
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;
loadWeather();
loadSpotlights();
