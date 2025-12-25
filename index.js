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
      // Use first image (or second if you want lifestyle image)
      const images = (p.mainImageUrl || "").split(";").map(i => i.trim()).filter(Boolean);
      const imgSrc = images[1] ? (images[1].includes("http") ? images[1] : 'https://static.wixstatic.com/media/' + images[1]) 
                               : images[0] ? (images[0].includes("http") ? images[0] : 'https://static.wixstatic.com/media/' + images[0]) 
                               : "";

      if (!imgSrc) return; // skip if no image

      // Wrap item in link to correct product page
      const productLink = `https://hirshtom-web.github.io/ab/product-page.html?id=${p.productId}`;

      const item = document.createElement("a");
      item.className = "slider-item";
      item.href = productLink;
      item.target = "_blank"; // open in new tab
      item.innerHTML = `
        <img src="${imgSrc}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <span class="price">$${parseFloat(p.newPrice || 0).toFixed(2)}</span>
        </div>
      `;

      sliderContainer.appendChild(item);
    });
  });
