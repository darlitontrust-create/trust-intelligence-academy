import json, re, sqlite3, sys
ex = json.load(open('ex.json')); seed = open('seed.sql').read()
def split_params(s):
    out=[];cur='';q=False
    for ch in s:
        if ch=="'": q=not q
        if ch==',' and not q: out.append(cur.strip());cur=''
        else: cur+=ch
    if cur.strip(): out.append(cur.strip())
    return out
def prep(sql, procs):
    def cp(m):
        procs[m.group(1).lower()] = ([p.split()[0] for p in split_params(m.group(3) or '')], m.group(4))
        return ''
    sql = re.sub(r'CREATE\s+PROCEDURE\s+(\w+)\s*(\(([^)]*)\))?\s*AS\s+BEGIN([\s\S]*?)\bEND\s*;?', cp, sql, flags=re.I)
    def ex_(m):
        name=m.group(1).lower(); args=split_params(m.group(2).strip().strip('()'))
        params, body = procs[name]
        for p,a in zip(params,args): body = body.replace(p,a)
        return body
    return re.sub(r'\b(?:EXEC|EXECUTE|CALL)\s+(\w+)\s*([^;]*);?', ex_, sql, flags=re.I)
def last_result(db, sql):
    res=None
    # executa statement a statement para capturar o último SELECT
    for st in [s for s in sqlite3_split(sql)]:
        cur=db.execute(st)
        if cur.description: res=([d[0] for d in cur.description], cur.fetchall())
    return res
def sqlite3_split(sql):
    out=[];buf=''
    for line in re.split(r'(;)', sql):
        buf+=line
        if line==';' and sqlite3.complete_statement(buf): out.append(buf.strip()); buf=''
    if buf.strip(): out.append(buf.strip())
    return [s for s in out if s.strip(';').strip()]
bad=0
for e in ex:
    db=sqlite3.connect(':memory:'); db.executescript(seed); procs={}
    try:
        r=last_result(db, prep(e['q'],procs))
        if e.get('c'):
            cs = e['c'] if isinstance(e['c'],list) else [e['c']]
            rows=[]
            for i,c in enumerate(cs):
                try: rr=last_result(db, prep(c,procs)); rows.append((i+1, json.dumps(rr[1][-1] if rr and rr[1] else 'ok')))
                except Exception as ex2: rows.append((i+1,'ERRO'))
            r = last_result(db, prep(cs[0],procs)) if len(cs)==1 and False else (['passo','resultado'], rows) if len(cs)>1 else None
            if len(cs)==1:
                db2=sqlite3.connect(':memory:'); db2.executescript(seed); p2={}
                last_result(db2, prep(e['q'],p2)); r=last_result(db2, prep(cs[0],p2))
        n=len(r[1]) if r else -1
        flag = '' if n>0 else '  <<<< VAZIO'
        if flag: bad+=1
        print(e['id'], e['t'][:22].ljust(22), n, (str(r[1][:2])[:110] if r else ''), flag)
    except Exception as err:
        bad+=1; print(e['id'], 'ERRO', err)
print('problemas:', bad)
