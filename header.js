function initHeader() {

  // ---------- CART ----------
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

  if (closePopup && popup) {
    closePopup.addEventListener("click", (e) => {
      e.stopPropagation();
      popup.style.display = "none";
    });
  }

  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.style.display = "none";
    });
  }

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

  // ---------- MOBILE MEGA MENU (TAP TO OPEN) ----------
  document.addEventListener("click", function (e) {
    const link = e.target.closest(".menu > a");
    if (!link) return;

    // only intercept on mobile
    if (window.innerWidth > 768) return;

    e.preventDefault();

    const menu = link.parentElement;
    const isOpen = menu.classList.contains("active");

    // close all
    document.querySelectorAll(".menu.active")
      .forEach(m => m.classList.remove("active"));

    // toggle current
    if (!isOpen) menu.classList.add("active");
  });

}
