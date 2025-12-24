// ================================
// gallery-walls.js
// ================================

function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");
  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  let currentIndex = 0;
  const productsPerBatch = 12;

  const banners = [
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_8428cdd03a514d8fa35248436418e881/1080p/mp4/file.mp4" },
    { type: "color", color: "#f7c59f" }
  ];

  // ================================
  // Load CSV
  // ================================
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      console.log("✅ CSV loaded, total rows:", res.data.length);
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

      if (allProducts.length === 0) {
        grid.innerHTML = "<p>No products found in CSV.</p>";
        return;
      }

      // Initial render
      renderProducts();
    },
    error: err => console.error("❌ CSV load failed:", err)
  });

  // ================================
  // Render Products
  // ================================
  function renderProducts() {
    const slice = allProducts.slice(currentIndex, currentIndex + productsPerBatch);
    if (!slice.length) return;

    slice.forEach((p, index) => {
      // Banner every 7th card
      let card;
      if ((currentIndex + index + 1) % 7 === 0) {
        const bannerIndex = Math.floor((currentIndex + index) / 7) % banners.length;
        const banner = banners[bannerIndex];

        card = document.createElement("div");
        card.className = "product-card banner-only";

        if (banner.type === "video") {
          card.innerHTML = `<div class="img-wrapper banner-wrapper">
            <video autoplay muted loop playsinline>
              <source src="${banner.src}" type="video/mp4">
            </video>
          </div>`;
        } else {
          card.innerHTML = `<div class="img-wrapper banner-wrapper" style="background:${banner.color}"></div>`;
        }
      } else {
        // Regular product card
        card = document.createElement("div");
        card.className = "product-card is-product artwork";
        card.dataset.images = JSON.stringify(p.images);

        const imgSrc = p.images[0] ? (p.images[0].includes("http") ? p.images[0] : 'https://static.wixstatic.com/media/' + p.images[0]) : "";
        let discountBubble = p.discount ? `<div class="discount-bubble">${p.discount}</div>` : "";
        let priceHTML = p.oldPrice && p.oldPrice > p.price
          ? `<span class="price-from">From $${p.price.toFixed(2)}</span><span class="price-old">$${p.oldPrice.toFixed(2)}</span>`
          : `<span class="price-new">$${p.price.toFixed(2)}</span>`;

        card.innerHTML = `<div class="img-wrapper">${discountBubble}<img src="${imgSrc}" alt="${p.name}"></div>
          <div class="product-info"><h3>${p.name}</h3><div class="price-wrapper">${priceHTML}</div></div>`;

        card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
      }

      grid.appendChild(card);
    });

    currentIndex += slice.length;

    if (currentIndex >= allProducts.length && showMoreBtn) {
      showMoreBtn.style.display = "none";
    } else if (showMoreBtn) {
      showMoreBtn.style.display = "block";
    }
  }

  if (showMoreBtn) showMoreBtn.addEventListener("click", renderProducts);

  // ================================
  // Debug: temporary CSV check
  // ================================
  console.log("🟢 initProductsPage executed");
}
