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
      initImageSelector();
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
          <img class="lifestyle-bg" alt="" loading="lazy" style="display:none">
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
  console.log("Redirecting to product-page.html?id=", b.id);
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

    // Update images for newly revealed cards
    updateGridImages();

    if (visibleCount >= cards.length && showMoreBtn) {
      showMoreBtn.style.display = "none";
    }
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", showNextBatch);
  }

  // =========================
  // IMAGE TOGGLE STATE
  // =========================
  let currentImageIndex =
    parseInt(localStorage.getItem("gridImageIndex")) || 0;

  function initImageSelector() {
    const imgButtons = document.querySelectorAll(".image-selector .img-btn");

    imgButtons.forEach(btn => {
      btn.classList.toggle(
        "active",
        parseInt(btn.dataset.index) === currentImageIndex
      );

      btn.addEventListener("click", () => {
        imgButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentImageIndex = parseInt(btn.dataset.index);
        localStorage.setItem("gridImageIndex", currentImageIndex);
        updateGridImages();
      });
    });

    updateGridImages();
  }

  // =========================
  // UPDATE IMAGES (artwork / lifestyle + fade-in)
  // =========================
  function updateGridImages() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
      const imgList = JSON.parse(card.dataset.images || "[]");
      if (!imgList.length) return;

      const artworkImg = card.querySelector(".artwork img");
      const lifestyleImg = card.querySelector(".lifestyle-bg");

      const img = imgList[currentImageIndex] || imgList[0];
      const url = img.startsWith("http")
        ? img
        : "https://static.wixstatic.com/media/" + img;

      if (currentImageIndex === 1 && lifestyleImg) {
        lifestyleImg.src = url;
        lifestyleImg.style.display = "block";
        artworkImg.style.display = "none";
        lifestyleImg.classList.remove("loaded");
        lifestyleImg.onload = () => lifestyleImg.classList.add("loaded");
      } else if (artworkImg) {
        artworkImg.src = url;
        artworkImg.style.display = "block";
        lifestyleImg.style.display = "none";
        artworkImg.classList.remove("loaded");
        artworkImg.onload = () => artworkImg.classList.add("loaded");
      }
    });
  }
}


// INIT
document.addEventListener("DOMContentLoaded", initBundlesPage);
