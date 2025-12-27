// footer.js
function initFooter() {
  // Accordion for mobile
  document.querySelectorAll('.footer-column h4').forEach(title => {
    title.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        title.parentElement.classList.toggle('active');
      }
    });
  });

  // Region popup
  const popup = document.getElementById("regionPopup");
  const openBtn = document.getElementById("openRegion");
  const closeBtn = document.getElementById("closeRegion");

  if (openBtn && popup) {
    openBtn.onclick = () => popup.classList.add("active");
  }
  if (closeBtn && popup) {
    closeBtn.onclick = () => popup.classList.remove("active");
  }

  // Region list
  const regions = [
    { country: "Austria", code: "AT", currency: "EUR", flag: "🇦🇹" },
    { country: "Belgium", code: "BE", currency: "EUR", flag: "🇧🇪" },
    { country: "Canada", code: "CA", currency: "CAD", flag: "🇨🇦" },
    { country: "France", code: "FR", currency: "EUR", flag: "🇫🇷" },
    { country: "Germany", code: "DE", currency: "EUR", flag: "🇩🇪" },
    { country: "Italy", code: "IT", currency: "EUR", flag: "🇮🇹" },
    { country: "Spain", code: "ES", currency: "EUR", flag: "🇪🇸" },
    { country: "United Kingdom", code: "GB", currency: "GBP", flag: "🇬🇧" },
    { country: "United States", code: "US", currency: "USD", flag: "🇺🇸" }
  ];

  const list = document.getElementById("regionList");
  if (list) {
    regions.forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${r.flag}</span> ${r.country} · ${r.currency}`;
      li.onclick = () => setRegion(r);
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

  // IP-based default
 const saved = localStorage.getItem("region");

if (saved) {
  setRegion(JSON.parse(saved));
} else {
  fetch("https://ipwho.is/")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("IP lookup failed");
      const match = regions.find(r => r.code === data.country_code);
      if (match) setRegion(match);
      else setRegion(regions[0]);
    })
    .catch(() => setRegion(regions[0]));
}
  // Prevent jump-to-top for placeholder links (AFTER footer exists)
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') {
      link.addEventListener('click', e => e.preventDefault());
    }
  });
}
