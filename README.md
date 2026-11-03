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

## First depth chapter

Curriculum → The Roman Republic → The Birth of Rome opens the first complete chapter, also linked from the study dashboard. The remaining five chapters are marked as planned. The chapter includes a schematic map, evidence-labelled chronology, primary and modern readings, comprehension checks, a source investigation and synthesis/reflection prompts.

Save responses explicitly before leaving. Completion requires all six responses, records a completion date and creates a linked journal reflection. Recompletion updates that reflection rather than duplicating it. Saving edits as a draft reopens the chapter. Existing `ledger-v1` records without course progress continue to load; exports now include `rome.answers` and `rome.completedAt`. All records remain browser-local, without cross-device sync or import/restore.

## Curated source curriculum

The curriculum now opens with twelve discipline shelves, each with four starter subject areas. Choose a discipline, browse all sources, or search by title, creator or subject. Topic, format and progress filters help narrow the selection. The catalogue contains 60 books, courses, guides and collections across 48 described areas with provider links, access notes, a reason to explore and a concrete starting point. Full material is read on the provider’s site; no external text is copied into the app.

Catalogue content lives in `lib/sources.ts`, with area descriptions in `lib/source-areas.ts`, separately from the reusable browser in `components/source-curriculum.tsx`. Add recommendations using stable, unique IDs and the existing discipline names. Add a description for every new area. Optional source roles distinguish another perspective, practice and a next step. Discipline shelves expose area buttons; all-source results load twelve at a time. Review the provider, URL, access conditions and starting instructions before adding a source; update the displayed review date when refreshing the selection. This is a starter collection, not a complete syllabus for any discipline.

Source status (To explore / Exploring / Explored) is stored as the optional `sourceProgress` field in the existing browser record and JSON export. Older records without it load unchanged, and other journal/book/chapter saves retain it. “Explored” is a personal marker, not a mastery score. Journal notes are optional and begin with the source’s attribution and URL. The Rome chapter remains an optional History companion with its existing progress preserved.
