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
    str.toLowerCase().trim()
      .replace(/&/g,'and')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');

  // ---------------- IMAGES ----------------
  function updateImageStyle(index) {
    const wrapper = document.querySelector(".main-image-wrapper");
    if (!wrapper) return;
    wrapper.classList.remove("artwork", "lifestyle");
    wrapper.classList.add(index === 0 ? "artwork" : "lifestyle");
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll(".dot").forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex)
    );
  }

  function switchImage(index) {
    if (!allImages.length) return;
    currentIndex = index;
    updateImageStyle(index);

    const img = new Image();
    img.src = allImages[index];
    img.onload = () => {
      mainImage.src = img.src;
      thumbsEl?.querySelectorAll("img").forEach((t,i) =>
        t.classList.toggle("active", i === index)
      );
      updateDots();
    };
  }

  function createThumbnail(src, index) {
    const img = document.createElement("img");
    img.src = src;
    img.addEventListener("click", () => switchImage(index));
    return img;
  }

  // ---------------- ACCORDION (FIXED) ----------------
  function initAccordion() {
    document.querySelectorAll(".accordion-item").forEach(item => {
      const header = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");
      if (!header || !content) return;

      content.style.maxHeight = null;

      header.onclick = () => {
        const open = item.classList.contains("active");
        document.querySelectorAll(".accordion-item").forEach(i => {
          i.classList.remove("active");
          const c = i.querySelector(".accordion-content");
          if (c) c.style.maxHeight = null;
        });
        if (!open) {
          item.classList.add("active");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      };
    });
  }

  // ---------------- LOAD CSV (GRID STYLE) ----------------
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {

      const products = res.data.map(p => {
        const mainImages = (p.mainImageUrl || "")
          .split(";")
          .map(i => i.trim())
          .filter(Boolean);

        let lifestyle = (p.lifestyleUrl || "").trim();
        if (!lifestyle && mainImages.length > 1) lifestyle = mainImages[1];

        return {
          id: (p.productId || "").trim(),
          name: (p.name || "").trim(),
          price: parseFloat(p.newPrice) || 0,
          oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
          category: (p.category || "").trim(),
          color: (p.color || "").trim(),
          artist: (p.artistName || p.artist || "").trim(),
          description: p.bio || "",
          downloadLink: (p.downloadLinkUrl || "").trim(),
          images: [mainImages[0], lifestyle].concat(mainImages.slice(2)).filter(Boolean)
        };
      });

      const product = products.find(p =>
        p.id.toLowerCase() === productId ||
        slugify(p.name) === productId
      );

      if (!product) return;

      // ---------------- RENDER ----------------
      titleEl.textContent = product.name;
      titleEl.after(categoryEl);
      categoryEl.textContent = [product.category, product.color].filter(Boolean).join(" • ");
      artistEl.textContent = product.artist;
      descEl.innerHTML = product.description;

      priceEl.textContent = "$" + product.price.toFixed(2);
      if (oldPriceEl && product.oldPrice) {
        oldPriceEl.textContent = "$" + product.oldPrice.toFixed(2);
        oldPriceEl.style.textDecoration = "line-through";
      }

      // Breadcrumbs
      const bc = document.querySelector(".breadcrumbs .current");
      if (bc) bc.textContent = product.name;

      // Images
      allImages = product.images;
      if (allImages.length) {
        switchImage(0);
        thumbsEl.innerHTML = "";
        dotsEl.innerHTML = "";

        allImages.forEach((src,i) => {
          thumbsEl?.appendChild(createThumbnail(src,i));
          if (dotsEl) {
            const d = document.createElement("div");
            d.className = "dot";
            d.onclick = () => switchImage(i);
            dotsEl.appendChild(d);
          }
        });
        updateDots();
      }

      buyBtn.onclick = () => {
        if (product.downloadLink) window.open(product.downloadLink,"_blank");
      };

      initAccordion();
    }
  });
}

initProductsPage();
