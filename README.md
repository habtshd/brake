# brake.net

Modern multi-page website for the Brake brand family:

- `Brake.net`
- `Brake Design`
- `Brake Market`

## Stack

- Next.js
- React
- Framer Motion
- TypeScript

## Build

```bash
npm install
npm run build
```

## Deploy notes

- Use branch: `main`
- Build command: `npm run build`
- Root directory: repository root
- Build output directory: `out`
- Framework preset: `None` or `Static Site` for Cloudflare Pages
- Do not publish `.next`; publish the static `out` directory instead
- Cloudflare Pages can also read `wrangler.toml` with `pages_build_output_dir = "out"`

## Runtime configuration

Copy `.env.example` to your Cloudflare Pages environment variables and set:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `SITE_URL`
- `SESSION_SECRET`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_TTL_SECONDS`
- `RATE_LIMIT_PER_HOUR`

## Database

Create a Cloudflare D1 database named `brake-net` and apply `d1/schema.sql` to it.
