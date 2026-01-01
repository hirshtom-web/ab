function initBundlesPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");
  if (!grid) return console.error("❌ productGrid not found");

  let allBundles = [];
  let visibleCount = 0;
  const ITEMS_PER_LOAD = 36;
  let currentImageIndex = parseInt(localStorage.getItem("gridImageIndex")) || 0;

  // =========================
  // LOAD CSV
  // =========================
  Papa.parse("https://hirshtom-web.github.io/ab/bundles.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      if (!res.data || !res.data.length) return console.error("❌ CSV empty or failed");

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

      // ✅ create cards
      allBundles.forEach(b => {
        const card = document.createElement("div");
        card.className = "product-card is-product";
        card.style.display = "none"; // initially hidden
        card.dataset.images = JSON.stringify(b.images);

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

        // click to product page
        card.addEventListener("click", () => {
          if (!b.id) return console.error("❌ Bundle ID missing", b.name);
          window.location.href = `product-page.html?id=${b.id}`;
        });

        grid.appendChild(card);
      });

      showNextBatch();
    },
    error: err => console.error("❌ CSV load failed:", err)
  });

  // =========================
  // SHOW MORE BUNDLES
  // =========================
  function showNextBatch() {
    const cards = document.querySelectorAll(".product-card");
    const nextCount = visibleCount + ITEMS_PER_LOAD;

    for (let i = visibleCount; i < nextCount && i < cards.length; i++) {
      cards[i].style.display = "flex";
    }

    visibleCount = nextCount;
    updateGridImages();

    if (visibleCount >= cards.length && showMoreBtn) showMoreBtn.style.display = "none";
  }

  if (showMoreBtn) showMoreBtn.addEventListener("click", showNextBatch);

  // =========================
  // UPDATE GRID IMAGES
  // =========================
  function updateGridImages() {
    document.querySelectorAll(".product-card").forEach(card => {
      const imgList = JSON.parse(card.dataset.images || "[]");
      if (!imgList.length) return;
      const lifestyleImg = card.querySelector(".lifestyle-bg");
      const img = imgList[currentImageIndex] || imgList[0];
      lifestyleImg.src = img.startsWith("http") ? img : 'https://static.wixstatic.com/media/' + img;
    });
  }
}

document.addEventListener("DOMContentLoaded", initBundlesPage);
