
  const isOpen = mobileSearchContainer.style.display === 'block';
  mobileSearchContainer.style.display = isOpen ? 'none' : 'block';

  if (!isOpen) {
    mobileSearchInput.focus();
  }
});

// ---------- MOBILE HAMBURGER MENU ----------
document.getElementById('hamburger').addEventListener('click', function() {
  if (window.innerWidth > 700) return;
  document.getElementById('mobileMenu').style.display = 'flex';
});

document.getElementById('closeMenu').addEventListener('click', function() {
  document.getElementById('mobileMenu').style.display = 'none';
});

// Close mobile menu if clicking outside links
document.getElementById('mobileMenu').addEventListener('click', function(e) {
  if (e.target === this) this.style.display = 'none';
});
</script>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script>
const slider = document.getElementById("bestsellerSlider");

Papa.parse("https://hirshtom-web.github.io/ab/new_product_list.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: results => {
    const products = results.data.slice(0, 12); // pick first 12
    products.forEach(p => {
      const item = document.createElement("div");
      item.className = "slider-item";

      const img = document.createElement("img");
      const imgUrl = (p.productImageUrl||"").split(";")[0]?.trim() || "";
      img.src = imgUrl.includes("http") ? imgUrl : "https://static.wixstatic.com/media/" + imgUrl;
      item.appendChild(img);

      const title = document.createElement("h3");
      title.innerText = p.name || "Unnamed Product";
      item.appendChild(title);

      const price = document.createElement("div");
      price.className = "price";
      price.innerText = p.price && p.price.trim()!=="" ? "$"+p.price : "$1";
      item.appendChild(price);

      slider.appendChild(item);
    });
  }
});

