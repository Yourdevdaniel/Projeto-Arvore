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

export const DEFAULT_STACK_CODE = `class PilhaEstatica:
    def __init__(self, capacidade):
        self.dados = [None] * capacidade
        self.topo = -1

    def push(self, valor):
        if self.topo == len(self.dados) - 1:
            print("Pilha cheia")
            return
        self.topo += 1
        self.dados[self.topo] = valor
        print("push", valor)

    def pop(self):
        if self.topo == -1:
            print("Pilha vazia")
            return None
        valor = self.dados[self.topo]
        self.dados[self.topo] = None
        self.topo -= 1
        print("pop", valor)
        return valor

pilha = PilhaEstatica(5)
pilha.push(10)
pilha.push(20)
pilha.push(30)
pilha.pop()
pilha.push(40)
`;

export const DEFAULT_STACK_DYNAMIC_CODE = `class No:
    def __init__(self, valor):
        self.valor = valor
        self.proximo = None

class PilhaDinamica:
    def __init__(self):
        self.topo = None

    def push(self, valor):
        novo = No(valor)
        novo.proximo = self.topo
        self.topo = novo
        print("push", valor)

    def pop(self):
        if self.topo is None:
            print("Pilha vazia")
            return None
        valor = self.topo.valor
        self.topo = self.topo.proximo
        print("pop", valor)
        return valor

pilha = PilhaDinamica()
pilha.push(10)
pilha.push(20)
pilha.push(30)
pilha.pop()
pilha.push(40)
`;

export const DEFAULT_QUEUE_STATIC_CODE = `class FilaEstatica:
    def __init__(self, capacidade):
        self.dados = [None] * capacidade
        self.frente = 0
        self.tras = -1
        self.tamanho = 0

    def enfileirar(self, valor):
        if self.tamanho == len(self.dados):
            print("Fila cheia")
            return
        self.tras = (self.tras + 1) % len(self.dados)
        self.dados[self.tras] = valor
        self.tamanho += 1
        print("entrou", valor)

    def desenfileirar(self):
        if self.tamanho == 0:
            print("Fila vazia")
            return None
        valor = self.dados[self.frente]
        self.dados[self.frente] = None
        self.frente = (self.frente + 1) % len(self.dados)
        self.tamanho -= 1
        print("saiu", valor)
        return valor

fila = FilaEstatica(5)
fila.enfileirar(10)
fila.enfileirar(20)
fila.enfileirar(30)
fila.desenfileirar()
fila.enfileirar(40)
`;

export const DEFAULT_QUEUE_DYNAMIC_CODE = `class No:
    def __init__(self, valor):
        self.valor = valor
        self.proximo = None

class FilaDinamica:
    def __init__(self):
        self.prim = None
        self.ult = None

    def enfileirar(self, valor):
        novo = No(valor)
        if self.ult is None:
            self.prim = novo
        else:
            self.ult.proximo = novo
        self.ult = novo
        print("entrou", valor)

    def desenfileirar(self):
        if self.prim is None:
            print("Fila vazia")
            return None
        valor = self.prim.valor
        self.prim = self.prim.proximo
        if self.prim is None:
            self.ult = None
        print("saiu", valor)
        return valor

fila = FilaDinamica()
fila.enfileirar(10)
fila.enfileirar(20)
fila.enfileirar(30)
fila.desenfileirar()
fila.enfileirar(40)
`;

export const DEFAULT_PRIORITY_QUEUE_CODE = `class FilaPrioridade:
    def __init__(self):
        self.dados = []

    def enfileirar(self, valor, prioridade):
        self.dados.append((prioridade, valor))
        self.dados.sort()
        print("entrou", valor, "prioridade", prioridade)

    def desenfileirar(self):
        if not self.dados:
            print("Fila vazia")
            return None
        prioridade, valor = self.dados.pop(0)
        print("saiu", valor)
        return valor

fila = FilaPrioridade()
fila.enfileirar("B", 2)
fila.enfileirar("A", 1)
fila.enfileirar("C", 3)
fila.desenfileirar()
`;

export const DEFAULT_LIST_SEQ_CODE = `class ListaSequencial:
    def __init__(self, capacidade):
        self.dados = [None] * capacidade
        self.tamanho = 0

    def inserir(self, valor):
        if self.tamanho == len(self.dados):
            print("Lista cheia")
            return
        self.dados[self.tamanho] = valor
        self.tamanho += 1
        print("inseriu", valor)

lista = ListaSequencial(5)
lista.inserir(10)
lista.inserir(20)
lista.inserir(30)
`;

export const DEFAULT_LIST_DYNAMIC_CODE = `class ListaDinamica:
    def __init__(self):
        self.dados = []

    def inserir(self, valor):
        self.dados.append(valor)
        print("inseriu", valor)

    def remover(self, valor):
        if valor in self.dados:
            self.dados.remove(valor)
            print("removeu", valor)

lista = ListaDinamica()
lista.inserir(10)
lista.inserir(20)
lista.inserir(30)
lista.remover(20)
`;

export const DEFAULT_LIST_SINGLY_CODE = `class No:
    def __init__(self, valor):
        self.valor = valor
        self.proximo = None

class ListaSimples:
    def __init__(self):
        self.prim = None
        self.ult = None

    def inserir(self, valor):
        novo = No(valor)
        if self.prim is None:
            self.prim = novo
        else:
            self.ult.proximo = novo
        self.ult = novo
        print("inseriu", valor)

lista = ListaSimples()
lista.inserir(10)
lista.inserir(20)
lista.inserir(30)
`;

export const DEFAULT_LIST_DOUBLY_CODE = `class No:
    def __init__(self, valor):
        self.valor = valor
        self.anterior = None
        self.proximo = None

class ListaDupla:
    def __init__(self):
        self.prim = None
        self.ult = None

    def inserir(self, valor):
        novo = No(valor)
        if self.prim is None:
            self.prim = novo
        else:
            novo.anterior = self.ult
            self.ult.proximo = novo
        self.ult = novo
        print("inseriu", valor)

lista = ListaDupla()
lista.inserir(10)
lista.inserir(20)
lista.inserir(30)
`;

export const DEFAULT_LIST_CIRC_SINGLY_CODE = `class No:
    def __init__(self, valor):
        self.valor = valor
        self.proximo = None

class ListaCircularSimples:
    def __init__(self):
        self.prim = None
        self.ult = None

    def inserir(self, valor):
        novo = No(valor)
        if self.prim is None:
            self.prim = novo
            self.ult = novo
            novo.proximo = novo
        else:
            novo.proximo = self.prim
            self.ult.proximo = novo
            self.ult = novo
        print("inseriu", valor)

lista = ListaCircularSimples()
lista.inserir(10)
lista.inserir(20)
lista.inserir(30)
`;

export const DEFAULT_LIST_CIRC_DOUBLY_CODE = `class No:
    def __init__(self, valor):
        self.valor = valor
        self.anterior = None
        self.proximo = None

class ListaCircularDupla:
    def __init__(self):
        self.prim = None
        self.ult = None

    def inserir(self, valor):
        novo = No(valor)
        if self.prim is None:
            self.prim = novo
            self.ult = novo
            novo.proximo = novo
            novo.anterior = novo
        else:
            novo.anterior = self.ult
            novo.proximo = self.prim
            self.ult.proximo = novo
            self.prim.anterior = novo
            self.ult = novo
        print("inseriu", valor)

lista = ListaCircularDupla()
lista.inserir(10)
lista.inserir(20)
lista.inserir(30)
`;

export const DEFAULT_LINEAR_CODES = {
  tree: DEFAULT_CODE,
  stack_static: DEFAULT_STACK_CODE,
  stack_dynamic: DEFAULT_STACK_DYNAMIC_CODE,
  queue_static: DEFAULT_QUEUE_STATIC_CODE,
  queue_dynamic: DEFAULT_QUEUE_DYNAMIC_CODE,
  queue_priority: DEFAULT_PRIORITY_QUEUE_CODE,
  list_seq: DEFAULT_LIST_SEQ_CODE,
  list_dynamic: DEFAULT_LIST_DYNAMIC_CODE,
  list_singly: DEFAULT_LIST_SINGLY_CODE,
  list_doubly: DEFAULT_LIST_DOUBLY_CODE,
  list_circular_singly: DEFAULT_LIST_CIRC_SINGLY_CODE,
  list_circular_doubly: DEFAULT_LIST_CIRC_DOUBLY_CODE,
};

// Tracer em Python — usa sys.settrace (stdlib) como "debugger".
export const TRACER = `
import sys, json

VAL   = ['valor','value','val','key','chave','data','dado','info','item']
LEFT  = ['esquerda','esq','left','l','filho_esquerdo','filho_esq']
RIGHT = ['direita','dir','right','r','filho_direito','filho_dir']
ARRAY_NAMES = ['dados','data','items','itens','valores','vetor','lista','elementos','array']
TOP_NAMES = ['topo','top']
FRONT_NAMES = ['frente','front','prim','primeiro','inicio','head','cabeca']
BACK_NAMES = ['tras','rear','ult','ultimo','fim','tail']
SIZE_NAMES = ['tamanho','tam','size','qtd','quantidade','n']
NEXT_NAMES = ['proximo','prox','next','seguinte','abaixo']
PREV_NAMES = ['anterior','ant','prev']

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

def _is_stack_node(o):
    if o is None or isinstance(o, (int,float,str,bool,list,dict,tuple,set,bytes)):
        return False
    return _attr(o,VAL) is not None and (_attr(o,NEXT_NAMES) is not None or _attr(o,PREV_NAMES) is not None)

def _active_items(raw, top):
    items = list(raw)
    if isinstance(top, int):
        if top < 0: return []
        items = items[:top + 1]
    return [_safe(x) for x in items if x is not None]

def _get_first(d, names):
    for n in names:
        if n in d:
            return n, d[n]
    return None, None

def _linear_kind(name, v):
    s = (name + ' ' + type(v).__name__).lower()
    if 'prioridade' in s or 'priority' in s: return 'fila_prioridade'
    if 'fila' in s or 'queue' in s: return 'fila'
    if 'pilha' in s or 'stack' in s: return 'pilha'
    if 'circular' in s and ('dupla' in s or 'dupl' in s or 'double' in s): return 'lista_circular_dupla'
    if 'circular' in s: return 'lista_circular'
    if 'dupla' in s or 'dupl' in s or 'double' in s: return 'lista_dupla'
    if 'lista' in s or 'list' in s: return 'lista'
    return 'sequencial'

def _array_items(raw, d):
    items = list(raw)
    top_name, top = _get_first(d, TOP_NAMES)
    front_name, front = _get_first(d, FRONT_NAMES)
    back_name, back = _get_first(d, BACK_NAMES)
    size_name, size = _get_first(d, SIZE_NAMES)
    refs = []
    if isinstance(top, int):
        items = [] if top < 0 else items[:top + 1]
        refs.append({'index': top, 'label': 'self.' + top_name})
    elif isinstance(front, int) and isinstance(size, int):
        cap = len(items) or 1
        items = [items[(front + i) % cap] for i in range(max(size, 0))]
        refs.append({'index': 0, 'label': 'self.' + front_name})
        if size > 0 and back_name: refs.append({'index': size - 1, 'label': 'self.' + back_name})
    elif isinstance(size, int):
        items = items[:max(size, 0)]
    else:
        items = [x for x in items if x is not None]
    return [_safe(x) for x in items if x is not None], refs

def _linked_items(head):
    out = []
    seen = set()
    cur = head
    circular = False
    doubly = False
    while _is_stack_node(cur) and id(cur) not in seen and len(out) < _MAX_NODES:
        seen.add(id(cur))
        va = _attr(cur, VAL)
        nx = _attr(cur, NEXT_NAMES) or _attr(cur, PREV_NAMES)
        doubly = doubly or _attr(cur, PREV_NAMES) is not None
        try:
            out.append({'id': id(cur), 'value': _safe(getattr(cur, va))})
            nxt = getattr(cur, nx)
            if _is_stack_node(nxt) and id(nxt) in seen: circular = True
            cur = nxt
        except Exception:
            break
    return out, circular, doubly

def _stack_candidates(name, v):
    if isinstance(v, (list, tuple)):
        return [{'id': id(v), 'label': name, 'kind': 'sequencial', 'items': _active_items(v, None), 'relation': 'array', 'refs': []}]
    try:
        d = vars(v)
    except Exception:
        return []
    kind = _linear_kind(name, v)
    for an in ARRAY_NAMES:
        if an in d and isinstance(d[an], (list, tuple)):
            items, refs = _array_items(d[an], d)
            return [{'id': id(v), 'label': name, 'kind': kind, 'items': items, 'capacity': len(d[an]), 'relation': 'array', 'refs': refs}]
    head_name, head = _get_first(d, TOP_NAMES + FRONT_NAMES)
    back_name, back = _get_first(d, BACK_NAMES)
    if _is_stack_node(head):
        items, circular, doubly = _linked_items(head)
        values = [x['value'] for x in items]
        if kind == 'pilha':
            values.reverse()
            refs = [{'index': len(values) - 1, 'label': 'self.' + head_name}]
        else:
            refs = [{'index': 0, 'label': 'self.' + head_name}]
        if _is_stack_node(back):
            for i, item in enumerate(items):
                if item['id'] == id(back):
                    refs.append({'index': len(values) - 1 - i if kind == 'pilha' else i, 'label': 'self.' + back_name})
                    break
        if circular and doubly: kind = 'lista_circular_dupla'
        elif circular: kind = 'lista_circular'
        elif doubly and kind == 'lista': kind = 'lista_dupla'
        return [{'id': id(v), 'label': name, 'kind': kind, 'items': values, 'relation': 'linked', 'circular': circular, 'doubly': doubly, 'refs': refs}]
    return []

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
    linear_map = {}
    f = frame
    depth = 0
    while f is not None:
        for name, v in list(f.f_locals.items()):
            for label, node in _node_roots(name, v):
                roots.append(node)
                var_to_node.setdefault(id(node), []).append(label)
                if depth == 0 and _is_node(v): highlight.append(id(node))
            for st in _stack_candidates(name, v):
                if st['items'] or st.get('capacity'): linear_map[st['id']] = st
        f = f.f_back; depth += 1
    for name, v in list(frame.f_globals.items()):
        for label, node in _node_roots(name, v):
            roots.append(node)
            var_to_node.setdefault(id(node), []).append(label)
        for st in _stack_candidates(name, v):
            if st['items'] or st.get('capacity'): linear_map[st['id']] = st
    nodes = _collect(roots)
    linears = list(linear_map.values())
    _snaps.append({
        'line': frame.f_lineno,
        'nodes': list(nodes.values()),
        'linears': linears,
        'stacks': linears,
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
    final_linears = {}
    try:
        for name, v in list(ns.items()):
            for label, node in _node_roots(name, v):
                final_roots.append(node)
                final_vars.setdefault(id(node), []).append(label)
            for st in _stack_candidates(name, v):
                if st['items'] or st.get('capacity'): final_linears[st['id']] = st
        final_nodes = list(_collect(final_roots).values())
    except Exception:
        final_nodes = []
    final = {
        'line': -1,
        'nodes': final_nodes,
        'linears': list(final_linears.values()),
        'stacks': list(final_linears.values()),
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
