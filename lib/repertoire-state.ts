import type { Level } from './repertoire';
export type SkillProgress = {active:boolean; startedAt:string|null; assessments:Partial<Record<Level,string>>};
export type PracticeEntry = {id:string; skillId:string; date:string; duration:number|null; notes:string; breakthrough:boolean; assessment:Level|null};
export type RepertoireRecord = {progress:Record<string,SkillProgress>; entries:PracticeEntry[]};
export function createRepertoire(skillIds:string[]):RepertoireRecord {
 return {progress:Object.fromEntries(skillIds.map(id=>[id,{active:true,startedAt:null,assessments:{}}])),entries:[]};
}
export function levelOf(progress?:SkillProgress):number {
 let level=0;
 while(level<4&&progress?.assessments[(level+1) as Level])level++;
 return level;
}
function isObject(value:unknown):value is Record<string,unknown>{return !!value&&typeof value==='object'&&!Array.isArray(value);}
function timestamp(value:unknown):value is string{return typeof value==='string'&&Number.isFinite(Date.parse(value));}
export function validPracticeDate(value:unknown):value is string {
 return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
}
export function isRepertoireRecord(value:unknown):value is RepertoireRecord {
 if(!isObject(value)||!isObject(value.progress)||!Array.isArray(value.entries))return false;
 const progressValid=Object.values(value.progress).every(p=>{
  if(!isObject(p)||typeof p.active!=='boolean'||(p.startedAt!==null&&!timestamp(p.startedAt))||!isObject(p.assessments))return false;
  const assessments=p.assessments;
  const keys=Object.keys(assessments);
  return keys.every(k=>['1','2','3','4'].includes(k)&&timestamp(assessments[k]))
   &&[1,2,3,4].every(n=>!(String(n) in assessments)||Array.from({length:n},(_,i)=>String(i+1)).every(k=>k in assessments));
 });
 const entriesValid=value.entries.every(e=>isObject(e)&&typeof e.id==='string'&&!!e.id&&typeof e.skillId==='string'&&!!e.skillId&&validPracticeDate(e.date)&&(e.duration===null||(typeof e.duration==='number'&&Number.isInteger(e.duration)&&e.duration>0&&e.duration<=1440))&&typeof e.notes==='string'&&e.notes.trim().length>0&&typeof e.breakthrough==='boolean'&&(e.assessment===null||[1,2,3,4].includes(e.assessment as number)));
 return progressValid&&entriesValid&&new Set(value.entries.map(e=>(e as PracticeEntry).id)).size===value.entries.length;
}
export function setAssessment(record:RepertoireRecord,skillId:string,level:Level,complete:boolean,now:string):RepertoireRecord {
 const old=record.progress[skillId]||{active:false,startedAt:null,assessments:{}};
 if(complete&&level>levelOf(old)+1)throw Error('Record the earlier assessments first.');
 const assessments={...old.assessments};
 if(complete)assessments[level]=now;
 else for(let n=level;n<=4;n++)delete assessments[n as Level];
 return {...record,progress:{...record.progress,[skillId]:{...old,startedAt:old.startedAt||(complete?now:null),assessments}}};
}
export function savePractice(record:RepertoireRecord,entry:PracticeEntry,now:string):RepertoireRecord {
 const old=record.progress[entry.skillId]||{active:false,startedAt:null,assessments:{}};
 let next={...record,progress:{...record.progress,[entry.skillId]:{...old,startedAt:old.startedAt||now}}};
 if(entry.assessment&&!old.assessments[entry.assessment])next=setAssessment(next,entry.skillId,entry.assessment,true,now);
 const index=record.entries.findIndex(e=>e.id===entry.id);
 const entries=index<0?[entry,...record.entries]:record.entries.map(e=>e.id===entry.id?entry:e);
 return {...next,entries};
}
