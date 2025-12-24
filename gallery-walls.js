async function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");
  const productsPerPage = 12; // load 12 at a time
  let allProducts = [];
  let currentIndex = 0;

  if (!grid) return console.error("❌ productGrid not found");

  // Load CSV
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      if (!res.data || !res.data.length) {
        grid.innerHTML = "<p>No products available.</p>";
        return;
      }

      // Map CSV to product objects
      allProducts = res.data.map(p => {
        const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
        const lifestyle = (p.lifestyleUrl || "").trim();
        const more = (p.moreImages || "").split(";").map(i => i.trim()).filter(Boolean);
        const images = [mainImages[0] || "", lifestyle].concat(mainImages.slice(1), more).filter(Boolean);

        return {
          id: (p.productId || "").trim(),
          name: (p.name || "Unnamed Product").trim(),
          price: p.newPrice ? parseFloat(p.newPrice) : 0,
          oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
          discount: p.discount || null,
          artist: (p.artistName || "").trim(),
          images: images.map(u => u.startsWith("http") ? u : 'https://static.wixstatic.com/media/' + u)
        };
      });

      // Initial render
      renderProducts();
    },
    error: err => {
      console.error("CSV load failed:", err);
      grid.innerHTML = "<p>Failed to load products.</p>";
    }
  });

  function renderProducts() {
    const slice = allProducts.slice(currentIndex, currentIndex + productsPerPage);
    slice.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      const img = p.images.length ? p.images[0] : "https://via.placeholder.com/300";
      card.innerHTML = `
        <div class="img-wrapper">
          <img src="${img}" alt="${p.name}">
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="price-wrapper">
            <span class="price-old">${p.oldPrice ? "$" + p.oldPrice : ""}</span>
            <span class="price-new">$${p.price}</span>
          </div>
        </div>
      `;
      card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
      grid.appendChild(card);
    });

    currentIndex += slice.length;

    // Hide button if all loaded
    if (currentIndex >= allProducts.length && showMoreBtn) {
      showMoreBtn.style.display = "none";
    }
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", renderProducts);
  }
}

document.addEventListener("DOMContentLoaded", initProductsPage);
