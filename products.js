function initProductsPage() {
  console.log("✅ initProductsPage running");

  const grid = document.getElementById("productGrid");
  if (!grid) {
    console.error("❌ productGrid not found");
    return;
  }

  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  let allProducts = [];
  let currentPage = 1;
  const productsPerPage = 12;

  function renderPage(page) {
    grid.innerHTML = "";
    const start = (page - 1) * productsPerPage;
    const slice = allProducts.slice(start, start + productsPerPage);

    slice.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
      `;
      grid.appendChild(card);
    });
  }

  // TEMP TEST DATA (IMPORTANT)
  allProducts = [
    { name: "Test Product 1", price: 10, image: "https://via.placeholder.com/300" },
    { name: "Test Product 2", price: 20, image: "https://via.placeholder.com/300" },
    { name: "Test Product 3", price: 30, image: "https://via.placeholder.com/300" }
  ];

  renderPage(currentPage);

  if (prevBtn) prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  };

  if (nextBtn) nextBtn.onclick = () => {
    if (currentPage * productsPerPage < allProducts.length) {
      currentPage++;
      renderPage(currentPage);
    }
  };
}
