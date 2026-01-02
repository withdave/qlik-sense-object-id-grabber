(() => {
  const OVERLAY_CLASS = "ogOverlay";
  const TARGET_CLASS = "qv-gridcell";

  const existing = document.getElementsByClassName(OVERLAY_CLASS);
  if (existing.length > 0) {
    while (existing.length > 0) {
      existing[0].parentNode?.removeChild(existing[0]);
    }
    console.log("qsog - cleared screen");
    return;
  }

  const elements = document.getElementsByClassName(TARGET_CLASS);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const tid = element.getAttribute("tid");
    if (!tid) continue;

    const outer = document.createElement("div");
    outer.style.position = "absolute";
    outer.style.bottom = "0";
    outer.style.right = "0";
    outer.style.zIndex = "2";
    outer.style.margin = "2px";
    outer.style.padding = "10px";
    outer.style.backgroundColor = "#6bb345";
    outer.style.userSelect = "text";
    outer.style.color = "#FFFFFF";
    outer.className = OVERLAY_CLASS;

    const link = document.createElement("a");
    link.textContent = tid;
    link.href = "#";
    link.style.color = "#FFFFFF";
    link.style.textDecoration = "none";
    link.style.userSelect = "text";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      void copyToClipboard(tid);
    });

    outer.appendChild(link);
    element.appendChild(outer);

    console.log(`Element ${i} id: ${tid}`);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        console.log(`Copied ${text} to clipboard`);
        return;
      }
    } catch {
      // Fall back to execCommand path below.
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      console.log(`Copied ${text} to clipboard`);
    } finally {
      document.body.removeChild(textarea);
    }
  }
})();
