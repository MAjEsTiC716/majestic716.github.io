---
name: portfolio-pages-supabase
description: Build or extend a portfolio site hosted on GitHub Pages using Astro, selective React interactivity, a seafoam-green visual system, and optional Supabase auth, Postgres, and realtime multiplayer features. Use when creating a resume-driven developer portfolio with lightweight browser games such as Tic-Tac-Toe and GitHub Actions deployment.
---

# Portfolio Pages Supabase

Use this skill when the user wants a portfolio website that is:

- hosted on GitHub Pages
- mostly static but visually polished
- interactive in the browser
- optionally backed by Supabase for auth, persistence, and realtime game state

## Default stack

- Astro for the site shell and content-heavy sections
- React islands only for interactive components
- GitHub Actions for GitHub Pages deployment
- Supabase for auth, profiles, Postgres tables, RPC functions, and realtime subscriptions

## Workflow

1. Inspect the repo first. If it is empty or near-empty, scaffold Astro at the repo root.
2. Keep the portfolio content tied to the user’s actual resume, work history, projects, and contact details.
3. Use a strong design direction instead of a generic template. This workflow assumes:
   - seafoam green base tones
   - black or near-black accents
   - expressive typography
   - bordered cards and clear contrast
4. Structure the site around:
   - hero
   - about
   - experience
   - projects
   - skills
   - playground
   - contact
5. Keep lightweight games client-side first. Tic-Tac-Toe is the default first game.
6. If the user wants accounts, persistent profiles, or multiplayer:
   - add Supabase env vars
   - add schema and RPC functions
   - keep privileged logic in Postgres functions instead of trusting the client
7. Configure GitHub Pages deployment with GitHub Actions and pass public Supabase values through repo secrets.

## Content guidance

- Present the user as a professional engineer first and a playful frontend experimenter second.
- Use the games section as proof of frontend and state-management skill, not as the whole identity of the site.
- Convert resume bullets into concise, high-signal project and experience copy.

## Supabase guidance

- Frontend-safe keys belong in `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.
- Create a `profiles` table tied to `auth.users`.
- For multiplayer Tic-Tac-Toe, create a `game_rooms` table with:
  - room code
  - board state
  - turn
  - status
  - winner
  - host and guest user ids
- Use SQL RPC functions for:
  - room creation
  - room join
  - move validation
  - room reset
- Add the multiplayer table to the `supabase_realtime` publication.

## Validation

- Run the Astro build before finishing.
- If Astro telemetry fails in a sandbox, rerun with `ASTRO_TELEMETRY_DISABLED=1`.
- Confirm the site still renders without Supabase env vars and that auth/multiplayer degrade gracefully.

## References

- For the concrete file layout, schema shape, and deployment pattern, read `references/implementation-notes.md`.
- For reusable user-facing content structure, read `references/content-outline.md`.
