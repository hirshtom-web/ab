function initProductsPage() {
  // ---------------- ELEMENTS ----------------
  const titleEl = document.querySelector(".pricing h2");
  const artistEl = document.querySelector(".artist");
  const priceEl = document.querySelector(".price");
  const oldPriceEl = document.querySelector(".old-price");
  const saleInfoEl = document.getElementById("saleInfo");
  const descEl = document.querySelector(".description");
  const mainImage = document.getElementById("mainImg");
  const thumbsEl = document.querySelector(".gallery-thumbs");
  const dotsEl = document.querySelector(".gallery-dots");
  const buyBtn = document.querySelector(".buy");

  const categoryEl = document.createElement("div");
  categoryEl.className = "product-category";

  // ---------------- CONFIG ----------------
  const csvUrl = "https://hirshtom-web.github.io/ab/product-catalog.csv";
  const productId = new URLSearchParams(location.search).get("id")?.trim();

  // ---------------- UTILITIES ----------------
  function slugify(str) {
    return str.toLowerCase().trim().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }

  let allImages = [];
  let currentIndex = 0;

  function switchImage(index) {
    if (!allImages.length) return;
    currentIndex = index;
    mainImage.style.opacity = 0;
    const newImg = new Image();
    newImg.src = allImages[currentIndex];
    newImg.onload = () => {
      mainImage.src = newImg.src;
      mainImage.style.opacity = 1;
      updateThumbs();
      updateDots();
    };
  }

  function createThumbnail(src) {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => switchImage(allImages.indexOf(src));
    return img;
  }

  function updateThumbs() {
    if(!thumbsEl) return;
    thumbsEl.querySelectorAll("img").forEach((img, idx) => {
      img.classList.toggle("active", idx === currentIndex);
    });
  }

  function updateDots() {
    if(!dotsEl) return;
    dotsEl.querySelectorAll("span.dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  function addInstantDelivery() {
    if(!descEl) return;
    descEl.querySelectorAll(".dynamic-description-text, .instant-delivery").forEach(el => el.remove());

    const dynamicDescriptions = [
      "This artwork complements modern living spaces with a light, airy, effortlessly stylish vibe.",
      "Add a touch of elegance and sophistication to your home with this piece.",
      "Perfect for creating a calm, serene atmosphere in any room.",
      "A bold statement piece that sparks conversation and creativity.",
      "Infuse your space with color, energy, and modern flair."
    ];

    const randomDesc = document.createElement("p");
    randomDesc.className = "dynamic-description-text";
    randomDesc.innerText = dynamicDescriptions[Math.floor(Math.random() * dynamicDescriptions.length)];
    descEl.prepend(randomDesc);

    const instantLink = document.createElement("a");
    instantLink.href = "#";
    instantLink.className = "ai-color-link instant-delivery";
    instantLink.innerHTML = `<span class="material-symbols-outlined">cloud_download</span> Instant Delivery`;
    descEl.appendChild(instantLink);
  }

  // ---------------- LOAD CSV & INIT PRODUCT ----------------
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(res) {
      const products = res.data.map(p => ({
        id: (p.productId || "").trim(),
        name: (p.name || "").trim(),
        price: parseFloat(p.price || 0),
        discount: parseFloat(p.discountValue || 0),
        discountMode: (p.discountMode || "").trim(),
        ribbon: (p.ribbon || "").trim(),
        category: (p.category || "").trim(),
        color: (p.color || "").trim(),
        artist: (p.artist || "").trim(),
        description: p.description || "",
        downloadLink: (p.downloadLink || "").trim(),
        visible: (p.visible || "true") === "true",
        images: (p.productImageUrl || "").split(";").map(u => u.trim()).filter(Boolean)
      }));

      const product = products.find(p =>
        (p.id === productId) || (slugify(p.name) === productId?.toLowerCase())
      );

      if(!product || !product.visible){
        document.body.innerHTML = "<p style='text-align:center;margin-top:50px;'>Product not available</p>";
        return;
      }

      // --- Update elements ---
      titleEl.innerText = product.name;
      titleEl.after(categoryEl);
      categoryEl.innerText = [product.category, product.color].filter(Boolean).join(" • ");
      artistEl.innerText = product.artist;
      descEl.innerHTML = product.description;
      addInstantDelivery();

      // --- Price ---
      let finalPrice = product.price;
      if(product.discount){
        if(product.discountMode === "PERCENT") finalPrice = product.price * (1 - product.discount/100);
        else if(product.discountMode === "FIXED") finalPrice = product.price - product.discount;
      }
      priceEl.childNodes[0].nodeValue = "$" + finalPrice.toFixed(2) + " ";
      if(oldPriceEl){
        if(product.discount){
          oldPriceEl.innerText = "$" + product.price.toFixed(2);
          oldPriceEl.style.textDecoration = "line-through";
          oldPriceEl.style.color = "#999";
        } else oldPriceEl.style.display = "none";
      }

      // --- Images ---
      allImages = product.images.length ? product.images : [mainImage.src];
      mainImage.src = allImages[0];

      if(thumbsEl){
        thumbsEl.innerHTML = "";
        allImages.forEach(src => thumbsEl.appendChild(createThumbnail(src)));
      }

      if(dotsEl){
        dotsEl.innerHTML = "";
        allImages.forEach((_, i) => {
          const dot = document.createElement("span");
          dot.className = "dot";
          if(i===0) dot.classList.add('active');
          dotsEl.appendChild(dot);
        });
      }

      // --- Buy button ---
      buyBtn.onclick = () => {
        if(product.downloadLink) window.open(product.downloadLink, "_blank");
        else alert("Download not available");
      };
    }
  });
}
