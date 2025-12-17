

  // Pagination
  prevBtn.onclick = ()=>{ if(currentPage>1){currentPage--; renderPage(currentPage);} };
  nextBtn.onclick = ()=>{ if(currentPage*productsPerPage<allProducts.length){currentPage++; renderPage(currentPage);} };

  // Banners
  function insertBanners(){
    grid.querySelectorAll(".banner-card").forEach(b=>b.remove());
    const cards=[...grid.querySelectorAll(".product-card")];
    for(let i=8;i<cards.length;i+=9){
      const b=document.createElement("div");
      b.className="banner-card";
      b.innerHTML="<span>✨ New Collection Drop!</span>";
      grid.insertBefore(b,cards[i]);
    }
  }

  // Shuffle
  shuffleBtn.addEventListener("click",()=>{
    shuffleArray(allProducts);
    renderPage(currentPage);
  });
  shuffleBtn.title="Shuffle to see more";

  // Sorting bubble
  sortBtn.addEventListener("click",()=>{
    const bubble=document.createElement("div");
    bubble.style.position="absolute";
    bubble.style.top="40px";
    bubble.style.right="0px";
    bubble.style.background="#fff";
    bubble.style.border="1px solid #ccc";
    bubble.style.padding="10px";
    bubble.style.zIndex="999";
    bubble.innerHTML=`
      <div data-sort="best">Best Selling</div>
      <div data-sort="priceAsc">Price: Low → High</div>
      <div data-sort="priceDesc">Price: High → Low</div>
      <div data-sort="az">Alphabetically A-Z</div>
      <div data-sort="za">Alphabetically Z-A</div>
      <div data-sort="new">New → Old</div>
      <div data-sort="old">Old → New</div>
    `;
    document.body.appendChild(bubble);

    bubble.querySelectorAll("div").forEach(item=>{
      item.addEventListener("click",()=>{
        const sortType=item.dataset.sort;
        switch(sortType){
          case "priceAsc": allProducts.sort((a,b)=>parseFloat(a.price||0)-parseFloat(b.price||0)); break;
          case "priceDesc": allProducts.sort((a,b)=>parseFloat(b.price||0)-parseFloat(a.price||0)); break;
          case "az": allProducts.sort((a,b)=>a.name.localeCompare(b.name)); break;
          case "za": allProducts.sort((a,b)=>b.name.localeCompare(a.name)); break;
          case "new": allProducts.sort((a,b)=>a.productId.localeCompare(b.productId)); break;
          case "old": allProducts.sort((a,b)=>b.productId.localeCompare(a.productId)); break;
          case "best": break;
        }
        renderPage(currentPage);
        bubble.remove();
      });
    });

    document.addEventListener("click",e=>{
      if(!bubble.contains(e.target)&&e.target!==sortBtn) bubble.remove();
    }, {once:true});
  });

  // Initial grid lock
  (function(){
    const isMobile = window.innerWidth<=768;
    grid.classList.remove("cols-1","cols-2","cols-3","cols-4");
    grid.classList.add(isMobile?"cols-2":"cols-4");
  })();

  window.addEventListener("resize",applyDefaultGrid);
});
</script>

