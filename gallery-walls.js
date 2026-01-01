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
        id: (b.bundleId || b.BundleId || "").trim(),
        name: (b.name || b.Name || "Unnamed Bundle").trim(),
        price: b.newPrice ? parseFloat(b.newPrice) : 1,
        oldPrice: b.originalPrice ? parseFloat(b.originalPrice) : null,
        // Always prefer lifestyle image
        lifestyle: (b.lifestyleUrl || b.LifestyleUrl || b.lifestyleurl || "").trim(),
      }));

      console.log("🟢 Bundles parsed:", allBundles);

      renderAllBundles();
      showNextBatch(); // show first batch
    },
    error: err => console.error("❌ CSV load failed:", err)
  });

  // =========================
  // RENDER ALL BUNDLES
  // =========================
  function renderAllBundles() {
    grid.innerHTML = "";

    allBundles.forEach(b => {
      const card = document.createElement("div");
      card.className = "product-card is-product";
      card.style.display = "none"; // hidden initially

      card.innerHTML = `
        <div class="mockup-stage">
          <img class="lifestyle-bg" alt="${b.name}" loading="lazy">
        </div>

        <div class="product-info">
          <h3>${b.name}</h3>
          <div class="price-wrapper">
            ${b.oldPrice ? `<span class="price-old">$${b.oldPrice.toFixed(2)}</span>` : ""}
            <span class="price-new">$${b.price.toFixed(2)}</span>
          </div>
        </div>
      `;

      // Click redirects
      card.addEventListener("click", () => {
        if (!b.id) return console.error("❌ Bundle ID missing!");
        window.location.href = `product-page.html?id=${b.id}`;
      });

      // Set lifestyle image
      const img = card.querySelector(".lifestyle-bg");
      if (b.lifestyle) {
        img.src = b.lifestyle.startsWith("http")
          ? b.lifestyle
          : "https://static.wixstatic.com/media/" + b.lifestyle;
      }

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
      cards[i].style.display = "flex"; // reveal the card
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
