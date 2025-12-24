document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");
  if (!grid) return console.error("❌ productGrid not found");
  if (!showMoreBtn) console.warn("⚠️ Show More button not found");

  const csvUrl = "https://hirshtom-web.github.io/ab/product-catalog.csv";
  const productsPerPage = 20; // initial batch
  let allProducts = [];
  let currentIndex = 0;

  const banners = [
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_8428cdd03a514d8fa35248436418e881/1080p/mp4/file.mp4" },
    { type: "color", color: "#f7c59f" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_4a4a7105ce284ce5928b811120fef2fc/1080p/mp4/file.mp4" },
    { type: "color", color: "#9fd3f7" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_9ac7f684c40e4b1db1cb7d8f644c1d77/1080p/mp4/file.mp4" },
    { type: "color", color: "#c5f79f" }
  ];

  function createProductCard(p, index) {
    let card;

    if ((index + 1) % 7 === 0) {
      // Banner
      card = document.createElement("div");
      card.className = "product-card banner-only";
      const bannerIndex = Math.floor(index / 7) % banners.length;
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
      // Regular product
      card = document.createElement("div");
      card.className = "product-card is-product";
      const imagesArray = p.images.length ? p.images : ["https://via.placeholder.com/300x300"];
      card.dataset.images = JSON.stringify(imagesArray);

      card.innerHTML = `
        <div class="img-wrapper">
          <img src="${imagesArray[0].startsWith('http') ? imagesArray[0] : 'https://static.wixstatic.com/media/' + imagesArray[0]}" alt="${p.name}">
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

    return card;
  }

  function renderNextBatch() {
    const slice = allProducts.slice(currentIndex, currentIndex + productsPerPage);
    if (!slice.length) {
      showMoreBtn.style.display = "none";
      return;
    }
    slice.forEach((p, idx) => grid.appendChild(createProductCard(p, currentIndex + idx)));
    currentIndex += slice.length;

    // Hide button if no more products
    if (currentIndex >= allProducts.length) showMoreBtn.style.display = "none";
  }

  showMoreBtn?.addEventListener("click", renderNextBatch);

  // Load CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (res) => {
      if (!res.data || !res.data.length) {
        console.error("❌ CSV loaded but no data");
        grid.innerHTML = "<p>No products available.</p>";
        showMoreBtn.style.display = "none";
        return;
      }

    allProducts = res.data.map(p => {
  const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
  const lifestyle = (p.lifestyleUrl || "").trim();
  const more = (p.moreImages || "").split(";").map(i => i.trim()).filter(Boolean);
  const images = [mainImages[0] || "", lifestyle].concat(mainImages.slice(1), more);

  return {
    id: (p.productId || "").trim(),
    name: (p.name || "").trim(),
    price: p.newPrice ? parseFloat(p.newPrice) : 0,
    oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
    discount: p.discount || null,
    artist: (p.artistName || "").trim(),
    images: images.map(u => u.startsWith("http") ? u : 'https://static.wixstatic.com/media/' + u)
  };
});


      console.log("✅ Products loaded:", allProducts.length);
      renderNextBatch();
    },
    error: err => {
      console.error("❌ CSV load failed:", err);
      grid.innerHTML = "<p>Failed to load products.</p>";
      showMoreBtn.style.display = "none";
    }
  });
});
