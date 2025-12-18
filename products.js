/* ================================
   INIT PRODUCTS PAGE
================================ */
function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageNumber = document.getElementById("pageNumber");
  const sortSelect = document.getElementById("sortSelect"); // dropdown for sort
  const shuffleBtn = document.getElementById("shuffleBtn"); // button for shuffle
  const layoutSelect = document.getElementById("layoutSelect"); // dropdown for grid layout

  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  let currentPage = 1;
  const productsPerPage = 60;
  let totalPages = 1;

  // Load CSV
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allProducts = res.data.map(p => ({
        id: (p.productId || "").trim(),
        name: (p.name || "Unnamed Product").trim(),
        price: p.price ? parseFloat(p.price) : 1,
        images: (p.productImageUrl || "").split(";").map(i => i.trim())
      }));
      totalPages = Math.ceil(allProducts.length / productsPerPage);
      renderPage(currentPage);
    },
    error: err => console.error("CSV load failed:", err)
  });

  /* ================================
     RENDER PAGE
  ================================= */
  function renderPage(page) {
    grid.innerHTML = "";
    const start = (page - 1) * productsPerPage;
    const slice = allProducts.slice(start, start + productsPerPage);

    if (!slice.length) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    slice.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image-container">
          <img class="primary-img" src="${p.images[0]}" alt="${p.name}">
          ${p.images[1] ? `<img class="secondary-img" src="${p.images[1]}" alt="${p.name}">` : ''}
        </div>
        <h3>${p.name}</h3>
        <p>$${p.price.toFixed(2)}</p>
      `;
      card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
      grid.appendChild(card);
    });

    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  /* ================================
     NAVIGATION BUTTONS
  ================================= */
  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPage(currentPage); } };
  nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderPage(currentPage); } };

  /* ================================
     SORTING
  ================================= */
  if (sortSelect) {
    sortSelect.addEventListener("change", e => {
      const value = e.target.value;
      if (value === "price-asc") allProducts.sort((a,b) => a.price - b.price);
      if (value === "price-desc") allProducts.sort((a,b) => b.price - a.price);
      if (value === "name-asc") allProducts.sort((a,b) => a.name.localeCompare(b.name));
      if (value === "name-desc") allProducts.sort((a,b) => b.name.localeCompare(a.name));
      currentPage = 1;
      renderPage(currentPage);
    });
  }

  /* ================================
     SHUFFLE
  ================================= */
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      allProducts = allProducts
        .map(a => ({sort: Math.random(), value: a}))
        .sort((a,b) => a.sort - b.sort)
        .map(a => a.value);
      currentPage = 1;
      renderPage(currentPage);
    });
  }

  /* ================================
     GRID LAYOUT
  ================================= */
  if (layoutSelect) {
    layoutSelect.addEventListener("change", e => {
      const value = e.target.value;
      grid.className = "product-grid"; // reset
      grid.classList.add(value); // value = "grid-2", "grid-3", "grid-4"
    });
  }
}

/* ================================
   INIT ON DOM READY
================================ */
document.addEventListener("DOMContentLoaded", initProductsPage);
