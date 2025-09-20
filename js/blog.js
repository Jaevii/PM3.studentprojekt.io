async function loadPosts() {
  // List of posts (add new JSON files here)
  const postFiles = ["posts/post1.json", "posts/test.json"];

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

      // Use summary field for preview
      let summaryText = post.summary || '';
      let summaryParagraphs = summaryText.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`);
      let thumbnail = summaryParagraphs.join('<br>');

      postDiv.innerHTML = `
        <div class="blog-post-header">
          <span class="blog-post-week">${week}</span>
          <h2>${post.title}</h2>
        </div>
        <div class="blog-post-body blog-post-thumbnail">
          ${thumbnail}
          <button class="read-more-btn">Läs mer</button>
        </div>
      `;

      // Modal logic: fetch and render full content only when opened
      postDiv.querySelector('.read-more-btn').addEventListener('click', async function(e) {
        e.stopPropagation();
        try {
          const response = await fetch(file);
          const fullPost = await response.json();
          // Support code blocks: replace triple backticks with <pre><code>
          let formatted = fullPost.content
            .replace(/```([\s\S]*?)```/g, function(match, code) {
              // Escape HTML in code
              const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
              return `<pre class="blog-code-block"><code>${escaped}</code></pre>`;
            });
          // Format paragraphs and line breaks
          let paragraphs = formatted.split(/\n\n+/);
          let formattedContent = paragraphs
            .map(paragraph => {
              // If it's a code block, don't wrap in <p>
              if (paragraph.startsWith('<pre')) return paragraph;
              return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
            })
            .join('<br>');
          showModal(fullPost.title, week, formattedContent);
        } catch (err) {
          showModal(post.title, week, '<p>Kunde inte ladda inlägget.</p>');
        }
      });

      container.prepend(postDiv); // newest on top
    } catch (error) {
      console.error("Error loading post:", file, error);
    }
  }

  // Modal creation (only once)
  if (!document.getElementById('blog-modal')) {
    const modal = document.createElement('div');
    modal.id = 'blog-modal';
    modal.innerHTML = `
      <div class="blog-modal-backdrop"></div>
      <div class="blog-modal-content">
        <button class="blog-modal-close">&times;</button>
        <div class="blog-modal-header"></div>
        <div class="blog-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.blog-modal-close').onclick = hideModal;
    modal.querySelector('.blog-modal-backdrop').onclick = hideModal;
  }

  function showModal(title, week, content) {
    const modal = document.getElementById('blog-modal');
    modal.querySelector('.blog-modal-header').innerHTML = `<span class="blog-post-week">${week}</span><h2>${title}</h2>`;
    modal.querySelector('.blog-modal-body').innerHTML = content;
    modal.classList.remove('fade-out');
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
  function hideModal() {
    const modal = document.getElementById('blog-modal');
    modal.classList.remove('active');
    modal.classList.add('fade-out');
    document.body.classList.remove('modal-open');
    setTimeout(() => {
      modal.classList.remove('fade-out');
      modal.style.display = 'none';
    }, 300);
    // Ensure modal stays visible during fade-out
    modal.style.display = 'flex';
  }
  // Show modal: always set display flex
  function showModal(title, week, content) {
    const modal = document.getElementById('blog-modal');
    modal.querySelector('.blog-modal-header').innerHTML = `<span class="blog-post-week">${week}</span><h2>${title}</h2>`;
    modal.querySelector('.blog-modal-body').innerHTML = content;
    modal.classList.remove('fade-out');
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
  }
} // <-- Add this closing brace to end loadPosts function

// Modal creation (only once)

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