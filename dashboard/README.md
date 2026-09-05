The owner dashboard is a React/Vite application backed by the API in `../backend`.

Run `npm ci` from this directory, copy `.env.example` to `.env`, and set `VITE_API_URL` to the backend origin (for example `http://localhost:4000`). Do not append `/api/v1`. Start with `npm run dev`; run `npm run build` for production output in `dist`, `npm run lint` for lint checks, and `npm test` for React/Redux regressions.

All administration routes require the owner session. Collections are fetched after authentication; successful mutations update the existing Redux collections. Password recovery pages keep independent state, and successful reset establishes both the bearer-token and cookie session.

Common UI comes from `@portfolio/shared`, installed from `../shared`. After changing shared source, rerun `npm ci` here. Deployments must include that sibling directory in the checkout. Keep `.npmrc` and `package-lock.json` committed. See [the root README](../README.md) for deployment and owner setup.
