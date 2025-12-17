<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return console.error("❌ productGrid element not found");

  // Load CSV
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      const allProducts = res.data.map(p => ({
        id: (p.productId || p.ProductId || "").trim(),
        name: (p.name || p.Name || "Unnamed Product").trim(),
        price: p.price ? parseFloat(p.price) : 1,
        image: (p.productImageUrl || p.ProductImageUrl || "").split(";")[0].trim()
      }));

      console.log("Products loaded:", allProducts.length, allProducts);

      // Render products
      allProducts.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${p.image.includes("http") ? p.image : 'https://static.wixstatic.com/media/' + p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
        `;
        // Click to go to single product page
        card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
        grid.appendChild(card);
      });
    },
    error: err => console.error("CSV load failed:", err)
  });
});
</script>
