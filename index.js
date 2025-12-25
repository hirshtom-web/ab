const productIds = [
  "8349201",
  "9182888",
  "9182889",
  "9182890",
  "9182891",
  "9182892",
  "9182893",
  "9182894",
  "9182895",
  "9182896"
]; // select your product ids

const sliderContainer = document.getElementById("newInSlider");

fetch("https://hirshtom-web.github.io/ab/product-catalog.csv")
  .then(res => res.text())
  .then(csvText => {
    const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
    
    // Filter only selected products
    const products = data.filter(p => productIds.includes(p.productId));

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
      item.className = "new-in-slider-item";

      item.innerHTML = `
        <img src="${imgSrc}" alt="${p.name}">
        <div class="new-in-slider-info">
          <h3>${p.name}</h3>
          <span class="price">$${parseFloat(p.newPrice || 0).toFixed(2)}</span>
        </div>
      `;

      // ✅ ONLY FIX: connect to correct product page
      item.addEventListener("click", () => {
        window.location.href =
          `https://hirshtom-web.github.io/ab/product-page.html?id=${p.productId}`;
      });

      sliderContainer.appendChild(item);
    });
  });
