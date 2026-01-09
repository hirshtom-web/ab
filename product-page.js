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

  function updateImageStyle(index) {
  const wrapper = document.querySelector(".main-image-wrapper");
  if (!wrapper) return;

  wrapper.classList.remove("artwork", "lifestyle");
  wrapper.classList.add(index === 0 ? "artwork" : "lifestyle");
}

function switchImage(index) {
  updateImageStyle(index); // ✅ ADD THIS LINE

    if(!allImages.length) return;
    currentIndex = index;
    mainImage.style.opacity = 0;
    const img = new Image();
    img.src = allImages[currentIndex];
    img.onload = () => {
      mainImage.src = img.src;
      mainImage.style.opacity = 1;
      // Update thumbs & dots
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

  function initAccordion() {
    document.querySelectorAll(".accordion-header").forEach(btn => {
      const item = btn.closest(".accordion-item");
      const content = btn.nextElementSibling;
      btn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        document.querySelectorAll(".accordion-item").forEach(i => {
          i.classList.remove("active");
          const c = i.querySelector(".accordion-content");
          if(c) c.style.maxHeight = null;
        });
        if(!isActive){
          item.classList.add("active");
          if(content) content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
  }

  // ---------------- LOAD CSV ----------------
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(res) {
      const products = res.data.map(p => {
        // Handle images
        const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
        let lifestyle = (p.lifestyleUrl || "").trim();
        if(!lifestyle && mainImages.length > 1) lifestyle = mainImages[1]; // fallback
        const images = [mainImages[0] || "", lifestyle].concat(mainImages.slice(2));

        return {
          id: (p.productId || "").trim(),
          name: (p.name || "").trim(),
          type: (p.type || "").toLowerCase(),
          price: p.newPrice ? parseFloat(p.newPrice) : 0,
          oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
          discount: p.discount || null,
          category: (p.category || "").trim(),
          color: (p.color || "").trim(),
          artist: (p.artistName || p.artist || "").trim(),
          description: p.bio || "",
          downloadLink: (p.downloadLinkUrl || "").trim(),
          visible: true, // all products visible
          images: images.map(u => u.startsWith("http") ? u : 'https://static.wixstatic.com/media/' + u)
        };
      });

      const product = products.find(p => p.id.toLowerCase() === productId || slugify(p.name) === productId);

      if(!product){
        document.body.innerHTML = "<p style='text-align:center;margin-top:50px;'>Product not available</p>";
        return;
      }

      // ---------------- DOM Updates ----------------
      titleEl.innerText = product.name;
      titleEl.after(categoryEl);
      categoryEl.innerText = [product.category, product.color].filter(Boolean).join(" • ");
      artistEl.innerText = product.artist;
      descEl.innerHTML = product.description;

      // --- Price ---
const hasSale =
  product.oldPrice &&
  product.price &&
  product.oldPrice > product.price;

priceEl.innerText = "$" + product.price.toFixed(2);

if (oldPriceEl) {
  if (hasSale) {
    oldPriceEl.innerText = "$" + product.oldPrice.toFixed(2);
    oldPriceEl.style.display = "inline";
    oldPriceEl.style.textDecoration = "line-through";
  } else {
    oldPriceEl.style.display = "none";
  }
}

     // --- Images ---
allImages = product.images;

if(allImages.length){

  // --- Set initial image ---
  switchImage(0);

  // --- Thumbnails (desktop only) ---
  if(thumbsEl){
    thumbsEl.innerHTML = "";
    allImages.forEach((src, i) => thumbsEl.appendChild(createThumbnail(src, i)));
  }

  // --- Dots ---
  if(dotsEl){
    dotsEl.innerHTML = "";
    allImages.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.addEventListener("click", () => switchImage(i));
      dotsEl.appendChild(dot);
    });
  }

  function updateDots(){
    if(!dotsEl) return;
    const dots = Array.from(dotsEl.querySelectorAll(".dot"));
    dots.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
  }

  // Update dots inside switchImage
  const originalSwitchImage = switchImage;
  switchImage = function(index){
    originalSwitchImage(index);
    updateDots();
  };

  // --- Mobile swipe ---
  const galleryWrapper = document.querySelector(".main-image-wrapper");
  if(allImages.length > 1 && galleryWrapper){
    let startX = 0;
    let endX = 0;

    galleryWrapper.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; });
    galleryWrapper.addEventListener("touchmove", (e) => { endX = e.touches[0].clientX; });
    galleryWrapper.addEventListener("touchend", () => {
      if(startX - endX > 50) switchImage((currentIndex + 1) % allImages.length);
      else if(endX - startX > 50) switchImage((currentIndex - 1 + allImages.length) % allImages.length);
    });
  }

  // --- Initialize dots on load ---
  updateDots();
}

      // Buy button
      buyBtn.onclick = () => {
        if(product.downloadLink) window.open(product.downloadLink,"_blank");
        else alert("Download not available");
      };

      // Accordion
      initAccordion();
    },
    error: err => console.error("CSV load failed:", err)
  });
}

// Sale countdown
const saleEl = document.getElementById("saleInfo");
if(saleEl){
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

// Tabs
document.addEventListener("DOMContentLoaded", () => {
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
});

// Artwork type select
const artworkTypeSelect = document.getElementById("artworkType");
const frameWrapper = document.getElementById("frameWrapper");

function updateArtworkOptions() {
  const value = artworkTypeSelect.value;
  frameWrapper.style.display = value.startsWith("print") ? "block" : "none";
}

updateArtworkOptions();
artworkTypeSelect.addEventListener("change", updateArtworkOptions);

// Get the current product ID from URL
document.addEventListener("DOMContentLoaded", () => {
  const currentProductId = new URLSearchParams(window.location.search).get("id");

  fetch("https://hirshtom-web.github.io/ab/product-catalog.csv")
    .then(res => res.text())
    .then(csvText => {
      const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
      const currentProduct = data.find(p => p.productId === currentProductId);

      if (currentProduct) {
        const currentEl = document.querySelector(".breadcrumbs .current");
        if (currentEl) currentEl.textContent = currentProduct.name;
      }
    })
    .catch(err => console.error("Failed to load product for breadcrumbs:", err));
});
