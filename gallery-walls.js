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
        id: (b.bundleId || "").trim(),
        image: (b.mainImageUrl ? b.mainImageUrl.split(";")[0].trim() : "")
      })).filter(b => b.image); // only keep bundles with images

      renderAllBundles();
      showNextBatch();
    },
    error: err => console.error("❌ CSV load failed:", err)
  });

  // =========================
  // RENDER CARDS
  // =========================
  function renderAllBundles() {
    grid.innerHTML = "";

    allBundles.forEach(b => {
      const card = document.createElement("div");
      card.className = "bundle-card";
      card.style.display = "none";

      // make image itself clickable
      const img = document.createElement("img");
      img.src = b.image.startsWith("http") ? b.image : "https://static.wixstatic.com/media/" + b.image;
      img.alt = "";
      img.loading = "lazy";

      img.addEventListener("click", () => {
        if (!b.id) return console.error("❌ Bundle ID missing!");
        window.location.href = `product-page.html?id=${b.id}`;
      });

      card.appendChild(img);
      grid.appendChild(card);
    });
  }

  // =========================
  // SHOW MORE ITEMS
  // =========================
  function showNextBatch() {
    const cards = document.querySelectorAll(".bundle-card");
    const nextCount = visibleCount + ITEMS_PER_LOAD;

    for (let i = visibleCount; i < nextCount && i < cards.length; i++) {
      const card = cards[i];
      card.style.display = "block"; // reveal card
    }

    visibleCount = nextCount;

    if (visibleCount >= cards.length && showMoreBtn) showMoreBtn.style.display = "none";
  }

  if (showMoreBtn) showMoreBtn.addEventListener("click", showNextBatch);
}

// INIT
document.addEventListener("DOMContentLoaded", initBundlesPage);
