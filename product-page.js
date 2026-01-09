// ================= SINGLE PRODUCT PAGE =================
async function initProductsPage() {

  // ---------------- DOM ----------------
  const titleEl = document.querySelector(".pricing h2");
  const artistEl = document.querySelector(".artist");
  const priceEl = document.querySelector(".price");
  const oldPriceEl = document.querySelector(".old-price");
  const descEl = document.querySelector(".description");
  const mainImage = document.getElementById("mainImg");
  const thumbsEl = document.querySelector(".gallery-thumbs");
  const dotsEl = document.querySelector(".gallery-dots");
  const buyBtn = document.querySelector(".buy");
  const saleEl = document.getElementById("saleInfo");
  const breadcrumbEl = document.querySelector(".breadcrumbs .current");

  const categoryEl = document.createElement("div");
  categoryEl.className = "product-category";

  const csvUrl = "https://hirshtom-web.github.io/ab/product-catalog.csv";
  const productId = new URLSearchParams(location.search).get("id")?.trim().toLowerCase();

  let allImages = [];
  let currentIndex = 0;

  const slugify = str =>
    str.toLowerCase().trim()
      .replace(/&/g,'and')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');

  // ---------------- IMAGE ----------------
  function updateImageStyle(index) {
    const wrapper = document.querySelector(".main-image-wrapper");
    if (!wrapper) return;
    wrapper.classList.toggle("artwork", index === 0);
    wrapper.classList.toggle("lifestyle", index !== 0);
  }

  function switchImage(index) {
    if (!allImages.length) return;
    currentIndex = index;
    updateImageStyle(index);

    const img = new Image();
    img.src = allImages[index];
    img.onload = () => {
      mainImage.src = img.src;
      thumbsEl?.querySelectorAll("img")
        .forEach((el,i)=>el.classList.toggle("active", i===index));
      dotsEl?.querySelectorAll(".dot")
        .forEach((el,i)=>el.classList.toggle("active", i===index));
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
      btn.onclick = () => {
        const item = btn.closest(".accordion-item");
        const content = btn.nextElementSibling;

        document.querySelectorAll(".accordion-item").forEach(i => {
          if (i !== item) {
            i.classList.remove("active");
            i.querySelector(".accordion-content")?.style.removeProperty("max-height");
          }
        });

        item.classList.toggle("active");
        if (item.classList.contains("active")) {
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          content.style.removeProperty("max-height");
        }
      };
    });
  }

  // ---------------- LOAD SALES (same as grid) ----------------
  const sales = await loadSalesConfig();

  // ---------------- LOAD PRODUCTS (SAME AS GRID) ----------------
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {

      const products = res.data.map(p => {
        const mainImages = (p.mainImageUrl || "")
          .split(";").map(i => i.trim()).filter(Boolean);

        let lifestyle = (p.lifestyleUrl || "").trim();
        if (!lifestyle && mainImages.length > 1) lifestyle = mainImages[1];

        return {
          id: (p.productId || "").trim(),
          name: (p.name || "").trim(),
          category: (p.category || "").trim(),
          color: (p.color || "").trim(),
          artist: (p.artistName || p.artist || "").trim(),
          description: p.bio || "",
          downloadLink: (p.downloadLinkUrl || "").trim(),

          // SAME PRICE LOGIC AS GRID
          basePrice: p.originalPrice ? parseFloat(p.originalPrice) : 0,

          images: [mainImages[0] || "", lifestyle]
            .concat(mainImages.slice(2))
            .map(u => u.startsWith("http")
              ? u
              : "https://static.wixstatic.com/media/" + u)
        };
      });

      const product = products.find(p =>
        p.id.toLowerCase() === productId ||
        slugify(p.name) === productId
      );

      if (!product) return;

      // ---------------- SALE (SAME AS GRID) ----------------
      const productRef = { id: product.id, category: product.category };
      const sale = getSaleForProduct(productRef, sales);
      const finalPrice = sale
        ? applySale(product.basePrice, sale)
        : product.basePrice;

      // ---------------- DOM ----------------
      titleEl.textContent = product.name;
      breadcrumbEl && (breadcrumbEl.textContent = product.name);
      titleEl.after(categoryEl);
      categoryEl.textContent = [product.category, product.color].filter(Boolean).join(" • ");
      artistEl.textContent = product.artist;
      descEl.innerHTML = product.description;

      priceEl.textContent = "$" + finalPrice.toFixed(2);

      if (sale) {
        oldPriceEl.textContent = "$" + product.basePrice.toFixed(2);
        oldPriceEl.style.display = "inline";
      } else {
        oldPriceEl.style.display = "none";
      }

      // ---------------- SALE TIMER ----------------
      if (sale && saleEl && sale.end_date) {
        const end = new Date(sale.end_date).getTime();
        const tick = () => {
          const diff = Math.max(0, end - Date.now());
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          saleEl.textContent =
            `Sale ends in ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
          if (diff > 0) requestAnimationFrame(tick);
        };
        tick();
      } else if (saleEl) {
        saleEl.style.display = "none";
      }

      // ---------------- IMAGES ----------------
      allImages = product.images;
      if (allImages.length) switchImage(0);

      thumbsEl && (
        thumbsEl.innerHTML = "",
        allImages.forEach((src,i)=>thumbsEl.appendChild(createThumbnail(src,i)))
      );

      dotsEl && (
        dotsEl.innerHTML = "",
        allImages.forEach((_,i)=>{
          const d = document.createElement("div");
          d.className="dot";
          d.onclick=()=>switchImage(i);
          dotsEl.appendChild(d);
        })
      );

      // ---------------- BUY ----------------
      buyBtn.onclick = () => {
        product.downloadLink
          ? window.open(product.downloadLink,"_blank")
          : alert("Download not available");
      };

      initAccordion();
    }
  });
}

initProductsPage();
