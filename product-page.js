<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

document.addEventListener("DOMContentLoaded", () => {

  // ---------------- ELEMENTS ----------------
  const titleEl = document.querySelector(".pricing h2") || document.getElementById("title");
  const artistEl = document.querySelector(".artist");
  const priceEl = document.querySelector(".price") || document.getElementById("price");
  const oldPriceEl = document.querySelector(".old-price") || document.getElementById("oldPrice");
  const saleInfoEl = document.querySelector(".sale-info") || document.getElementById("saleInfo");
  const descEl = document.querySelector(".description") || document.getElementById("description");
  const mainImage = document.getElementById("mainImg") || document.getElementById("mainImage");
  const thumbsEl = document.querySelector(".gallery-thumbs") || document.getElementById("thumbnails");
  const dotsEl = document.querySelector(".gallery-dots");
  const buyBtn = document.querySelector(".buy") || document.getElementById("addToCart");
  const relatedGrid = document.getElementById("relatedGrid");

  // Category element under title
  const categoryEl = document.createElement("div");
  categoryEl.className = "product-category";

  // ---------------- CONFIG ----------------
  const csvUrl = "https://hirshtom-web.github.io/ab/product-catalog.csv";
  const productId = new URLSearchParams(location.search).get("id")?.trim() || new URLSearchParams(location.search).get("product")?.trim();

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

  // Dynamic descriptions
  const dynamicDescriptions = [
    "This artwork complements modern living spaces with a light, airy, effortlessly stylish vibe.",
    "Add a touch of elegance and sophistication to your home with this piece.",
    "Perfect for creating a calm, serene atmosphere in any room.",
    "A bold statement piece that sparks conversation and creativity.",
    "Infuse your space with color, energy, and modern flair."
  ];

  function addInstantDelivery() {
    if(!descEl) return;
    descEl.querySelectorAll(".dynamic-description-text, .instant-delivery").forEach(el => el.remove());

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
        id: (p.productId || p.ProductId || "").trim(),
        name: (p.name || p.Name || "").trim(),
        price: parseFloat(p.price || p.Price || 0),
        discount: parseFloat(p.discountValue || 0),
        discountMode: (p.discountMode || "").trim(),
        ribbon: (p.ribbon || p.Ribbon || "").trim(),
        category: (p.category || p.Category || "").trim(),
        color: (p.color || p.Color || "").trim(),
        artist: (p.artist || "").trim(),
        description: p.description || "",
        downloadLink: (p.downloadLink || "").trim(),
        visible: (p.visible || "true") === "true",
        images: (p.productImageUrl || p.ProductImageUrl || "").split(";").map(u => u.trim()).filter(Boolean)
      }));

      console.log("All products loaded:", products.map(p=>p.id)); // DEBUG

      const product = products.find(p =>
        (p.id === productId) || (slugify(p.name) === productId?.toLowerCase())
      );

      if(!product || !product.visible){
        document.body.innerHTML = "<p style='text-align:center;margin-top:50px;'>Product not available</p>";
        return;
      }

      // --- TITLE & CATEGORY ---
      titleEl.innerText = product.name;
      titleEl.after(categoryEl);
      categoryEl.innerText = [product.category, product.color].filter(Boolean).join(" • ");

      // --- ARTIST ---
      if(artistEl) artistEl.innerText = product.artist;

      // --- DESCRIPTION ---
      if(descEl) descEl.innerHTML = product.description;
      addInstantDelivery();

       // ---------------- PRICE, OLD PRICE & SALE TIMER ----------------
let finalPrice = product.price;
if(product.discount){
  if(product.discountMode === "PERCENT") finalPrice = product.price * (1 - product.discount/100);
  else if(product.discountMode === "FIXED") finalPrice = product.price - product.discount;
}

// Set current price
if(priceEl) {
  priceEl.childNodes[0].nodeValue = "$" + finalPrice.toFixed(2) + " "; // update text node before old price
}

// Set old price
if(oldPriceEl){
  if(product.discount){
    oldPriceEl.innerText = "$" + product.price.toFixed(2);
    oldPriceEl.style.textDecoration = "line-through";
    oldPriceEl.style.color = "#999";
    oldPriceEl.style.display = "inline";
    oldPriceEl.style.marginLeft = "8px";
    oldPriceEl.style.marginRight = "8px";
  } else {
    oldPriceEl.innerText = "";
    oldPriceEl.style.display = "none";
  }
}

// Set sale timer
function startCountdown(duration) {
  if(!saleInfoEl) return;
  saleInfoEl.style.display = "inline";
  saleInfoEl.style.fontWeight = "bold";
  saleInfoEl.style.color = "#d9534f";
  let timer = duration;
  const interval = setInterval(() => {
    let hours = Math.floor(timer / 3600);
    let minutes = Math.floor((timer % 3600) / 60);
    let seconds = timer % 60;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    saleInfoEl.textContent = `Sale ends in ${hours}:${minutes}:${seconds}`;
    if(timer > 0) timer--; else clearInterval(interval);
  }, 1000);
}
startCountdown(10*3600 + 33*60 + 11);


      // --- IMAGES & THUMBNAILS ---
      allImages = product.images.map(src => src.startsWith("http") ? src : "https://static.wixstatic.com/media/" + src);
      if(allImages.length) mainImage.src = allImages[0];

      if(thumbsEl){
        thumbsEl.innerHTML = "";
        allImages.forEach(src => thumbsEl.appendChild(createThumbnail(src)));
      }

      // --- MOBILE DOTS ---
      if(dotsEl){
        dotsEl.innerHTML = "";
        allImages.forEach((_, i) => {
          const dot = document.createElement("span");
          dot.className = "dot";
          if(i===0) dot.classList.add("active");
          dotsEl.appendChild(dot);
        });
      }

      // --- RIBBON ---
      const galleryMain = mainImage.parentElement;
      galleryMain.querySelectorAll(".top-label").forEach(e => e.remove());
      if(product.ribbon){
        const rEl = document.createElement("div");
        rEl.className = "top-label";
        rEl.innerText = product.ribbon;
        galleryMain.appendChild(rEl);
      }

      // --- BUY BUTTON ---
      if(buyBtn) buyBtn.onclick = () => {
        if(product.downloadLink) window.open(product.downloadLink, "_blank");
        else alert("Download not available");
      };

      // --- RELATED PRODUCTS (same category) ---
      if(relatedGrid){
        const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0,10);
        relatedGrid.innerHTML = "";
        related.forEach(r => {
          const card = document.createElement("div");
          card.className = "related-card";
          const img = document.createElement("img");
          img.src = r.images[0] ? (r.images[0].startsWith("http") ? r.images[0] : "https://static.wixstatic.com/media/" + r.images[0]) : "https://via.placeholder.com/300";
          const h4 = document.createElement("h4");
          h4.innerText = r.name;
          card.appendChild(img);
          card.appendChild(h4);
          card.onclick = () => location.href = `product-page.html?id=${r.id}`;
          relatedGrid.appendChild(card);
        });
      }

      // --- SALE COUNTDOWN ---
      function startCountdown(duration) {
        if(!saleInfoEl) return;
        saleInfoEl.style.display = "block"; // make sure visible
        let timer = duration;
        const interval = setInterval(() => {
          let hours = Math.floor(timer / 3600);
          let minutes = Math.floor((timer % 3600) / 60);
          let seconds = timer % 60;
          hours = hours<10?"0"+hours:hours;
          minutes = minutes<10?"0"+minutes:minutes;
          seconds = seconds<10?"0"+seconds:seconds;
          saleInfoEl.textContent = `Sale ends in ${hours}:${minutes}:${seconds}`;
          if(timer>0) timer--; else clearInterval(interval);
        }, 1000);
      }
      startCountdown(10*3600 + 33*60 + 11);

      // --- MOBILE SWIPE ---
      let startX = 0;
      mainImage.addEventListener("touchstart", e => startX = e.touches[0].clientX);
      mainImage.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        if(Math.abs(endX - startX) < 50) return;
        if(endX - startX > 50) switchImage((currentIndex - 1 + allImages.length) % allImages.length);
        else switchImage((currentIndex + 1) % allImages.length);
      });

      // --- ACCORDION ---
      document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.accordion-item');
          const content = btn.nextElementSibling;
          if(!item || !content) return;
          if(item.classList.contains('active')){
            content.style.maxHeight = null;
            item.classList.remove('active');
          } else {
            document.querySelectorAll('.accordion-item').forEach(i=>{
              i.classList.remove('active');
              const c=i.querySelector('.accordion-content');
              if(c) c.style.maxHeight = null;
            });
            content.style.maxHeight = content.scrollHeight + 'px';
            item.classList.add('active');
          }
        });
      });

      // --- OPTIONAL CSS ---
      const style = document.createElement('style');
      style.innerHTML = `
.dynamic-description-text {
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
  line-height: 1.4;
}
.instant-delivery {
  display: inline-flex;
  align-items: center;
  font-weight: bold;
  color: #d9534f;
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 13px;
}
.instant-delivery .material-icons-outlined {
  font-size: 16px;
  margin-right: 4px;
}
.product-category {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
  margin-bottom: 10px;
}
`;
      document.head.appendChild(style);

    }
  });

});
