# Noah Garcia Portfolio

Astro portfolio site for Noah Garcia, styled with a custom green and black visual system and deployed to GitHub Pages. The site includes:

- professional portfolio sections based on resume content
- a local interactive Tic-Tac-Toe practice game
- Supabase-backed user accounts
- Supabase-backed multiplayer Tic-Tac-Toe rooms and realtime sync

## Stack

- Astro
- React islands for interactive UI
- Supabase Auth
- Supabase Postgres + Realtime
- GitHub Pages via GitHub Actions

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Fill in:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

4. In Supabase SQL Editor, run:

```sql
-- paste the contents of supabase/schema.sql into the editor and run it
```

5. Start the dev server:

```bash
npm run dev
```

Astro usually serves the site at `http://localhost:4321`.

## Supabase Multiplayer Setup

In Supabase:

1. Go to `SQL Editor` and run the full contents of `supabase/schema.sql`.
2. Go to `Authentication > URL Configuration`.
3. Set the local development Site URL to `http://localhost:4321`.
4. Add these Redirect URLs:

```text
http://localhost:4321/**
https://majestic716.github.io/**
```

5. If you are testing quickly, go to `Authentication > Sign In / Providers > Email` and temporarily disable email confirmations. Re-enable confirmations before using the site publicly.

If a confirmation link shows `otp_expired`, request a new signup/login email. Supabase email links are single-use and can expire; old links will keep failing even after settings are fixed.

## GitHub Pages Deployment

Set these repository secrets before enabling Pages deployment:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

In GitHub:

1. Go to `Settings > Pages`
2. Set `Source` to `GitHub Actions`
3. Push to `main`

The workflow in `.github/workflows/deploy.yml` will build and deploy the site.

## Notes

- The site will still render without Supabase env vars, but auth and multiplayer will remain disabled.
- The multiplayer flow uses database RPC functions so move validation happens in Postgres instead of relying only on client checks.
