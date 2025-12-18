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
  images: (p.productImageUrl || "").split(";").map(i => i.trim())  // store all images
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
 const imagesArray = p.images.length ? p.images : [p.image];
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
// GRID IMAGE TOGGLE WITH MEMORY
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const imgButtons = document.querySelectorAll(".image-selector .img-btn");
  if (!imgButtons.length) return;

  // Load last selection from localStorage, default to 0 (Cover)
  let currentImageIndex = parseInt(localStorage.getItem("selectedImageIndex") || 0);

  // Set active button based on saved value
  imgButtons.forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.image-selector .img-btn[data-index="${currentImageIndex}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  imgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active button
      imgButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentImageIndex = parseInt(btn.dataset.index);

      // Save selection
      localStorage.setItem("selectedImageIndex", currentImageIndex);

      // Update all product images in the grid
      const productCards = document.querySelectorAll("#productGrid .product-card");
      productCards.forEach(card => {
        const imgList = card.dataset.images ? JSON.parse(card.dataset.images) : [card.querySelector("img").src];
        const newImg = imgList[currentImageIndex] || imgList[0];
        card.querySelector("img").src = newImg.includes("http") ? newImg : 'https://static.wixstatic.com/media/' + newImg;
      });
    });
  });

  // Trigger initial update on page load
  const productCards = document.querySelectorAll("#productGrid .product-card");
  productCards.forEach(card => {
    const imgList = card.dataset.images ? JSON.parse(card.dataset.images) : [card.querySelector("img").src];
    const newImg = imgList[currentImageIndex] || imgList[0];
    card.querySelector("img").src = newImg.includes("http") ? newImg : 'https://static.wixstatic.com/media/' + newImg;
  });
});
