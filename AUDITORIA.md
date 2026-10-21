# Auditoria da página de vendas — Investimento Inicial para Educadores

## Escopo e evidências

Auditoria do repositório `henriquefelix8920/pamella1`, com leitura do código React/CSS, inspeção dos recursos do site, verificação do checkout público em português e checagens técnicas locais. O checkout foi consultado sem preencher dados pessoais nem acionar pagamento.

## Diagnóstico antes da reformulação

### Posicionamento e copy

A página apresentava o curso por meio de títulos amplos sobre “liberdade financeira”, com benefícios em linguagem genérica e pouca conexão explícita com as dúvidas cotidianas de professores. Havia repetições entre conteúdo, materiais, oferta e chamada final. A primeira chamada levava à seção de materiais, em vez de aproximar rapidamente a pessoa da compra.

A biografia anterior afirmava aspectos da trajetória pessoal da autora que não estavam comprovados no material público consultado. A FAQ também prometia garantia de sete dias sem que essa condição aparecesse na página pública do checkout consultada.

### Visual e experiência

O vídeo era aplicado como fundo ao longo de toda a página, competindo com textos e botões. A estrutura tinha blocos longos com cartões e ícones repetidos, seções com altura mínima de tela e hierarquia tipográfica fraca. O mesmo serifado era usado em quase todo o conteúdo; algumas regras CSS ainda traziam cores roxas e azuis que não combinavam com a identidade verde solicitada.

A imagem `public/foto3.jpg` usada na capa do curso era de um produto diferente, relacionado a curso de moda/social media. Esse recurso foi removido da página e do diretório público. O vídeo original ficou arquivado fora de `public/` após a primeira reformulação; em atualização posterior, uma cópia web otimizada passou a aparecer apenas no hero. O retrato da autora e o logotipo originais foram preservados.

### Conversão e informação comercial

O endereço configurado como “checkout” abria uma segunda página de vendas da Hotmart, antes do pagamento. A página pública da oferta confirmava o preço à vista de R$ 58,40, mas o checkout em português mostrou também 12 parcelas de R$ 6,04, total de R$ 72,48, com acréscimo no parcelamento. A apresentação atual deixa esse total explícito e direciona os botões diretamente ao checkout oficial.

A garantia de sete dias não foi encontrada no checkout público consultado. A copy não promete mais essa condição; recomenda conferir reembolso e termos diretamente na Hotmart antes de concluir a compra.

## Estrutura implementada

A narrativa foi reorganizada em AIDA:

- **Atenção:** promessa editorial dirigida a professores, com destaque para a identidade verde e marfim inspirada em gravuras monetárias, capa tipográfica original e elementos flutuantes.
- **Interesse:** identificação com a rotina de educadores e uma jornada visual de organização financeira, entendimento das opções e planejamento.
- **Desejo:** apresentação específica dos temas e ferramentas incluídos — guia, planilha, calculadora e duas videoaulas — sem alegar retornos ou resultados garantidos.
- **Ação:** oferta com preço à vista e parcelado discriminado, CTA para o checkout oficial, respostas a objeções e CTA móvel persistente após rolagem.

A identidade usa DM Serif Display e DM Sans, detalhes de gravura, sinais de moeda e elementos de papel/ledger em CSS, evitando depender de modelos genéricos de cartões estáticos. A página mantém navegação responsiva, FAQ nativa expansível, metadados básicos de compartilhamento e suporte a `prefers-reduced-motion`.

## Auditoria técnica e segurança

A implementação antiga carregava muitas dependências sem uso na página, incluindo recursos 3D, gráficos, roteamento, drag-and-drop e utilitários. O componente 3D órfão foi removido e as dependências foram reduzidas ao conjunto utilizado pela página e pelo build. O `npm audit` passou de sete vulnerabilidades reportadas no conjunto original para zero após essa limpeza e atualização compatível.

## Verificações realizadas

- `npm run typecheck`: aprovado.
- `npm run build`: aprovado.
- `npm audit`: zero vulnerabilidades reportadas após a atualização.
- Pré-visualização via navegador: título, copy, seções AIDA, FAQ e links renderizados; rota `/manus-routes.json` respondeu com o manifesto válido.
- Checkout Hotmart: R$ 58,40 à vista; 12x de R$ 6,04; total parcelado de R$ 72,48, com acréscimo. Nenhuma compra foi iniciada.

## Recomendação para operação

Revise periodicamente preço, parcelamento e políticas no checkout antes de campanhas. Se houver uma política específica de garantia ou reembolso aprovada para esta oferta, ela pode ser adicionada à página usando a condição exata exibida pela Hotmart.

## Fontes

- [Página pública da oferta Hotmart](https://ps-pamela.hotmart.host/investimento-inicial-para-educadores-construa-sua-liberdade-financeira-a6936b49-be67-439a-a251-99d2fef587b5)
- [Checkout oficial da oferta](https://pay.hotmart.com/H107527766S?off=hgr7z00a&hotfeature=51)
- [21st.dev — referências de componentes para landing pages](https://21st.dev/community/components/s/landing-page)


## Atualização posterior — vídeo no hero

A pedido da proprietária, o vídeo original foi reintroduzido apenas como fundo do hero. Para web, foi codificado em H.264, 1280×720, sem faixa de áudio: o arquivo passou de 14,09 MB para 4,16 MB. Um poster estático serve de fallback e o vídeo não é renderizado quando o dispositivo indica preferência por movimento reduzido. A cópia original permanece preservada em `archived-assets/video1.mp4`.
