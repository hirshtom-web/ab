Papa.parse("blog-posts.csv", {
  download: true,
  header: true,
  complete: res => {
    const post = res.data.find(p => p.id === getPostId());
    renderPost(post);
  }
});

function getPostId() {
  return new URLSearchParams(window.location.search).get("id");
}

function renderPost(post) {
  document.querySelector("h1").textContent = post.title;
  document.querySelector(".subtitle").textContent = post.subtitle;
  document.querySelector(".author").textContent = post.author;
  document.querySelector(".date").textContent = post.date;
  document.querySelector(".hero img").src = post.heroImage;
  document.querySelector(".blog-content").innerHTML = post.content;
}
