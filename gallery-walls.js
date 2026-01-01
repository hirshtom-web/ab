function updateGridImages() {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const imgList = JSON.parse(card.dataset.images || "[]");
    if (!imgList.length) return;

    const artworkImg = card.querySelector(".artwork img");
    const lifestyleImg = card.querySelector(".lifestyle-bg");

    // 🔒 ALWAYS pick lifestyle (last image)
    const lifestyle = imgList[imgList.length - 1];
    const url = lifestyle.startsWith("http")
      ? lifestyle
      : "https://static.wixstatic.com/media/" + lifestyle;

    // show lifestyle only
    lifestyleImg.src = url;
    lifestyleImg.style.display = "block";
    artworkImg.style.display = "none";

    lifestyleImg.classList.remove("loaded");
    lifestyleImg.onload = () => lifestyleImg.classList.add("loaded");
  });
}
