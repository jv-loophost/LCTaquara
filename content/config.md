# Configuração geral do site

# >>> Edite os valores depois dos dois-pontos. Não apague os nomes dos campos. <<<

clube: Lions Clube Taquara
cidade: Taquara/RS
lema: Nós servimos
al_atual: AL26-27
als: AL26-27

# Links que aparecem na barra do topo e no rodapé
instagram_url: https://instagram.com/lionstaquara
mylion_url: https://www.lionportal.org
distrito: Distrito LD-2
distrito_multiplo: Distrito Múltiplo LD
estatuto_url: content/AL26-27/estatuto.pdf

# ----------------------------------------------------------------------
# SEÇÕES DA PÁGINA (ordem de exibição, de cima para baixo)
# Cada linha:  arquivo | título | ícone | modo
#
#   modo = markdown      -> texto livre (negrito, listas, links, tabelas)
#   modo = presidente    -> lema do AL em destaque + carta do presidente
#   modo = financeiro    -> mostra o PIX atrás de um botão
#   modo = aniversarios  -> lido pelo calendário e exibido mês a mês
#   modo = campanhas     -> calendário leonístico (inclui aniversários automaticamente)
#   modo = banner        -> banner rotativo de fotos (fica no topo)
#
# Para ADICIONAR uma seção nova: crie o arquivo .md na pasta do AL e
# acrescente uma linha aqui no formato acima (use modo markdown).
# Para REMOVER uma seção: apague (ou comente com #) a linha dela.
# Ícones: nomes em https://tabler.io/icons (sem o "ti-").
# ----------------------------------------------------------------------

## Seções
fotos.md               | (banner)               | photo          | banner
palavra-presidente.md  | Palavra do Presidente  | quote          | presidente
clube.md               | Informações do clube   | map-pin        | markdown
diretoria.md           | Diretoria              | users          | markdown
comites.md             | Comitês                | clipboard-list | markdown
comissoes.md           | Comissões              | checklist      | markdown
contatos.md            | Contatos               | mail           | markdown
links.md               | Links úteis            | external-link  | markdown
financeiro.md          | Financeiro             | cash           | financeiro
aniversarios.md        | Aniversários           | cake           | aniversarios
campanhas.md           | Calendário leonístico  | calendar-star  | campanhas
