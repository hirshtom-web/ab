/* Three theme variations */
const variants = [
  {
    theme: "theme-red",
    image: "https://static.wixstatic.com/media/1799ca_55c89d325e624fdeb6bc25a72adf11ee~mv2.png"
  },
  {
    theme: "theme-blue",
    image: "https://static.wixstatic.com/media/1799ca_bca1417cd29a4721b51e0eab31d77c63~mv2.png"
  },
  {
    theme: "theme-pink",
    image: "https://static.wixstatic.com/media/1799ca_d0fb977fc5cc47adb0a7ce93770f1c01~mv2.png"
  }
];

/* Pick a random variation */
const random = variants[Math.floor(Math.random() * variants.length)];

/* Apply variation */
document.getElementById("artist-right").classList.add(random.theme);
document.getElementById("artist-image").src = random.image;

