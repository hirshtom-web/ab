function initRelatedSlider() {
  const relatedProductIds = [
    "9182888",
    "9182889",
    "9182890",
    "9182891",
    "9182892",
  ];

  const sliderContainer = document.getElementById("relatedProductsSlider");
  if (!sliderContainer) return; // Exit if container doesn't exist

  fetch("https://hirshtom-web.github.io/ab/product-catalog.csv")
    .then(res => res.text())
    .then(csvText => {
      const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
      const products = data.filter(p => relatedProductIds.includes(p.productId));

      products.forEach(p => {
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
        item.className = "related-slider-item";

        item.innerHTML = `
          <div class="img-wrapper">
            <img src="${imgSrc}" alt="${p.name}">
          </div>
          <div class="related-slider-info">
            <h4>${p.name}</h4>
            <span class="price">$${parseFloat(p.newPrice || 0).toFixed(2)}</span>
          </div>
        `;

        item.addEventListener("click", () => {
          window.location.href =
            `https://hirshtom-web.github.io/ab/product-page.html?id=${p.productId}`;
        });

        sliderContainer.appendChild(item);
      });
    })
    .catch(err => console.error("Related slider failed:", err));
}
