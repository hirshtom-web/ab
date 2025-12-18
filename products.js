function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageNumber = document.getElementById("pageNumber");

  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  let currentPage = 1;
  const productsPerPage = 60;

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
        image: (p.productImageUrl || "").split(";")[0].trim()
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

  // Store all images in a JSON array for toggle
  const imagesArray = (p.productImageUrl || p.image).split(";").map(i => i.trim());
  card.dataset.images = JSON.stringify(imagesArray);

  card.innerHTML = `
    <img src="${imagesArray[0].includes("http") ? imagesArray[0] : 'https://static.wixstatic.com/media/' + imagesArray[0]}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>$${p.price}</p>
  `;
  card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
  grid.appendChild(card);
});


    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPage(currentPage); } };
  nextBtn.onclick = () => { if (currentPage * productsPerPage < allProducts.length) { currentPage++; renderPage(currentPage); } };
}

// ============================
// GRID IMAGE TOGGLE ADD-ON
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const imgButtons = document.querySelectorAll(".image-selector .img-btn");
  if (!imgButtons.length) return;

  let currentImageIndex = 0; // 0 = Cover, 1 = Lifestyle

  imgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active button
      imgButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentImageIndex = parseInt(btn.dataset.index);

      // Update all product images in the grid
      const productCards = document.querySelectorAll("#productGrid .product-card");
      productCards.forEach((card, i) => {
        // Get the product's original image list from a data attribute
        const imgList = card.dataset.images ? JSON.parse(card.dataset.images) : [card.querySelector("img").src];
        const newImg = imgList[currentImageIndex] || imgList[0];
        card.querySelector("img").src = newImg.includes("http") ? newImg : 'https://static.wixstatic.com/media/' + newImg;
      });
    });
  });
});
