function initBundlesPage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return console.error("❌ productGrid not found");

  const showMoreBtn = document.getElementById("showMoreBtn");
  const ITEMS_PER_LOAD = 36;
  let visibleCount = 0;
  let allBundles = [];

  // Load CSV
  Papa.parse("https://hirshtom-web.github.io/ab/bundles.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
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

      renderBundles();
      showNextBatch();
    },
    error: err => console.error("❌ CSV load failed:", err)
  });

  function renderBundles() {
    grid.innerHTML = ""; // clear
    allBundles.forEach((b, i) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.images = JSON.stringify(b.images);

      card.innerHTML = `
        <div class="img-wrapper">
          <img alt="${b.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3>${b.name}</h3>
          <div class="price-wrapper">
            ${b.oldPrice ? `<span class="price-old">$${b.oldPrice.toFixed(2)}</span>` : ""}
            <span class="price-new">$${b.price.toFixed(2)}</span>
          </div>
        </div>
      `;

      // Click to product page
      card.addEventListener("click", () => {
        if (!b.id) return console.error("❌ Bundle ID missing for", b.name);
        window.location.href = `product-page.html?id=${b.id}`;
      });

      grid.appendChild(card);
    });
  }

  function showNextBatch() {
    const cards = document.querySelectorAll(".product-card");
    const nextCount = visibleCount + ITEMS_PER_LOAD;

    for (let i = visibleCount; i < nextCount && i < cards.length; i++) {
      const card = cards[i];
      card.style.display = "flex";

      // Set first image
      const imgList = JSON.parse(card.dataset.images || "[]");
      if (imgList.length) card.querySelector("img").src = imgList[0].includes("http") ? imgList[0] : 'https://static.wixstatic.com/media/' + imgList[0];
    }

    visibleCount = nextCount;

    if (visibleCount >= cards.length && showMoreBtn) {
      showMoreBtn.style.display = "none";
    }
  }

  if (showMoreBtn) showMoreBtn.addEventListener("click", showNextBatch);
}

document.addEventListener("DOMContentLoaded", initBundlesPage);
