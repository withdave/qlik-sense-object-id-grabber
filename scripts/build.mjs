import { build, context } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const entry = path.join(repoRoot, "src", "qsog.js");

function escapeHtmlAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function resolveVersionLabel() {
  const envVersion = (process.env.QSOG_VERSION || process.env.GITHUB_REF_NAME || "").trim();
  if (envVersion && !["master", "main"].includes(envVersion)) {
    return envVersion.startsWith("v") ? envVersion : `v${envVersion}`;
  }

  const npmVersion = (process.env.npm_package_version || "").trim();
  if (npmVersion) return `v${npmVersion}`;

  return "";
}

function pageHtml({ bookmarkletHref, versionLabel }) {
  const safeHref = escapeHtmlAttribute(bookmarkletHref);
  const suffix = versionLabel ? ` ${versionLabel}` : "";
  const buttonText = `qsog${suffix}`;
  const safeButtonText = escapeHtmlAttribute(buttonText);
  const safeTitle = escapeHtmlAttribute(`Drag to bookmarks: ${buttonText}`);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>qsog - Qlik Sense Object (id) Grabber</title>
    <style>
      body { margin: 0; padding: 2rem 1rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #24292f; }
      main { max-width: 760px; margin: 0 auto; }
      h1 { margin: 0 0 0.5rem; font-size: 2rem; }
      h2 { margin: 0 0 1.5rem; font-size: 1.2rem; font-weight: 400; color: #57606a; }
      a.button { display: inline-block; padding: 0.6rem 1rem; border: 1px solid #d0d7de; border-radius: 6px; background: #f6f8fa; color: #24292f; text-decoration: none; font-weight: 600; }
      a.button:active { transform: translateY(1px); }
      p { line-height: 1.5; }
      .muted { color: #57606a; }
      textarea { width: 100%; min-height: 7rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; }
      img { max-width: 100%; height: auto; border: 1px solid #d0d7de; border-radius: 6px; }
    </style>
  </head>
  <body>
    <main>
      <h1>qsog - Qlik Sense Object (id) Grabber</h1>
      <p>
        <a class="button" href="${safeHref}" title="${safeTitle}">${safeButtonText}</a>
        drag this button to the bookmark bar of your browser. Read more at <a href="https://github.com/withdave/qlik-sense-object-id-grabber">qsog</a>.
      </p>
      <p><img src="qsog_demo.gif" alt="Demo of qsog" /></p>
      <p class="muted">Or create a bookmark manually by copy/pasting the bookmarklet URL:</p>
      <textarea readonly>${bookmarkletHref}</textarea>
    </main>
  </body>
</html>
`;
}

function toBookmarklet(js) {
  // Keep it robust when pasted into a bookmark URL field.
  // We percent-encode the script portion (common bookmarklet practice).
  return `javascript:${encodeURIComponent(js)}`;
}

async function writeOutputsOnce() {
  const baseBuildOptions = {
    entryPoints: [entry],
    bundle: true,
    platform: "browser",
    format: "iife",
    target: "es2018",
    write: false,
  };

  const unminified = await build({
    ...baseBuildOptions,
    minify: false,
  });

  const minified = await build({
    ...baseBuildOptions,
    minify: true,
  });

  const unminifiedJs = unminified.outputFiles[0].text.trim();
  const minifiedJs = minified.outputFiles[0].text.trim();

  await fs.writeFile(path.join(repoRoot, "qsog.js"), `${unminifiedJs}\n`, "utf8");
  await fs.writeFile(path.join(repoRoot, "qsog.min.js"), `${minifiedJs}\n`, "utf8");

  const bookmarklet = toBookmarklet(minifiedJs);
  await fs.writeFile(path.join(repoRoot, "bookmarklet.txt"), `${bookmarklet}\n`, "utf8");

  const distDir = path.join(repoRoot, "dist");
  await fs.mkdir(distDir, { recursive: true });
  const versionLabel = resolveVersionLabel();
  await fs.writeFile(
    path.join(distDir, "index.html"),
    pageHtml({ bookmarkletHref: bookmarklet, versionLabel }),
    "utf8",
  );
  await fs.writeFile(path.join(distDir, ".nojekyll"), "", "utf8");
  await fs.copyFile(path.join(repoRoot, "qsog_demo.gif"), path.join(distDir, "qsog_demo.gif"));

  console.log("Built: qsog.js, qsog.min.js, bookmarklet.txt, dist/index.html");
}

const watch = process.argv.includes("--watch");

if (!watch) {
  await writeOutputsOnce();
} else {
  await writeOutputsOnce();

  const ctx = await context({
    entryPoints: [entry],
    bundle: true,
    platform: "browser",
    format: "iife",
    target: "es2018",
    minify: true,
    write: true,
    outfile: path.join(repoRoot, ".tmp-watch-output.js"),
    plugins: [
      {
        name: "qsog-bookmarklet-regenerator",
        setup(buildApi) {
          buildApi.onEnd((result) => {
            if (result.errors?.length) return;
            void writeOutputsOnce();
          });
        },
      },
    ],
  });

  await ctx.watch();
  console.log("Watching src/qsog.js for changes...");
}
