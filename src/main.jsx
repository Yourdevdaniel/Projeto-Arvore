import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { DEFAULT_LINEAR_CODES, TRACER, layoutTree } from './tracer.js'
import './styles.css'

const SPEEDS = [
  { label: 'Lento', ms: 1200 },
  { label: 'Normal', ms: 600 },
  { label: 'Rápido', ms: 300 },
]

const STRUCTURES = {
  tree: { label: 'Arvore', icon: '🌳', code: DEFAULT_LINEAR_CODES.tree, unit: 'nos', file: 'arvore.py', family: 'arvore' },
  stack_static: { label: 'Pilha estatica', icon: '▤', code: DEFAULT_LINEAR_CODES.stack_static, unit: 'itens', file: 'pilha-estatica.py', family: 'pilha' },
  stack_dynamic: { label: 'Pilha dinamica', icon: '▥', code: DEFAULT_LINEAR_CODES.stack_dynamic, unit: 'itens', file: 'pilha-dinamica.py', family: 'pilha' },
  queue_static: { label: 'Fila estatica', icon: '⇥', code: DEFAULT_LINEAR_CODES.queue_static, unit: 'itens', file: 'fila-estatica.py', family: 'fila' },
  queue_dynamic: { label: 'Fila dinamica', icon: '→', code: DEFAULT_LINEAR_CODES.queue_dynamic, unit: 'itens', file: 'fila-dinamica.py', family: 'fila' },
  queue_priority: { label: 'Fila prioridade', icon: '★', code: DEFAULT_LINEAR_CODES.queue_priority, unit: 'itens', file: 'fila-prioridade.py', family: 'fila' },
  list_seq: { label: 'Lista sequencial', icon: '[]', code: DEFAULT_LINEAR_CODES.list_seq, unit: 'itens', file: 'lista-sequencial.py', family: 'lista' },
  list_dynamic: { label: 'Lista dinamica', icon: '[+]', code: DEFAULT_LINEAR_CODES.list_dynamic, unit: 'itens', file: 'lista-dinamica.py', family: 'lista' },
  list_singly: { label: 'Lista simples', icon: '→', code: DEFAULT_LINEAR_CODES.list_singly, unit: 'nos', file: 'lista-simples.py', family: 'lista' },
  list_doubly: { label: 'Lista dupla', icon: '↔', code: DEFAULT_LINEAR_CODES.list_doubly, unit: 'nos', file: 'lista-dupla.py', family: 'lista' },
  list_circular_singly: { label: 'Circular simples', icon: '↻', code: DEFAULT_LINEAR_CODES.list_circular_singly, unit: 'nos', file: 'lista-circular-simples.py', family: 'lista' },
  list_circular_doubly: { label: 'Circular dupla', icon: '⟳', code: DEFAULT_LINEAR_CODES.list_circular_doubly, unit: 'nos', file: 'lista-circular-dupla.py', family: 'lista' },
}

function helpPrompt(current) {
  const base = `Você é um professor de Estruturas de Dados ajudando um aluno.

O código Python abaixo roda em um VISUALIZADOR WEB que executa Python no navegador (Pyodide) e desenha a estrutura passo a passo. Regras:

- NÃO existe terminal interativo: não use input() nem menus com "while True".
- Chame as operações DIRETO no final do código usando print() para mostrar resultados.
- Use apenas Python puro, sem bibliotecas externas.`
  const detail = current.family === 'arvore'
    ? '- Para árvore, use atributos como valor/value/key, esquerda/left e direita/right.'
    : current.family === 'pilha'
      ? '- Para pilha, use lista, pilha estática com vetor + topo, ou pilha dinâmica com topo/head e proximo/next/anterior.'
      : current.family === 'fila'
        ? '- Para fila, use frente/tras ou prim/ult; fila de prioridade pode usar pares (prioridade, valor).'
        : '- Para listas, use dados/lista para sequencial ou prim/ult com proximo/anterior para encadeada, dupla e circular.'
  return `${base}
${detail}

Sua tarefa:
1. Diga, de forma simples, qual(is) o(s) erro(s) do código.
2. Corrija o código para funcionar nesse visualizador (sem input()/menu; com um trecho no final que monta a estrutura e chama as operações).
3. Devolva o código corrigido COMPLETO, pronto para copiar e colar.

Código do aluno:`
}

function HelpButton({ code, current }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const texto = helpPrompt(current) + '\n\n"""\n' + (code || '') + '\n"""\n'
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      ta.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="help">
      <button className="help-btn" aria-label="Ajuda com erros">?</button>
      <div className="help-pop" role="dialog">
        <p>Seu código está dando erro? Copie este prompt e cole em qualquer IA
          (ChatGPT, Gemini, etc.) <b>junto com o seu código</b> — ela pode te ajudar a corrigir.</p>
        <button className="help-copy" onClick={copy}>{copied ? '✓ Copiado!' : '📋 Copiar prompt'}</button>
      </div>
    </div>
  )
}

function TreeView({ snap, identify }) {
  const nodes = snap ? snap.nodes : []
  const { pos, cols, maxDepth, rootIds } = useMemo(() => layoutTree(nodes), [nodes])
  if (!nodes.length) return <div className="tree"><div className="empty">Nenhum nó ainda…</div></div>

  const GAPX = 66, GAPY = identify ? 96 : 84, PAD = 44, R = 21
  const w = Math.max(cols, 1) * GAPX + PAD * 2
  const h = (maxDepth + 1) * GAPY + PAD * 2
  const px = (id) => pos[id].x * GAPX + PAD
  const py = (id) => pos[id].depth * GAPY + PAD
  const hl = new Set(snap.highlight)
  const rootSet = new Set(rootIds)

  const grauDe = (n) => (n.left != null ? 1 : 0) + (n.right != null ? 1 : 0)
  const papel = (n) => rootSet.has(n.id) ? { nome: 'raiz', cls: 'role-root' }
    : grauDe(n) === 0 ? { nome: 'folha', cls: 'role-leaf' }
    : { nome: 'nó', cls: 'role-internal' }

  const folhas = nodes.filter((n) => grauDe(n) === 0).length
  const grauArv = nodes.reduce((m, n) => Math.max(m, grauDe(n)), 0)

  return (
    <div className={'tree' + (identify ? ' ident' : '')}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <radialGradient id="gnode" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#9db8ff" /><stop offset="100%" stopColor="#5f86e0" />
          </radialGradient>
          <radialGradient id="gnodehl" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#3b5bb5" /><stop offset="100%" stopColor="#16245e" />
          </radialGradient>
        </defs>
        {nodes.map((n) => ['left', 'right'].map((side) => {
          const c = n[side]
          if (c == null || !pos[c] || !pos[n.id]) return null
          return <line key={n.id + side} className="edge" x1={px(n.id)} y1={py(n.id)} x2={px(c)} y2={py(c)} />
        }))}
        {nodes.map((n) => {
          if (!pos[n.id]) return null
          const p = papel(n)
          return (
            <g key={n.id} className={'nodeg ' + p.cls + (hl.has(n.id) ? ' hl' : '')} transform={`translate(${px(n.id)},${py(n.id)})`}>
              {snap.vars[String(n.id)] && <text className="var" y={-R - 10}>{snap.vars[String(n.id)].join(', ')}</text>}
              <circle className="disc" r={R} />
              <text className="lbl">{String(n.value)}</text>
              {identify && <text className="meta" y={R + 15}>{p.nome} · nv {pos[n.id].depth} · gr {grauDe(n)}</text>}
            </g>
          )
        })}
      </svg>
      {identify && (
        <div className="legend">
          <div className="lg-row"><span className="dot root" />Raiz</div>
          <div className="lg-row"><span className="dot internal" />Nó interno</div>
          <div className="lg-row"><span className="dot leaf" />Folha</div>
          <div className="lg-sep" />
          <div className="lg-stat">Tamanho: <b>{nodes.length}</b> nós</div>
          <div className="lg-stat">Altura: <b>{maxDepth}</b></div>
          <div className="lg-stat">Grau da árvore: <b>{grauArv}</b></div>
          <div className="lg-stat">Folhas: <b>{folhas}</b></div>
          <div className="lg-note">nv = nível · gr = grau (raiz = nível 0)</div>
        </div>
      )}
    </div>
  )
}

function LinearView({ snap, prevSnap, identify, current }) {
  const linear = snap?.linears?.[0] || snap?.stacks?.[0]
  if (!linear) return <div className="tree linear-scene"><div className="empty">Nenhuma estrutura ainda...</div></div>

  const items = linear.items || []
  const prevItems = prevSnap?.linears?.[0]?.items || prevSnap?.stacks?.[0]?.items || []
  const vertical = current.family === 'pilha'
  const capacity = Math.max(linear.capacity || items.length, items.length, 1)
  const refsByIndex = (linear.refs || []).reduce((acc, ref) => {
    if (ref.index >= 0) acc[ref.index] = [...(acc[ref.index] || []), ref.label]
    return acc
  }, {})
  const entering = items.length > prevItems.length ? items.length - 1 : -1
  const leaving = prevItems.length > items.length ? prevItems[vertical ? prevItems.length - 1 : 0] : null
  const slots = vertical ? Array.from({ length: capacity }, (_, i) => capacity - 1 - i) : items.map((_, i) => i)
  const arrow = linear.doubly ? '↔' : '→'

  const cell = (idx) => {
    const active = idx < items.length
    const role = current.family === 'pilha'
      ? idx === items.length - 1 ? 'topo' : idx === 0 && active ? 'base' : ''
      : current.family === 'fila'
        ? idx === 0 && active ? 'frente' : idx === items.length - 1 ? 'tras' : ''
        : idx === 0 && active ? 'prim' : idx === items.length - 1 ? 'ult' : ''
    return (
      <div key={idx} className={'linear-cell' + (active ? ' filled' : '') + (idx === entering ? ' entering' : '') + (role ? ' ' + role : '')}>
        <span className="linear-index">{idx}</span>
        <span className="linear-value">{active ? String(items[idx]) : 'vazio'}</span>
        {identify && <span className="linear-role">{[role, ...(refsByIndex[idx] || [])].filter(Boolean).join(' · ')}</span>}
      </div>
    )
  }

  return (
    <div className={'tree linear-scene' + (identify ? ' ident' : '')}>
      <div className={'linear-stage' + (vertical ? ' vertical' : '')}>
        <div className="linear-head">
          <b>{linear.label}</b>
          <span>{linear.kind}{linear.circular ? ' circular' : ''}{linear.doubly ? ' dupla' : ''}</span>
        </div>
        <div className={'linear-box' + (vertical ? ' vertical' : '')}>
          {vertical
            ? slots.map(cell)
            : slots.map((idx) => (
                <React.Fragment key={idx}>
                  {cell(idx)}
                  {idx < items.length - 1 && <span className="linear-arrow">{arrow}</span>}
                </React.Fragment>
              ))}
          {!vertical && linear.circular && items.length > 1 && <span className="linear-arrow loop">↺</span>}
          {leaving != null && <div className="linear-cell filled leaving"><span className="linear-index">sai</span><span className="linear-value">{String(leaving)}</span></div>}
        </div>
      </div>
      {identify && (
        <div className="legend">
          <div className="lg-stat">Tipo: <b>{linear.kind}</b></div>
          <div className="lg-stat">Tamanho: <b>{items.length}</b> {current.unit}</div>
          {linear.capacity && <div className="lg-stat">Capacidade: <b>{linear.capacity}</b></div>}
          {(linear.refs || []).map((ref, i) => <div key={i} className="lg-stat">{ref.label}: <b>{ref.index}</b></div>)}
          <div className="lg-note">{current.family === 'pilha' ? 'push/pop no topo' : current.family === 'fila' ? 'entra atras, sai na frente' : 'setas indicam encadeamento'}</div>
        </div>
      )}
    </div>
  )
}

function CodePanel({ mode, code, setCode, snap, error, output }) {
  const lines = useMemo(() => code.split('\n'), [code])
  const viewRef = useRef(null)
  const gutterRef = useRef(null)
  const activeLine = snap ? snap.line : -1

  useEffect(() => {
    if (mode !== 'run' || !viewRef.current) return
    const el = viewRef.current.querySelector('.cl.active')
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [activeLine, mode])

  const showOutput = (mode !== 'edit' && snap) || error

  return (
    <div className="pane-code">
      {mode === 'edit'
        ? <div className="editwrap">
            <div className="gutter" ref={gutterRef} aria-hidden="true">
              {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              className="editor" spellCheck={false} wrap="off" value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={(e) => { if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop }}
            />
          </div>
        : <div className="codeview" ref={viewRef}>
            {lines.map((ln, i) => (
              <div key={i} className={'cl' + (i + 1 === activeLine ? ' active' : '')}>
                <span className="ln">{i + 1}</span>{ln || ' '}
              </div>
            ))}
          </div>}
      {showOutput && (
        <div className="output">
          {mode !== 'edit' && snap && <><span className="lbl">Saída</span>{(output || '').slice(0, snap.outlen) || '—'}</>}
          {error && (
            <div className="errbox">
              <span className="err-title">⚠ Erro na execução</span>
              <span className="err-msg">{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function App() {
  const [ready, setReady] = useState(false)
  const [structure, setStructure] = useState('tree')
  const [mode, setMode] = useState('edit')
  const [codes, setCodes] = useState(() => Object.fromEntries(Object.entries(STRUCTURES).map(([key, item]) => [key, item.code])))
  const [snaps, setSnaps] = useState([])
  const [idx, setIdx] = useState(0)
  const [result, setResult] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [identify, setIdentify] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)
  const [status, setStatus] = useState('Carregando Python (Pyodide)…')
  const pyRef = useRef(null)
  const current = STRUCTURES[structure]
  const code = codes[structure]
  const setCurrentCode = useCallback((value) => {
    setCodes((prev) => ({ ...prev, [structure]: value }))
  }, [structure])

  const switchStructure = useCallback((next) => {
    if (next === structure) return
    setPlaying(false)
    setSnaps([])
    setResult(null)
    setIdx(0)
    setIdentify(false)
    setMode('edit')
    setStructure(next)
    setStatus(STRUCTURES[next].label + ': edite o codigo e clique em Rodar.')
  }, [structure])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const py = await window.loadPyodide()
        await py.runPythonAsync(TRACER)
        if (!alive) return
        pyRef.current = py
        setReady(true)
        setStatus('Pronto. Edite o código e clique em Rodar.')
      } catch (e) {
        setStatus('Falha ao carregar o Python: ' + e)
      }
    })()
    return () => { alive = false }
  }, [])

  const execute = useCallback(() => {
    const fn = pyRef.current.globals.get('run_user_code')
    try { return JSON.parse(fn(code)) }
    catch (e) { return { snaps: [], final: null, output: '', error: 'Falha ao executar o código: ' + e, fatal: true } }
    finally { fn.destroy() }
  }, [code])

  const run = useCallback(() => {
    if (!ready) return
    setPlaying(false)
    setStatus('Executando…')
    const res = execute()
    if (res.error && res.snaps.length === 0) {
      setStatus('')
      setResult({ error: res.error, fatal: true })
      return
    }
    setSnaps(res.snaps)
    setResult(res)
    setIdx(0)
    setMode('run')
  }, [ready, execute])

  const runFinal = useCallback(() => {
    if (!ready) return
    setPlaying(false)
    const res = execute()
    if (res.error && res.snaps.length === 0) {
      setStatus('')
      setResult({ error: res.error, fatal: true })
      return
    }
    setResult(res)
    setMode('result')
  }, [ready, execute])

  const toEdit = useCallback(() => { setPlaying(false); setMode('edit'); setStatus('Modo edição.') }, [])

  const limpar = useCallback(() => {
    setPlaying(false)
    setSnaps([])
    setResult(null)
    setIdx(0)
    setIdentify(false)
    setMode('edit')
    setStatus(current.label + ' apagada. Pronto para rodar de novo (o codigo foi mantido).')
  }, [current.label])

  const fileRef = useRef(null)

  const exportCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/x-python' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = current.file; a.click()
    URL.revokeObjectURL(url)
  }, [code, current.file])

  const importCode = useCallback(async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permite reimportar o mesmo arquivo
    if (!file) return
    setCurrentCode(await file.text())
    setResult(null)
    setStatus('Código importado: ' + file.name)
  }, [setCurrentCode])
  const go = useCallback((n) => setIdx(() => Math.min(Math.max(n, 0), Math.max(snaps.length - 1, 0))), [snaps.length])

  useEffect(() => {
    if (!playing) return
    if (idx >= snaps.length - 1) { setPlaying(false); return }
    const t = setTimeout(() => setIdx((i) => Math.min(i + 1, snaps.length - 1)), SPEEDS[speedIdx].ms)
    return () => clearTimeout(t)
  }, [playing, idx, snaps.length, speedIdx])

  useEffect(() => {
    if (mode !== 'run') return
    const h = (e) => {
      if (e.key === 'ArrowRight') { setPlaying(false); go(idx + 1) }
      else if (e.key === 'ArrowLeft') { setPlaying(false); go(idx - 1) }
      else if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [mode, idx, go])

  const snap = mode === 'run' ? snaps[idx] : mode === 'result' ? result?.final : null
  const prevSnap = mode === 'run' && idx > 0 ? snaps[idx - 1] : null
  const last = idx >= snaps.length - 1
  const errorToShow = result?.error && (result.fatal || mode === 'result' || (mode === 'run' && last)) ? result.error : null

  const changeCode = useCallback((v) => { setCurrentCode(v); setResult((r) => (r?.error ? null : r)) }, [setCurrentCode])
  const finalSize = current.family !== 'arvore'
    ? (result?.final?.linears?.[0]?.items?.length ?? result?.final?.stacks?.[0]?.items?.length ?? 0)
    : (result?.final?.nodes?.length ?? 0)

  const statusEl = mode === 'run' && snap ? (
    <span className="status">
      <b>Passo {idx + 1}/{snaps.length}</b> · linha {snap.line}
      {last && (result?.error
        ? <span className="e"> · erro: {result.error}</span>
        : <span> · fim{result?.truncated ? ' · ⚠ parou no limite de passos (possível laço infinito)' : ''}</span>)}
    </span>
  ) : mode === 'result' ? (
    <span className="status">
      <b>Resultado final</b> · {finalSize} {current.unit}
      {result?.truncated && <span className="e"> · ⚠ laço infinito (parou no limite)</span>}
      {result?.error && <span className="e"> · erro: {result.error}</span>}
    </span>
  ) : <span className="status">{result?.fatal ? <span className="e">Erro: {result.error}</span> : status}</span>

  return (
    <>
      <div className="toolbar">
        <h1><span className="em">{current.icon}</span> {current.label} <span className="sub" style={{ color: 'var(--muted)', fontWeight: 400 }}>— passo a passo</span></h1>
        <div className="tabs" role="tablist" aria-label="Estrutura">
          {Object.entries(STRUCTURES).map(([key, item]) => (
            <button
              key={key}
              className={'tab' + (structure === key ? ' active' : '')}
              role="tab"
              aria-selected={structure === key}
              onClick={() => switchStructure(key)}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <HelpButton code={code} current={current} />
        <input ref={fileRef} type="file" accept=".py,.txt,text/plain" style={{ display: 'none' }} onChange={importCode} />
        {mode === 'edit'
          ? <>
              <button className="btn" onClick={() => fileRef.current.click()}>📂 Importar</button>
              <button className="btn" onClick={exportCode}>💾 Exportar</button>
              <button className="btn" disabled={!ready} onClick={runFinal}>⚡ Resultado</button>
              <button className="btn primary" disabled={!ready} onClick={run}>▶ Passo a passo</button>
            </>
          : <>
              <button className={'btn' + (identify ? ' primary' : '')} onClick={() => setIdentify((v) => !v)}>🔍 Identificar</button>
              <button className="btn" onClick={limpar}>🗑 Limpar</button>
              <button className="btn ghost" onClick={toEdit}>✎ Editar</button>
            </>}
      </div>

      <div className="body">
        <div className="pane-tree">
          {current.family !== 'arvore'
            ? <LinearView snap={snap} prevSnap={prevSnap} identify={identify} current={current} />
            : <TreeView snap={snap} identify={identify} />}
        </div>
        <CodePanel mode={mode} code={code} setCode={changeCode} snap={snap} error={errorToShow} output={result?.output} />
      </div>

      <div className="controls">
        {statusEl}
        {mode === 'run' && (
          <button className="cbtn wide" onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)} title="Velocidade do automático">
            ⏱ {SPEEDS[speedIdx].label}
          </button>
        )}
        <button className="cbtn" disabled={mode !== 'run' || idx === 0} onClick={() => { setPlaying(false); go(idx - 1) }} aria-label="Anterior">◀</button>
        <button className="cbtn wide play" disabled={mode !== 'run'} onClick={() => { if (last) setIdx(0); setPlaying((p) => !p) }}>
          {playing ? '⏸ Pausar' : '⏵ Auto'}
        </button>
        <button className="cbtn" disabled={mode !== 'run' || last} onClick={() => { setPlaying(false); go(idx + 1) }} aria-label="Próximo">▶</button>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
