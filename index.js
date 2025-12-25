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
        images: (p.mainImageUrl || "")
          .split(";")
          .map(i => i.trim())
          .filter(Boolean)
      }));

      console.log("🧩 Products mapped:", allProducts);

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
  if (!container) {
    console.warn("⚠️ Slider container not found:", targetId);
    return;
  }

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

    // fallback placeholder if product missing
    if (!product) {
      console.warn("⚠️ Product ID not found:", id);
      const ph = document.createElement("div");
      ph.className = "unique-slider-item placeholder";
      container.appendChild(ph);
      return;
    }

    const img =
      product.images.length
        ? product.images[0].startsWith("http")
          ? product.images[0]
          : "https://static.wixstatic.com/media/" + product.images[0]
        : "";

    const card = document.createElement("a");
    card.className = "unique-slider-item";
    card.href = `product-page.html?id=${product.id}`;

    card.innerHTML = `
      <img src="${img}" alt="${product.name}" loading="lazy">
      <div class="slider-info">
        <h4>${product.name}</h4>
        <span>$${product.price.toFixed(2)}</span>
      </div>
    `;

    container.appendChild(card);
  });

  console.log("🎉 Slider rendered:", productIds.length, "items");
}
