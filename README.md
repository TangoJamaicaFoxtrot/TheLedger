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

The curriculum now opens with twelve discipline shelves, each with four starter subject areas. Navigation is nested: Curriculum → discipline → subject area → sources. Each level replaces the previous view within the curriculum section. Breadcrumbs and back controls return to a parent level; opening a new level moves focus to its heading. Global search and browsing all sources are available from the overview. Topic, format and progress filters help narrow the selection. The catalogue contains 60 books, courses, guides and collections across 48 described areas with provider links, access notes, a reason to explore and a concrete starting point. Full material is read on the provider’s site; no external text is copied into the app.

Catalogue content lives in `lib/sources.ts`, with area descriptions in `lib/source-areas.ts`, separately from the reusable browser in `components/source-curriculum.tsx`. Add recommendations using stable, unique IDs and the existing discipline names. Add a description for every new area. Optional source roles distinguish another perspective, practice and a next step. Discipline views expose area buttons; all-source results load twelve at a time. Review the provider, URL, access conditions and starting instructions before adding a source; update the displayed review date when refreshing the selection. This is a starter collection, not a complete syllabus for any discipline.

Source status (To explore / Exploring / Explored) is stored as the optional `sourceProgress` field in the existing browser record and JSON export. Older records without it load unchanged, and other journal/book/chapter saves retain it. “Explored” is a personal marker, not a mastery score. Journal notes are optional and begin with the source’s attribution and URL. The Rome chapter remains an optional History companion with its existing progress preserved.

## The Gentleman's Repertoire

Open **Repertoire** in the main navigation. This independent practical-skills pillar has an overview, a collection grouped into ten disciplines, an active workspace and a practice journal. It launches with three developed guides: the one-handed finger whistle, bowline and French Drop. Empty disciplines explicitly have no launch skills; they do not contain placeholder tasks. All three launch skills start active, with no competence awarded.

Each reusable skill view includes equipment, instructions, practice suggestions, difficulties, care notes, four assessments, related skills and its practice history. Users record their own successful demonstrations in order: Novice, Practitioner, Proficient, Mastery. “Demonstrated” on the overview means Practitioner or higher. Assessments have dates; hours, activity and activation do not award a level. Reopening a level also reopens later levels. No performance is independently verified.

Practice notes support date, optional duration, a breakthrough flag and an optional completed assessment. They can be edited or removed. Saving an assessment with a note is one browser-storage write. Assessment records are separate from notes: removing a note or clearing its association does not revoke competence; use Reopen assessment on the skill page. Deactivating a skill preserves its assessments and notes. Dates and last-practised activity are derived from the records, without streaks or deadlines.

Catalogue data lives in `lib/repertoire.ts`; record types, validation and state transitions live in `lib/repertoire-state.ts`; `components/repertoire.tsx` renders every skill using the same view. Use stable skill and discipline IDs when extending the collection. The parent study component saves the optional `repertoire` field alongside entries, books, Rome progress and source progress in the existing `ledger-v1` record. Older records without the field initialise the launch defaults. Exports include it. Malformed records disable saving rather than resetting stored data. No database, authentication, dependencies or environment variables were added. Records remain browser-local; clearing browser storage loses them, and import/sync are not implemented.

Run `npm test` for catalogue and progress-transition checks, `npm run typecheck` for types and `npm run build` for the production build. There is no separate lint command configured.

Review on branch `codex/gentlemans-repertoire`: run `npm run dev`, open the local URL and test the Repertoire views on desktop/mobile. Review the diff, excluding any unrelated local setup-note edits. After personal identity checks, commit and push this branch for a pull request into `main`. Review the preview and obtain explicit production authorisation before merging; connected Vercel deployments may run automatically. This implementation does not merge, deploy or modify production data.
