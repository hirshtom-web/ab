function initProductsPage() {
    // --- Filter & search state ---
  let filteredProducts = [];
  let activeFilters = {};
  let searchQuery = "";

function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    // 1️⃣ Taxonomy filters
    const taxonomyMatch = Object.entries(activeFilters).every(([filter, value]) => {
      const list = p.filters?.[filter] || [];
      return list.some(v => v === value.toLowerCase());
    });

    if (!taxonomyMatch) return false;

    // 2️⃣ Search
    if (searchQuery) {
      return p.searchText.includes(searchQuery);
    }

    return true;
  });

  // Clear and reload grid with filtered products
  grid.innerHTML = "";
  currentIndex = 0;
  loadMoreProducts();

  if (loadMoreBtn) {
    loadMoreBtn.style.display = (filteredProducts.length > currentIndex) ? "block" : "none";
  }
}

  function normalizeList(val) {
    return (val || "")
      .split(";")
      .map(v => v.trim().toLowerCase());
  }

  const grid = document.getElementById("productGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (!grid) return console.error("❌ productGrid not found");

    // --- Filter buttons ---
document.addEventListener("click", e => {
  const el = e.target.closest("[data-filter]");
  if (!el) return;

  const filter = el.dataset.filter;
  const value = el.dataset.value;

  // Highlight UI
  document.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => b.classList.remove("active"));
  el.classList.add("active");

  // Update state
  if (value === "all") delete activeFilters[filter];
  else activeFilters[filter] = value.toLowerCase(); // lowercase fix

  // Reapply filters
  applyFilters();
});

// --- Search input listeners (desktop + mobile) ---
function attachSearchInput(inputEl) {
  if (!inputEl) return;

  inputEl.addEventListener("input", () => {
    searchQuery = inputEl.value.trim().toLowerCase();
    applyFilters();
  });
}

attachSearchInput(document.getElementById("searchBar"));        // desktop
attachSearchInput(document.getElementById("mobileSearchBar")); // mobile



  let allProducts = [];
  let currentIndex = 0;                  
  const initialLoad = 30;
  const loadMoreCount = 18;
  let currentImageIndex = parseInt(localStorage.getItem("gridImageIndex")) || 0;

  const banners = [
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_8428cdd03a514d8fa35248436418e881/1080p/mp4/file.mp4" },
    { type: "color", color: "#f7c59f" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_4a4a7105ce284ce5928b811120fef2fc/1080p/mp4/file.mp4" },
    { type: "color", color: "#9fd3f7" },
    { type: "video", src: "https://video.wixstatic.com/video/1799ca_9ac7f684c40e4b1db1cb7d8f644c1d77/1080p/mp4/file.mp4" },
    { type: "color", color: "#c5f79f" }
  ];

// --- Set dynamic page title from any filter param ---
const params = new URLSearchParams(window.location.search);
const titleEl = document.getElementById("dynamicPageTitle");

if (titleEl) {
  // List all the filter keys you use in your bubbles
  const filterKeys = [
    "collection",
    "category",
    "color",
    "style",
    "room",
    "artist",
    "keywords",
    "meaning",
    "use-case",
    "emotional-energy",
    "scale",
    "drawings",
    "color-story"
  ];

  let foundTitle = false;

  filterKeys.forEach(key => {
    const val = params.get(key);
    if (val && !foundTitle) {
      // Replace dashes with spaces and capitalize words
      const formatted = val.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      titleEl.textContent = formatted;
      foundTitle = true;
    }
  });

  // Default if no filter matches
  if (!foundTitle) {
    titleEl.textContent = "All Products";
  }
}


  // --- Load CSV and initialize products ---
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
    allProducts = res.data.map(p => {
  const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
  let lifestyle = (p.lifestyleUrl || "").trim();
  if (!lifestyle && mainImages.length > 1) lifestyle = mainImages[1]; // fallback

  return {
    type: (p.type || "").toLowerCase() === "single" ? "artwork" : "lifestyle",
    id: (p.productId || "").trim(),
    name: (p.name || "Unnamed Product").trim(),
    images: [
      mainImages[0] || "",
      lifestyle
    ].concat(mainImages.slice(2)),
    video: (p["video/s"] || "").trim(),
    oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
    discount: p.discount ? p.discount.trim() : null,
    price: p.newPrice ? parseFloat(p.newPrice) : 1,
    searchText: [
      p.name,
      p.collection,
      p.category,
      p.style,
      p.color,
      p.room,
      p.keywords
    ].join(" ").toLowerCase(),
    filters: {
      collection: normalizeList(p.collection),
      category: normalizeList(p.category),
      color: normalizeList(p.color),
      style: normalizeList(p.style),
      room: normalizeList(p.room),
      artist: normalizeList(p.artist),
      keywords: normalizeList(p.keywords)
    }
  };
});

// --- Initial load after allProducts is ready ---
filteredProducts = allProducts; // start with everything
currentIndex = 0;
loadMoreProducts();

    },
    error: err => console.error("CSV load failed:", err)
  });

  // --- Create product card ---
  function createProductCard(p, index) {
    const card = document.createElement("div");

    // Banner every 10th product
    if ((index + 1) % 10 === 0) {
      card.className = "product-card banner-only";
      const banner = banners[Math.floor(index / 10) % banners.length];
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
      // Regular product card
      const productClass = currentImageIndex === 0 ? "artwork" : "lifestyle";
      card.className = `product-card is-product ${productClass}`;
      card.dataset.images = JSON.stringify(p.images);

      const imgSrc = p.images[currentImageIndex] 
        ? (p.images[currentImageIndex].includes("http") ? p.images[currentImageIndex] : 'https://static.wixstatic.com/media/' + p.images[currentImageIndex])
        : "";

      const discountBubble = p.discount ? `<div class="discount-bubble">${p.discount}</div>` : "";
      const priceHTML = p.oldPrice && p.oldPrice > p.price
        ? `<span class="price-from">$${p.price.toFixed(2)}</span><span class="price-old">$${p.oldPrice.toFixed(2)}</span>`
        : `<span class="price-new">$${p.price.toFixed(2)}</span>`;

      card.innerHTML = `
<div class="img-wrapper">
  ${discountBubble}

  <img
    class="img-primary"
    src="${imgSrc}"
    alt="${p.name}"
  >

  ${p.images[1] ? `
    <img
      class="img-secondary"
      src="${p.images[1].includes("http")
        ? p.images[1]
        : 'https://static.wixstatic.com/media/' + p.images[1]}"
      alt="${p.name}"
    >
  ` : ""}
</div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="price-wrapper">${priceHTML}</div>
        </div>`;

      card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
    }

    return card;
  }

  // --- Load More function ---
function loadMoreProducts() {
  const amount = currentIndex === 0 ? initialLoad : loadMoreCount;
  const nextProducts = filteredProducts.slice(currentIndex, currentIndex + amount);
  nextProducts.forEach((p, idx) =>
    grid.appendChild(createProductCard(p, currentIndex + idx))
  );
  currentIndex += amount;

  if (currentIndex >= filteredProducts.length && loadMoreBtn) {
    loadMoreBtn.style.display = "none";
  }
}


  if (loadMoreBtn) loadMoreBtn.addEventListener("click", loadMoreProducts);

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
      if (!newImg && imgList.length > 1) newImg = imgList[1]; // fallback
      card.querySelector("img").src = newImg.includes("http") ? newImg : 'https://static.wixstatic.com/media/' + newImg;

      card.classList.remove("artwork", "lifestyle");
      card.classList.add(currentImageIndex === 0 ? "artwork" : "lifestyle");
    });
  }

  // --- Grid column buttons ---
  let defaultCols = window.innerWidth <= 768 ? 2 : 3;
  grid.classList.add(`cols-${defaultCols}`);
  document.querySelectorAll(`.grid-btn[data-cols="${defaultCols}"]`).forEach(btn => btn.classList.add("active"));
  const gridButtons = document.querySelectorAll(".grid-btn");
  gridButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll(".grid-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      grid.classList.remove("cols-1","cols-2","cols-3","cols-4");
      grid.classList.add(`cols-${btn.dataset.cols}`);
    });
  });

  // --- Shuffle ---
  const shuffleBtn = document.querySelector('.control-btn[title="Shuffle"]');
  if (shuffleBtn) shuffleBtn.addEventListener("click", () => {
    for (let i = allProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
    }
    grid.innerHTML = "";
    currentIndex = 0;
    loadMoreProducts();
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
    sortBubble.style.cssText = "position:absolute;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);padding:8px 0;display:none;z-index:9999";

    sortOptions.forEach(opt => {
      const el = document.createElement("div");
      el.textContent = opt.label;
      el.style.cssText = "padding:8px 16px;cursor:pointer";
      el.onmouseenter = () => el.style.background = "#f5f5f5";
      el.onmouseleave = () => el.style.background = "transparent";
      el.onclick = () => {
        allProducts.sort(opt.fn);
        grid.innerHTML = "";
        currentIndex = 0;
        loadMoreProducts();
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
      if (!sortBtn.contains(e.target) && !sortBubble.contains(e.target)) sortBubble.style.display = "none";
    });
  }
}
