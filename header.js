function initHeader() {

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

  // ---------- GIFT POPUP ----------
  const giftIcon = document.getElementById("giftIcon");
  const mobileGift = document.getElementById("mobileGift");

  function openPopup() {
    const popup = document.getElementById("itemPopup");
    popup.style.display = "flex";
  }

  if (giftIcon) giftIcon.addEventListener("click", openPopup);
  if (mobileGift) mobileGift.addEventListener("click", openPopup);

  // ---------- MOBILE NAV LINKS ----------
  const mobileCart = document.getElementById("mobileCart");
  const mobileHelp = document.getElementById("mobileHelp");

  if (mobileCart) mobileCart.onclick = () => location.href = "cart.html";
  if (mobileHelp) mobileHelp.onclick = () => location.href = "help.html";
}
