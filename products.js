function initProductsPage() {

  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const shuffleBtn = document.querySelector('[title="Shuffle"]');
  const sortBtn = document.querySelector('[title="Sort"]');

  if (!grid) return; // safety exit

  // Pagination
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

  // Shuffle
  shuffleBtn.addEventListener("click", () => {
    shuffleArray(allProducts);
    renderPage(currentPage);
  });

  // Sort menu
  sortBtn.addEventListener("click", () => {
    const bubble = document.createElement("div");
    bubble.className = "sort-bubble";
    bubble.innerHTML = `
      <div data-sort="priceAsc">Price ↑</div>
      <div data-sort="priceDesc">Price ↓</div>
      <div data-sort="az">A–Z</div>
      <div data-sort="za">Z–A</div>
    `;
    document.body.appendChild(bubble);

    bubble.querySelectorAll("div").forEach(item => {
      item.onclick = () => {
        const type = item.dataset.sort;
        if (type === "priceAsc") allProducts.sort((a,b)=>a.price-b.price);
        if (type === "priceDesc") allProducts.sort((a,b)=>b.price-a.price);
        if (type === "az") allProducts.sort((a,b)=>a.name.localeCompare(b.name));
        if (type === "za") allProducts.sort((a,b)=>b.name.localeCompare(a.name));
        renderPage(currentPage);
        bubble.remove();
      };
    });
  });

  // Default grid
  applyDefaultGrid();
}

