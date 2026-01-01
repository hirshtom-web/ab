function initHeader() {

  
  document.getElementById("cartIcon")?.addEventListener("click", () => {
  window.location.href = "cart.html";
});


  // ---------- MOBILE HAMBURGER ----------
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.style.display = "flex";
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener("click", () => {
      mobileMenu.style.display = "none";
    });
  }

  // ---------- MOBILE SEARCH ----------
  const mobileSearchIcon = document.getElementById("mobileSearch");
  const mobileSearchContainer = document.querySelector(".mobile-search-container");
  const mobileSearchInput = document.getElementById("mobileSearchBar");

  if (mobileSearchIcon) {
    mobileSearchIcon.addEventListener("click", () => {
      const open = mobileSearchContainer.style.display === "block";
      mobileSearchContainer.style.display = open ? "none" : "block";
      if (!open) mobileSearchInput.focus();
    });
  }

  // ---------- DESKTOP SEARCH ----------
  const desktopSearchIcon = document.getElementById("searchIcon");
  const desktopSearchBar = document.getElementById("searchBar");

  if (desktopSearchIcon) {
    desktopSearchIcon.addEventListener("click", () => {
      const open = desktopSearchBar.style.display === "block";
      desktopSearchBar.style.display = open ? "none" : "block";
      if (!open) desktopSearchBar.focus();
    });
  }
 function initGlobalSearch() {
  const desktopInput = document.getElementById("searchBar");
  const mobileInput = document.getElementById("mobileSearchBar");

 function doSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return;

  // ALWAYS load products first (even on home page)
  loadAllProducts().then(() => {
    const results = window.allProductsGlobal.filter(p =>
      p.searchText.includes(q)
    );

    sessionStorage.setItem("searchResults", JSON.stringify(results));
    window.location.href =
      "search-results.html?q=" + encodeURIComponent(q);
  });
}


  [desktopInput, mobileInput].forEach(input => {
    if (!input) return;
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        doSearch(e.target.value);
      }
    });
  });
}

// ---------- GIFT POPUP ----------
const giftIcon = document.getElementById("giftIcon");
const mobileGift = document.getElementById("mobileGift");
const popup = document.getElementById("itemPopup");
const closePopup = document.getElementById("closePopup");

function openPopup() {
  if (!popup) return;
  popup.style.display = "flex";
}

if (giftIcon) giftIcon.addEventListener("click", openPopup);
if (mobileGift) mobileGift.addEventListener("click", openPopup);

// Close with X
if (closePopup && popup) {
  closePopup.addEventListener("click", (e) => {
    e.stopPropagation(); // 👈 CRITICAL
    popup.style.display = "none";
  });
}

// Close when clicking background
if (popup) {
  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
  });
}

// Close with ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popup?.style.display === "flex") {
    popup.style.display = "none";
  }
});

  // ---------- MOBILE NAV LINKS ----------
  const mobileCart = document.getElementById("mobileCart");
  const mobileHelp = document.getElementById("mobileHelp");

  if (mobileCart) mobileCart.onclick = () => location.href = "cart.html";
  if (mobileHelp) mobileHelp.onclick = () => location.href = "help.html";
}


// Select all mega menus
  const megaMenus = document.querySelectorAll('.mega-menu');

  // Listen for scroll
  window.addEventListener('scroll', () => {
    megaMenus.forEach(menu => {
      menu.style.display = 'none';
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(5px)'; // optional: reset transform
    });
  });

  // Optional: also close when mouse leaves nav-item
  const navItems = document.querySelectorAll('.has-mega');
  navItems.forEach(item => {
    item.addEventListener('mouseleave', () => {
      const menu = item.querySelector('.mega-menu');
      if (menu) {
        menu.style.display = 'none';
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(5px)';
      }
    });
  });

window.addEventListener('scroll', () => {
  megaMenus.forEach(menu => {
    menu.classList.add('hide');
  });
});
