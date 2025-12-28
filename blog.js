document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blog-post-placeholder");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    container.innerHTML = "<h2>Post not found</h2>";
    return;
  }

  Papa.parse("https://hirshtom-web.github.io/ab/blog-posts.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      const post = res.data.find(p => p.id === postId);

      if (!post) {
        container.innerHTML = "<h2>Post not found</h2>";
        return;
      }

      renderPost(post);
    },
    error: err => {
      console.error("❌ Blog CSV load failed", err);
      container.innerHTML = "<h2>Error loading post</h2>";
    }
  });

  function renderPost(post) {
    document.title = post.title + " | ArteBarte";

    container.innerHTML = `
      <article class="blog-post">
        <div class="blog-hero">
          ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ""}
        </div>

        <div class="blog-content">
          <h1>${post.title}</h1>
          ${post.subtitle ? `<h2>${post.subtitle}</h2>` : ""}

          <div class="blog-meta">
            <span>${post.author || "ArteBarte"}</span>
            <span>•</span>
            <span>${post.date}</span>
          </div>

          <div class="blog-body">
            ${post.content}
          </div>
        </div>
      </article>
    `;
  }
});

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
