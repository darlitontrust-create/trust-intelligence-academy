# Executor da Trust Intelligence Academy (roda dentro do Pyodide).
# Executa o prelude (dados) e o código do aluno, captura a saída e o erro.
import sys, io, json, traceback, builtins

def __tia_input(*a, **k):
    raise RuntimeError("input() não é usado nos exercícios: os dados já estão nas variáveis.")

def __tia_run(src, prelude):
    ns = {'__name__': '__main__', '__builtins__': builtins}
    buf = io.StringIO()
    old_out, old_in = sys.stdout, builtins.input
    err = None
    try:
        exec(prelude, ns)
        sys.stdout = buf
        builtins.input = __tia_input
        exec(compile(src, '<seu código>', 'exec'), ns)
    except SyntaxError as e:
        err = {'type': type(e).__name__, 'msg': str(e.msg), 'line': e.lineno, 'col': e.offset, 'text': (e.text or '').rstrip()}
    except BaseException as e:
        line = None
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == '<seu código>':
                line = fr.lineno
        err = {'type': type(e).__name__, 'msg': str(e), 'line': line}
    finally:
        sys.stdout = old_out
        builtins.input = old_in
    out = buf.getvalue()
    if len(out) > 20000:
        out = out[:20000] + '\n… (saída cortada)'
    return json.dumps({'out': out, 'err': err}, ensure_ascii=False)
