// ===============================
//   PRODUCTS DATA
// ===============================
const allProducts = [
  {id: "8349201", name: "Product 1", price: 39.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182888", name: "Product 2", price: 29.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182889", name: "Product 3", price: 19.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182890", name: "Product 4", price: 49.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182891", name: "Product 5", price: 24.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182892", name: "Product 6", price: 34.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182893", name: "Product 7", price: 44.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182894", name: "Product 8", price: 59.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182895", name: "Product 9", price: 22.99, images: ["https://via.placeholder.com/400"]},
  {id: "9182896", name: "Product 10", price: 27.99, images: ["https://via.placeholder.com/400"]}
];

const NEW_IN_IDS = [
  "8349201","9182888","9182889","9182890","9182891",
  "9182892","9182893","9182894","9182895","9182896"
];

// ===============================
//   RENDER SLIDER PRODUCTS
// ===============================
function renderSliderProducts(products, targetId, productIds) {
  const container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML = ""; // clear placeholder cards

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
      product.images && product.images.length
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

// wait until DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  renderSliderProducts(allProducts, "newInSlider", NEW_IN_IDS);
});
