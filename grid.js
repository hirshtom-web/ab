function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageNumber = document.getElementById("pageNumber");

  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  let currentPage = 1;
  const productsPerPage = 60;

  // LOAD CSV (UNCHANGED)
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allProducts = res.data.map(p => ({
        id: (p.productId || "").trim(),
        name: (p.name || "Unnamed Product").trim(),
        price: p.price ? parseFloat(p.price) : 1,
        oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
        images: (p.productImageUrl || "")
          .split(";")
          .map(i => i.trim())
          .filter(Boolean)
      }));

      renderPage(currentPage);
      updateGridImages();
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
      card.className = "product-card is-product";
      card.dataset.images = JSON.stringify(p.images);

      card.innerHTML = `
        <div class="mockup-stage">
          <img class="lifestyle-bg" alt="">
          <div class="artwork">
            <img alt="${p.name}">
          </div>
        </div>

        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="price-wrapper">
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ""}
            <span class="price-new">$${p.price}</span>
          </div>
        </div>
      `;

      card.onclick = () =>
        (window.location.href = `product-page.html?id=${p.id}`);

      grid.appendChild(card);
    });

    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    if (pageNumber) pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  // IMAGE TOGGLE STATE
  let currentImageIndex = parseInt(localStorage.getItem("gridImageIndex")) || 0;

  const imgButtons = document.querySelectorAll(".image-selector .img-btn");
  imgButtons.forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.index) === currentImageIndex);
    btn.addEventListener("click", () => {
      imgButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentImageIndex = parseInt(btn.dataset.index);
      localStorage.setItem("gridImageIndex", currentImageIndex);
      updateGridImages();
    });
  });

  // 🔑 IMAGE UPDATE (FIXED)
function updateGridImages() {
  const productCards = document.querySelectorAll("#productGrid .product-card.is-product");

  productCards.forEach(card => {
    const imgList = JSON.parse(card.dataset.images || "[]");
    const artworkImg = card.querySelector(".artwork img");
    const lifestyleImg = card.querySelector(".lifestyle-bg");

    const img = imgList[currentImageIndex] || imgList[0];
    const url = img.includes("http")
      ? img
      : "https://static.wixstatic.com/media/" + img;

    if (currentImageIndex === 1 && lifestyleImg) {
      // LIFESTYLE LOOK
      lifestyleImg.src = url;
      card.classList.add("is-lifestyle");
    } else {
      // ARTWORK LOOK
      if (artworkImg) artworkImg.src = url;
      card.classList.remove("is-lifestyle");
    }
  });
}


  // PAGINATION
  if (prevBtn)
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        updateGridImages();
      }
    };

  if (nextBtn)
    nextBtn.onclick = () => {
      if (currentPage * productsPerPage < allProducts.length) {
        currentPage++;
        renderPage(currentPage);
        updateGridImages();
      }
    };
}
