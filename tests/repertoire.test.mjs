import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import ts from 'typescript';
const directory=mkdtempSync(join(tmpdir(),'ledger-repertoire-'));
const require=createRequire(import.meta.url);
function load(name){const path=join(directory,`${name}.cjs`);writeFileSync(path,ts.transpileModule(readFileSync(new URL(`../lib/${name}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText);return require(path);}
const {repertoireSkills:skills,repertoireDisciplines:disciplines}=load('repertoire');
const {createRepertoire,levelOf,isRepertoireRecord,setAssessment,savePractice,validPracticeDate}=load('repertoire-state');
const now='2026-11-04T12:00:00.000Z';
const initial=()=>createRepertoire(skills.map(s=>s.id));
after(()=>rmSync(directory,{recursive:true,force:true}));
test('launch collection is complete and all links resolve inside the catalogue',()=>{
 assert.equal(skills.length,3);assert.equal(disciplines.length,10);assert.equal(new Set(skills.map(s=>s.id)).size,skills.length);
 for(const s of skills){assert(disciplines.some(d=>d.id===s.disciplineId));assert.equal(s.assessments.length,4);assert(s.assessments.every(Boolean));assert(s.instructions.length>=5);assert(s.relatedIds.every(id=>skills.some(other=>other.id===id)));assert.equal(new URL(s.reference.url).protocol,'https:');}
});
test('default activation does not award competence or mark a skill as started',()=>{const r=initial();assert(isRepertoireRecord(r));assert.equal(Object.values(r.progress).filter(p=>p.active).length,3);for(const p of Object.values(r.progress)){assert.equal(levelOf(p),0);assert.equal(p.startedAt,null);}});
test('assessment sequence records competence and reopening a level reopens later levels',()=>{
 const r=initial();assert.throws(()=>setAssessment(r,'bowline',3,true,now));let next=r;for(const n of [1,2,3,4])next=setAssessment(next,'bowline',n,true,now);
 assert.equal(levelOf(next.progress.bowline),4);assert(isRepertoireRecord(next));next=setAssessment(next,'bowline',2,false,now);assert.equal(levelOf(next.progress.bowline),1);assert.equal(next.progress.bowline.assessments[4],undefined);assert.equal(levelOf(r.progress.bowline),0);
});
test('practice alone starts a skill but never grants competence; edits retain entry identity',()=>{
 const entry={id:'practice-1',skillId:'french-drop',date:'2026-11-04',duration:3,notes:'A more natural transfer.',breakthrough:false,assessment:null};
 let r=savePractice(initial(),entry,now);assert.equal(levelOf(r.progress['french-drop']),0);assert.equal(r.progress['french-drop'].startedAt,now);
 r=savePractice(r,{...entry,notes:'Updated note.',duration:null},now);assert.equal(r.entries.length,1);assert.equal(r.entries[0].notes,'Updated note.');assert(isRepertoireRecord(r));
});
test('an assessment and practice note save as one record; editing or removing notes preserves assessments',()=>{
 const entry={id:'practice-1',skillId:'bowline',date:'2026-11-04',duration:null,notes:'Recognised the collar.',breakthrough:true,assessment:1};
 const original=initial();const r=savePractice(original,entry,now);assert.equal(r.entries.length,1);assert.equal(levelOf(r.progress.bowline),1);assert.equal(original.entries.length,0);
 const edited=savePractice(r,{...entry,assessment:null},now);assert.equal(levelOf(edited.progress.bowline),1);const removed={...edited,entries:[]};assert.equal(levelOf(removed.progress.bowline),1);assert(isRepertoireRecord(removed));
});
test('deactivation and reactivation preserve progress and journal history',()=>{
 let r=setAssessment(initial(),'finger-whistle',1,true,now);const original=structuredClone(r);r={...r,progress:{...r.progress,'finger-whistle':{...r.progress['finger-whistle'],active:false}}};
 assert.equal(levelOf(r.progress['finger-whistle']),1);assert.deepEqual(r.entries,original.entries);r.progress['finger-whistle'].active=true;assert.deepEqual(r,original);
});
test('malformed stored records are rejected rather than silently reset',()=>{
 for(const bad of [null,{},[],{progress:[],entries:[]},{progress:{bowline:{active:true,startedAt:null,assessments:{4:now}}},entries:[]}])assert.equal(isRepertoireRecord(bad),false);
 const entry={id:'x',skillId:'bowline',date:'2026-11-04',duration:3,notes:'Practice.',breakthrough:false,assessment:null};
 for(const change of [{date:'2026-02-31'},{duration:-1},{duration:1.5},{duration:1441},{notes:''},{assessment:7}])assert.equal(isRepertoireRecord({...initial(),entries:[{...entry,...change}]}),false);
 assert.equal(isRepertoireRecord({...initial(),entries:[entry,entry]}),false);assert.equal(validPracticeDate('2028-02-29'),true);assert.equal(validPracticeDate('2026-02-29'),false);
});
