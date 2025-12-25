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
  renderSliderPlaceholders("newInSlider", NEW_IN_IDS.length);
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
      console.log("✅ CSV loaded:", res.data.length);

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
          .filter(Boolean),
        lifestyleUrl: (p.lifestyleUrl || "").trim()
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
    const wrap = document.createElement("div");
    wrap.className = "slider-item-wrap";
    wrap.innerHTML = `<div class="unique-slider-item placeholder"></div>`;
    container.appendChild(wrap);
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

    // fallback placeholder
    if (!product) {
      const wrap = document.createElement("div");
      wrap.className = "slider-item-wrap";
      wrap.innerHTML = `<div class="unique-slider-item placeholder"></div>`;
      container.appendChild(wrap);
      return;
    }

    /* ===============================
       IMAGE PICK LOGIC
    ================================ */
    let img = "";

    if (product.lifestyleUrl) {
      img = product.lifestyleUrl;
    } else if (product.images[1]) {
      img = product.images[1];
    } else if (product.images[0]) {
      img = product.images[0];
    }

    if (img && !img.startsWith("http")) {
      img = "https://static.wixstatic.com/media/" + img;
    }

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
          ${
            product.originalPrice
              ? `<span class="price-old">$${product.originalPrice.toFixed(2)}</span>`
              : ""
          }
          <span class="price-new">$${product.price.toFixed(2)}</span>
        </div>
      </div>
    `;

    container.appendChild(wrap);
  });

  console.log("🎉 Slider rendered:", productIds.length, "items");
}
