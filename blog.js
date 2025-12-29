document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blog-post-placeholder");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    container.innerHTML = "<h2>Post not found</h2>";
    return;
  }

  fetch("https://hirshtom-web.github.io/ab/blog-posts.json")
    .then(res => res.json())
    .then(posts => {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        container.innerHTML = "<h2>Post not found</h2>";
        return;
      }
      renderPost(post);
    })
    .catch(err => {
      console.error("❌ Blog JSON load failed", err);
      container.innerHTML = "<h2>Error loading post</h2>";
    });

  function renderPost(post) {
    document.title = post.title + " | ArteBarte";

    const contentHTML = post.content.map(block => {
      switch (block.type) {
        case "title":
          return `<h3>${block.text}</h3>`;
        case "paragraph":
          return `<p>${block.text}</p>`;
        case "bullet":
          return `<ul>${block.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        case "numbered":
          return `<ol>${block.items.map(i => `<li>${i}</li>`).join('')}</ol>`;
        case "link":
          return `<p><a href="${block.url}" target="_blank">${block.text}</a></p>`;
        default:
          return "";
      }
    }).join('');

    container.innerHTML = `
      <article class="blog-post">
        <div class="blog-hero">
          ${post.heroImage ? `<img src="${post.heroImage}" alt="${post.title}">` : ""}
        </div>

        <div class="blog-content">
          <h1>${post.title}</h1>
          ${post.subtitle ? `<h2>${post.subtitle}</h2>` : ""}

          <div class="blog-meta">
            <span>${post.author || "ArteBarte"}</span>
            <span>•</span>
            <span>${post.date}</span>
            <span>•</span>
            <span>${post.views || 0} Views</span>
            <span>•</span>
            <span>${post.likes || 0} Likes</span>
            <span>•</span>
            <span>${post.readTime || 1} min read</span>
          </div>

          <div class="blog-body">
            ${contentHTML}
          </div>
        </div>
      </article>
    `;
  }
});
