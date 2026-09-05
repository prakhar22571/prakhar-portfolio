The backend uses Express, MongoDB, Cloudinary, JWT sessions, and SMTP.

Run `npm ci`, copy `.env.example` to `config/.env`, and set:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection URI; the app uses database `PersonalPortfolio` |
| `JWT_SECRET_KEY` | Private signing secret |
| `JWT_EXPIRES` / `COOKIE_EXPIRE` | Token lifetime (default 7d) / cookie lifetime in days (default 7) |
| `PORTFOLIO_OWNER_ID` | Explicit owner MongoDB ID; optional only when exactly one account exists |
| `PORTFOLIO_URL` / `DASHBOARD_URL` | Exact public and admin origins; dashboard URL also forms password-reset links |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_MAIL`, `SMTP_PASSWORD` | SMTP connection and sender credentials |
| `PORT` | Local listening port, default 4000 |
| `NODE_ENV` | Set production for secure cross-site cookies on HTTPS deployments |

`npm run dev` uses Node's built-in watch mode. `npm start` starts the long-running server. Vercel uses `api/index.js`. `npm test` runs isolated regression tests; it does not connect to a database or send emails.

There is no public signup endpoint. To initialize an empty database, create a private JSON file outside version control containing `fullName`, `email`, `phone`, `aboutMe`, `password` (at least eight characters), `portfolioURL`, `avatarPath`, and `resumePath`. Optional social URL fields are supported. File paths are resolved relative to that JSON file. Run:

```text
npm run provision-owner -- /path/to/private-owner.json
```

The command refuses to create an account if one already exists. It prints the new owner's ID for `PORTFOLIO_OWNER_ID`. Existing accounts need no provisioning. Multi-account databases require the explicit owner ID; other users cannot authenticate or mutate portfolio data. Remove the private input file after provisioning using your normal credential-handling process.

Image uploads accept PNG, JPEG, GIF, WebP, and SVG; resumes require PDF. Uploads are limited to 10 MB, checked by declared type and basic file signatures. Images/resumes are uploaded first, saved to MongoDB, then previous assets are deleted. Failed persistence rolls back new uploads. Cloudinary cleanup failures are logged with the asset ID for later cleanup; an already committed update is not reported as failed merely because obsolete-file cleanup failed.

Profile responses use explicit field allowlists. Password hashes and reset metadata are never returned; the public profile also omits private contact fields and Cloudinary IDs.
