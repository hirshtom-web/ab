async function initProductsPage() {
  const titleEl = document.querySelector(".pricing h2");
  const artistEl = document.querySelector(".artist");
  const priceEl = document.querySelector(".price");
  const oldPriceEl = document.querySelector(".old-price");
  const descEl = document.querySelector(".description");
  const mainImage = document.getElementById("mainImg");
  const thumbsEl = document.querySelector(".gallery-thumbs");
  const dotsEl = document.querySelector(".gallery-dots");
  const buyBtn = document.querySelector(".buy");
  const categoryEl = document.createElement("div");
  categoryEl.className = "product-category";

  const csvUrl = "https://hirshtom-web.github.io/ab/product-catalog.csv";
  const productId = new URLSearchParams(location.search).get("id")?.trim().toLowerCase();

  let allImages = [];
  let currentIndex = 0;

  const slugify = str => str.toLowerCase().trim().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  function updateImageStyle(index) {
    const wrapper = document.querySelector(".main-image-wrapper");
    if (!wrapper) return;
    wrapper.classList.remove("artwork", "lifestyle");
    wrapper.classList.add(index === 0 ? "artwork" : "lifestyle");
  }

  function switchImage(index) {
    if (!allImages.length) return;
    currentIndex = index;
    updateImageStyle(index);
    mainImage.style.opacity = 0;
    const img = new Image();
    img.src = allImages[currentIndex];
    img.onload = () => {
      mainImage.src = img.src;
      mainImage.style.opacity = 1;
      thumbsEl?.querySelectorAll("img").forEach((img, idx) => img.classList.toggle("active", idx === currentIndex));
      dotsEl?.querySelectorAll(".dot").forEach((dot, idx) => dot.classList.toggle("active", idx === currentIndex));
    };
  }

  function createThumbnail(src, index) {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => switchImage(index);
    return img;
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll(".dot").forEach((dot, idx) => dot.classList.toggle("active", idx === currentIndex));
  }

  function initAccordion() {
    document.querySelectorAll(".accordion-header").forEach(btn => {
      const item = btn.closest(".accordion-item");
      const content = btn.nextElementSibling;
      btn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        document.querySelectorAll(".accordion-item").forEach(i => {
          i.classList.remove("active");
          const c = i.querySelector(".accordion-content");
          if (c) c.style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add("active");
          if (content) content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
  }

  // ---------------- LOAD SALES FIRST ----------------
  let sales = [];
  try {
    sales = await loadSalesConfig();
  } catch(err) {
    console.error("Failed to load sales:", err);
  }

  // ---------------- LOAD CSV ----------------
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      let allProducts = res.data.map(p => {
        const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
        let lifestyle = (p.lifestyleUrl || "").trim();
        if (!lifestyle && mainImages.length > 1) lifestyle = mainImages[1];
        const images = [mainImages[0] || "", lifestyle].concat(mainImages.slice(2)).filter(Boolean).map(u => u.startsWith("http") ? u : 'https://static.wixstatic.com/media/' + u);

        const basePrice = p.originalPrice ? parseFloat(p.originalPrice) : 0;
        const productRef = { id: (p.productId || "").trim(), category: (p.category || "").trim() };
        const sale = getSaleForProduct(productRef, sales);
        const finalPrice = sale ? applySale(basePrice, sale) : basePrice;

        return {
          id: (p.productId || "").trim(),
          name: (p.name || "Unnamed Product").trim(),
          type: (p["single/bundle"] || "").toLowerCase() === "single" ? "artwork" : "lifestyle",
          images,
          artist: (p.artistName || p.artist || "").trim(),
          category: (p.category || "").trim(),
          color: (p.color || "").trim(),
          description: p.bio || "",
          downloadLink: (p.downloadLinkUrl || "").trim(),
          price: finalPrice,
          oldPrice: sale ? basePrice : null,
          sale
        };
      });

      const product = allProducts.find(p => p.id.toLowerCase() === productId || slugify(p.name) === productId) || {
        id: "temp",
        name: "Sample Product",
        images: ["https://via.placeholder.com/500x500?text=Product"],
        price: 99.99,
        oldPrice: 129.99,
        artist: "Anonymous",
        category: "Art Prints",
        color: "Default",
        description: "<p>This is a fallback product.</p>",
        downloadLink: ""
      };

      renderProduct(product);
    },
    error: err => {
      console.error("CSV load failed:", err);
      renderProduct({
        id: "temp",
        name: "Sample Product",
        images: ["https://via.placeholder.com/500x500?text=Product"],
        price: 99.99,
        oldPrice: 129.99,
        artist: "Anonymous",
        category: "Art Prints",
        color: "Default",
        description: "<p>This is a fallback product.</p>",
        downloadLink: ""
      });
    }
  });

  // ---------------- RENDER PRODUCT ----------------
  function renderProduct(product) {
    titleEl.innerText = product.name;
    titleEl.after(categoryEl);
    categoryEl.innerText = [product.category, product.color].filter(Boolean).join(" • ");
    artistEl.innerText = product.artist;
    descEl.innerHTML = product.description;

    priceEl.innerText = "$" + product.price.toFixed(2);
    if (oldPriceEl) {
      if (product.oldPrice && product.oldPrice > product.price) {
        oldPriceEl.innerText = "$" + product.oldPrice.toFixed(2);
        oldPriceEl.style.display = "inline";
        oldPriceEl.style.textDecoration = "line-through";
      } else oldPriceEl.style.display = "none";
    }

    const discountEl = document.querySelector(".discount-bubble");
    if (discountEl) {
      if (product.sale) {
        discountEl.innerText = product.sale.discount_type === "percent"
          ? `${product.sale.discount_value}% OFF`
          : `$${product.sale.discount_value} OFF`;
        discountEl.style.display = "inline-block";
      } else discountEl.style.display = "none";
    }

    // Images
    allImages = product.images;
    if (allImages.length) switchImage(0);
    if (thumbsEl) {
      thumbsEl.innerHTML = "";
      allImages.forEach((src, i) => thumbsEl.appendChild(createThumbnail(src, i)));
    }
    if (dotsEl) {
      dotsEl.innerHTML = "";
      allImages.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.addEventListener("click", () => switchImage(i));
        dotsEl.appendChild(dot);
      });
      updateDots();
    }

    const galleryWrapper = document.querySelector(".main-image-wrapper");
    if (allImages.length > 1 && galleryWrapper) {
      let startX = 0, endX = 0;
      galleryWrapper.addEventListener("touchstart", e => startX = e.touches[0].clientX);
      galleryWrapper.addEventListener("touchmove", e => endX = e.touches[0].clientX);
      galleryWrapper.addEventListener("touchend", () => {
        if (startX - endX > 50) switchImage((currentIndex + 1) % allImages.length);
        else if (endX - startX > 50) switchImage((currentIndex - 1 + allImages.length) % allImages.length);
      });
    }

    buyBtn.onclick = () => {
      if (product.downloadLink) window.open(product.downloadLink, "_blank");
      else alert("Download not available");
    };

    initAccordion();

    const currentEl = document.querySelector(".breadcrumbs .current");
    if (currentEl) currentEl.textContent = product.name;
  }
}

initProductsPage().catch(err => console.error("Product page failed:", err));
