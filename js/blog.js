async function loadPosts() {
  // List of posts (add new JSON files here)
  const postFiles = ["posts/post1.json", "posts/post2.json"];

  const container = document.getElementById("blog-container");

  // Helper to get week number from date string
  function getWeekNumber(dateString) {
    const date = new Date(dateString);
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstJan.getDay() + 1) / 7);
  }

  for (let file of postFiles) {
    try {
      const response = await fetch(file);
      const post = await response.json();

      // Calculate week number and year
      let week = "";
      if (post.date) {
        const d = new Date(post.date);
        const weekNum = getWeekNumber(post.date);
        week = `Vecka ${weekNum}, ${d.getFullYear()}`;
      }

      const postDiv = document.createElement("div");
      postDiv.className = "blog-post-block";

      postDiv.innerHTML = `
        <div class="blog-post-header">
          <span class="blog-post-week">${week}</span>
          <h2>${post.title}</h2>
        </div>
        <div class="blog-post-body">
          ${post.content}
        </div>
      `;

      container.prepend(postDiv); // newest on top
    } catch (error) {
      console.error("Error loading post:", file, error);
    }
  }
}

loadPosts();

// Go to Bottom Button Logic
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("go-bottom-btn");
  function checkShowButton() {
    // Show if page is scrollable (content taller than viewport)
    if (document.body.scrollHeight > window.innerHeight + 20) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }
  checkShowButton();
  window.addEventListener("resize", checkShowButton);
  window.addEventListener("load", checkShowButton);
  // In case posts load after DOMContentLoaded
  setTimeout(checkShowButton, 500);

  btn.addEventListener("click", function () {
    // Scroll to the last blog post block if it exists
    const posts = document.querySelectorAll('.blog-post-block');
    if (posts.length > 0) {
      posts[posts.length - 1].scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  });
});