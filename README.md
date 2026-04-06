# Noah Garcia Portfolio

Astro portfolio site for Noah Garcia, styled with a seafoam green and black visual system and deployed to GitHub Pages. The site includes:

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
