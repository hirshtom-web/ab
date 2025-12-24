function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");

  if (!grid) {
    console.error("❌ productGrid not found");
    return;
  }

  let allProducts = [];
  const ITEMS_PER_LOAD = 36;
  let visibleCount = 0;

  // =========================
  // LOAD CSV (UNCHANGED LOGIC)
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
      showNextBatch();
    },
    error: err => console.error("CSV load failed:", err)
  });

  // =========================
  // RENDER ALL PRODUCTS
  // =========================
  function renderAllProducts() {
    grid.innerHTML = "";

    allProducts.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card is-product";
      card.style.display = "none";
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
  // SHOW MORE
  // =========================
  function showNextBatch() {
    const products = document.querySelectorAll(".product-card");
    const nextCount = visibleCount + ITEMS_PER_LOAD;

    for (let i = visibleCount; i < nextCount && i < products.length; i++) {
      products[i].style.display = "flex";
    }

    visibleCount = nextCount;

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
  // IMAGE UPDATE
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

    const targetImg = currentImageIndex === 1 ? lifestyleImg : artworkImg;

    // hide while loading
    targetImg.classList.remove("loaded");
    targetImg.src = url;

    targetImg.onload = () => targetImg.classList.add("loaded");

    // hide the other image
    const otherImg = currentImageIndex === 1 ? artworkImg : lifestyleImg;
    otherImg.classList.remove("loaded");
    });
  }
} // ✅ THIS WAS MISSING

// INIT
document.addEventListener("DOMContentLoaded", initProductsPage);
