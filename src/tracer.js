export const DEFAULT_CODE = `class No:
    def __init__(self, valor):
        self.valor = valor
        self.esquerda = None
        self.direita = None

def inserir(raiz, valor):
    if raiz is None:
        return No(valor)
    if valor < raiz.valor:
        raiz.esquerda = inserir(raiz.esquerda, valor)
    else:
        raiz.direita = inserir(raiz.direita, valor)
    return raiz

def buscar(raiz, alvo):
    atual = raiz
    while atual is not None:
        if alvo == atual.valor:
            return atual
        elif alvo < atual.valor:
            atual = atual.esquerda
        else:
            atual = atual.direita
    return None

def em_ordem(raiz):
    if raiz is None:
        return
    em_ordem(raiz.esquerda)
    print(raiz.valor)
    em_ordem(raiz.direita)

raiz = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    raiz = inserir(raiz, v)

print("Em ordem:")
em_ordem(raiz)

print("Buscando 40...")
buscar(raiz, 40)
`;

// Tracer em Python — usa sys.settrace (stdlib) como "debugger".
export const TRACER = `
import sys, json

VAL   = ['valor','value','val','key','chave','data','dado','info','item']
LEFT  = ['esquerda','esq','left','l','filho_esquerdo','filho_esq']
RIGHT = ['direita','dir','right','r','filho_direito','filho_dir']

def _attr(o, names):
    for n in names:
        try:
            if hasattr(o, n): return n
        except Exception:
            pass  # hasattr propaga erros que nao sejam AttributeError (ex.: property que levanta)
    return None

def _is_node(o):
    if o is None or isinstance(o, (int,float,str,bool,list,dict,tuple,set,bytes)):
        return False
    la, ra, va = _attr(o,LEFT), _attr(o,RIGHT), _attr(o,VAL)
    return va is not None and (la is not None or ra is not None)

def _safe(v):
    if v is None or isinstance(v,(int,float,bool)): return v
    try: return str(v)
    except Exception: return '?'

_MAX = 4000           # limite de passos (protege contra laco infinito)
_MAX_NODES = 600      # limite de nos desenhados (protege contra arvore gigante)
_MAX_OUT = 20000      # limite de caracteres de saida guardados

def _collect(roots):
    seen = {}
    stack = list(roots)
    while stack:
        if len(seen) >= _MAX_NODES: break
        o = stack.pop()
        if not _is_node(o): continue
        i = id(o)
        if i in seen: continue
        la, ra, va = _attr(o,LEFT), _attr(o,RIGHT), _attr(o,VAL)
        try:
            left  = getattr(o, la) if la else None
            right = getattr(o, ra) if ra else None
            val   = getattr(o, va) if va else None
        except Exception:
            continue  # atributo que levanta erro (property etc.) -> ignora o no
        seen[i] = {'id': i, 'value': _safe(val),
                   'left':  id(left)  if _is_node(left)  else None,
                   'right': id(right) if _is_node(right) else None}
        stack.append(left); stack.append(right)
    return seen

_snaps = []

# Excecao para abortar laco infinito. BaseException para nao ser pega por
# "except Exception" do aluno. ponytail: um "except:" (cru) ainda pega -> teto aceito.
class _StepLimit(BaseException):
    pass

def _blocked_input(*a, **k):
    raise RuntimeError("input() nao funciona aqui: este e um programa de terminal (interativo). No visualizador, chame as operacoes direto, sem menu nem input().")

def _dedup(seq):
    out = []
    for x in seq:
        if x not in out: out.append(x)
    return out

# A partir de uma variavel, retorna [(rotulo, no)]:
# - se ja e um no, ele mesmo
# - senao, se for um objeto (ex.: classe Tree), procura nos nos seus atributos (ex.: .raiz)
def _node_roots(name, v):
    if _is_node(v):
        return [(name, v)]
    try:
        d = vars(v)
    except Exception:
        return []
    return [(name + '.' + an, av) for an, av in list(d.items()) if _is_node(av)]

def _capture(frame):
    roots = []
    var_to_node = {}
    highlight = []
    f = frame
    depth = 0
    while f is not None:
        for name, v in list(f.f_locals.items()):
            for label, node in _node_roots(name, v):
                roots.append(node)
                var_to_node.setdefault(id(node), []).append(label)
                if depth == 0 and _is_node(v): highlight.append(id(node))
        f = f.f_back; depth += 1
    for name, v in list(frame.f_globals.items()):
        for label, node in _node_roots(name, v):
            roots.append(node)
            var_to_node.setdefault(id(node), []).append(label)
    nodes = _collect(roots)
    _snaps.append({
        'line': frame.f_lineno,
        'nodes': list(nodes.values()),
        'highlight': list(set(highlight)),
        'vars': {str(k): _dedup(vs) for k, vs in var_to_node.items()},
        'outlen': sys.stdout.tell(),  # O(1); a saida completa vai uma vez so no final
    })

def _trace(frame, event, arg):
    if frame.f_code.co_filename == '<usuario>':
        if event == 'line':
            if len(_snaps) >= _MAX:
                raise _StepLimit
            try:
                _capture(frame)
            except Exception:
                pass  # uma falha ao capturar nunca derruba o codigo do aluno
    return _trace

def run_user_code(src):
    import io
    _snaps.clear()
    old_out = sys.stdout
    sys.stdout = io.StringIO()
    error = None
    truncated = False
    ns = {'input': _blocked_input}
    try:
        code = compile(src, '<usuario>', 'exec')
        sys.settrace(_trace)
        exec(code, ns)
    except _StepLimit:
        truncated = True
    except SyntaxError as e:
        error = 'Erro de sintaxe' + (' (linha ' + str(e.lineno) + ')' if e.lineno else '') + ': ' + (e.msg or 'codigo invalido')
    except Exception as e:
        import traceback
        tb = e.__traceback__
        lineno = None
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == '<usuario>':
                lineno = tb.tb_lineno
            tb = tb.tb_next
        msg = ''.join(traceback.format_exception_only(type(e), e)).strip()
        error = ('Linha ' + str(lineno) + ': ' if lineno else '') + msg
    finally:
        sys.settrace(None)
        full_out = sys.stdout.getvalue()
        sys.stdout = old_out
    if len(full_out) > _MAX_OUT:
        full_out = full_out[:_MAX_OUT] + '\\n...(saida muito longa, cortada aqui)'
    # estado final: arvore montada no escopo global + saida completa
    final_roots = []
    final_vars = {}
    try:
        for name, v in list(ns.items()):
            for label, node in _node_roots(name, v):
                final_roots.append(node)
                final_vars.setdefault(id(node), []).append(label)
        final_nodes = list(_collect(final_roots).values())
    except Exception:
        final_nodes = []
    final = {
        'line': -1,
        'nodes': final_nodes,
        'highlight': [],
        'vars': {str(k): _dedup(vs) for k, vs in final_vars.items()},
        'outlen': len(full_out),
    }
    return json.dumps({'snaps': _snaps, 'final': final, 'output': full_out,
                       'error': error, 'truncated': truncated})
`;

// Layout da árvore: x pela ordem em-ordem, y pela profundidade.
export function layoutTree(nodes) {
  const map = {};
  nodes.forEach((n) => (map[n.id] = n));
  const childIds = new Set();
  nodes.forEach((n) => {
    if (n.left != null) childIds.add(n.left);
    if (n.right != null) childIds.add(n.right);
  });
  const roots = nodes.filter((n) => !childIds.has(n.id));
  const pos = {};
  const seen = new Set();
  let counter = 0;
  let maxDepth = 0;
  const walk = (id, depth) => {
    if (id == null || seen.has(id) || !map[id]) return;
    seen.add(id);
    maxDepth = Math.max(maxDepth, depth);
    walk(map[id].left, depth + 1);
    pos[id] = { x: counter++, depth };
    walk(map[id].right, depth + 1);
  };
  roots.forEach((r) => walk(r.id, 0));
  return { map, pos, cols: counter, maxDepth, rootIds: roots.map((r) => r.id) };
}
