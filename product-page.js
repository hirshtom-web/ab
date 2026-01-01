async function initProductsPage() {
  // ---------------- DOM ELEMENTS ----------------
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
  const galleryWrapper = document.querySelector(".main-image-wrapper");
  const artworkTypeSelect = document.getElementById("artworkType");
  const frameWrapper = document.getElementById("frameWrapper");
  const saleEl = document.getElementById("saleInfo");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id")?.trim().toLowerCase();

  if (!productId) {
    document.body.innerHTML = "<p>Invalid product</p>";
    return;
  }

  let allImages = [];
  let currentIndex = 0;

  const slugify = str =>
    str.toLowerCase().trim().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  // ---------------- IMAGE FUNCTIONS ----------------
  function updateImageStyle(index) {
    if (!galleryWrapper) return;
    galleryWrapper.classList.remove("artwork", "lifestyle");
    galleryWrapper.classList.add(index === 0 ? "artwork" : "lifestyle");
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

      // Thumbnails
      thumbsEl?.querySelectorAll("img").forEach((img, idx) =>
        img.classList.toggle("active", idx === currentIndex)
      );

      // Dots
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

  // ---------------- LOAD PRODUCT ----------------
  await loadAllProducts(); // make sure globalProducts.js loaded allProductsGlobal
  const product = window.allProductsGlobal.find(
    p => p.id.toLowerCase() === productId.toLowerCase()
  );

  if (!product) {
    document.body.innerHTML = "<p style='text-align:center;margin-top:50px;'>Product not available</p>";
    return;
  }

  // ---------------- DOM UPDATES ----------------
  titleEl.innerText = product.name;
  titleEl.after(categoryEl);
  categoryEl.innerText = [product.category, product.color].filter(Boolean).join(" • ");
  artistEl.innerText = product.artist;
  descEl.innerHTML = product.description;

  // --- Price with discount ---
  let finalPrice = product.price;
  if (product.discount) {
    if (product.discount.includes("%")) {
      finalPrice = product.price * (1 - parseFloat(product.discount) / 100);
    } else {
      finalPrice = product.price - parseFloat(product.discount);
    }
  }
  priceEl.innerText = "$" + finalPrice.toFixed(2);

  if (oldPriceEl) {
    if (product.discount) {
      oldPriceEl.innerText = "$" + product.price.toFixed(2);
      oldPriceEl.style.textDecoration = "line-through";
    } else oldPriceEl.style.display = "none";
  }

  // ---------------- IMAGES ----------------
  allImages = product.images;

  if (allImages.length) {
    switchImage(0);

    // Thumbnails
    if (thumbsEl) {
      thumbsEl.innerHTML = "";
      allImages.forEach((src, i) => thumbsEl.appendChild(createThumbnail(src, i)));
    }

    // Dots
    if (dotsEl) {
      dotsEl.innerHTML = "";
      allImages.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.addEventListener("click", () => switchImage(i));
        dotsEl.appendChild(dot);
      });
    }

    // Mobile swipe
    if (allImages.length > 1 && galleryWrapper) {
      let startX = 0;
      let endX = 0;
      galleryWrapper.addEventListener("touchstart", e => (startX = e.touches[0].clientX));
      galleryWrapper.addEventListener("touchmove", e => (endX = e.touches[0].clientX));
      galleryWrapper.addEventListener("touchend", () => {
        if (startX - endX > 50) switchImage((currentIndex + 1) % allImages.length);
        else if (endX - startX > 50) switchImage((currentIndex - 1 + allImages.length) % allImages.length);
      });
    }
  }

  // ---------------- BUY BUTTON ----------------
  buyBtn.onclick = () => {
    if (product.downloadLink) window.open(product.downloadLink, "_blank");
    else alert("Download not available");
  };

  // ---------------- ACCORDION ----------------
  initAccordion();

  // ---------------- SALE COUNTDOWN ----------------
  if (saleEl) {
    let seconds = 36000; // 10 hours
    function updateTimer() {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      saleEl.innerText = `Sale ends in ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
      if (seconds > 0) {
        seconds--;
        setTimeout(updateTimer, 1000);
      }
    }
    updateTimer();
  }

  // ---------------- TABS ----------------
  const tabs = document.querySelectorAll(".artwork-tabs .tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // ---------------- ARTWORK TYPE ----------------
  function updateArtworkOptions() {
    const value = artworkTypeSelect.value;
    frameWrapper.style.display = value.startsWith("print") ? "block" : "none";
  }
  updateArtworkOptions();
  artworkTypeSelect.addEventListener("change", updateArtworkOptions);

  // ---------------- BREADCRUMBS ----------------
  const currentEl = document.querySelector(".breadcrumbs .current");
  if (currentEl) currentEl.textContent = product.name;
}

// INIT
document.addEventListener("DOMContentLoaded", initProductsPage);
