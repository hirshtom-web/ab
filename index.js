document.addEventListener("DOMContentLoaded", initPage);

/* ===============================
   CONFIG
================================ */
const CSV_URL = "https://hirshtom-web.github.io/ab/product-catalog.csv";

const NEW_IN_IDS = [
  "8349201",
  "9182888",
  "9182889",
  "9182890",
  "9182891",
  "9182892",
  "9182893",
  "9182894",
  "9182895",
  "9182896"
];

/* ===============================
   INIT
================================ */
function initPage() {
  // show placeholders immediately
  renderSliderPlaceholders("newInSlider", NEW_IN_IDS.length);

  // load products
  loadProducts();
}

/* ===============================
   LOAD CSV
================================ */
function loadProducts() {
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      console.log("✅ CSV loaded:", res.data.length, "rows");

      const allProducts = res.data.map(p => ({
        id: String(p.productId || "").trim(),
        name: (p.name || "Unnamed Product").trim(),
        price: p.newPrice
          ? parseFloat(p.newPrice)
          : p.originalPrice
          ? parseFloat(p.originalPrice)
          : 0,
        originalPrice: p.originalPrice
          ? parseFloat(p.originalPrice)
          : null,
        images: (p.mainImageUrl || "")
          .split(";")
          .map(i => i.trim())
          .filter(Boolean)
      }));

      renderSliderProducts(allProducts, "newInSlider", NEW_IN_IDS);
    },
    error: err => console.error("❌ CSV load failed:", err)
  });
}

/* ===============================
   PLACEHOLDERS
================================ */
function renderSliderPlaceholders(targetId, count) {
  const container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const ph = document.createElement("div");
    ph.className = "unique-slider-item placeholder";
    container.appendChild(ph);
  }
}

/* ===============================
   RENDER SLIDER PRODUCTS
================================ */
function renderSliderProducts(products, targetId, productIds) {
  const container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML = "";

  productIds.forEach(id => {
    const product = products.find(p => p.id === String(id));

    // placeholder if missing
    if (!product) {
      const ph = document.createElement("div");
      ph.className = "slider-item-wrap";
      ph.innerHTML = `<div class="unique-slider-item placeholder"></div>`;
      container.appendChild(ph);
      return;
    }

    const img =
      product.images.length
        ? product.images[0].startsWith("http")
          ? product.images[0]
          : "https://static.wixstatic.com/media/" + product.images[0]
        : "";

    const wrap = document.createElement("div");
    wrap.className = "slider-item-wrap";

    wrap.innerHTML = `
      <a class="unique-slider-item unique-slider-media"
         href="product-page.html?id=${product.id}">
        <img src="${img}" alt="${product.name}" loading="lazy">
      </a>

      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price-wrapper">
          ${product.originalPrice ? `<span class="price-old">$${product.originalPrice.toFixed(2)}</span>` : ""}
          <span class="price-new">$${product.price.toFixed(2)}</span>
        </div>
      </div>
    `;

    container.appendChild(wrap);
  });
}
