async function init() {
  const grid = document.getElementById("wishlist-grid");
  const emptyState = document.getElementById("empty-state");

  let data;
  try {
    const res = await fetch("wishlist.json", { cache: "no-store" });
    data = await res.json();
  } catch (err) {
    grid.innerHTML = `<p style="font-family:var(--font-mono);color:#e0b0a8;">Couldn't load wishlist.json — check it's valid JSON and sitting next to index.html.</p>`;
    console.error(err);
    return;
  }

  const site = data.site || {};
  const items = Array.isArray(data.items) ? data.items : [];

  document.getElementById("site-title").textContent = site.title || "The Wishlist";
  document.title = site.title || "The Wishlist";
  document.getElementById("site-tagline").textContent = site.tagline || "";
  document.getElementById("coffee-link").href = site.coffeeLink || "#";

  const earliestYear = items.reduce((min, it) => {
    const y = (it.dateAdded || "").slice(0, 4);
    return y && (!min || y < min) ? y : min;
  }, "");
  document.getElementById("year-established").textContent = earliestYear || new Date().getFullYear();

  const fulfilledCount = items.filter(i => i.fulfilled).length;
  document.getElementById("count-line").textContent =
    `${items.length} ${items.length === 1 ? "entry" : "entries"} — ${fulfilledCount} acquired`;

  if (items.length === 0) {
    emptyState.hidden = false;
    return;
  }

  grid.innerHTML = items.map((item, i) => renderCard(item, i)).join("");
}

function renderCard(item, index) {
  const num = String(index + 1).padStart(3, "0");
  const fulfilled = !!item.fulfilled;
  const stampClass = fulfilled ? "acquired" : "wishing";
  const stampLabel = fulfilled ? "Acquired" : "Wishing";
  const dateLine = fulfilled && item.dateFulfilled
    ? `Acquired ${escapeHtml(item.dateFulfilled)}`
    : item.dateAdded
      ? `Added ${escapeHtml(item.dateAdded)}`
      : "";

  return `
    <article class="card">
      <div class="stamp ${stampClass}">${stampLabel}</div>
      <p class="card-number">No. ${num}</p>
      ${item.category ? `<p class="card-category">${escapeHtml(item.category)}</p>` : ""}
      <h2>${escapeHtml(item.name || "Untitled wish")}</h2>
      ${item.note ? `<p class="card-note">${escapeHtml(item.note)}</p>` : ""}
      <div class="card-footer">
        ${item.price ? `<span class="card-price">${escapeHtml(item.price)}</span>` : "<span></span>"}
        ${item.link ? `<a class="card-link" href="${escapeAttr(item.link)}" target="_blank" rel="noopener">view ↗</a>` : ""}
      </div>
      ${dateLine ? `<p class="card-date">${dateLine}</p>` : ""}
    </article>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

init();
