Prakhar's portfolio contains three independently deployable applications and one shared UI package.

| Directory | Purpose |
| --- | --- |
| `backend` | Express API, MongoDB models, Cloudinary uploads, password recovery |
| `dashboard` | React administration app for the portfolio owner |
| `portfolio` | Public React portfolio |
| `shared` | Shared components, hooks, styles, and Tailwind preset |

Use Node.js 22 and npm. Run `npm ci` inside each of `backend`, `dashboard`, and `portfolio`. Each app retains its own lockfile. The frontends install `@portfolio/shared` from `../shared`; their committed `.npmrc` files make npm copy this package instead of creating a symlink. After editing shared source, rerun `npm ci` in both frontends to refresh the installed copies.

Copy `backend/.env.example` to `backend/config/.env` (create the config directory), and copy each frontend's `.env.example` to `.env`. Fill in the environment values described in the app READMEs. Start the API with `npm run dev` in backend, then `npm run dev` in each frontend. Use different Vite ports if running both at once.

Public registration has been removed. Existing installations with exactly one user continue using that account as owner. If multiple accounts exist, set `PORTFOLIO_OWNER_ID` to the intended owner's MongoDB ID. Without that setting, multi-account installations refuse access rather than guessing. For a new database, use the provisioning command in [backend/README.md](backend/README.md).

From the repository root:

- `npm run lint`: lint both frontends and shared source.
- `npm test`: run backend and frontend regression tests.
- `npm run build`: build both frontends.
- `npm run check`: run all three checks.
- `npm run format`: format application and shared source.

Tests mock network/database persistence; they exercise the actual password model middleware, authorization, validation, upload lifecycle, Redux state, React forms, and navigation caching without changing production data. CI runs these checks on pushes and pull requests.

For deployment, keep the backend's local `server.js` and Vercel `api/index.js` entry points. Each frontend can be deployed separately using its directory as the project root. The build checkout must include the sibling `shared` directory: in Vercel, enable source files outside the project root in the build settings. Run installs/builds from the corresponding frontend directory so its `.npmrc` applies. Configure the API URL and backend CORS origins for the deployed sites. Do not deploy only the contents of one frontend folder without its shared package.
