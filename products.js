Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(res) {
    const allProducts = res.data.map(p => ({
      id: (p.productId || p.ProductId || "").trim(),
      name: (p.name || p.Name || "Unnamed Product").trim(),
      price: p.price ? parseFloat(p.price) : 1,
      image: p.productImageUrl
        ? (p.productImageUrl.split(";")[0].trim().includes("http")
            ? p.productImageUrl.split(";")[0].trim()
            : "https://static.wixstatic.com/media/" + p.productImageUrl.split(";")[0].trim())
        : "https://via.placeholder.com/300"
    }));

    const grid = document.getElementById("productGrid");
    if (!grid) return;

    allProducts.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
      `;
      card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
      grid.appendChild(card);
    });
  }
});
