'use client';
import { useEffect, useRef, useState } from 'react';
import { areaDescriptions } from '@/lib/source-areas';
import { disciplines } from '@/lib/curriculum';
import { sources, sourceStatuses, type Source, type SourceProgress, type SourceStatus } from '@/lib/sources';

type Props = {
 progress: SourceProgress;
 ready: boolean;
 onStatus: (id:string,status:SourceStatus)=>void;
 onReflect: (source:Source)=>void;
 onRome: ()=>void;
};
export default function SourceCurriculum({progress,ready,onStatus,onReflect,onRome}:Props) {
 const [visibleCount,setVisibleCount]=useState(12);
 const [view,setView]=useState<'overview'|'areas'|'sources'>('overview');
 const heading=useRef<HTMLHeadingElement>(null);
 const content=useRef<HTMLElement>(null);
 const firstRender=useRef(true);
 const [discipline,setDiscipline]=useState('All disciplines');
 const [query,setQuery]=useState('');
 const [format,setFormat]=useState('All formats');
 const [status,setStatus]=useState('All statuses');
 const [topic,setTopic]=useState('All topics');
 useEffect(()=>{if(firstRender.current){firstRender.current=false;return;}heading.current?.focus({preventScroll:true});content.current?.scrollIntoView({block:'start'});},[view,discipline,topic]);
 const topics=Array.from(new Set(sources.filter(s=>discipline==='All disciplines'||s.discipline===discipline).map(s=>s.topic)));
 const filtered=sources.filter(s=>(discipline==='All disciplines'||s.discipline===discipline)&&(topic==='All topics'||s.topic===topic)&&(format==='All formats'||s.format===format)&&(status==='All statuses'||(progress[s.id]||'To explore')===status)&&`${s.title} ${s.creator} ${s.discipline} ${s.topic} ${s.why}`.toLowerCase().includes(query.trim().toLowerCase()));
 const visibleSources=filtered.slice(0,visibleCount);
 const areaCount=new Set(sources.map(s=>`${s.discipline}:${s.topic}`)).size;
 function resetFilters(){setQuery('');setFormat('All formats');setStatus('All statuses');setVisibleCount(12);}
 function overview(){setView('overview');setDiscipline('All disciplines');setTopic('All topics');resetFilters();}
 function choose(name:string){setDiscipline(name);setTopic('All topics');setView(name==='All disciplines'?'sources':'areas');resetFilters();}
 function openTopic(name:string){setTopic(name);setView('sources');resetFilters();}
 return <section ref={content} className="source-curriculum" aria-label="Curated curriculum">
  <nav className="curriculum-breadcrumb" aria-label="Curriculum location">
   {view==='overview'?<span aria-current="page">Curriculum</span>:<button className="text-button" onClick={overview}>Curriculum</button>}
   {view!=='overview'&&<><span aria-hidden="true">/</span>{view==='areas'?<span aria-current="page">{discipline}</span>:discipline==='All disciplines'?<span aria-current="page">All sources</span>:<><button className="text-button" onClick={()=>choose(discipline)}>{discipline}</button><span aria-hidden="true">/</span><span aria-current="page">{topic==='All topics'?'All sources':topic}</span></>}</>}
  </nav>
  <h2 className="curriculum-view-title" ref={heading} tabIndex={-1}>{view==='overview'?'Your guide to a wider world.':view==='areas'?discipline:topic!=='All topics'?topic:discipline==='All disciplines'?'All sources':`${discipline} sources`}</h2>
  {view==='overview'&&<>
   <div className="balance"><span>50% BREADTH</span><span>50% DEPTH</span></div>
   <p className="muted">A balance of attention, not a completion target. Sample widely, then stay with one book, course or subject. Reflections are always optional.</p>
   <p className="eyebrow">{disciplines.length} DISCIPLINES · {areaCount} AREAS · {sources.length} SOURCES</p>
   <p>Choose a discipline to enter its subject areas, then choose an area to find books, courses and collections.</p>
   <form className="curriculum-search" onSubmit={e=>{e.preventDefault();setView('sources');setVisibleCount(12);}}><label htmlFor="curriculum-search">Search across the curriculum</label><div><input id="curriculum-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Title, subject or creator"/><button className="primary">Search →</button></div></form>
   <div className="discipline-picker" aria-label="Choose a discipline">
    {disciplines.map(([name],i)=><button key={name} onClick={()=>choose(name)}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><strong>{name}</strong><span>{new Set(sources.filter(s=>s.discipline===name).map(s=>s.topic)).size} areas · {sources.filter(s=>s.discipline===name).length} sources →</span></button>)}
   </div><button className="text-button" onClick={()=>choose('All disciplines')}>Browse all {sources.length} sources →</button>
  </>}
  {view==='areas'&&<section className="topic-shelves" aria-label={`${discipline} subject areas`}>
   <button className="text-button" onClick={overview}>← All disciplines</button>
   <p>A working map of {discipline.toLowerCase()}. Choose a subject area to explore its sources.</p>
   <div className="topic-grid">{topics.map(name=><button key={name} onClick={()=>openTopic(name)}><strong>{name}</strong><span>{areaDescriptions[name]}</span><small>{sources.filter(s=>s.discipline===discipline&&s.topic===name).length} {sources.filter(s=>s.discipline===discipline&&s.topic===name).length===1?'source':'sources'} →</small></button>)}</div>
   <button className="text-button" onClick={()=>openTopic('All topics')}>Browse all {sources.filter(s=>s.discipline===discipline).length} {discipline.toLowerCase()} sources →</button>
   {discipline==='History'&&<article className="course-card rome-companion"><div className="eyebrow">OPTIONAL STUDY COMPANION</div><h3>The Birth of Rome</h3><p>Explore the introduction, map and source investigation. Your saved chapter work is preserved.</p><button className="text-button" onClick={onRome}>Open the Rome companion →</button></article>}
  </section>}
  {view==='sources'&&<>
   <button className="text-button" onClick={()=>discipline==='All disciplines'?overview():choose(discipline)}>← {discipline==='All disciplines'?'All disciplines':`${discipline} areas`}</button>
   {topic!=='All topics'&&<p>{areaDescriptions[topic]}</p>}
  <div className="source-filters">
   <label htmlFor="source-search">Find a source<input id="source-search" type="search" value={query} onChange={e=>{setQuery(e.target.value);setVisibleCount(12);}} placeholder="Title, subject or creator"/></label>
   <label htmlFor="source-topic">Topic<select id="source-topic" aria-label="Topic" value={topic} onChange={e=>{setTopic(e.target.value);setVisibleCount(12);}}><option>All topics</option>{topics.map(t=><option key={t}>{t}</option>)}</select></label>
   <label htmlFor="source-format">Format<select id="source-format" aria-label="Format" value={format} onChange={e=>{setFormat(e.target.value);setVisibleCount(12);}}><option>All formats</option>{['Book','Course','Guide','Collection'].map(f=><option key={f}>{f}</option>)}</select></label>
   <label htmlFor="source-progress-filter">Your progress<select id="source-progress-filter" aria-label="Filter by progress" value={status} onChange={e=>{setStatus(e.target.value);setVisibleCount(12);}}><option>All statuses</option>{sourceStatuses.map(s=><option key={s}>{s}</option>)}</select></label>
  </div>
  <div className="section-heading"><h3>Sources to explore</h3><p role="status" className="muted">{filtered.length} {filtered.length===1?'source':'sources'}</p></div>
  <p className="muted">“Explored” means you have engaged with a source to your satisfaction; it does not claim mastery or that you have read every page. Progress stays in this browser and is included in your export.</p>
  {filtered.length===0?<div className="empty"><h3>No sources match these filters.</h3><button className="text-button" onClick={()=>{resetFilters();}}>Clear filters →</button></div>:<div className="source-grid">{visibleSources.map(source=><article className="source-card" key={source.id}>
   <div className="eyebrow">{source.discipline} · {source.topic}</div><h3>{source.title}</h3><p className="source-creator">{source.creator}</p><div className="source-meta"><span>{source.role||'Start here'}</span><span>{source.format}</span><span>{source.access}</span></div>
   <p>{source.why}</p><div className="source-start"><strong>BEGIN HERE</strong><p>{source.begin}</p></div>
   <a className="source-link" href={source.url} target="_blank" rel="noopener noreferrer">Open source ↗<span className="sr-only">: {source.title} (new tab)</span></a>
   <label htmlFor={`status-${source.id}`}>Your progress</label><select id={`status-${source.id}`} aria-label={`Progress for ${source.title}`} disabled={!ready} value={progress[source.id]||'To explore'} onChange={e=>onStatus(source.id,e.target.value as SourceStatus)}>{sourceStatuses.map(s=><option key={s}>{s}</option>)}</select>
   <button className="text-button" onClick={()=>onReflect(source)}>Keep a note in your journal →</button>
  </article>)}</div>}{filtered.length>visibleSources.length&&<div className="load-sources"><p className="muted">Showing {visibleSources.length} of {filtered.length} matching sources</p><button className="primary" onClick={()=>setVisibleCount(visibleCount+12)}>Show more sources ↓</button></div>}</>}
  <p className="muted">Growing collection · Sources reviewed 3 November 2026. Books, courses, guides and reference collections have different scopes; the access label describes the linked material. Project Gutenberg editions are public domain in the USA; availability elsewhere depends on local rights. External sites maintain their own content and any optional account features.</p>
 </section>;
}
