const {execFileSync}=require('child_process');
class Database{constructor(){this.prev=[]}
 exec(sql){const out=JSON.parse(execFileSync('python3',[__dirname+'/pyexec.py'],{input:JSON.stringify({prev:this.prev,sql})}).toString());
  if(out.err) throw new Error(out.err); this.prev.push(sql); return out.ok;}
 close(){}}
globalThis.initSqlJs=async()=>({Database});
globalThis.performance=globalThis.performance||require('perf_hooks').performance;
