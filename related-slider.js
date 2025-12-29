// --- Set a random title for the related slider ---
function setRandomRelatedTitle() {
  const titles = [
    "Related Products",
    "You May Also Like",
    "Complete the Look",
    "Similar Items",
    "Recommended"
  ];

  const titleEl = document.getElementById("relatedTitle");
  if (!titleEl) return;

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  titleEl.textContent = randomTitle;
}

// --- Initialize the related products slider ---
function initRelatedSlider() {
  const sliderContainer = document.getElementById("relatedProductsSlider");
  if (!sliderContainer) return; // Exit if container doesn't exist

  setRandomRelatedTitle();

  fetch("https://hirshtom-web.github.io/ab/product-catalog.csv")
    .then(res => res.text())
    .then(csvText => {
      const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

      // 1️⃣ Exclude the current product
      const currentProductId = new URLSearchParams(window.location.search).get("id");
      const otherProducts = data.filter(p => p.productId !== currentProductId);

      // 2️⃣ Rank products by relevance
      const currentProduct = data.find(p => p.productId === currentProductId);
      let relatedProducts = [];

      if (currentProduct) {
        relatedProducts = otherProducts
          .map(p => {
            let score = 0;
            if (p.category === currentProduct.category) score += 3;
            if (p.collection === currentProduct.collection) score += 2;
            if (p.style === currentProduct.style) score += 1;
            return { ...p, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // pick top 10
      } else {
        relatedProducts = otherProducts.slice(0, 10); // fallback
      }

      // 3️⃣ Render slider items
      sliderContainer.innerHTML = ""; // clear existing
      relatedProducts.forEach(p => {
        const mainImages = (p.mainImageUrl || "").split(";")
          .map(i => i.trim())
          .filter(Boolean);
        const imgSrc = mainImages[0]
          ? (mainImages[0].includes("http") ? mainImages[0] : "https://static.wixstatic.com/media/" + mainImages[0])
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
          </div>`;

        // Navigate to single product page on click
        item.addEventListener("click", () => {
          window.location.href = `product-page.html?id=${p.productId}`;
        });

        sliderContainer.appendChild(item);
      });
    })
    .catch(err => console.error("Related slider failed:", err));
}

// --- Auto-init on page load ---
document.addEventListener("DOMContentLoaded", initRelatedSlider);
