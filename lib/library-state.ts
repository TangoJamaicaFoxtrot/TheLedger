export const readingStatuses = ['To read', 'Reading', 'Finished', 'Paused', 'Abandoned'] as const;
export type ReadingStatus = typeof readingStatuses[number];
export const noteKinds = ['Thought', 'Quotation', 'Question'] as const;
export type BookNote = { id: string; kind: typeof noteKinds[number]; text: string; location: string; createdAt: string; updatedAt: string };
export type Book = {
  id: string; title: string; author: string; status: ReadingStatus; discipline: string;
  tags: string[]; pagesRead: number; totalPages: number | null; rating: number | null;
  startedOn: string; finishedOn: string; archived: boolean; notes: BookNote[]; sourceUrl: string;
};
export type JournalEntry = { id: string; title: string; body: string; date: string; bookId?: string; updatedAt?: string };
export const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export const timestamp = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
export function validDay(value: unknown): value is string {
  return typeof value === 'string' && (value === '' || (/^\d{4}-\d{2}-\d{2}$/.test(value) && timestamp(value) && new Date(value).toISOString().slice(0, 10) === value));
}
export const safeUrl = (value: string) => { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };
export function blankBook(id: string): Book {
  return { id, title: '', author: '', status: 'To read', discipline: 'Literature', tags: [], pagesRead: 0, totalPages: null, rating: null, startedOn: '', finishedOn: '', archived: false, notes: [], sourceUrl: '' };
}
export function isNote(value: unknown): value is BookNote {
  return object(value) && typeof value.id === 'string' && !!value.id.trim() && noteKinds.includes(value.kind as BookNote['kind']) && typeof value.text === 'string' && !!value.text.trim() && typeof value.location === 'string' && timestamp(value.createdAt) && timestamp(value.updatedAt);
}
export function bookError(book: Book): string | null {
  if (!book.title.trim() || !book.author.trim()) return 'Add both a title and an author.';
  if (!Number.isInteger(book.pagesRead) || book.pagesRead < 0 || (book.totalPages !== null && (!Number.isInteger(book.totalPages) || book.totalPages < 1))) return 'Use whole page numbers, with a positive total.';
  if (book.totalPages !== null && book.pagesRead > book.totalPages) return 'Your current page cannot exceed the total pages.';
  if (!validDay(book.startedOn) || !validDay(book.finishedOn)) return 'Use valid reading dates.';
  if (book.startedOn && book.finishedOn && book.startedOn > book.finishedOn) return 'The finish date cannot be before the start date.';
  if (book.sourceUrl && !safeUrl(book.sourceUrl)) return 'Use a complete http or https link.';
  return null;
}
// Old four-field books acquire defaults without replacing their IDs or reading status.
export function readBooks(value: unknown): Book[] {
  if (!Array.isArray(value)) throw Error('The library is missing.');
  const books = value.map(item => {
    if (!object(item) || typeof item.id !== 'string' || !item.id.trim() || typeof item.title !== 'string' || typeof item.author !== 'string') throw Error('A book is invalid.');
    const book = { ...blankBook(item.id), ...item } as Book;
    if (!readingStatuses.includes(book.status) || typeof book.discipline !== 'string' || !Array.isArray(book.tags) || !book.tags.every(t => typeof t === 'string') || typeof book.archived !== 'boolean' || !Array.isArray(book.notes) || !book.notes.every(isNote) || new Set(book.notes.map(n => n.id)).size !== book.notes.length || (book.rating !== null && (!Number.isInteger(book.rating) || book.rating < 1 || book.rating > 5)) || typeof book.sourceUrl !== 'string' || bookError(book)) throw Error('A book contains invalid details.');
    return book;
  });
  if (new Set(books.map(b => b.id)).size !== books.length) throw Error('The library contains duplicate IDs.');
  return books;
}
export function matchingBook(books: Book[], title: string, author: string) {
  const normalise = (text: string) => text.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  return books.find(b => normalise(b.title) === normalise(title) && normalise(b.author) === normalise(author));
}
export function findBooks(books: Book[], query: string, status: string, shelf: string) {
  const term = query.trim().toLocaleLowerCase();
  return books.filter(b => (shelf === 'Archived' ? b.archived : !b.archived) && (status === 'All statuses' || b.status === status) && [b.title, b.author, b.discipline, ...b.tags, ...b.notes.flatMap(n => [n.text, n.location])].join(' ').toLocaleLowerCase().includes(term));
}
