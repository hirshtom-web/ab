// ---------------- SINGLE PRODUCT PAGE JS ----------------
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

  const slugify = str =>
    str.toLowerCase().trim().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  // ---------------- IMAGE FUNCTIONS ----------------
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

      thumbsEl?.querySelectorAll("img").forEach((img, idx) =>
        img.classList.toggle("active", idx === currentIndex)
      );
      dotsEl?.querySelectorAll(".dot").forEach((dot, idx) =>
        dot.classList.toggle("active", idx === currentIndex)
      );
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

  // ---------------- ACCORDION ----------------
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

  // ---------------- FALLBACK PRODUCT ----------------
  const fallbackProduct = {
    id: "temp",
    name: "Sample Product",
    type: "art",
    price: 99.99,
    oldPrice: 129.99,
    category: "Art Prints",
    color: "Default",
    artist: "Anonymous",
    description: "<p>This is a fallback product.</p>",
    downloadLink: "",
    images: ["https://via.placeholder.com/500x500?text=Product"]
  };

  // ---------------- LOAD CSV ----------------
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: async function(res) {
      let product = fallbackProduct;

      try {
        const products = res.data.map(p => {
          const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
          let lifestyle = (p.lifestyleUrl || "").trim();
          if (!lifestyle && mainImages.length > 1) lifestyle = mainImages[1];
          const images = [mainImages[0] || "", lifestyle].concat(mainImages.slice(2));

          return {
            id: (p.productId || "").trim(),
            name: (p.name || "").trim(),
            type: (p.type || "").toLowerCase(),
            price: parseFloat(p.newPrice) || 0,
            oldPrice: parseFloat(p.originalPrice) || null,
            category: (p.category || "").trim(),
            color: (p.color || "").trim(),
            artist: (p.artistName || p.artist || "").trim(),
            description: p.bio || "",
            downloadLink: (p.downloadLinkUrl || "").trim(),
            images: images.map(u => u.startsWith("http") ? u : 'https://static.wixstatic.com/media/' + u)
          };
        });

        product = products.find(p => p.id.toLowerCase() === productId || slugify(p.name) === productId) || fallbackProduct;

        // Load sales config
        const SALES_CONFIG = await loadSalesConfig();
        renderProduct(product, SALES_CONFIG);

      } catch (err) {
        console.error("CSV parsing failed, using fallback product.", err);
        renderProduct(product, []);
      }
    },
    error: err => {
      console.error("CSV load failed, using fallback product.", err);
      renderProduct(fallbackProduct, []);
    }
  });

  // ---------------- RENDER PRODUCT ----------------
  async function renderProduct(product, salesConfig) {
    titleEl.innerText = product.name;
    titleEl.after(categoryEl);
    categoryEl.innerText = [product.category, product.color].filter(Boolean).join(" • ");
    artistEl.innerText = product.artist;
    descEl.innerHTML = product.description;

    const sale = getSaleForProduct(product, salesConfig);
    const basePrice = product.price;
    const originalPrice = product.oldPrice || basePrice;
    const finalPrice = sale ? applySale(basePrice, sale) : basePrice;
    const hasSale = sale || (originalPrice > finalPrice);

    // Price
    priceEl.innerText = "$" + finalPrice.toFixed(2);
    if (oldPriceEl) {
      if (hasSale) {
        oldPriceEl.innerText = "$" + originalPrice.toFixed(2);
        oldPriceEl.style.display = "inline";
        oldPriceEl.style.textDecoration = "line-through";
      } else oldPriceEl.style.display = "none";
    }

    // Discount bubble
    const discountEl = document.querySelector(".discount-bubble");
    if (discountEl) {
      if (sale) {
        discountEl.innerText = sale.discount_type === "percent"
          ? `${sale.discount_value}% OFF`
          : `$${sale.discount_value} OFF`;
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

    // Mobile swipe
    const galleryWrapper = document.querySelector(".main-image-wrapper");
    if (allImages.length > 1 && galleryWrapper) {
      let startX = 0;
      let endX = 0;
      galleryWrapper.addEventListener("touchstart", e => startX = e.touches[0].clientX);
      galleryWrapper.addEventListener("touchmove", e => endX = e.touches[0].clientX);
      galleryWrapper.addEventListener("touchend", () => {
        if (startX - endX > 50) switchImage((currentIndex + 1) % allImages.length);
        else if (endX - startX > 50) switchImage((currentIndex - 1 + allImages.length) % allImages.length);
      });
    }

    // Buy button
    buyBtn.onclick = () => {
      if (product.downloadLink) window.open(product.downloadLink, "_blank");
      else alert("Download not available");
    };

    // Accordion
    initAccordion();

    // Breadcrumbs
    const currentEl = document.querySelector(".breadcrumbs .current");
    if (currentEl) currentEl.textContent = product.name;
  }

  // ---------------- SALE COUNTDOWN ----------------
  const saleEl = document.getElementById("saleInfo");
  if (saleEl) {
    let seconds = 36000; // 10 hours
    function updateTimer() {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      saleEl.innerText = `Sale ends in ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
      if(seconds > 0){
        seconds--;
        setTimeout(updateTimer, 1000);
      }
    }
    updateTimer();
  }
}

initProductsPage().catch(err => console.error("Product page failed:", err));
