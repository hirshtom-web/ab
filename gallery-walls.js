function initBundlesPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");

  if (!grid) return console.error("❌ productGrid not found");

  let allBundles = [];
  const ITEMS_PER_LOAD = 36;
  let visibleCount = 0;

  // =========================
  // LOAD CSV
  // =========================
  Papa.parse("https://hirshtom-web.github.io/ab/bundles.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      console.log("✅ CSV loaded, total rows:", res.data.length);

      allBundles = res.data.map(b => ({
        id: (b.bundleId || "").trim(),
        name: (b.name || "Unnamed Bundle").trim(),
        price: b.newPrice ? parseFloat(b.newPrice) : 1,
        oldPrice: b.originalPrice ? parseFloat(b.originalPrice) : null,
        images: [
          ...(b.mainImageUrl ? b.mainImageUrl.split(";").map(i => i.trim()) : []),
          ...(b.lifestyleUrl ? [b.lifestyleUrl.trim()] : [])
        ].filter(Boolean)
      }));

      console.log("🟢 Bundles parsed:", allBundles);

      renderAllBundles();
      showNextBatch(); // show first batch
    },
    error: err => console.error("❌ CSV load failed:", err)
  });

  // =========================
  // RENDER ALL BUNDLES (hidden initially)
  // =========================
  function renderAllBundles() {
    grid.innerHTML = "";

    allBundles.forEach(b => {
      const card = document.createElement("div");
      card.className = "product-card is-product";
      card.style.display = "none"; // hidden initially
      card.dataset.images = JSON.stringify(b.images);

      // Always use lifestyle image (last in array) as initial src
      const lifestyleUrl = b.images.length > 1 ? b.images[b.images.length - 1] : b.images[0];
      const url = lifestyleUrl.startsWith("http")
        ? lifestyleUrl
        : "https://static.wixstatic.com/media/" + lifestyleUrl;

      card.innerHTML = `
        <div class="mockup-stage">
          <img class="lifestyle-bg" src="${url}" alt="" loading="lazy" style="display:block">
          <div class="artwork">
            <img alt="${b.name}" loading="lazy" style="display:none">
          </div>
        </div>

        <div class="product-info">
          <h3>${b.name}</h3>
          <div class="price-wrapper">
            ${b.oldPrice ? `<span class="price-old">$${b.oldPrice.toFixed(2)}</span>` : ""}
            <span class="price-new">$${b.price.toFixed(2)}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        if (!b.id) return console.error("❌ Bundle ID missing!");
        window.location.href = `product-page.html?id=${b.id}`;
      });

      grid.appendChild(card);
    });
  }

  // =========================
  // SHOW MORE ITEMS
  // =========================
  function showNextBatch() {
    const cards = document.querySelectorAll(".product-card");
    const nextCount = visibleCount + ITEMS_PER_LOAD;

    for (let i = visibleCount; i < nextCount && i < cards.length; i++) {
      const card = cards[i];
      card.style.display = "flex"; // reveal the card
    }

    visibleCount = nextCount;

    if (visibleCount >= cards.length && showMoreBtn) {
      showMoreBtn.style.display = "none";
    }
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", showNextBatch);
  }
}

// INIT
document.addEventListener("DOMContentLoaded", initBundlesPage);
