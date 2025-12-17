<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return console.error("Grid not found");

  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      const products = res.data
        .map(p => ({
          id: (p.productId || p.ProductId || "").trim(),
          name: (p.name || p.Name || "Unnamed Product").trim(),
          price: p.price ? parseFloat(p.price) : 1,
          image: (p.productImageUrl || p.ProductImageUrl || "").split(";")[0].trim(),
          visible: ((p.visible || p.Visible || "").toLowerCase() === "true")
        }))
        .filter(p => p.visible);

      console.log("Products loaded:", products);

      products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${p.image.includes("http") ? p.image : "https://static.wixstatic.com/media/" + p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
        `;
        card.onclick = () => window.location.href = `product-page.html?id=${p.id}`;
        grid.appendChild(card);
      });
    },
    error: err => console.error("CSV load error:", err)
  });
});
</script>
