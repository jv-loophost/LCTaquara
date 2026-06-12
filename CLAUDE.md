# CLAUDE.md

Orientações técnicas para o Claude Code (e outros agentes) trabalhando neste
repositório. Para a visão geral do projeto, formatos de conteúdo e procedimentos
de edição, a fonte da verdade é o **`README.md`** — leia-o primeiro. Este arquivo
cobre apenas o que é específico de quem mexe no código.

## Regra de ouro: sem build

**Site estático, sem dependências de pacote.** Não há `package.json`, `npm`,
bundler nem etapa de compilação — e **não crie nenhum**. O `index.html` carrega
`assets/app.js`, que em runtime faz `fetch` dos `.md` em `content/` e renderiza no
navegador com `marked`. `marked`, ícones (Tabler) e fontes (Google) vêm de CDN.

## Arquitetura motor × conteúdo

- **Motor** (raramente muda): `index.html`, `assets/app.js`, `assets/styles.css`.
- **Conteúdo** (o que quase toda tarefa edita): os `.md` em `content/`.
  - `content/config.md` — painel de controle: pares `chave: valor` e, após o
    cabeçalho `## Seções`, a lista ordenada `arquivo | título | ícone | modo`.
  - `content/AL<NN>-<NN>/` — tudo de um Ano Leonístico; `al_atual` em `config.md`
    define qual está ativo.

### Mapa modo → renderizador (em `app.js`)

Cada `modo` na lista de seções aciona uma função dedicada:

| modo           | função          | observação                                              |
|----------------|-----------------|---------------------------------------------------------|
| `markdown`     | `renderMarkdown`| texto livre via `marked`                                |
| `presidente`   | `renderPresidente`| 1ª linha `lema:` vira destaque; resto é a carta       |
| `financeiro`   | `renderFinanceiro`| chave PIX fica atrás de um botão (privacidade)        |
| `aniversarios` | —               | **não vira seção própria**; injetado no calendário      |
| `campanhas`    | `renderCampanhas`| o calendário; embute os aniversários mês a mês         |
| `banner`       | `buildHero`     | banner rotativo de fotos no topo                        |

## Armadilhas do parser (confira ao editar `.md` ou o motor)

- **Cabeçalho de mês em `campanhas.md`** precisa ser `## <Mês> <Ano>` com o nome do
  mês **em português** + ano (ex.: `## Julho 2026`). Se não casar com o rótulo
  gerado por `monthsForAL`, a atividade não aparece em mês nenhum.
- **`data` de atividade** é `DD/MM/AAAA` (ex.: `07/07/2026`). O regex de ordenação
  só captura dia/mês, mas o modal exibe a string inteira — não remova o ano.
- **`tipo`** é normalizado em `typeKey`: começa com "campanha" → campanha; "reuni" →
  reunião; "come"/"feria"/contém "comemora" → comemorativa; senão → evento.
- **Linhas iniciadas por `#`** em qualquer `.md` são comentários (documentam o
  formato no próprio arquivo) e não aparecem no site — preserve-as.
- Ao mexer em qualquer parser de `app.js`, valide que os `.md` existentes continuam
  válidos (ou ajuste-os junto).

## Visualizar localmente

**Nunca** abra `index.html` via `file://` — o navegador bloqueia o `fetch` dos
`.md`. Sirva a raiz por HTTP:

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Convenções

- A grande maioria das tarefas é **só editar `.md`**. Não toque em `index.html`,
  `app.js` ou `styles.css` a menos que o pedido seja claramente de motor/layout.
- **Dados sensíveis:** a página é pública. Aniversários só dia/mês (sem ano); PIX
  atrás de botão. Datas de aniversário/clube já foram conferidas com a lista
  oficial — trate como sensíveis e confirme antes de alterar.
- **Deploy é automático:** commit em `main` republica via GitHub Pages (~1 min).
  Não há script de deploy. CI em `.github/workflows/` roda o code-review do Claude
  em PRs e o bot `@claude` em issues/comentários.

> Procedimentos para o usuário leigo (editar pelo navegador, criar o próximo AL,
> ligar o GitHub Pages, formatos detalhados de cada `.md`): ver **`README.md`**.
