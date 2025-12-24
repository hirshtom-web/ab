function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");

  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  const ITEMS_PER_LOAD = 36;
  let visibleCount = 0;

  // =========================
  // LOAD CSV
  // =========================
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allProducts = res.data.map(p => ({
        id: (p.productId || "").trim(),
        name: (p.name || "Unnamed Product").trim(),
        price: p.price ? parseFloat(p.price) : 1,
        oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
        images: (p.productImageUrl || "")
          .split(";")
          .map(i => i.trim())
          .filter(Boolean)
      }));

      renderAllProducts();
      initImageSelector();
      showNextBatch(); // show first batch
    },
    error: err => console.error("CSV load failed:", err)
  });

  // =========================
  // RENDER ALL PRODUCTS (hidden initially)
  // =========================
  function renderAllProducts() {
    grid.innerHTML = "";

    allProducts.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card is-product";
      card.style.display = "none"; // hidden initially
      card.dataset.images = JSON.stringify(p.images);

      card.innerHTML = `
        <div class="mockup-stage">
          <img class="lifestyle-bg" alt="" loading="lazy">
          <div class="artwork">
            <img alt="${p.name}" loading="lazy">
          </div>
        </div>

        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="price-wrapper">
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ""}
            <span class="price-new">$${p.price}</span>
          </div>
        </div>
      `;

      card.onclick = () => {
        window.location.href = `product-page.html?id=${p.id}`;
      };

      grid.appendChild(card);
    });
  }

  // =========================
  // SHOW MORE ITEMS
  // =========================
  function showNextBatch() {
    const products = document.querySelectorAll(".product-card");
    const nextCount = visibleCount + ITEMS_PER_LOAD;

    for (let i = visibleCount; i < nextCount && i < products.length; i++) {
      const card = products[i];
      card.style.display = "flex"; // reveal the card
    }

    visibleCount = nextCount;

    // Update images for newly revealed products
    updateGridImages();

    if (visibleCount >= products.length && showMoreBtn) {
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

      if (currentImageIndex === 1) {
        // lifestyle mode
        lifestyleImg.src = url;
        lifestyleImg.style.display = "block";
        artworkImg.style.display = "none";
        // fade in
        lifestyleImg.classList.remove("loaded");
        lifestyleImg.onload = () => lifestyleImg.classList.add("loaded");
      } else {
        // artwork mode
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
document.addEventListener("DOMContentLoaded", initProductsPage);
