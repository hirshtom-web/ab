function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");

  if (!grid) return console.error("❌ productGrid not found");
  if (!showMoreBtn) console.warn("⚠️ Show More button not found");

  let allProducts = [];
  let currentIndex = 0; // tracks how many products are shown
  const productsPerPage = 60;

  const banners = [
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_8428cdd03a514d8fa35248436418e881/1080p/mp4/file.mp4" },
    { type: "color", color: "#f7c59f" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_4a4a7105ce284ce5928b811120fef2fc/1080p/mp4/file.mp4" },
    { type: "color", color: "#9fd3f7" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_9ac7f684c40e4b1db1cb7d8f644c1d77/1080p/mp4/file.mp4" },
    { type: "color", color: "#c5f79f" }
  ];

  // Load CSV
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      if (!res.data || !res.data.length) {
        console.error("❌ CSV loaded but no data found", res);
        grid.innerHTML = "<p>No products available.</p>";
        return;
      }

      allProducts = res.data.map(p => ({
        id: (p.productId || "").trim(),
        name: (p.name || "Unnamed Product").trim(),
        price: p.price ? parseFloat(p.price) : 1,
        oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
        images: (p.productImageUrl || "").split(";").map(i => i.trim()).filter(Boolean)
      }));

      console.log("✅ Products loaded:", allProducts.length);

      renderProducts(); // first batch
    },
    error: err => {
      console.error("❌ CSV load failed:", err);
      grid.innerHTML = "<p>Failed to load products.</p>";
    }
  });

  function renderProducts() {
    const slice = allProducts.slice(currentIndex, currentIndex + productsPerPage);

    if (!slice.length) {
      if (showMoreBtn) showMoreBtn.style.display = "none";
      if (currentIndex === 0) grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    slice.forEach((p, index) => {
      let card;

      // Banner every 7th card
      if ((currentIndex + index + 1) % 7 === 0) {
        card = document.createElement("div");
        card.className = "product-card banner-only";

        const bannerIndex = Math.floor((currentIndex + index) / 7) % banners.length;
        const banner = banners[bannerIndex];

        if (banner.type === "video") {
          card.innerHTML = `
            <div class="img-wrapper banner-wrapper">
              <video autoplay muted loop playsinline>
                <source src="${banner.src}" type="video/mp4">
              </video>
            </div>
          `;
        } else {
          card.innerHTML = `<div class="img-wrapper banner-wrapper" style="background:${banner.color}"></div>`;
        }
      } else {
        // Regular product card
        card = document.createElement("div");
        card.className = "product-card is-product";

        const imagesArray = p.images.length ? p.images : ["https://via.placeholder.com/300x300"];
        card.dataset.images = JSON.stringify(imagesArray);

        card.innerHTML = `
          <div class="img-wrapper">
            <img src="${imagesArray[0].includes("http") ? imagesArray[0] : 'https://static.wixstatic.com/media/' + imagesArray[0]}" alt="${p.name}">
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <div class="price-wrapper">
              <span class="price-old">${p.oldPrice ? `$${p.oldPrice}` : ''}</span>
              <span class="price-new">$${p.price}</span>
            </div>
          </div>
        `;

        card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
      }

      grid.appendChild(card);
    });

    currentIndex += slice.length;

    // Hide Show More if no more products
    if (currentIndex >= allProducts.length && showMoreBtn) {
      showMoreBtn.style.display = "none";
    } else if (showMoreBtn) {
      showMoreBtn.style.display = "block";
    }
  }

  if (showMoreBtn) {
    showMoreBtn.onclick = () => renderProducts();
  }
}
