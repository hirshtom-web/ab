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
      allBundles = res.data.map(b => ({
        id: (b.bundleId || b.BundleId || "").trim(),
        name: (b.name || b.Name || "Unnamed Bundle").trim(),
        price: b.newPrice ? parseFloat(b.newPrice) : 1,
        oldPrice: b.originalPrice ? parseFloat(b.originalPrice) : null,
        lifestyle: (b.lifestyleUrl || b.LifestyleUrl || "").trim(),
      }));

      // Remove bundles that have no lifestyle at all
      allBundles = allBundles.filter(b => b.lifestyle);

      renderAllBundles();
      showNextBatch();
    },
    error: err => console.error("❌ CSV load failed:", err)
  });

  // =========================
  // RENDER BUNDLES
  // =========================
  function renderAllBundles() {
    grid.innerHTML = "";

    allBundles.forEach(b => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.style.display = "none";

      const imgUrl = b.lifestyle.startsWith("http")
        ? b.lifestyle
        : "https://static.wixstatic.com/media/" + b.lifestyle;

      card.innerHTML = `
        <div class="mockup-stage">
          <img class="lifestyle-bg" src="${imgUrl}" alt="${b.name}" loading="lazy">
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
  // SHOW MORE
  // =========================
  function showNextBatch() {
    const cards = document.querySelectorAll(".product-card");
    const nextCount = visibleCount + ITEMS_PER_LOAD;

    for (let i = visibleCount; i < nextCount && i < cards.length; i++) {
      cards[i].style.display = "flex";
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
