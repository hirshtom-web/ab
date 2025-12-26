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
  document.getElementById("openRegion").onclick = () => popup.classList.add("active");
  document.getElementById("closeRegion").onclick = () => popup.classList.remove("active");

  // Region list
  const regions = [
    { country: "Andorra", code: "AD", currency: "EUR", flag: "🇦🇩" },
    { country: "Austria", code: "AT", currency: "EUR", flag: "🇦🇹" },
    { country: "Belgium", code: "BE", currency: "EUR", flag: "🇧🇪" },
    { country: "Canada", code: "CA", currency: "CAD", flag: "🇨🇦" },
    { country: "France", code: "FR", currency: "EUR", flag: "🇫🇷" },
    { country: "Germany", code: "DE", currency: "EUR", flag: "🇩🇪" },
    { country: "Italy", code: "IT", currency: "EUR", flag: "🇮🇹" },
    { country: "Spain", code: "ES", currency: "EUR", flag: "🇪🇸" },
    { country: "Switzerland", code: "CH", currency: "CHF", flag: "🇨🇭" },
    { country: "United Kingdom", code: "GB", currency: "GBP", flag: "🇬🇧" },
    { country: "United States", code: "US", currency: "USD", flag: "🇺🇸" }
  ];

  const list = document.getElementById("regionList");
  regions.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${r.flag}</span> ${r.country} · ${r.currency}`;
    li.onclick = () => setRegion(r);
    list.appendChild(li);
  });

  function setRegion(r) {
    document.getElementById("currentFlag").textContent = r.flag;
    document.getElementById("currentRegion").textContent = `${r.country} · ${r.currency}`;
    popup.classList.remove("active");
    localStorage.setItem("region", JSON.stringify(r));
  }

  // IP-based default
  const saved = localStorage.getItem("region");
  if (saved) {
    setRegion(JSON.parse(saved));
  } else {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        const match = regions.find(r => r.code === data.country_code);
        if (match) setRegion(match);
      })
      .catch(() => setRegion(regions[0]));
  }
}
