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
        images: (b.mainImageUrl ? b.mainImageUrl.split(";").map(i => i.trim()) : [])
          .filter(Boolean)
      }));

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

      card.innerHTML = `
        <div class="mockup-stage">
          <div class="artwork">
            <img alt="" loading="lazy">
          </div>
        </div>
      `;

      // Navigate to product page on click
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

    updateGridImages();

    if (visibleCount >= cards.length && showMoreBtn) {
      showMoreBtn.style.display = "none";
    }
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", showNextBatch);
  }

  // =========================
  // UPDATE IMAGES
  // =========================
  function updateGridImages() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
      const imgList = JSON.parse(card.dataset.images || "[]");
      if (!imgList.length) return;

      const artworkImg = card.querySelector(".artwork img");
      const img = imgList[0]; // always first image
      const url = img.startsWith("http")
        ? img
        : "https://static.wixstatic.com/media/" + img;

      if (artworkImg) {
        artworkImg.src = url;
        artworkImg.style.display = "block";
        artworkImg.classList.remove("loaded");
        artworkImg.onload = () => artworkImg.classList.add("loaded");
      }
    });
  }
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", initBundlesPage);
