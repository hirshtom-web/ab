document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  hamburger.addEventListener("click", () => {
    // Toggle mobile menu visibility
    if (mobileMenu.style.display === "none") {
      mobileMenu.style.display = "block";
    } else {
      mobileMenu.style.display = "none";
    }
  });

  document.getElementById("mobileSearch").addEventListener("click", () => {
    alert("Search clicked"); // replace with your search function
  });

  document.getElementById("mobileGift").addEventListener("click", () => {
    window.location.href = "gift.html"; // replace with your gift page
  });

  document.getElementById("mobileHelp").addEventListener("click", () => {
    window.location.href = "help.html"; // replace with your help page
  });

  document.getElementById("mobileCart").addEventListener("click", () => {
    window.location.href = "cart.html"; // replace with your cart page
  });
});

// ---------- GIFT CARD POPUP ----------
document.getElementById('giftIcon').addEventListener('click', function() {
  openPopup(
    'https://static.wixstatic.com/media/1799ca_b4155d02cccc4736a27be7dfce5fd416~mv2.png',
    'Christmas Gift Card',
    'Send this beautiful Christmas gift card to someone special and make their holidays joyful!',
    '$25'
  );
});
document.getElementById('mobileGift').addEventListener('click', function() {
  openPopup(
    'https://static.wixstatic.com/media/1799ca_b4155d02cccc4736a27be7dfce5fd416~mv2.png',
    'Christmas Gift Card',
    'Send this beautiful Christmas gift card to someone special and make their holidays joyful!',
    '$25'
  );
});

function openPopup(imgSrc, title, description, price) {
  const popup = document.getElementById('itemPopup');
  popup.querySelector('.popup-image img').src = imgSrc;
  popup.querySelector('.popup-text h2').textContent = title;
  popup.querySelector('.popup-text p:nth-of-type(1)').textContent = description;
  popup.querySelector('.popup-text p.price').innerHTML = `<strong>Price: ${price}</strong>`;
  popup.style.display = 'flex';
}

function closePopup() {
  document.getElementById('itemPopup').style.display = 'none';
}

// ---------- DESKTOP SEARCH ----------
const desktopSearchIcon = document.getElementById('searchIcon');
const desktopSearchBar  = document.getElementById('searchBar');

desktopSearchIcon.addEventListener('click', () => {
  const isOpen = desktopSearchBar.style.display === 'block';
  desktopSearchBar.style.display = isOpen ? 'none' : 'block';

  if (!isOpen) {
    desktopSearchBar.focus();
  }
});

// ---------- MOBILE SEARCH ----------
const mobileSearchIcon = document.getElementById('mobileSearch');
const mobileSearchContainer = document.querySelector('.mobile-search-container');
const mobileSearchInput = document.getElementById('mobileSearchBar');

mobileSearchIcon.addEventListener('click', () => {
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
  
