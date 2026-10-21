// Configuração centralizada do produto
// Atualize os valores aqui para refletir a oferta atual

export const PRODUCT = {
  name: "Investimento Inicial para Educadores",
  subtitle: "Construa sua Liberdade Financeira",
  tagline: "Um guia direto para educadores começarem a organizar o dinheiro e entender os primeiros passos dos investimentos — sem precisar ter experiência.",
  // Checkout público oficial da oferta Hotmart
  checkoutUrl: "https://pay.hotmart.com/H107527766S?off=hgr7z00a&hotfeature=51",
  // Condições consultadas no checkout brasileiro
  price: {
    amount: "R$ 58,40",
    installments: "12x de R$ 6,04",
    note: "À vista por R$ 58,40. Em 12x, o checkout informa total de R$ 72,48 (com acréscimo). Confira as condições atualizadas na Hotmart."
  },
  author: {
    name: "Pamella Seixas",
    role: "Professora da rede pública de Minas Gerais",
    photo: "/foto1.jpg"
  },
  logo: "/foto2.jpg",
  materials: [
    {
      title: "Manual / Guia Principal",
      description: "Material principal com orientações sobre organização financeira e primeiros passos nos investimentos.",
      icon: "book"
    },
    {
      title: "Planilha de Organização Financeira",
      description: "Ferramenta prática para ajustar e organizar suas receitas e despesas.",
      icon: "spreadsheet"
    },
    {
      title: "Calculadora de Aposentadoria",
      description: "Calculadora para auxiliar no planejamento financeiro de longo prazo.",
      icon: "calculator"
    },
    {
      title: "Videoaula: CDB e Tesouro Direto",
      description: "Aula complementar sobre renda fixa, abordando CDB e Tesouro Direto.",
      icon: "video"
    },
    {
      title: "Videoaula: Fundos Imobiliários (FIIs)",
      description: "Aula complementar sobre o conceito de fundos imobiliários.",
      icon: "video"
    }
  ],
  faq: [
    {
      question: "Para quem é este material?",
      answer: "O material foi desenvolvido para educadores que desejam compreender melhor suas finanças pessoais e aprender conceitos básicos de investimento. É voltado para quem está começando e quer organizar a vida financeira com orientação prática."
    },
    {
      question: "Preciso já entender de investimentos?",
      answer: "Não. O conteúdo foi pensado para iniciantes. A proposta é apresentar conceitos de forma acessível, sem exigir conhecimento prévio em finanças ou investimentos."
    },
    {
      question: "O que está incluído na compra?",
      answer: "O material inclui o manual/guia principal, uma planilha de organização financeira, uma calculadora de aposentadoria e duas videoaulas complementares (uma sobre CDB e Tesouro Direto, outra sobre fundos imobiliários)."
    },
    {
      question: "Como recebo acesso ao material?",
      answer: "Após a confirmação do pagamento, o acesso é disponibilizado pela plataforma Hotmart. Você receberá as instruções por e-mail."
    },
    {
      question: "Quais são as formas de pagamento?",
      answer: "O pagamento é processado pela Hotmart, que aceita cartão de crédito (com possibilidade de parcelamento), boleto bancário e outras formas disponíveis na plataforma."
    },
    {
      question: "Como funciona a garantia e o reembolso?",
      answer: "Confira as condições de garantia e reembolso no checkout oficial e nos termos aplicáveis da Hotmart antes de concluir a compra."
    }
  ]
} as const;
