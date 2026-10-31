import sys, json, sqlite3, re
inp=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
def stmts(sql):
    out=[];buf=''
    for part in re.split(r'(;)', sql):
        buf+=part
        if part==';' and sqlite3.complete_statement(buf): out.append(buf); buf=''
    if buf.strip(): out.append(buf)
    return [s for s in out if s.strip().strip(';').strip()]
try:
    for s in inp['prev']: db.executescript(s)
    res=[]
    for st in stmts(inp['sql']):
        cur=db.execute(st)
        if cur.description: res.append({'columns':[d[0] for d in cur.description],'values':[list(r) for r in cur.fetchall()]})
    print(json.dumps({'ok':res}))
except Exception as e:
    print(json.dumps({'err':str(e)}))
