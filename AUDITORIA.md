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

A pedido da proprietária, o vídeo original foi reintroduzido apenas como fundo do hero. Para web, foi otimizado em H.264, 960×540, sem faixa de áudio: o arquivo passou de 14,09 MB para cerca de 1,93 MB. A imagem de poster foi retirada tanto do fundo quanto do elemento de vídeo para evitar aparência de imagem e vídeo sobrepostos; o vídeo é único meio visual de fundo. As fontes DM Sans e DM Serif Display são servidas localmente em WOFF2; retratos e logo usam WebP. O vídeo continua sem aparecer quando o dispositivo indica preferência por movimento reduzido. A cópia original permanece preservada em `archived-assets/video1.mp4`.


## Curadoria de desempenho — 21 de outubro de 2026

### Diagnóstico

O MP4 do hero era o maior recurso isolado: 1.934.682 bytes, H.264, 960×540, 24 fps, 8 segundos, reproduzido em loop. Além do download, o código aplicava saturação e brilho a cada quadro e mantinha uma textura SVG de ruído `feTurbulence` por cima. Esses fatores fazem do vídeo e da composição do hero os candidatos mais fortes para o peso percebido, embora o código sozinho não prove a origem da lentidão em cada aparelho.

O banner rolante não contém animação JavaScript: ele duplica os tópicos e anima apenas `transform` por CSS. Foi restaurado ao visual anterior, com ciclo de 52 segundos e animação desligada para quem prefere movimento reduzido. Portanto, não é o maior custo de rede e tende a ser menos oneroso que decodificar um vídeo contínuo.

O bundle não aponta, por si só, para um gargalo excepcional: JavaScript com 285.298 bytes sem compressão (91.625 bytes gzip), CSS com 29.261 bytes (7.669 bytes gzip), quatro dependências de runtime e fontes locais totalizando 86.248 bytes. As imagens WebP já eram compactas; a miniatura do logo e a foto completa ainda podiam ser ajustadas ao tamanho de uso no hero.

### Ajustes feitos

O vídeo web foi reencodado em H.264 Baseline, 640×360, 24 fps, sem áudio, mantendo os oito segundos e o conteúdo visual. O arquivo caiu para **1.068.601 bytes**, redução de **44,8%** sobre a versão web anterior; cada quadro tem **55,6% menos pixels** para decodificação. O original de 14,09 MB continua preservado em `archived-assets/video1.mp4`.

Removi o filtro de saturação/brilho que incidia sobre cada quadro e retirei a camada SVG de ruído em tela cheia. A opacidade e a sobreposição verde existentes continuam dando contraste à copy, e os círculos radiais, o vídeo como único fundo de mídia, as notas flutuantes, inclinação/volume da capa, animações Framer Motion, CTA dourado e efeitos 3D foram mantidos.

O selo do hero agora carrega um retrato WebP de 128×171 (5.014 bytes), em vez de baixar de imediato a foto completa (102.596 bytes); o retrato completo permanece para a seção da autora, que é lazy-loaded. O logo foi reduzido para 192×192 (3.982 bytes, antes 50.326). A soma bruta do vídeo e dessas duas imagens do primeiro hero caiu de 2.087.604 para 1.077.597 bytes (**48,4%**). O listener passivo da barra de compra móvel também só tenta atualizar o React quando cruza o limiar de visibilidade, não em todos os eventos de rolagem.

### Verificação e ressalvas

No preview desta sessão, o navegador mediu corpo codificado de 1.068.601 bytes (1.068.901 bytes transferidos incluindo cabeçalhos), resolução de 640×360 e filtro computado `none`; o ticker reportou animação `marquee` de 52 segundos. Um teste curto A/B neste browser de sandbox marcou 60 chamadas de `requestAnimationFrame` por segundo e zero quadros de vídeo perdidos tanto com vídeo pausado quanto reproduzindo. Houve uma frame longa em cada amostra. Isso verifica o comportamento no browser de teste, mas **não representa uma medição em celular ou no aparelho da proprietária**, onde GPU, rede e decodificador variam.

A auditoria estática também identificou o `backdrop-filter` do cabeçalho fixo e o brilho dourado animado (inclui `background-position` e sombra) como superfícies potenciais de pintura. Foram mantidos porque são efeitos visuais deliberados e o teste não demonstrou que estejam causando a lentidão relatada. Se ainda houver travamento no aparelho real, a próxima investigação conclusiva é uma gravação de Performance/Network nele, comparando a reprodução do vídeo ligada e pausada e verificando GPU, Paint e frames perdidos.
