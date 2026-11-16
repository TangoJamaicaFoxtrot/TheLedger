'use client';
import { useEffect, useRef, useState } from 'react';
import Repertoire from '@/components/repertoire';
import { repertoireSkills } from '@/lib/repertoire';
import { createRepertoire, isRepertoireRecord, type RepertoireRecord } from '@/lib/repertoire-state';
import RomeChapter from '@/components/rome-chapter';
import SourceCurriculum from '@/components/source-curriculum';
import { type SourceProgress } from '@/lib/sources';
import { emptyRome, type RomeProgress } from '@/lib/rome';
import { initialBooks } from '@/lib/curriculum';
import ReadingLibrary from '@/components/reading-library';
import ReadingJournal from '@/components/reading-journal';
import BackupRestore, { downloadRecord } from '@/components/backup-restore';
import { blankBook, readBooks, matchingBook, type Book, type BookNote, type JournalEntry as Entry } from '@/lib/library-state';
import { readLedger, type LedgerRecord } from '@/lib/ledger-state';
import type { Source } from '@/lib/sources';
export default function Study() {
 const [repertoire,setRepertoire] = useState<RepertoireRecord>(()=>createRepertoire(repertoireSkills.map(s=>s.id)));
 const [repertoireDirty,setRepertoireDirty] = useState(false);
 const [sourceProgress,setSourceProgress] = useState<SourceProgress>({});
 const [rome,setRome] = useState<RomeProgress>(emptyRome);
 const [chapterDirty,setChapterDirty] = useState(false);
 const [chapterOpen,setChapterOpen] = useState(false);
 const [tab,setTab] = useState('The study');
 const [entries,setEntries] = useState<Entry[]>([]);
 const [books,setBooks] = useState<Book[]>(()=>readBooks(initialBooks));
 const [ready,setReady] = useState(false);
 const [title,setTitle] = useState('');
 const [body,setBody] = useState('');
 const [linkedBook,setLinkedBook] = useState('');
 const [journalSeed,setJournalSeed] = useState(0);
 const [selectedBook,setSelectedBook] = useState<string|null>(null);
 const [libraryDirty,setLibraryDirty] = useState(false);
 const [journalDirty,setJournalDirty] = useState(false);
 const [restoring,setRestoring] = useState(false);
 const [notice,setNotice] = useState('');
 const lastSaved = useRef<string|null>(null);
 const pageHeading = useRef<HTMLHeadingElement>(null);
 useEffect(()=>{pageHeading.current?.focus();},[tab]);
 const dirty = chapterDirty || repertoireDirty || libraryDirty || journalDirty;
 function applyRecord(record:LedgerRecord) {
  setEntries(record.entries);setBooks(record.books);setRome(record.rome);setSourceProgress(record.sourceProgress);
  const defaults=createRepertoire(repertoireSkills.map(s=>s.id));
  setRepertoire(record.repertoire?{...record.repertoire,progress:{...defaults.progress,...record.repertoire.progress}}:defaults);
 }
 useEffect(()=>{
  try {
   const raw=localStorage.getItem('ledger-v1');
   if(raw) applyRecord(readLedger(JSON.parse(raw)));
   lastSaved.current=raw;setReady(true);
  } catch {setNotice('Your saved record could not be loaded. Export the original data to recover it, or restore a valid backup. Saving is paused to protect your record.');}
  const changed=(event:StorageEvent)=>{if(event.key==='ledger-v1'||event.key===null){setReady(false);setNotice('Your record changed in another tab. Reload this page before making more changes.');}};
  window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);
 },[]);
 useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 function persist(nextEntries:Entry[],nextBooks:Book[],nextRome:RomeProgress=rome,nextSourceProgress:SourceProgress=sourceProgress,nextRepertoire:RepertoireRecord=repertoire) {
  if(!ready)return false;
  try {
   if(localStorage.getItem('ledger-v1')!==lastSaved.current){setReady(false);setNotice('Your record changed in another tab. Reload before saving.');return false;}
   const record=readLedger({version:2,entries:nextEntries,books:nextBooks,rome:nextRome,sourceProgress:nextSourceProgress,repertoire:nextRepertoire});
   const raw=JSON.stringify({version:2,...record});
   localStorage.setItem('ledger-v1',raw);lastSaved.current=raw;applyRecord(record);setNotice('');return true;
  }catch{setNotice('This change could not be saved. Your previous record has been kept. Check the details or export a backup if browser storage is full.');return false;}
 }
 function exportRecord(){
  try {const raw=ready?JSON.stringify({version:2,entries,books,rome,sourceProgress,repertoire},null,2):localStorage.getItem('ledger-v1');if(!raw){setNotice('No saved browser record was found to export.');return;}downloadRecord(raw,ready?'the-ledger.json':'the-ledger-recovery.json');}
  catch{setNotice('Your browser could not export the record.');}
 }
 function restore(record:LedgerRecord){
  try {
   const previous=localStorage.getItem('ledger-v1');
   if(previous!==lastSaved.current&&ready){setNotice('Another tab changed your record. Reload before restoring.');return false;}
   if(previous)localStorage.setItem('ledger-before-restore',previous);
   const raw=JSON.stringify({version:2,...record});localStorage.setItem('ledger-v1',raw);lastSaved.current=raw;
   applyRecord(record);setReady(true);setLibraryDirty(false);setJournalDirty(false);setChapterDirty(false);setRepertoireDirty(false);setTab('The study');setNotice('Backup restored. Your previous saved record is retained in this browser as a recovery copy.');return true;
  } catch{setNotice('The backup could not be saved. Your current record has not been replaced.');return false;}
 }
 function navigate(name:string){
  if(name!==tab&&dirty&&!window.confirm('Leave without saving your latest changes?'))return;
  if(name!==tab){if(tab==='Journal'){setTitle('');setBody('');setLinkedBook('');}setLibraryDirty(false);setJournalDirty(false);setChapterDirty(false);setRepertoireDirty(false);}
  setTab(name);
 }
 function reflect(book:Book,note?:BookNote){
  setTitle('On '+book.title);setBody(note?`${note.kind}${note.location?' · '+note.location:''}\n${note.text}\n\n`:'');setLinkedBook(book.id);setJournalSeed(n=>n+1);setTab('Journal');
 }
 function addSource(source:Source){
  if(!ready)return;
  const existing=books.find(b=>b.sourceUrl===source.url)||matchingBook(books,source.title,source.creator)||(source.id==='dumas-monte-cristo'?books.find(b=>b.id==='monte-cristo'):undefined);
  if(existing){setSelectedBook(existing.id);setTab('Library');setNotice('This book is already in your library.');return;}
  const book={...blankBook(crypto.randomUUID()),title:source.title,author:source.creator,discipline:source.discipline,sourceUrl:source.url,tags:[source.topic]};
  if(persist(entries,[book,...books])){setSelectedBook(book.id);setTab('Library');setNotice('Added to your reading list.');}
 }
 const currentBook=books.find(b=>b.status==='Reading'&&!b.archived);
 function saveRome(next:RomeProgress, reflection?:string){const id='reflection-rome-birth';const nextEntries=reflection?[{id,title:'The Birth of Rome · Reflection',body:reflection.trim(),date:new Date().toISOString()},...entries.filter(e=>e.id!==id)]:entries;return persist(nextEntries,books,next);}
 const nav=['The study','Curriculum','Repertoire','Library','Journal'];
 return <div className="shell"><aside><a className="brand" href="/">The Ledger<span>A LIFE OF LEARNING</span></a><div className="nav-label">YOUR DIGITAL STUDY</div><nav aria-label="Main navigation">{nav.map((name,i)=><button key={name} className={tab===name?'active':''} onClick={()=>navigate(name)}><span className="nav-number">0{i+1}</span>{name}</button>)}</nav><div className="aside-note"><span>THE GUIDING PRINCIPLE</span><p>Read widely.<br/>Think deeply.<br/>Make something of it.</p><small>A lifelong education, at your own pace.</small></div></aside><main><header><span>THE POLYMATH PROJECT</span><div className="header-actions"><button className="text-button" onClick={exportRecord}>{ready?'Export your record ↗':'Export original data ↗'}</button><button className="text-button" onClick={()=>{if(dirty&&!window.confirm('Discard unsaved changes if you restore a backup?'))return;setRestoring(v=>!v);}}>Restore backup</button></div></header>{notice&&<p role="status" className="notice">{notice}</p>}{restoring&&<BackupRestore onRestore={restore} onCancel={()=>setRestoring(false)}/>}
 <section className="intro"><div className="eyebrow">THE FOUNDATIONS · CHAPTER ONE</div><h1 ref={pageHeading} tabIndex={-1}>{tab==='The study'?'A lifetime spent learning.':tab==='Curriculum'?'An education without edges.':tab==='Repertoire'?"The Gentleman’s Repertoire.":tab==='Library'?'Keep good company.':'Ideas worth keeping.'}</h1><p>{tab==='The study'?'A place for your books, your questions, and the person you are becoming.':tab==='Curriculum'?'Twelve disciplines. A balance of broad exploration and sustained depth.':tab==='Repertoire'?'Practical, unusual and occasionally eccentric skills worth mastering.':tab==='Library'?'Your reading life, one conversation with a great mind at a time.':'A commonplace book for observations, connections and reflections.'}</p></section>
 {tab==='The study'&&<><article className="course-card"><div className="eyebrow">YOUR CURATED EDUCATION · TWELVE DISCIPLINES</div><h2>Good sources. A place to begin.</h2><p>Explore books, courses, collections and practical guides. Choose one subject to follow deeply, and leave room to discover another.</p><button className="primary" onClick={()=>{setChapterOpen(false);setTab('Curriculum');}}>Explore the source shelves ↗</button></article><div className="study-grid"><article className="feature"><div className="eyebrow">CURRENTLY EXPLORING</div>{currentBook?<div className="book-layout"><div className="book-cover"><span>{currentBook.author}</span><strong>{currentBook.title}</strong><span>❧</span></div><div><span className="pill">{currentBook.discipline.toUpperCase()}</span><h2>{currentBook.title}</h2><p>{currentBook.author}</p><p className="muted">{currentBook.pagesRead}{currentBook.totalPages?' / '+currentBook.totalPages:''} pages · {currentBook.notes.length} {currentBook.notes.length===1?'note':'notes'}</p><button className="primary" onClick={()=>{setSelectedBook(currentBook.id);setTab('Library');}}>Continue your notebook ↗</button></div></div>:<div><h2>What will you read next?</h2><p>Choose a book from your shelves, or add something that has caught your attention.</p><button className="primary" onClick={()=>{setSelectedBook(null);setTab('Library');}}>Open your library ↗</button></div>}</article><article className="journal-card"><div className="eyebrow">THE INTELLECTUAL RECORD</div><h2>Let a thought<br/>take shape.</h2><p>A passage that stayed with you. A question you cannot shake. Start there.</p><button className="primary" onClick={()=>{setTitle('');setBody('');setLinkedBook('');setJournalSeed(n=>n+1);setTab('Journal');}}>Open your journal ↗</button><small>{entries.length} {entries.length===1?'entry':'entries'} in your record</small></article></div><div className="section-heading"><h2>The shape of your education</h2><button className="text-button" onClick={()=>setTab('Curriculum')}>Explore the curriculum →</button></div><div className="principles"><article><span>01 / BREADTH</span><h3>Follow the connections.</h3><p>Half your study opens doors across the twelve disciplines.</p></article><article><span>02 / DEPTH</span><h3>Stay with a question.</h3><p>Half goes to the subjects that reward a closer look.</p></article><article><span>03 / EXPEDITIONS</span><h3>Leave room for wonder.</h3><p>Independent explorations can begin wherever curiosity leads.</p></article></div></>}
 {tab==='Curriculum'&&<>{chapterOpen&&ready?<RomeChapter progress={rome} ready={ready} onSave={saveRome} onDirtyChange={setChapterDirty} onBack={()=>setChapterOpen(false)}/>:<SourceCurriculum progress={sourceProgress} ready={ready} onStatus={(id,status)=>persist(entries,books,rome,{...sourceProgress,[id]:status})} onAddBook={addSource} onReflect={source=>{setTitle(source.title+' · Notes');setBody(source.creator+'\n'+source.url+'\n\n');setLinkedBook('');setJournalSeed(n=>n+1);setTab('Journal');}} onRome={()=>setChapterOpen(true)}/>}</>}
 {tab==='Repertoire'&&<Repertoire record={repertoire} ready={ready} onDirtyChange={setRepertoireDirty} onSave={next=>{if(!ready||!isRepertoireRecord(next)){setNotice('The repertoire change could not be validated. Your saved record has not been replaced.');return false;}return persist(entries,books,rome,sourceProgress,next);}}/>}
 {tab==='Library'&&<ReadingLibrary books={books} entries={entries} ready={ready} selectedId={selectedBook} onSelect={setSelectedBook} onSave={next=>persist(entries,next)} onReflect={reflect} onDirtyChange={setLibraryDirty}/>}
 {tab==='Journal'&&<ReadingJournal key={journalSeed} entries={entries} books={books} ready={ready} initial={{title,body,bookId:linkedBook}} onSave={next=>{const saved=persist(next,books);if(saved){setTitle('');setBody('');setLinkedBook('');}return saved;}} onOpenBook={id=>{setTitle('');setBody('');setLinkedBook('');setJournalDirty(false);setSelectedBook(id);setTab('Library');}} onDirtyChange={setJournalDirty}/>}
 <footer><span>THE LEDGER</span><span>Knowledge · Culture · Character · Craft</span></footer></main></div>;
}
