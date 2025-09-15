// How long to keep images (1 day in ms)
const EXPIRY = 24 * 60 * 60 * 1000;

const grid = document.getElementById("grid");
const fileInput = document.getElementById("fileInput");

// Load stored images from localStorage
function loadImages() {
  const stored = JSON.parse(localStorage.getItem("images") || "[]");
  const now = Date.now();

  // Filter out expired images
  const validImages = stored.filter(img => now - img.timestamp < EXPIRY);

  // Save back only valid ones
  localStorage.setItem("images", JSON.stringify(validImages));

  // Render them in the grid
  grid.innerHTML = "";
  validImages.forEach(img => {
    const div = document.createElement("div");
    const image = document.createElement("img");
    image.src = img.dataUrl;
    div.appendChild(image);
    grid.appendChild(div);
  });
}

// Handle new uploads
fileInput.addEventListener("change", e => {
  const files = Array.from(e.target.files);
  const stored = JSON.parse(localStorage.getItem("images") || "[]");

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      stored.push({ dataUrl: ev.target.result, timestamp: Date.now() });
      localStorage.setItem("images", JSON.stringify(stored));
      loadImages();
    };
    reader.readAsDataURL(file);
  });

  e.target.value = ""; // reset input
});

// Initial load
loadImages();
