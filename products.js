function initProductsPage() {
  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageNumber = document.getElementById("pageNumber");

  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  let currentPage = 1;
  const productsPerPage = 60;
  let currentImageIndex = parseInt(localStorage.getItem("gridImageIndex")) || 0;

  const banners = [
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_8428cdd03a514d8fa35248436418e881/1080p/mp4/file.mp4" },
    { type: "color", color: "#f7c59f" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_4a4a7105ce284ce5928b811120fef2fc/1080p/mp4/file.mp4" },
    { type: "color", color: "#9fd3f7" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_9ac7f684c40e4b1db1cb7d8f644c1d77/1080p/mp4/file.mp4" },
    { type: "color", color: "#c5f79f" }
  ];

  const params = new URLSearchParams(window.location.search);
  const activeCollection = params.get("collection");
  const activeCategory   = params.get("category");
  const activeColor      = params.get("color");

  const titleEl = document.getElementById("dynamicPageTitle");
  if (titleEl) {
    if (activeCollection) titleEl.textContent = `New in ${activeCollection}`;
    else if (activeCategory) titleEl.textContent = activeCategory;
    else if (activeColor) titleEl.textContent = `${activeColor} collection`;
    else titleEl.textContent = "All products";
  }

  // --- Load CSV ---
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allProducts = res.data.map(p => {
        const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
        let lifestyle = (p.lifestyleUrl || "").trim();
        if (!lifestyle && mainImages.length > 1) lifestyle = mainImages[1];
        const images = [mainImages[0] || "", lifestyle].concat(mainImages.slice(2));
        return {
          type: (p.type || "").toLowerCase() === "single" ? "artwork" : "lifestyle",
          id: (p.productId || "").trim(),
          name: (p.name || "Unnamed Product").trim(),
          images: images,
          video: (p["video/s"] || "").trim(),
          oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
          discount: p.discount ? p.discount.trim() : null,
          price: p.newPrice ? parseFloat(p.newPrice) : 1
        };
      });
      renderPage(currentPage);
      renderPagination();
    },
    error: err => console.error("CSV load failed:", err)
  });

  // --- Render grid page ---
  function renderPage(page) {
    grid.innerHTML = "";
    const start = (page - 1) * productsPerPage;
    const slice = allProducts.slice(start, start + productsPerPage);

    if (!slice.length) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    slice.forEach((p, index) => {
      let card;

      // Banner every 10th card
      if ((index + 1) % 10 === 0) {
        card = document.createElement("div");
        card.className = "product-card banner-only";

        const bannerIndex = Math.floor(index / 10) % banners.length;
        const banner = banners[bannerIndex];

        if (banner.type === "video") {
          card.innerHTML = `
            <div class="img-wrapper banner-wrapper">
              <video autoplay muted loop playsinline>
                <source src="${banner.src}" type="video/mp4">
              </video>
            </div>`;
        } else {
          card.innerHTML = `<div class="img-wrapper banner-wrapper" style="background:${banner.color}"></div>`;
        }

      } else {
        card = document.createElement("div");
        const productClass = currentImageIndex === 0 ? "artwork" : "lifestyle";
        card.className = `product-card is-product ${productClass}`;
        card.dataset.images = JSON.stringify(p.images);

        const imgSrc = p.images[currentImageIndex]
          ? (p.images[currentImageIndex].includes("http")
              ? p.images[currentImageIndex]
              : 'https://static.wixstatic.com/media/' + p.images[currentImageIndex])
          : "";

        let discountBubble = p.discount ? `<div class="discount-bubble">${p.discount}</div>` : "";
        let priceHTML = "";
        if (p.oldPrice && p.oldPrice > p.price) {
          priceHTML = `<span class="price-from">$${p.price.toFixed(2)}</span>
                       <span class="price-old">$${p.oldPrice.toFixed(2)}</span>`;
        } else priceHTML = `<span class="price-new">$${p.price.toFixed(2)}</span>`;

        card.innerHTML = `
          <div class="img-wrapper">
            ${discountBubble}
            <img src="${imgSrc}" alt="${p.name}">
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <div class="price-wrapper">${priceHTML}</div>
          </div>`;

        card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
      }

      grid.appendChild(card);
    });

    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    if (pageNumber) pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  // --- Pagination ---
  function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    const pageBtns = paginationContainer.querySelectorAll(".page-btn");
    pageBtns.forEach(btn => btn.remove());

    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "page-btn";
      if (i === currentPage) btn.classList.add("active");
      btn.onclick = () => {
        currentPage = i;
        renderPage(currentPage);
        renderPagination();
      };
      paginationContainer.insertBefore(btn, nextBtn);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      renderPagination();
    }
  };

  nextBtn.onclick = () => {
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      renderPagination();
    }
  };

  // --- Image toggle buttons ---
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

  function updateGridImages() {
    const productCards = document.querySelectorAll("#productGrid .product-card.is-product");
    productCards.forEach(card => {
      const imgList = card.dataset.images ? JSON.parse(card.dataset.images) : [];
      let newImg = imgList[currentImageIndex] || imgList[0] || "";
      card.querySelector("img").src = newImg.includes("http") ? newImg : 'https://static.wixstatic.com/media/' + newImg;
      card.classList.remove("artwork", "lifestyle");
      card.classList.add(currentImageIndex === 0 ? "artwork" : "lifestyle");
    });
  }

  updateGridImages();

  // --- Shuffle ---
  const shuffleBtn = document.querySelector('.control-btn[title="Shuffle"]');
  if (shuffleBtn) shuffleBtn.addEventListener("click", () => {
    for (let i = allProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
    }
    renderPage(currentPage);
    renderPagination();
  });

  // --- Sort ---
  const sortBtn = document.querySelector('.control-btn[title="Sort"]');
  if (sortBtn) {
    const sortOptions = [
      { label: "Price: Low → High", fn: (a,b)=>a.price-b.price },
      { label: "Price: High → Low", fn: (a,b)=>b.price-a.price },
      { label: "Name: A → Z", fn: (a,b)=>a.name.localeCompare(b.name) },
      { label: "Name: Z → A", fn: (a,b)=>b.name.localeCompare(a.name) }
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
      el.onmouseenter = () => el.style.background = "#f5f5f5";
      el.onmouseleave = () => el.style.background = "transparent";
      el.onclick = () => {
        allProducts.sort(opt.fn);
        renderPage(currentPage);
        renderPagination();
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
