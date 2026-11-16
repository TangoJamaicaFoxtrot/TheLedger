import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
const directory = mkdtempSync(join(tmpdir(), 'ledger-library-'));
const require = createRequire(import.meta.url);
for (const name of ['library-state', 'ledger-state', 'repertoire-state', 'sources']) {
  writeFileSync(join(directory, `${name}.js`), ts.transpileModule(readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
}
const { readBooks, blankBook, bookError, findBooks, matchingBook } = require(join(directory, 'library-state.js'));
const { readLedger } = require(join(directory, 'ledger-state.js'));
const { createRepertoire, savePractice } = require(join(directory, 'repertoire-state.js'));
after(() => rmSync(directory, { recursive: true, force: true }));
const now = '2026-11-16T12:00:00.000Z';
const book = () => ({ ...blankBook('book-1'), title: 'The Count of Monte Cristo', author: 'Alexandre Dumas' });
const note = () => ({ id: 'note-1', kind: 'Question', text: 'Is knowledge a form of freedom?', location: 'Chapter 12', createdAt: now, updatedAt: now });
const legacy = () => ({ entries: [{ id: 'old-entry', title: 'An earlier thought', body: 'Keep this.', date: now }], books: [{ id: 'monte-cristo', title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', status: 'Reading' }] });
test('legacy library migration retains book and journal identities, without modifying original data', () => {
  const before = legacy(); const original = structuredClone(before); const result = readLedger(before);
  assert.equal(result.books[0].id, 'monte-cristo'); assert.equal(result.books[0].status, 'Reading');
  assert.equal(result.books[0].pagesRead, 0); assert.deepEqual(result.books[0].notes, []);
  assert.equal(result.entries[0].body, 'Keep this.'); assert.deepEqual(before, original);
  assert.deepEqual(result.rome, { answers: {}, completedAt: null });
});
test('full backup round trip retains notes, linked reflections, and all existing learning records', () => {
  const b = { ...book(), notes: [note()], pagesRead: 84, totalPages: 1200, tags: ['power'], rating: 4, archived: true, startedOn: '2026-10-28', finishedOn: '', sourceUrl: 'https://example.com/book' };
  const repertoire = savePractice(createRepertoire(['bowline']), { id: 'practice-1', skillId: 'bowline', date: '2026-11-16', duration: 10, notes: 'A better loop.', breakthrough: true, assessment: 1 }, now);
  const record = { books: [b], entries: [{ id: 'entry-1', title: 'Freedom', body: 'A longer thought.', date: now, bookId: b.id, updatedAt: now }], rome: { answers: { reflection: 'My Rome answer.' }, completedAt: now }, sourceProgress: { 'livy-rome': 'Exploring' }, repertoire };
  assert.deepEqual(readLedger(JSON.parse(JSON.stringify({ version: 2, ...record }))), record);
});
test('search finds thoughts, quotation locations and tags; archive and status filters compose', () => {
  const b = { ...book(), tags: ['Renaissance'], notes: [note()], status: 'Reading' };
  assert.equal(findBooks([b], 'freedom', 'Reading', 'Current shelves').length, 1);
  assert.equal(findBooks([b], 'chapter 12', 'All statuses', 'Current shelves').length, 1);
  assert.equal(findBooks([b], 'renaissance', 'Finished', 'Current shelves').length, 0);
  assert.equal(findBooks([{ ...b, archived: true }], '', 'Reading', 'Current shelves').length, 0);
  assert.equal(findBooks([{ ...b, archived: true }], '', 'Reading', 'Archived').length, 1);
});
test('invalid page counts, dates, links, statuses and note data cannot replace a record', () => {
  for (const changes of [{ pagesRead: -1 }, { pagesRead: 2.5 }, { pagesRead: 21, totalPages: 20 }, { totalPages: 0 }, { startedOn: '2026-02-30' }, { startedOn: '2026-11-16', finishedOn: '2026-10-01' }, { sourceUrl: 'javascript:alert(1)' }, { rating: 6 }, { status: 'Unknown' }, { notes: [{ ...note(), text: '' }] }, { notes: [note(), note()] }, { tags: [4] }]) {
    assert.throws(() => readBooks([{ ...book(), ...changes }]));
  }
  assert.equal(bookError({ ...book(), pagesRead: 50, totalPages: null }), null);
  assert.equal(bookError({ ...book(), startedOn: '2028-02-29' }), null);
});
test('backup validation rejects dangling links, duplicate IDs and invalid learning records before restore', () => {
  for (const change of [{ version: 3 }, { entries: [{ ...legacy().entries[0], bookId: 'missing' }] }, { entries: [legacy().entries[0], legacy().entries[0]] }, { books: [book(), book()] }, { rome: { answers: { a: 4 }, completedAt: null } }, { repertoire: { progress: [], entries: [] } }, { sourceProgress: { a: 'not a status' } }]) assert.throws(() => readLedger({ ...legacy(), ...change }));
});
test('duplicate detection allows punctuation differences but distinguishes another author', () => {
  assert.equal(matchingBook([book()], ' THE COUNT OF MONTE-CRISTO ', 'Alexandre Dumas')?.id, 'book-1');
  assert.equal(matchingBook([book()], book().title, 'Someone else'), undefined);
});
