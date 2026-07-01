# 🌳 Visualizador de Árvore Binária de Busca (BST)

Um site que mostra, **passo a passo**, como uma Árvore Binária de Busca funciona
em Python — parecido com o [pythontutor.com](https://pythontutor.com).

Você escreve o código de um lado; do outro, a árvore vai sendo desenhada e o
programa roda **linha por linha**, destacando a linha atual e o **nó que está
sendo percorrido** (ao inserir, buscar, percorrer em ordem, etc).

> 📅 **Feito em 01/07/2026.**
> Se você está vendo este repositório **muito tempo depois**, é possível que
> algumas coisas tenham mudado: os programas usados (Node.js, navegador) podem
> ter versões novas, os botões podem estar um pouco diferentes, e **a forma como
> a matéria de árvores é ensinada também pode ter mudado** desde então. Se algo
> aqui não bater com o que você aprendeu, confie sempre no seu material e no seu
> professor. 🙂

---

## 💻 Como rodar o projeto

Não precisa entender nada de programação. É só seguir os passos na ordem.
Você vai precisar de um computador com internet.

### Passo 1 — Instalar o Node.js (uma única vez)

O Node.js é um programa **gratuito** que faz o projeto funcionar.

1. Entre no site: **https://nodejs.org**
2. Clique no botão grande que diz **"LTS"** (é a versão recomendada).
3. Abra o arquivo baixado e vá clicando em **"Avançar / Next"** até **"Concluir /
   Finish"**. Pode aceitar tudo que já vem marcado.

Pronto. Você só faz isso uma vez na vida do computador.

### Passo 2 — Baixar este projeto

1. Nesta página do GitHub, clique no botão verde **`< > Code`**.
2. Clique em **"Download ZIP"**.
3. Encontre o arquivo `.zip` que baixou (geralmente na pasta **Downloads**),
   clique com o botão direito e escolha **"Extrair tudo / Extract all"**.
4. Isso cria uma pasta chamada `arvore` (ou parecido). É dentro dela que vamos
   trabalhar.

### Passo 3 — Abrir o "terminal" dentro da pasta

O terminal é uma janelinha onde a gente digita comandos.

**No Windows (jeito mais fácil):**
1. Abra a pasta do projeto (aquela que você extraiu).
2. Clique na **barra de endereço** lá em cima (onde aparece o caminho da pasta),
   apague o que estiver escrito, digite **`cmd`** e aperte **Enter**.
3. Vai abrir uma janela preta. É o terminal, já apontando para a pasta certa.

**No Mac:** clique com o botão direito na pasta → **"Novo Terminal na Pasta"**.

### Passo 4 — Ligar o projeto

Na janela do terminal, digite o comando abaixo e aperte **Enter**:

```
npm install
```

Espere terminar (pode demorar um ou dois minutos e aparecer bastante texto —
é normal). **Isso também só precisa ser feito uma vez.**

Depois digite este outro comando e aperte **Enter**:

```
npm run dev
```

Em poucos segundos o **navegador abre sozinho** com o projeto funcionando. 🎉
Se por acaso não abrir, abra o navegador e digite: **http://localhost:8000**

### Para desligar

Volte na janela do terminal e aperte as teclas **`Ctrl` + `C`** ao mesmo tempo.
Da próxima vez que quiser usar, é só abrir o terminal na pasta de novo (Passo 3)
e digitar **`npm run dev`**.

> ⚠️ **Dica importante:** abrir o arquivo `index.html` com dois cliques **não
> funciona**. O projeto precisa ser ligado com `npm run dev`, como explicado acima.

---

## 🕹️ Como usar o site

- **Editor (lado esquerdo):** escreva ou altere o código da árvore. Tem
  **numeração de linha** para você se localizar.
- **▶ Passo a passo:** roda mostrando cada linha. Avance com **◀ / ▶**, ou use o
  **⏵ Auto** (que tem um botão de velocidade **Lento / Normal / Rápido**).
  No computador dá para usar as setas `←` `→` do teclado e a barra de `espaço`.
- **⚡ Resultado:** roda direto e mostra só a árvore final e o resultado.
- **🔍 Identificar:** mostra o papel de cada nó (**raiz / interno / folha**) e as
  medidas da árvore — **tamanho, altura, grau**, e o **nível e grau de cada nó**.
- **🗑 Limpar:** apaga a árvore que está na tela e deixa tudo pronto para rodar de
  novo, **sem apagar o seu código**.
- **📂 Importar / 💾 Exportar:** abre ou salva o código como um arquivo `.py`.
- **❓ (bolinha "?" no topo):** botão de ajuda. Copia um prompt pronto para você
  colar em qualquer IA junto com o seu código (veja a seção
  [Transparência sobre o prompt](#-transparência-sobre-o-prompt-do-botão-)).

Se o seu código tiver algum erro, aparece uma **caixa vermelha embaixo do editor**
dizendo **em qual linha** foi o problema — é só corrigir e rodar de novo.

### 🛡️ À prova de travamentos

O site foi feito para aguentar código "de qualquer jeito" (inclusive gerado por
IA) sem travar:

- **Laço infinito** (`while True`) para sozinho no limite de passos, em vez de
  congelar a página.
- **`input()` e menus interativos** não funcionam aqui (é um visualizador, não um
  terminal) — em vez de travar, aparece um aviso explicando o que fazer.
- Saída e árvore muito grandes são **limitadas** para não pesar.
- Um erro no seu código **nunca quebra o site** — ele mostra a mensagem e segue.

---

## 🤖 Transparência sobre o prompt do botão "?"

Ao clicar em **📋 Copiar prompt** (na bolinha "?"), o site copia para a área de
transferência o texto abaixo **seguido do seu código**. Nada é enviado para
lugar nenhum — é só copiar; você é quem cola numa IA à sua escolha. O prompt fica
aqui à mostra para total transparência:

```text
Você é um professor de Estruturas de Dados ajudando um aluno.

O código Python abaixo roda em um VISUALIZADOR WEB de Árvore Binária de Busca (BST) que executa Python no navegador (Pyodide) e desenha a árvore passo a passo. Ele tem regras importantes:

- NÃO existe terminal interativo: não use input() nem menus com "while True". O código roda de uma vez só, como um script.
- Chame as operações DIRETO no final do código (criar a árvore, inserir valores, buscar, percorrer em ordem/pré/pós, etc.) usando print() para mostrar resultados.
- A árvore é reconhecida pelos nomes dos atributos: valor em valor/value/val/key/chave/info; filho esquerdo em esquerda/esq/left; filho direito em direita/dir/right. Também aceita uma classe "wrapper" (ex.: uma classe Tree com atributo .raiz).
- Use apenas Python puro, sem bibliotecas externas.

Sua tarefa:
1. Diga, de forma simples, qual(is) o(s) erro(s) do código.
2. Corrija o código para funcionar nesse visualizador (sem input()/menu; com um trecho no final que monta a árvore e chama as operações).
3. Devolva o código corrigido COMPLETO, pronto para copiar e colar.

Código do aluno:

"""
(o seu código entra aqui automaticamente)
"""
```

> ℹ️ O prompt fica no arquivo `src/main.jsx` (constante `HELP_PROMPT`). Se quiser
> mudar o texto, é só editar por lá.

---

## 🛠️ Tecnologias usadas

| Tecnologia | Para quê serve |
| --- | --- |
| **[Vite](https://vite.dev) + [React 18](https://react.dev)** | Montam a tela e o servidor que roda no seu computador. |
| **[Pyodide](https://pyodide.org)** | Roda **Python 3 dentro do navegador** (sem precisar instalar Python). É ele que executa o seu código. |
| **`sys.settrace` (do próprio Python)** | Faz o papel de "modo debug", guardando uma "foto" a cada linha (linha atual + árvore + nó apontado). |
| **SVG + CSS** | Desenham a árvore e as animações. |

---

## 📁 Estrutura dos arquivos

```
arvore/
├── index.html        # página inicial (carrega o Pyodide + o app)
├── vite.config.js    # configuração do Vite
├── package.json      # lista de dependências e comandos
└── src/
    ├── main.jsx      # o app (interface, botões, desenho da árvore)
    ├── tracer.js     # o código Python do "debug" + posição dos nós
    └── styles.css    # as cores e o estilo
```

Comandos disponíveis (para quem quiser explorar):

```
npm run dev       # liga o projeto (o que você vai usar no dia a dia)
npm run build     # gera uma versão pronta para publicar (pasta dist/)
npm run preview   # testa essa versão pronta
```

---

## 🔍 Como o site reconhece a árvore

Ele identifica um "nó" pelo nome dos atributos. Já reconhece automaticamente:

- **Valor:** `valor`, `value`, `val`, `key`, `chave`, `data`, `dado`, `info`, `item`
- **Filho esquerdo:** `esquerda`, `esq`, `left`, `l`, `filho_esquerdo`, `filho_esq`
- **Filho direito:** `direita`, `dir`, `right`, `r`, `filho_direito`, `filho_dir`

Se quiser usar outros nomes, é só adicioná-los nas listas `VAL` / `LEFT` / `RIGHT`
no começo do arquivo `src/tracer.js`.

Convenções usadas: **raiz = nível 0** e **altura = número de arestas** do caminho
mais longo (uma árvore só com a raiz tem altura 0).

---

## 📚 Sobre

Projeto feito para a disciplina de **Estruturas de Dados** do **CEULP/ULBRA**, com
o **professor Fabiano Fagundes**.

- Finalidade **exclusivamente acadêmica / de estudo**.
- **Sem fins lucrativos** — sem intenção de venda ou uso comercial.
- Desenvolvido **com ajuda de Inteligência Artificial** (Claude Code) como
  ferramenta de apoio ao aprendizado.

---

### 💚 Bons estudos e boas provas!

Que este projeto te ajude a enxergar as árvores de um jeito mais claro.
Você consegue. 🌳✨
#
