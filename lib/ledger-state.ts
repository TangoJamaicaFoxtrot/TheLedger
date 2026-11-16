import { readBooks, object, timestamp, type Book, type JournalEntry } from './library-state';
import { isRepertoireRecord, type RepertoireRecord } from './repertoire-state';
import type { RomeProgress } from './rome';
import { sourceStatuses, type SourceProgress, type SourceStatus } from './sources';
export type LedgerRecord = { entries: JournalEntry[]; books: Book[]; rome: RomeProgress; sourceProgress: SourceProgress; repertoire?: RepertoireRecord };
export function readLedger(value: unknown): LedgerRecord {
  if (!object(value) || (value.version !== undefined && value.version !== 1 && value.version !== 2)) throw Error('This is not a supported Ledger backup.');
  const books = readBooks(value.books);
  if (!Array.isArray(value.entries) || !value.entries.every(e => object(e) && typeof e.id === 'string' && !!e.id.trim() && typeof e.title === 'string' && typeof e.body === 'string' && timestamp(e.date) && (e.updatedAt === undefined || timestamp(e.updatedAt)) && (e.bookId === undefined || books.some(b => b.id === e.bookId)))) throw Error('A journal entry is invalid or linked to a missing book.');
  const entries = value.entries as JournalEntry[];
  if (new Set(entries.map(e => e.id)).size !== entries.length) throw Error('Journal entry IDs must be unique.');
  const rome = value.rome ?? { answers: {}, completedAt: null };
  if (!object(rome) || !object(rome.answers) || !Object.values(rome.answers).every(v => typeof v === 'string') || (rome.completedAt !== null && !timestamp(rome.completedAt))) throw Error('Rome chapter progress is invalid.');
  const sourceProgress = value.sourceProgress ?? {};
  if (!object(sourceProgress) || !Object.values(sourceProgress).every(v => sourceStatuses.includes(v as SourceStatus))) throw Error('Curriculum progress is invalid.');
  if (value.repertoire !== undefined && !isRepertoireRecord(value.repertoire)) throw Error('Repertoire progress is invalid.');
  return { entries, books, rome: rome as RomeProgress, sourceProgress: sourceProgress as SourceProgress, ...(value.repertoire === undefined ? {} : { repertoire: value.repertoire }) };
}
