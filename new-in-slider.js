// --- NEW IN SLIDER ---
function initNewInSlider() {
  const sliderContainer = document.getElementById("newInSlider");
  if (!sliderContainer) return;

  fetch("https://hirshtom-web.github.io/ab/product-catalog.csv")
    .then(res => res.text())
    .then(csvText => {
      const data = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      }).data;

      // 1️⃣ Take last 10 products (newest at top)
      const newProducts = data.slice(-10).reverse();

      // 2️⃣ Render slider items
      newProducts.forEach(p => {
        const mainImages = (p.mainImageUrl || "")
          .split(";")
          .map(i => i.trim())
          .filter(Boolean);

        const imgSrc = mainImages[0]
          ? (mainImages[0].includes("http")
              ? mainImages[0]
              : "https://static.wixstatic.com/media/" + mainImages[0])
          : "";

        const item = document.createElement("div");
        item.className = "new-in-slider-item";

        item.innerHTML = `
          <div class="img-wrapper">
            <img src="${imgSrc}" alt="${p.name}">
          </div>
          <div class="new-in-slider-info">
            <h3>${p.name}</h3>
            <span class="price">$${parseFloat(p.newPrice || 0).toFixed(2)}</span>
          </div>
        `;

        // 3️⃣ Link to product page by ID
        item.addEventListener("click", () => {
          window.location.href =
            `product-page.html?id=${p.productId}`;
        });

        sliderContainer.appendChild(item);
      });
    })
    .catch(err => console.error("New In slider failed:", err));
}

// Call it
initNewInSlider();
