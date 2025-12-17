
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  let allProducts = [];
  let currentPage = 1;
  const productsPerPage = 60; // <-- 60 items per page

  // Load CSV
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allProducts = res.data.map(p => ({
        id: (p.productId || p.ProductId || "").trim(),
        name: (p.name || p.Name || "Unnamed Product").trim(),
        price: p.price ? parseFloat(p.price) : 1,
        image: (p.productImageUrl || p.ProductImageUrl || "").split(";")[0].trim()
      }));

      renderPage(currentPage);
    },
    error: err => console.error("CSV load failed:", err)
  });

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
        <img src="${p.image.includes("http") ? p.image : 'https://static.wixstatic.com/media/' + p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
      `;
      card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
      grid.appendChild(card);
    });

    // Update pagination info
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable buttons if needed
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  // Pagination buttons
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  };
  nextBtn.onclick = () => {
    if (currentPage * productsPerPage < allProducts.length) {
      currentPage++;
      renderPage(currentPage);
    }
  };
});
</script>
