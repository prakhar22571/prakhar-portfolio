The public portfolio is a React/Vite application backed by `../backend`.

Run `npm ci` from this directory, copy `.env.example` to `.env`, and set `VITE_API_URL` to the backend origin (for example `http://localhost:4000`). Do not append `/api/v1`. Run `npm run dev`, `npm run build`, `npm run lint`, or `npm test` as needed.

Home data is fetched as one parallel batch, deduplicated during loading, and retained across project-page navigation. The existing loading/retry UI remains available when the API is unavailable. Direct project links have loading, error, and retry states.

Common UI comes from `@portfolio/shared`, installed from `../shared`. After changing shared source, rerun `npm ci` here. The deployment checkout must contain that sibling directory; see [the root README](../README.md). The React Toastify implementation is the single notification system.
