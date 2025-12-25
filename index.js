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
];

const sliderContainer = document.getElementById("newInSlider");

fetch("https://hirshtom-web.github.io/ab/product-catalog.csv")
  .then(res => res.text())
  .then(csvText => {
    const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
    
    // Filter only selected products
    const products = data.filter(p => productIds.includes(p.productId));

   products.forEach(p => {
  const id = p.productId.trim(); // ensure no spaces
  const mainImages = (p.mainImageUrl || "")
    .split(";")
    .map(i => i.trim())
    .filter(Boolean);

  const imgSrc = mainImages[1] || mainImages[0] || ""; // use 2nd image if exists, fallback to 1st

  const productLink = `https://hirshtom-web.github.io/ab/product-page.html?id=${id}`;

  const item = document.createElement("div");
  item.className = "new-in-slider-item";
  item.innerHTML = `
    <a href="${productLink}">
      <img src="${imgSrc}" alt="${p.name}">
      <div class="new-in-slider-info">
        <h3>${p.name}</h3>
        <span class="price">$${parseFloat(p.newPrice || 0).toFixed(2)}</span>
      </div>
    </a>
  `;
  sliderContainer.appendChild(item);

  console.log("Added:", p.name, id, productLink); // debug
});
