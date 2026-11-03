export const romeCourse = 'The Roman Republic: Power, Ambition & the Fall of a Political Order';
export const courseChapters = ['The Birth of Rome', 'The Machinery of the Republic', 'Masters of the Mediterranean', 'The Seeds of Destruction', 'The Age of Generals', 'The End of the Republic'];
export const prompts = [
 {id:'geography', title:'01 · Place and possibility', text:'How did the Tiber and Rome’s hills offer both opportunities and difficulties? Explain two connections between geography and settlement.'},
 {id:'evidence', title:'02 · What can we know?', text:'Why does evidence of eighth-century huts fail to prove that Romulus founded Rome in 753 BCE? Distinguish an observation from an inference.'},
 {id:'power', title:'03 · A change of rulers', text:'What changed in the traditional transition from kingship to republic? Whose freedom was still restricted?'},
 {id:'investigation', title:'04 · Investigation: myth against evidence', text:'Read Livy’s preface and 1.4–7. Choose a claim about the twins. Record: (1) the claim and passage; (2) the author’s distance from events and purpose; (3) material evidence that could test part of it; (4) what that evidence cannot establish. End with a verdict: supported, contradicted, or unresolved, and explain your confidence.'},
 {id:'synthesis', title:'05 · Synthesis', text:'In 150–250 words, answer: was Rome born in a single moment? Use one literary tradition and one archaeological observation. Consider how an origin story might legitimise power centuries later.'},
 {id:'reflection', title:'06 · Your intellectual record', text:'Which origin story has shaped your own view of a nation or institution? What happens when you separate its moral meaning from its historical evidence? Connect Rome to politics, rhetoric, or a book you have read.'},
] as const;
export type RomeProgress = { answers: Record<string,string>; completedAt: string | null };
export const emptyRome: RomeProgress = {answers:{},completedAt:null};
export const chronology = [
 ['c. 1000–800 BCE','Material evidence','Burials and traces of settlement show communities in the area before the traditional foundation date.'],
 ['753 BCE','Later tradition','The conventional date for Romulus’s foundation; a retrospective calculation, not an excavated event.'],
 ['c. 700–600 BCE','Material evidence','Settlement and civic spaces develop over time; the Forum valley gradually becomes a shared centre.'],
 ['Sixth century BCE','Material evidence','Monumental building and sanctuaries reveal an increasingly substantial city connected to wider Italy.'],
 ['509 BCE','Later tradition','The conventional expulsion of Tarquinius Superbus and beginning of the Republic. The precise transition remains debated.'],
 ['Late first century BCE','Surviving literature','Livy and Dionysius write about Rome’s beginnings many centuries after the supposed events.'],
];
