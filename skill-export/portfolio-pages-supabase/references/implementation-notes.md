# Implementation Notes

## Recommended project shape

- `src/layouts/Layout.astro`: global metadata, global styles, color tokens, typography
- `src/pages/index.astro`: one strong single-page portfolio layout with anchored sections
- `src/components/PlaygroundApp.tsx`: auth, practice game, and multiplayer room UI
- `src/data/portfolio.ts`: resume-derived structured content
- `supabase/schema.sql`: tables, policies, triggers, RPC functions, realtime publication
- `.github/workflows/deploy.yml`: GitHub Pages build and deploy
- `.env.example`: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`

## Visual system

- Base palette:
  - `#BFE8D7`
  - `#DFF8EE`
  - `#94D3B7`
  - `#2F5D50`
  - `#101312`
- Prefer soft layered backgrounds, visible borders, and near-black type.
- Avoid making the whole site pastel. Use dark accents to keep contrast and structure.

## Portfolio sections

- Hero with concise pitch and action buttons
- About section focused on systems thinking and engineering identity
- Experience timeline
- Project cards with tech tags and problem/solution framing
- Skills grouped by delivery category, not a single keyword dump
- Playground section with a local practice game and Supabase multiplayer mode
- Contact section with email, phone, GitHub, and resume PDF

## Multiplayer pattern

- Keep a local practice board available even before backend configuration.
- For realtime mode:
  - require auth
  - persist profile username
  - create rooms via SQL RPC
  - join rooms via room code
  - validate moves in SQL
  - subscribe to room changes with Supabase Realtime

## SQL requirements

- `profiles` table referencing `auth.users`
- `game_rooms` table with 9-cell board, turn, status, winner, and player ids
- row level security enabled
- readable room policy only for participants
- trigger to update `updated_at`
- function to generate unique room codes
- function to evaluate a board winner
- RPC functions:
  - `create_tic_tac_toe_room`
  - `join_tic_tac_toe_room`
  - `make_tic_tac_toe_move`
  - `reset_tic_tac_toe_room`
- add `public.game_rooms` to `supabase_realtime`

## Deployment notes

- Use GitHub Actions Pages deploy rather than relying on Jekyll behavior.
- Set repo secrets:
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`
- In the build step, set `ASTRO_TELEMETRY_DISABLED=1` if sandboxed or CI environments make telemetry config noisy.

## Good fallback behavior

- If Supabase env vars are missing, render the site and practice game anyway.
- Show a clear setup message in the multiplayer panel instead of failing silently.
