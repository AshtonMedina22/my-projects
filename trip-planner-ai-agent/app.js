const tripForm = document.querySelector("#tripForm");
const tripStatus = document.querySelector("#tripStatus");
const itineraryPanel = document.querySelector("#itineraryPanel");
const tracePanel = document.querySelector("#tracePanel");
const mapPanel = document.querySelector("#mapPanel");
const feedbackPanel = document.querySelector("#feedbackPanel");

const state = {
  itinerary: JSON.parse(localStorage.getItem("trip_itinerary") || "null"),
  feedback: JSON.parse(localStorage.getItem("trip_feedback") || "{}"),
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function collectForm() {
  return {
    destination: document.querySelector("#destination").value.trim(),
    days: Number(document.querySelector("#days").value),
    pace: document.querySelector("#pace").value,
    constraints: document.querySelector("#constraints").value.trim(),
    interests: [...document.querySelectorAll('input[name="interests"]:checked')].map((item) => item.value),
  };
}

function allItems(itinerary) {
  const rows = [];
  for (const day of itinerary?.days || []) {
    for (const block of ["morning", "afternoon", "evening"]) {
      for (const item of day[block] || []) {
        rows.push({ ...item, day: day.day, block });
      }
    }
  }
  return rows;
}

function saveItinerary(payload) {
  state.itinerary = payload;
  localStorage.setItem("trip_itinerary", JSON.stringify(payload));
}

function saveFeedback() {
  localStorage.setItem("trip_feedback", JSON.stringify(state.feedback));
}

function renderMap(itinerary) {
  const items = allItems(itinerary);
  if (!items.length) {
    mapPanel.innerHTML = "";
    return;
  }
  const minLat = Math.min(...items.map((item) => item.lat));
  const maxLat = Math.max(...items.map((item) => item.lat));
  const minLon = Math.min(...items.map((item) => item.lon));
  const maxLon = Math.max(...items.map((item) => item.lon));
  const latSpan = Math.max(maxLat - minLat, 0.001);
  const lonSpan = Math.max(maxLon - minLon, 0.001);
  const points = items.map((item, index) => {
    const x = 8 + ((item.lon - minLon) / lonSpan) * 84;
    const y = 88 - ((item.lat - minLat) / latSpan) * 76;
    return `<button class="live-map-pin" style="left:${x}%;top:${y}%;" title="Day ${item.day} ${item.block}: ${escapeHtml(item.name)}">${index + 1}</button>`;
  });
  mapPanel.innerHTML = `
    <div class="live-map-grid">${points.join("")}</div>
    <div class="live-map-caption">${items.length} stops plotted from itinerary coordinates</div>
  `;
}

function vote(poiId, direction) {
  state.feedback[poiId] = (state.feedback[poiId] || 0) + (direction === "up" ? 1 : -1);
  saveFeedback();
  renderFeedback();
}

function renderItinerary(payload) {
  const itinerary = payload?.itinerary;
  if (!itinerary) return;
  tripStatus.innerHTML = `<p><strong>${escapeHtml(itinerary.destination)}</strong> generated in ${escapeHtml(payload.mode)} mode. ${escapeHtml(itinerary.summary)}</p>`;
  itineraryPanel.innerHTML = `
    <div class="trip-download-row">
      <button id="downloadTrip" class="button secondary" type="button">Download JSON</button>
    </div>
    ${(itinerary.days || []).map((day) => `
      <article class="trip-day-card">
        <h2>Day ${escapeHtml(day.day)}: ${escapeHtml(day.theme)}</h2>
        <div class="trip-block-grid">
          ${["morning", "afternoon", "evening"].map((block) => `
            <section>
              <h3>${block[0].toUpperCase()}${block.slice(1)}</h3>
              ${(day[block] || []).map((item) => `
                <div class="poi-card">
                  <strong>${escapeHtml(item.name)}</strong>
                  <span>${escapeHtml(item.category)} | ${escapeHtml(item.poi_id)}</span>
                  <p>${escapeHtml(item.why)}</p>
                  <div class="vote-row">
                    <button type="button" data-vote="up" data-poi="${escapeHtml(item.poi_id)}">Upvote</button>
                    <button type="button" data-vote="down" data-poi="${escapeHtml(item.poi_id)}">Downvote</button>
                  </div>
                </div>
              `).join("")}
            </section>
          `).join("")}
        </div>
      </article>
    `).join("")}
    ${(itinerary.sources || []).length ? `<section class="sources-list"><h2>Sources</h2>${itinerary.sources.map((source) => `<a href="${escapeHtml(source.url)}">${escapeHtml(source.title || source.url)}</a>`).join("")}</section>` : ""}
  `;
  document.querySelectorAll("[data-vote]").forEach((button) => {
    button.addEventListener("click", () => vote(button.dataset.poi, button.dataset.vote));
  });
  document.querySelector("#downloadTrip")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trip-itinerary.json";
    link.click();
    URL.revokeObjectURL(url);
  });
  renderMap(itinerary);
}

function renderTrace(payload) {
  tracePanel.innerHTML = (payload?.trace || []).map((item) => `
    <details class="tool-detail" open>
      <summary>${escapeHtml(item.step)}</summary>
      <pre>${escapeHtml(JSON.stringify(item, null, 2))}</pre>
    </details>
  `).join("") || "<p>No trace yet.</p>";
}

function renderFeedback() {
  const entries = Object.entries(state.feedback);
  feedbackPanel.innerHTML = entries.length
    ? entries.map(([poi, score]) => `<p><strong>${escapeHtml(poi)}</strong>: ${score}</p>`).join("")
    : "<p>No feedback yet. Vote on POIs after generating an itinerary.</p>";
}

tripForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = collectForm();
  tripStatus.innerHTML = "<p>Running live travel agent: geocoding, searching POIs, retrieving guide context, and building itinerary...</p>";
  itineraryPanel.innerHTML = "";
  tracePanel.innerHTML = "";
  try {
    const response = await fetch("/api/trip-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Trip planner failed");
    saveItinerary(data);
    renderItinerary(data);
    renderTrace(data);
    renderFeedback();
  } catch (error) {
    tripStatus.innerHTML = `<p class="error-text">Error: ${escapeHtml(error.message)}</p>`;
  }
});

if (state.itinerary) {
  renderItinerary(state.itinerary);
  renderTrace(state.itinerary);
}
renderFeedback();
