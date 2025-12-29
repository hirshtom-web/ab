// --- NEW IN SLIDER ---
function initNewInSlider() {
  const sliderContainer = document.getElementById("newInSlider");
  if (!sliderContainer) return;

  fetch("https://hirshtom-web.github.io/ab/product-catalog.csv")
    .then(res => res.text())
    .then(csvText => {
      const data = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      }).data;

      // 1️⃣ Take last 10 products (newest first)
      const newProducts = data.slice(-10).reverse();

      newProducts.forEach(p => {
        const mainImages = (p.mainImageUrl || "")
          .split(";")
          .map(i => i.trim())
          .filter(Boolean);

        const imgSrc = mainImages[0]
          ? (mainImages[0].includes("http")
              ? mainImages[0]
              : "https://static.wixstatic.com/media/" + mainImages[0])
          : "";

        // --- Price logic ---
        const newPrice = parseFloat(p.newPrice || 0);
        const oldPrice = parseFloat(p.originalPrice || 0);
        const hasDiscount = oldPrice > newPrice;

        const discountBubble = hasDiscount && p.discount
          ? `<div class="discount-bubble">${p.discount}</div>`
          : "";

        const priceHTML = hasDiscount
          ? `
            <span class="price-new">$${newPrice.toFixed(2)}</span>
            <span class="price-old">$${oldPrice.toFixed(2)}</span>
          `
          : `
            <span class="price-new">$${newPrice.toFixed(2)}</span>
          `;

        const item = document.createElement("div");
        item.className = "new-in-slider-item";

        item.innerHTML = `
          <div class="img-wrapper">
            ${discountBubble}
            <img src="${imgSrc}" alt="${p.name}">
          </div>
          <div class="new-in-slider-info">
            <h3>${p.name}</h3>
            <div class="price-wrapper">
              ${priceHTML}
            </div>
          </div>
        `;

        // Link to product page
        item.addEventListener("click", () => {
          window.location.href = `product-page.html?id=${p.productId}`;
        });

        sliderContainer.appendChild(item);
      });
    })
    .catch(err => console.error("New In slider failed:", err));
}

// Init
initNewInSlider();
