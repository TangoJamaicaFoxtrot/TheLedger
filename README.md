# The Ledger

A personal digital study for a lifelong polymath education. Next.js App Router, React and TypeScript.

## Run locally

Use Node 22 or later. Run `npm ci`, then `npm run dev`, and open http://localhost:3000. Open this folder in VS Code using File → Open Folder. The Codex extension is recommended in the workspace.

`npm run typecheck` checks types; `npm run build` creates the production build.

## First version

- Study dashboard with a warm paper and forest-green design.
- Twelve disciplines, guided by 50% breadth / 50% depth, with independent expeditions.
- Reading statuses for The Count of Monte Cristo and Atlas Shrugged, based on the founding conversation.
- Journal entries and reading statuses saved in browser storage, plus JSON export.

This scaffold has no account system or cloud database. Records stay in the browser and do not sync between devices. Export regularly; clearing browser data removes saved records. No personal journal entries are embedded in the deployed source. Import/restore is not implemented yet.

See [setup and deployment](docs/SETUP.md) before your first push. Supabase authentication, private cloud persistence, editable pathways and the first twelve-week term are future work.
