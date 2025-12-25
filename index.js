function renderSliderProducts(products, targetId, productIds) {
  const container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML = "";

  productIds.forEach(id => {
    const product = products.find(p => p.id === id);
    if (!product) return;

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
      <img src="${img}" alt="${product.name}">
      <div class="slider-info">
        <h4>${product.name}</h4>
        <span>$${product.price}</span>
      </div>
    `;

    container.appendChild(card);
  });
}
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

// after allProducts is built
renderSliderProducts(allProducts, "newInSlider", NEW_IN_IDS);
