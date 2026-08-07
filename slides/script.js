async function init() {
  const btn = document.getElementById("download-btn");
  const fallback = document.getElementById("fallback-link");
  const nameEl = document.getElementById("file-name");
  const sizeEl = document.getElementById("file-size");

  const fileUrl = btn.getAttribute("href");
  nameEl.textContent = fileUrl;

  try {
    const res = await fetch(fileUrl, { method: "HEAD", cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const bytes = Number(res.headers.get("content-length"));
    sizeEl.textContent = bytes ? formatBytes(bytes) : "PowerPoint file";
  } catch (err) {
    sizeEl.textContent = "File not found yet — upload slides.pptx next to index.html";
    btn.setAttribute("aria-disabled", "true");
    fallback.textContent = "Check back once it's uploaded";
    fallback.removeAttribute("href");
  }
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(val < 10 && i > 0 ? 1 : 0)} ${units[i]} · PowerPoint file`;
}

init();
