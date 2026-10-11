# Deployment

The existing public repository is joansonltd-beep/gloc-site. Main deploys directly to the live Vercel site. Never force push.

Before pushing, describe the changes and get the owner's approval. Fetch origin main, inspect git log HEAD..origin/main, and merge if needed. Run npx tsc --noEmit and npx next build. Commit author email must be exactly Joansonltd@gmail.com.

Secrets belong only in Vercel Environment Variables or local .env.local files. Never include credentials in a commit.

The code uses new bundled Jamaica copy until individual CMS documents are reviewed and given contentEdition jamaica-v1. Existing personal contact channels and portrait remain available. Do not seed or replace production CMS documents without approval.
