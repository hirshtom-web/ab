window.allProductsGlobal = []; // global product array

function loadAllProducts() {
  return new Promise((resolve, reject) => {
    if (window.allProductsGlobal.length) return resolve(window.allProductsGlobal);

    Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: res => {
        window.allProductsGlobal = res.data.map(p => ({
          id: (p.productId || p.bundleId || "").trim(),
          name: (p.name || "Unnamed").trim(),
          price: p.newPrice ? parseFloat(p.newPrice) : 1,
          oldPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
          images: [
            ...(p.mainImageUrl ? p.mainImageUrl.split(";").map(i => i.trim()) : []),
            ...(p.lifestyleUrl ? [p.lifestyleUrl.trim()] : [])
          ].filter(Boolean),
          type: p.type || "product",
          searchText: Object.values(p).join(" ").toLowerCase() // all text for search
        }));
        resolve(window.allProductsGlobal);
      },
      error: err => reject(err)
    });
  });
}
