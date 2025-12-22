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
        oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
        images: (p.productImageUrl || "").split(";").map(i => i.trim()).filter(i => i)
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
      let card = document.createElement("div");
      card.className = "product-card is-product variant-frame-mat";

      const imagesArray = p.images.length ? p.images : [""]; // fallback
      card.dataset.images = JSON.stringify(imagesArray);

      const firstImage = imagesArray[0];
      const firstImageUrl = firstImage.includes("http")
        ? firstImage
        : 'https://static.wixstatic.com/media/' + firstImage;

      card.innerHTML = `
        <div class="mockup-stage">
          <div class="poster-frame">
              <div class="artwork">
                <img src="${firstImageUrl}" alt="${p.name}">
              </div>
            </div>
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
      grid.appendChild(card);
    });

    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    if (pageNumber) pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  // Pagination buttons
  if (prevBtn) prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPage(currentPage); updateGridImages(); } };
  if (nextBtn) nextBtn.onclick = () => { if (currentPage * productsPerPage < allProducts.length) { currentPage++; renderPage(currentPage); updateGridImages(); } };

  // IMAGE TOGGLE (Cover / Lifestyle)
  const imgButtons = document.querySelectorAll(".image-selector .img-btn");
  let currentImageIndex = parseInt(localStorage.getItem("gridImageIndex")) || 0;

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

  function updateGridImages() {
    const productCards = document.querySelectorAll("#productGrid .product-card.is-product");
    productCards.forEach(card => {
      const imgList = card.dataset.images ? JSON.parse(card.dataset.images) : [];
      const newImg = imgList[currentImageIndex] || imgList[0];
      const imgEl = card.querySelector(".mockup-stage .poster-frame .artwork img");
      if (imgEl) imgEl.src = newImg.includes("http") ? newImg : 'https://static.wixstatic.com/media/' + newImg;
    });
  }

  // Initial image update
  updateGridImages();

  // SHUFFLE & SORT
  const shuffleBtn = document.querySelector('.control-btn[title="Shuffle"]');
  const sortBtn = document.querySelector('.control-btn[title="Sort"]');

  if (shuffleBtn) shuffleBtn.addEventListener("click", () => {
    for (let i = allProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
    }
    renderPage(currentPage);
    updateGridImages();
  });

  if (sortBtn) {
    const sortOptions = [
      { label: "Price: Low → High", fn: (a, b) => a.price - b.price },
      { label: "Price: High → Low", fn: (a, b) => b.price - a.price },
      { label: "Name: A → Z", fn: (a, b) => a.name.localeCompare(b.name) },
      { label: "Name: Z → A", fn: (a, b) => b.name.localeCompare(a.name) }
    ];

    const sortBubble = document.createElement("div");
    sortBubble.className = "sort-bubble";
    sortBubble.style.position = "absolute";
    sortBubble.style.background = "#fff";
    sortBubble.style.border = "1px solid #ccc";
    sortBubble.style.borderRadius = "8px";
    sortBubble.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    sortBubble.style.padding = "8px 0";
    sortBubble.style.display = "none";
    sortBubble.style.zIndex = 9999;

    sortOptions.forEach(opt => {
      const el = document.createElement("div");
      el.textContent = opt.label;
      el.style.padding = "8px 16px";
      el.style.cursor = "pointer";
      el.style.whiteSpace = "nowrap";
      el.onmouseenter = () => el.style.background = "#f5f5f5";
      el.onmouseleave = () => el.style.background = "transparent";
      el.onclick = () => {
        allProducts.sort(opt.fn);
        renderPage(currentPage);
        updateGridImages();
        sortBubble.style.display = "none";
      };
      sortBubble.appendChild(el);
    });

    document.body.appendChild(sortBubble);

    sortBtn.addEventListener("click", () => {
      const rect = sortBtn.getBoundingClientRect();
      sortBubble.style.top = rect.bottom + window.scrollY + "px";
      sortBubble.style.left = rect.left + window.scrollX + "px";
      sortBubble.style.display = sortBubble.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", e => {
      if (!sortBtn.contains(e.target) && !sortBubble.contains(e.target)) {
        sortBubble.style.display = "none";
      }
    });
  }
}
