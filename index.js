<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

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

    // Filter only selected products (trim spaces in productId just in case)
    const products = data.filter(p => productIds.includes(p.productId.trim()));

    console.log("Filtered products:", products); // debug check

    products.forEach(p => {
      // Split images; use 2nd image if available, else fallback to first
      const mainImages = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
      const imgSrc = mainImages[1] 
        ? (mainImages[1].includes("http") ? mainImages[1] : 'https://static.wixstatic.com/media/' + mainImages[1]) 
        : (mainImages[0] ? (mainImages[0].includes("http") ? mainImages[0] : 'https://static.wixstatic.com/media/' + mainImages[0]) : "");

      const itemLink = `https://hirshtom-web.github.io/ab/product-page.html?id=${p.productId.trim()}`;

      const item = document.createElement("a"); // use <a> to link
      item.className = "slider-item";
      item.href = itemLink;
      item.target = "_blank"; // optional, opens in new tab
      item.innerHTML = `
        <img src="${imgSrc}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <span class="price">$${parseFloat(p.newPrice || 0).toFixed(2)}</span>
        </div>
      `;
      sliderContainer.appendChild(item);
    });
  })
  .catch(err => console.error("Error loading CSV:", err));
