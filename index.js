/* ===============================
   RENDER SLIDER PRODUCTS
================================ */
function renderSliderProducts(products, targetId, productIds) {
  const container = document.getElementById(targetId);
  if (!container) return;

  // Clear container first
  container.innerHTML = "";

  productIds.forEach(id => {
    const product = products.find(p => String(p.id) === String(id));

    // Fallback placeholder if product missing
    if (!product) {
      console.warn("⚠️ Product ID not found:", id);
      const placeholder = document.createElement("div");
      placeholder.className = "unique-slider-item placeholder";
      container.appendChild(placeholder);
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

    // Use product-info structure
    card.innerHTML = `
      <img src="${img}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price-wrapper">
          ${product.originalPrice ? `<span class="price-old">$${product.originalPrice.toFixed(2)}</span>` : ""}
          <span class="price-new">$${product.price.toFixed(2)}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  console.log(`🎉 Slider rendered: ${productIds.length} items`);
}
