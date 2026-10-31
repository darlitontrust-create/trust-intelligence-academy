require('./shim.js'); globalThis.window=globalThis;
eval(require('fs').readFileSync('../js/seed.js','utf8'));
require('../js/sql-engine.js'); require('../js/exercises.js');
globalThis.UI={}; require('../js/lessons.js');
(async()=>{ await SQLEngine.init();
 const miss=ExerciseBank.EXERCISES.filter(e=>!Lessons.MAP[e.t]).map(e=>e.id+' '+e.t); console.log('sem aula:',miss);
 const used=new Set(Object.values(Lessons.MAP)); console.log('aulas',Object.keys(Lessons.LESSONS).length,'não usadas',Object.keys(Lessons.LESSONS).filter(k=>!used.has(k)));
 for(const k in Lessons.LESSONS){const r=SQLEngine.run(Lessons.LESSONS[k].exemplo.sql); console.log(k.padEnd(12), r.ok? (r.result? r.result.values.length+' linhas '+JSON.stringify(r.result.values[0]).slice(0,80):'sem linhas') : 'ERRO '+r.message);}
})();
