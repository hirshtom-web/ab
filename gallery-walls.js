function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");
  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  let currentIndex = 0;
  const productsPerBatch = 12;

  // banners etc...
  const banners = [ /* ... your banners ... */ ];

  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allProducts = res.data.map(p => {
        const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
        let lifestyle = (p.lifestyleUrl || "").trim();
        if (!lifestyle && mainImages.length > 1) lifestyle = mainImages[1];
        const images = [mainImages[0] || "", lifestyle].concat(mainImages.slice(2)).filter(Boolean);

        return {
          type: (p.type || "").toLowerCase() === "single" ? "artwork" : "lifestyle",
          id: (p.productId || "").trim(),
          name: (p.name || "Unnamed Product").trim(),
          images: images,
          video: (p["video/s"] || "").trim(),
          oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
          discount: p.discount ? p.discount.trim() : null,
          price: p.newPrice ? parseFloat(p.newPrice) : 1
        };
      });

      renderProducts();
    },
    error: err => console.error("CSV load failed:", err)
  });

  function renderProducts() {
    const slice = allProducts.slice(currentIndex, currentIndex + productsPerBatch);
    if (!slice.length) return;

    slice.forEach((p, index) => {
      // Render cards (same as your previous code)
      let card = document.createElement("div");
      card.className = `product-card is-product artwork`;
      card.dataset.images = JSON.stringify(p.images);

      const imgSrc = p.images[0] ? (p.images[0].includes("http") ? p.images[0] : 'https://static.wixstatic.com/media/' + p.images[0]) : "";
      let discountBubble = p.discount ? `<div class="discount-bubble">${p.discount}</div>` : "";
      let priceHTML = p.oldPrice && p.oldPrice > p.price
        ? `<span class="price-from">From $${p.price.toFixed(2)}</span><span class="price-old">$${p.oldPrice.toFixed(2)}</span>`
        : `<span class="price-new">$${p.price.toFixed(2)}</span>`;

      card.innerHTML = `<div class="img-wrapper">${discountBubble}<img src="${imgSrc}" alt="${p.name}"></div>
        <div class="product-info"><h3>${p.name}</h3><div class="price-wrapper">${priceHTML}</div></div>`;

      card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;

      grid.appendChild(card);
    });

    currentIndex += slice.length;
    if (currentIndex >= allProducts.length && showMoreBtn) showMoreBtn.style.display = "none";
  }

  if (showMoreBtn) showMoreBtn.addEventListener("click", renderProducts);
}
