// footer.js
function initFooter() {

  /* ===============================
     MOBILE FOOTER ACCORDION
     - Mobile only
     - Smooth (CSS handles animation)
     - Only ONE section open at a time
  ================================ */
  const headers = document.querySelectorAll('.footer-column h4');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      if (window.innerWidth > 768) return;

      const column = header.parentElement;

      // Close all others
      document.querySelectorAll('.footer-column.active').forEach(openCol => {
        if (openCol !== column) openCol.classList.remove('active');
      });

      // Toggle clicked one
      column.classList.toggle('active');
    });
  });


  /* ===============================
     REGION POPUP
  ================================ */
  const popup = document.getElementById("regionPopup");
  const openBtn = document.getElementById("openRegion");
  const closeBtn = document.getElementById("closeRegion");

  if (openBtn && popup) {
    openBtn.addEventListener("click", () => popup.classList.add("active"));
  }

  if (closeBtn && popup) {
    closeBtn.addEventListener("click", () => popup.classList.remove("active"));
  }


  /* ===============================
     REGION LIST
  ================================ */
  const regions = [
    { country: "United States", code: "US", currency: "USD", flag: "🇺🇸" },
    { country: "Canada", code: "CA", currency: "CAD", flag: "🇨🇦" },
    { country: "United Kingdom", code: "GB", currency: "GBP", flag: "🇬🇧" },
    { country: "France", code: "FR", currency: "EUR", flag: "🇫🇷" },
    { country: "Spain", code: "ES", currency: "EUR", flag: "🇪🇸" },
    { country: "Italy", code: "IT", currency: "EUR", flag: "🇮🇹" },
    { country: "Germany", code: "DE", currency: "EUR", flag: "🇩🇪" },
    { country: "Belgium", code: "BE", currency: "EUR", flag: "🇧🇪" }
  ];

  const list = document.getElementById("regionList");

  if (list) {
    list.innerHTML = "";
    regions.forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${r.flag}</span> ${r.country} · ${r.currency}`;
      li.addEventListener("click", () => setRegion(r));
      list.appendChild(li);
    });
  }

  function setRegion(r) {
    const flag = document.getElementById("currentFlag");
    const region = document.getElementById("currentRegion");

    if (flag) flag.textContent = r.flag;
    if (region) region.textContent = `${r.country} · ${r.currency}`;

    popup?.classList.remove("active");
    localStorage.setItem("region", JSON.stringify(r));
  }


  /* ===============================
     LOAD SAVED / IP DEFAULT REGION
  ================================ */
  const saved = localStorage.getItem("region");

  if (saved) {
    setRegion(JSON.parse(saved));
  } else {
    fetch("https://ipwho.is/")
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error();
        const match = regions.find(r => r.code === data.country_code);
        setRegion(match || regions[0]);
      })
      .catch(() => setRegion(regions[0]));
  }


  /* ===============================
     PREVENT # JUMP
  ================================ */
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
  });

}


/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", initFooter);
