function initProductsPage() {
  console.log("✅ initProductsPage running");

  const grid = document.getElementById("productGrid");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const shuffleBtn = document.querySelector(".controls-right [title='Shuffle']");
  const sortBtn = document.querySelector(".controls-right [title='Sort']");
  const gridBtns = document.querySelectorAll(".grid-btn");

  if (!grid) return console.error("❌ productGrid not found");

  let allProducts = [];
  let currentPage = 1;
  const productsPerPage = 12;

  // -------------------------------
  // FETCH CSV PRODUCTS
  // -------------------------------
  Papa.parse("https://hirshtom-web.github.io/ab/product-catalog.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: results => {
      console.log("CSV loaded:", results.data);

      allProducts = results.data
        .filter(p => p.visible && p.visible.toLowerCase() === "true") // only visible products
        .map(p => ({
          name: p.name || "Unnamed Product",
          price: p.price ? parseFloat(p.price) : 1,
          image: p.productImageUrl
            ? p.productImageUrl.split(";")[0].trim()
            : "https://via.placeholder.com/300",
          productId: p.productId || "",
          type: p.type || "",
          category: p.category || "",
        }));

      console.log("Mapped products:", allProducts);
      renderPage(currentPage);
    },
    error: err => console.error("CSV load error:", err)
  });

  // -------------------------------
  // RENDER GRID PAGE
  // -------------------------------
  function renderPage(page) {
    grid.innerHTML = "";
    const start = (page - 1) * productsPerPage;
    const slice = allProducts.slice(start, start + productsPerPage);

    if (!slice.length) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    slice.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image.includes("http") ? p.image : "https://static.wixstatic.com/media/" + p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
      `;
      grid.appendChild(card);

      if ((i + 1) % 9 === 0) {
        const banner = document.createElement("div");
        banner.className = "banner-card";
        banner.innerHTML = "<span>✨ New Collection Drop!</span>";
        grid.appendChild(banner);
      }
    });
  }

  // -------------------------------
  // PAGINATION
  // -------------------------------
  if (prevBtn) prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  };
  if (nextBtn) nextBtn.onclick = () => {
    if (currentPage * productsPerPage < allProducts.length) {
      currentPage++;
      renderPage(currentPage);
    }
  };

  // -------------------------------
  // SHUFFLE BUTTON
  // -------------------------------
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      shuffleArray(allProducts);
      renderPage(currentPage);
    });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // -------------------------------
  // SORT BUTTON
  // -------------------------------
  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      const bubble = document.createElement("div");
      bubble.style.position = "absolute";
      bubble.style.top = "40px";
      bubble.style.right = "0px";
      bubble.style.background = "#fff";
      bubble.style.border = "1px solid #ccc";
      bubble.style.padding = "10px";
      bubble.style.zIndex = "999";
      bubble.innerHTML = `
        <div data-sort="priceAsc">Price: Low → High</div>
        <div data-sort="priceDesc">Price: High → Low</div>
        <div data-sort="az">A → Z</div>
        <div data-sort="za">Z → A</div>
      `;
      document.body.appendChild(bubble);

      bubble.querySelectorAll("div").forEach(item => {
        item.addEventListener("click", () => {
          const sortType = item.dataset.sort;
          switch (sortType) {
            case "priceAsc":
              allProducts.sort((a, b) => a.price - b.price);
              break;
            case "priceDesc":
              allProducts.sort((a, b) => b.price - a.price);
              break;
            case "az":
              allProducts.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "za":
              allProducts.sort((a, b) => b.name.localeCompare(a.name));
              break;
          }
          renderPage(currentPage);
          bubble.remove();
        });
      });

      document.addEventListener("click", e => {
        if (!bubble.contains(e.target) && e.target !== sortBtn) bubble.remove();
      }, { once: true });
    });
  }

  // -------------------------------
  // GRID LAYOUT BUTTONS
  // -------------------------------
  gridBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      gridBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cols = parseInt(btn.dataset.cols);
      grid.classList.remove("cols-1","cols-2","cols-3","cols-4");
      grid.classList.add(`cols-${cols}`);
    });
  });

  // -------------------------------
  // DEFAULT GRID
  // -------------------------------
  (function() {
    const isMobile = window.innerWidth <= 768;
    grid.classList.remove("cols-1","cols-2","cols-3","cols-4");
    grid.classList.add(isMobile ? "cols-2" : "cols-4");
  })();

  window.addEventListener("resize", () => {
    const isMobile = window.innerWidth <= 768;
    grid.classList.remove("cols-1","cols-2","cols-3","cols-4");
    grid.classList.add(isMobile ? "cols-2" : "cols-4");
  });
}

// -------------------------------
// INIT ON DOM LOAD
// -------------------------------
document.addEventListener("DOMContentLoaded", initProductsPage);
