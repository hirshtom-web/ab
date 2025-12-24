function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageNumber = document.getElementById("pageNumber");

  if (!grid) return console.error("❌ productGrid not found");
  if (!prevBtn || !nextBtn || !pageNumber) {
    console.warn("⚠️ Pagination buttons or pageNumber not found");
  }

  let allProducts = [];
  let currentPage = 1;
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

      // Map CSV data to products
      allProducts = res.data.map(p => ({
        id: (p.productId || "").trim(),
        name: (p.name || "Unnamed Product").trim(),
        price: p.price ? parseFloat(p.price) : 1,
        oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
        images: (p.productImageUrl || "").split(";").map(i => i.trim()).filter(Boolean)
      }));

      console.log("✅ Products loaded:", allProducts.length);

      renderPage(currentPage);
    },
    error: err => {
      console.error("❌ CSV load failed:", err);
      grid.innerHTML = "<p>Failed to load products.</p>";
    }
  });

  function renderPage(page) {
    grid.innerHTML = "";
    const start = (page - 1) * productsPerPage;
    const slice = allProducts.slice(start, start + productsPerPage);

    if (!slice.length) {
      grid.innerHTML = "<p>No products found on this page.</p>";
      return;
    }

    slice.forEach((p, index) => {
      let card;

      // Banner every 7th card
      if ((index + 1) % 7 === 0) {
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

    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    if (pageNumber) pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  if (prevBtn) prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPage(currentPage); } };
  if (nextBtn) nextBtn.onclick = () => { if (currentPage * productsPerPage < allProducts.length) { currentPage++; renderPage(currentPage); } };
}
