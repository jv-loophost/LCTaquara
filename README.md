# Lions Clube Taquara — site dos sócios

Landing page com as informações do Ano Leonístico (AL) para os sócios do
Lions Clube Taquara. **Todo o conteúdo fica em arquivos de texto (`.md`)** que
qualquer pessoa consegue editar — não é preciso saber programar.

- **Editar conteúdo:** mude os arquivos dentro de `content/AL26-27/`.
- **Publicar:** salve a alteração (Commit) no GitHub. O site atualiza sozinho.
- **Site no ar:** https://jv-loophost.github.io/LCTaquara/ (após ligar o GitHub Pages — veja abaixo).

Não existe etapa de "compilar". O `index.html` lê os `.md` na hora de abrir a página.

---

## Como está organizado

```
LCTaquara/
├── index.html              <- o "motor" da página (raramente se mexe)
├── assets/
│   ├── styles.css          <- aparência (cores, fontes)
│   ├── app.js              <- lógica (raramente se mexe)
│   └── lions-emblem.png    <- emblema do clube
├── content/
│   ├── config.md           <- painel de controle: dados gerais + ordem das seções
│   └── AL26-27/            <- TUDO do Ano Leonístico 2026/2027
│       ├── clube.md
│       ├── diretoria.md
│       ├── comites.md
│       ├── comissoes.md
│       ├── contatos.md
│       ├── links.md
│       ├── financeiro.md   <- PIX (aparece só ao clicar)
│       ├── aniversarios.md <- exibidos DENTRO do calendário, mês a mês (veja abaixo)
│       ├── campanhas.md    <- o calendário leonístico (seção principal)
│       ├── estatuto.pdf    <- troque pelo estatuto oficial
│       └── fotos/          <- fotos do banner do topo
└── README.md               <- este arquivo
```

---

## Como editar (pelo navegador, sem instalar nada)

1. Entre no repositório no GitHub e abra o arquivo que quer mudar (ex.: `content/AL26-27/campanhas.md`).
2. Clique no lápis (**Edit**) no canto superior direito.
3. Faça as alterações no texto.
4. Role até o fim e clique em **Commit changes**.
5. Pronto — em cerca de 1 minuto o site reflete a mudança. **Isso é o "deploy".**

> Dica: cada arquivo `.md` começa com linhas de comentário (que iniciam com `#`)
> explicando o formato daquela seção. Elas não aparecem no site.

### O painel de controle: `content/config.md`
É onde ficam os dados gerais (nome, cidade, Instagram, MyLion, estatuto) e a
**ordem das seções**. Para esconder uma seção, basta apagar (ou comentar com `#`)
a linha dela na lista de seções. Para criar uma seção nova, crie o arquivo `.md`
e acrescente uma linha na lista no formato `arquivo | título | ícone | modo`.

Ícones: use os nomes de https://tabler.io/icons (sem o prefixo `ti-`).

---

## Aniversários — onde aparecem e como editar

Os aniversários **não têm mais uma seção separada** na página: eles aparecem
**dentro do Calendário Leonístico**, no final de cada mês, depois das
atividades. Cada mês que tiver aniversários ganha uma mini-lista com:

- 🎂 **Nascimentos** (ícone rosa)
- 💍 **Casamentos** (ícone dourado)

A legenda no topo do calendário identifica os dois tipos, e os botões de
navegação por mês (Jan, Fev, …) também acendem quando o mês tem aniversário,
mesmo sem nenhuma atividade programada.

**Para editar, nada mudou:** continue usando o arquivo
`content/AL26-27/aniversarios.md`, no mesmo formato de sempre:

```
## Aniversários de nascimento
12/03 | João da Silva

## Aniversários de casamento
27/05 | Ana e Pedro
```

Uma linha por pessoa/casal, no formato `DD/MM | Nome` (sem o ano), embaixo do
título certo. O calendário lê esse arquivo automaticamente e distribui os
aniversários nos meses correspondentes.

---

## Adicionar fotos ao banner

1. Coloque as imagens dentro de `content/AL26-27/fotos/` (de preferência largas, ex.: 1600x640).
2. Abra `content/AL26-27/fotos.md` e liste uma por linha: `arquivo | legenda`.
3. (Opcional) Como o banner é largo e baixo, ele mostra só uma faixa da foto. Para
   não cortar rostos, acrescente um 3º campo com o ponto focal, ex.:
   `arquivo | legenda | center 20%` (sobe o corte) ou `center 60%` (desce). Sem o
   campo, o padrão é o centro.

As fotos passam automaticamente, em rotação, no banner do topo.

---

## Criar o próximo Ano Leonístico (AL27-28, AL28-29, …)

A estrutura foi feita para o presidente seguinte **replicar em minutos**:

1. **Copie a pasta** `content/AL26-27/` e renomeie a cópia para `content/AL27-28/`.
2. Atualize os arquivos `.md` dentro dela (diretoria, campanhas, fotos, etc.).
3. Em `content/config.md`, troque `al_atual: AL26-27` por `al_atual: AL27-28`.
4. (Opcional) Para deixar os anos anteriores acessíveis por um seletor no topo,
   liste todos no campo `als`, por exemplo: `als: AL27-28, AL26-27`.

Os anos antigos ficam preservados nas pastas — nada se perde.

---

## Ligar o site (GitHub Pages) — só uma vez

1. No repositório, vá em **Settings -> Pages**.
2. Em **Build and deployment -> Source**, escolha **Deploy from a branch**.
3. Em **Branch**, selecione `main` e a pasta `/ (root)`. Salve.
4. Aguarde alguns minutos. O endereço será **https://jv-loophost.github.io/LCTaquara/**.

A partir daí, toda edição com Commit republica o site automaticamente.

> Observação: abrir o `index.html` direto do seu computador (`file://`) não
> funciona, porque o navegador bloqueia a leitura dos `.md`. Use o GitHub Pages
> (ou um servidor local) para visualizar.

---

## Usando o Claude Cowork

Com o GitHub conectado no Cowork, dá para pedir coisas como:

- "Atualize a diretoria do AL em `diretoria.md` com esta lista…"
- "Crie a pasta do AL27-28 a partir da do AL26-27."
- "Adicione estas atividades ao calendário de campanhas."

O Cowork edita os arquivos e faz o Commit (sempre pedindo sua confirmação antes).

---

## Sobre privacidade

Esta página é **pública**. Por isso, por padrão:

- Os **aniversários** mostram apenas **dia e mês** (sem o ano de nascimento).
- A **chave PIX** fica **atrás de um botão**, com aviso para confirmar com a tesouraria.

Antes de publicar nomes e datas dos sócios, é recomendável avisá-los. Se um dia
quiserem restringir o acesso só aos sócios, é possível migrar a hospedagem para
uma opção com login (ex.: Cloudflare Pages + Access).
