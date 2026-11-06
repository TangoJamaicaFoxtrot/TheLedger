export const competenceLevels = ['Not yet assessed', 'Novice', 'Practitioner', 'Proficient', 'Mastery'] as const;
export type Level = 1 | 2 | 3 | 4;
export const repertoireDisciplines = [
 {id:'dexterity',number:'I',name:'Dexterity & Deception',description:'Small feats of coordination, sleight of hand and playful surprise.'},
 {id:'knotcraft',number:'II',name:'Knotcraft & Practicality',description:'Useful knots, careful repairs and everyday resourcefulness.'},
 {id:'exploration',number:'III',name:'Exploration & Navigation',description:'Find your bearings and read the world around you.'},
 {id:'memory',number:'IV',name:'Mind & Memory',description:'Train attention, recall and deliberate thought.'},
 {id:'craftsmanship',number:'V',name:'Craftsmanship',description:'Develop a feel for tools, materials and making.'},
 {id:'communication',number:'VI',name:'Communication',description:'Make meaning through words, signs and signals.'},
 {id:'physical',number:'VII',name:'Physical Proficiency',description:'Explore balance, coordination and controlled movement.'},
 {id:'nature',number:'VIII',name:'Natural History',description:'Recognise the living world and its changing conditions.'},
 {id:'social',number:'IX',name:'Social Arts',description:'Practise conversation, hospitality and the art of putting others at ease.'},
 {id:'self-reliance',number:'X',name:'Self-Reliance',description:'Care for your tools, surroundings and practical preparedness.'},
];
export type RepertoireSkill = {
 id:string; slug:string; number:string; name:string; disciplineId:string; description:string;
 difficulty:string; equipment:string[]; setup:string; why:string; instructions:string[];
 practice:string[]; mistakes:string[]; safety:string[]; assessments:[string,string,string,string];
 tags:string[]; relatedIds:string[]; reference:{label:string;url:string};
};
export const repertoireSkills:RepertoireSkill[] = [
 {id:'finger-whistle',slug:'one-handed-finger-whistle',number:'001',name:'The One-Handed Finger Whistle',disciplineId:'dexterity',description:'Produce a clear, piercing whistle with the thumb and index finger of one hand.',difficulty:'Patient beginner',equipment:['Clean hands'],setup:'A quiet outdoor space away from other people’s ears. No special equipment.',why:'An entertaining feat of control: a tiny adjustment can turn a breath of air into a remarkably effective signal.',instructions:[
  'Wash your hands. Touch the pads of your thumb and index finger together to form an O; keep the other fingers comfortably clear of your mouth.',
  'Moisten your lips and curl them gently inward over your teeth. Keep the jaw relaxed rather than clamping down.',
  'Lift the tongue tip slightly. Place the joined fingertips just inside your mouth and gently guide the tip back, so it folds a little behind the fingers. Do not force the tongue or push deeply.',
  'Close the lips snugly around the fingers, leaving a small central air passage. Keep your fingertips together and away from your teeth.',
  'Blow a short, controlled breath through the opening. Change one small thing at a time: finger angle, tongue position or the size of the lip opening. Look for a faint tone before increasing the airflow.',
  'Once a tone appears, pause, reset and try to reproduce the same position. Clear sound comes from the seal and airflow, not simply from blowing harder.'
 ],practice:['Try five gentle breaths, then take a break. A three-minute experiment counts as practice.','When you find a tone, note the finger angle and tongue position that worked.','Practise setting up afresh between attempts; consistency matters more than a single loud success.'],mistakes:['Air escaping around the fingers: improve the lip seal.','Only a rush of air: narrow the opening slightly and adjust the tongue tip.','Excessive force or tension: soften the jaw and use a shorter breath.','An opening that is too large: bring the lips closer around the fingers.'],safety:['Keep hands clean and pressure gentle. Stop if your mouth feels sore or you feel light-headed.','Practise away from people’s and animals’ ears. Do not chase volume in an enclosed space.'],assessments:[
  'Explain the lip, finger and tongue positions and practise setting them up gently.',
  'Produce a clear whistle at least once.',
  'Produce a clear whistle on at least four of five fresh attempts, resetting between each.',
  'Produce a clear, loud whistle on demand on five consecutive fresh attempts, in a suitable open space.'
 ],tags:['coordination','signalling','three-minute practice'],relatedIds:['french-drop'],reference:{label:'Further demonstration: one-handed finger-whistle guide',url:'https://guides.brit.co/guides/whistle-on-fingers'}},
 {id:'bowline',slug:'bowline',number:'002',name:'The Bowline',disciplineId:'knotcraft',description:'Tie and dress a fixed loop from memory, recognising its structure before testing your speed.',difficulty:'Beginner',equipment:['Approximately 1–2 metres of supple practice rope'],setup:'A clear tabletop. Use unloaded rope and keep a generous free end.',why:'A useful introduction to how rope structures work. Learning to inspect a knot is as valuable as remembering how to tie it.',instructions:[
  'Identify the standing part (the long section) and the working end (the short free end). Leave enough working end for the size of loop you want and a generous tail.',
  'Make a small loop in the standing part, with the standing part running beneath the crossing. This is the rabbit’s hole; keep the longer standing part pointing away from you.',
  'Bring the working end up through this small loop from underneath. The larger loop below it will become the fixed loop.',
  'Take the working end around the back of the standing part, then down through the same small loop. Remember: out of the hole, around the tree, back into the hole.',
  'Hold the working end alongside the adjacent side of the large loop while pulling the standing part to settle the knot. Dress the strands neatly, leaving a generous tail inside the large loop.',
  'Compare your result with the linked animation. Check that the working end went around the standing part, that the collar surrounds it, and that the large loop does not run freely. Untie and repeat before trying the timed challenge.'
 ],practice:['Tie slowly beside the animation, then cover the instructions and reconstruct it.','Inspect and untie every attempt; speed is useful only after the shape is right.','For the timed challenge, start with straight rope laid out and finish only once the knot is dressed. Inspect it afterwards.'],mistakes:['A loop that slides: retrace the route around the standing part.','Running the tail around the wrong strand: identify the long standing part before continuing.','A neat-looking but incorrect knot: compare the strand path, not just the silhouette.','A short tail or loose dressing: reset with more rope rather than rushing.'],safety:['This is an unloaded practice exercise. Do not use a beginner’s bowline for climbing, human suspension, rescue or any life-critical application.','A bowline can loosen when unloaded and can be tied incorrectly. A time record is not evidence that a knot is safe to use.'],assessments:[
  'Identify standing part, working end, fixed loop and collar on a correctly formed bowline.',
  'Tie, dress and inspect a correct bowline using the instructions.',
  'Tie and dress five correct bowlines consecutively without instructions, inspecting each one.',
  'Tie and dress a correct bowline from memory in under 10 seconds, starting with straight unloaded rope; verify the structure afterwards.'
 ],tags:['rope','practicality','inspection'],relatedIds:['finger-whistle'],reference:{label:'Compare your knot: Animated Knots by Grog',url:'https://www.animatedknots.com/bowline-knot'}},
 {id:'french-drop',slug:'french-drop',number:'003',name:'The French Drop',disciplineId:'dexterity',description:'Make a coin apparently vanish through a false transfer and natural attention.',difficulty:'Beginner · performance takes practice',equipment:['A coin, such as a 50p','A mirror or camera, optional'],setup:'Sit or stand at a comfortable height with a soft surface below your hands.',why:'A miniature lesson in attention. The mechanics create the possibility; a believable action makes the effect.',instructions:[
  'First transfer the coin genuinely a few times. Observe the speed, hand shapes and where your eyes naturally follow it. This is the action you will imitate.',
  'Hold the coin visibly near the fingertips of your non-dominant hand, between the thumb and fingers. Keep the palm relaxed and slightly cupped.',
  'Bring the other hand towards the coin as if to take it. The taking thumb passes behind the coin while the fingers cover it from the audience’s view.',
  'Under that cover, release the coin into the curled fingers of the original hand. Do not actually take it. Close the apparently taking hand as it moves away.',
  'Let your gaze follow the apparently taking hand. Allow the original hand to settle naturally, keeping the retained coin out of sight. Avoid freezing it or staring at it.',
  'Pause briefly, then open the empty hand to reveal the vanish. Finish without exposing the other palm; put the coin down discreetly between practice attempts. Watch from the audience’s angle and compare with a genuine transfer.'
 ],practice:['Alternate a real transfer with a false one, keeping the rhythm and gaze alike.','Practise at normal speed. Watch for flashes of the coin from the spectator’s position.','Try a short, relaxed presentation for someone willing to watch a trick. Do not explain the method beforehand; ask afterwards whether they saw the coin retained.'],mistakes:['Looking at the hand that secretly holds the coin: let the eyes follow the apparent action.','An exaggerated grab or rigid empty fist: imitate the genuine transfer you practised.','Dropping the coin noisily or exposing it at the side: soften the receiving fingers and check viewing angles.','Rushing the reveal: give the apparent transfer time to register.'],safety:['Use this for consensual entertainment, not to mislead someone in a transaction.','Keep coins away from small children and do not put them in your mouth.'],assessments:[
  'Explain the false transfer and show where the coin really remains, without an audience.',
  'Perform the mechanics from a spectator’s angle without flashing or dropping the retained coin.',
  'Complete ten convincing false transfers consecutively, checking a mirror or recording for exposure, rhythm and gaze.',
  'Perform a convincing vanish for a willing volunteer who has not been told the method; record their feedback without claiming the app verified the effect.'
 ],tags:['coin magic','misdirection','performance'],relatedIds:['finger-whistle'],reference:{label:'Further demonstration: Howcast’s French Drop lesson',url:'https://howcast.com/videos/499441-how-to-do-the-french-drop-coin-tricks/'}},
];
