// Build an avatars manifest using Vite's import.meta.globEager when available.
// If you see an error about `import.meta.globEager is not a function` in the
// browser console it usually means the app wasn't started via Vite. Start the
// dev server with `npm run dev` so Vite can transform this code at build time.

// Use Vite's import.meta.glob to build a manifest of avatar asset URLs.
// This must be run through Vite (dev server or build) so the glob is transformed at
// build time into a static mapping. Do not guard the call with runtime checks.
const modules = import.meta.glob("./*.{svg,png,jpg,jpeg,webp}", { eager: true, as: "url" });

const avatars = Object.keys(modules).map((filePath) => {
  const fileName = filePath.split("/").pop();
  const id = fileName.replace(/\.(svg|png|jpg|jpeg|webp)$/, "");
  const src = modules[filePath]; // url string provided by Vite
  const name = id.replace(/[-_]/g, " ");
  return { id, name, src, thumbnail: src, tags: [] };
});

export default avatars;