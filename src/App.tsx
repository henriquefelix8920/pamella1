import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { PRODUCT } from './config';
// Ícones editoriais com traço uniforme e discreto.


type ElegantIconName = 'chart' | 'lightbulb' | 'bank' | 'building' | 'calendar' | 'target' | 'book' | 'spreadsheet' | 'calculator' | 'video' | 'document';

function ElegantIcon({ name, className = 'w-6 h-6' }: { name: ElegantIconName; className?: string }) {
  const paths: Record<ElegantIconName, React.ReactNode> = {
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 2 5-6" /><path d="M16 7h3v3" /></>,
    lightbulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8.5 14.5a7 7 0 1 1 7 0c-.9.6-1.5 1.5-1.5 2.5h-4c0-1-.6-1.9-1.5-2.5Z" /></>,
    bank: <><path d="m3 9 9-6 9 6" /><path d="M4 10h16" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /><path d="M3 20h18M2 23h20" /></>,
    building: <><path d="M4 21V5l8-3 8 3v16" /><path d="M8 8h1M15 8h1M8 12h1M15 12h1M8 16h1M15 16h1" /><path d="M10 21v-3h4v3" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /><path d="m8 15 2 2 5-4" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /><path d="m15 9 5-5M16 4h4v4" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z" /><path d="M4 5.5V22M8 7h8M8 11h7" /></>,
    spreadsheet: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></>,
    calculator: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M8 6h8v4H8zM8 14h2M14 14h2M8 18h2M14 18h2" /></>,
    video: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3Z" /></>,
    document: <><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v6h5M9 13h7M9 17h7" /></>,
  };
  return <svg className={`${className} elegant-icon-motion`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

// ═══════════════════════════════════════════
// ANIMATED BUTTON COMPONENT
// ═══════════════════════════════════════════

function AnimatedButton({ children, href, variant = 'primary', className = '' }: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'offer';
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const baseClasses = 'relative inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-full overflow-hidden transition-all duration-500 group';
  const variantClasses = variant === 'offer'
    ? 'offer-cta text-[#10291d] border border-[#e7d7a6]/80'
    : variant === 'secondary'
    ? 'editorial-cta text-[#f4f0e5] border border-[#d9cda9]/35'
    : 'editorial-cta text-[#f4f0e5] border border-white/20';

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Glow follower */}
      {isHovered && (
        <span
          className="absolute w-32 h-32 rounded-full opacity-30 blur-xl transition-opacity duration-300 pointer-events-none"
          style={{
            left: mousePos.x - 64,
            top: mousePos.y - 64,
            background: variant === 'offer' ? 'rgba(232,211,151,0.35)' : 'rgba(212,205,169,0.18)'
          }}
        />
      )}
      
      {/* Border glow animation */}
      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(232,211,151,0.3), transparent, rgba(82,116,91,0.25))',
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <motion.svg
          className="elegant-icon-motion w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </motion.svg>
      </span>
    </a>
  );
}

// ═══════════════════════════════════════════
// SECTION WRAPPER WITH ANIMATED BG
// ═══════════════════════════════════════════

function AnimatedSection({ children, className = '', id = '', bgVariant = 'default' }: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  bgVariant?: 'default' | 'accent' | 'gold' | 'dark';
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const bgClasses = {
    default: 'bg-[#10291d]',
    accent: 'bg-gradient-to-b from-[#10291d] via-[#173d2b] to-[#10291d]',
    gold: 'bg-gradient-to-b from-[#10291d] via-[#173d2b] to-[#10291d]',
    dark: 'bg-gradient-to-b from-[#10291d] via-[#10291d] to-[#10291d]',
  };

  return (
    <section
      ref={ref}
      id={id}
      className={`relative min-h-screen py-20 md:py-32 overflow-hidden ${bgClasses[bgVariant]} ${className}`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: bgVariant === 'gold'
              ? 'radial-gradient(ellipse at 30% 50%, rgba(212,168,83,0.08) 0%, transparent 60%)'
              : bgVariant === 'accent'
              ? 'radial-gradient(ellipse at 70% 50%, rgba(108,99,255,0.08) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(108,99,255,0.05) 0%, transparent 60%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>
      
      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════
// 3D CARD COMPONENT
// ═══════════════════════════════════════════

function Card3D({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -10;
    const rotateY = (x - 0.5) * 10;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [0, 5]);

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video absolute inset-0 w-full h-full object-cover opacity-75"
          src={PRODUCT.heroVideo}
        />
        <div className="absolute inset-0 hero-video-fade" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10291d]/35 via-transparent to-[#10291d]/20" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 text-center"
        style={{ y, opacity, scale }}
      >
        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <span className="block text-[#f5f1e7]">Invista no seu</span>
          <span className="block text-gradient-gold">futuro financeiro</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-[#d8d2c1] max-w-[600px] mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {PRODUCT.tagline}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <AnimatedButton href="#materiais" variant="secondary">
            Conhecer o material
          </AnimatedButton>
          <a
            href="#conteudo"
            className="inline-flex items-center gap-2 px-6 py-4 text-[#d8d2c1] hover:text-white transition-colors duration-300"
          >
            <span>Saiba mais</span>
            <motion.svg
              className="elegant-icon-motion w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </a>
        </motion.div>

        {/* Price hint */}
        <motion.p
          className="mt-8 text-sm text-[#b5b29f]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          A partir de {PRODUCT.price.amount} • ou {PRODUCT.price.installments}
        </motion.p>

        {/* Floating product mockup */}
        <motion.div
          className="mt-12 perspective-container"
          style={{ rotateX }}
          initial={{ opacity: 0, y: 60, rotateY: -15 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative mx-auto w-[280px] h-[360px] sm:w-[320px] sm:h-[420px]" style={{ animation: 'float 6s ease-in-out infinite' }}>
            {/* Glow behind mockup */}
            <div className="absolute inset-0 rounded-3xl border border-[#c8ad70]/15 scale-[1.03]" />
            
            {/* Mockup card */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, #234735 0%, #173d2b 62%, #10291d 100%)',
                transform: 'translateZ(40px)',
              }}>
              {/* Inner content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-[#c8ad70]/35 mb-6 shadow-lg">
                  <img src="/foto3.jpg" alt="Material Investimento Inicial" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Investimento Inicial
                </h3>
                <p className="text-[#c8ad70] text-sm font-medium mb-4">para Educadores</p>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c8ad70]/50 to-transparent mb-4" />
                <p className="text-xs text-[#d8d2c1] leading-relaxed">
                  Guia prático de educação financeira
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 border border-[#c8ad70]/10 rounded-full" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-[#52745b]/10 rounded-lg rotate-45" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" 
                 />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#d8d2c1]/30 flex items-start justify-center p-1 elegant-icon-motion">
          <motion.div
            className="w-1.5 h-3 rounded-full bg-[#52745b] elegant-icon-motion"
            animate={{ y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════
// IDENTIFICATION SECTION
// ═══════════════════════════════════════════

function IdentificationSection() {
  const situations = [
    "Quer organizar melhor suas receitas e despesas, mas não sabe por onde começar",
    "Sente que poderia investir, mas não entende os conceitos básicos",
    "Gostaria de planejar o futuro financeiro com mais clareza e segurança",
    "Busca um material didático que respeite seu ritmo de aprendizagem",
    "Quer distinguir entre reserva financeira e investimento de forma prática",
  ];

  return (
    <AnimatedSection id="identificacao" bgVariant="accent">
      
      
      <div className="relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#52745b] border border-[#52745b]/20 bg-[#52745b]/5">
              Identificação
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Este material pode ser <span className="text-gradient-accent">para você</span> se...
          </h2>
          <p className="text-[#d8d2c1] text-lg max-w-[600px] mx-auto">
            Você não precisa ser especialista em investimentos para começar a cuidar melhor do seu dinheiro.
          </p>
        </motion.div>

        <div className="grid gap-4 max-w-[700px] mx-auto">
          {situations.map((situation, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 p-5 rounded-xl glass-surface glass-surface-hover transition-all duration-300 group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ x: 8, transition: { duration: 0.2 } }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#52745b]/20 to-[#52745b]/5 flex items-center justify-center group-hover:from-[#52745b]/30 group-hover:to-[#52745b]/10 transition-all duration-300">
                <svg className="w-4 h-4 text-[#52745b] elegant-icon-motion" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#e8e8f0] text-base leading-relaxed">{situation}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ═══════════════════════════════════════════
// SOLUTION SECTION
// ═══════════════════════════════════════════

function SolutionSection() {
  const topics = [
    { icon: "chart", title: "Organização financeira", desc: "Compreender suas receitas e despesas de forma clara" },
    { icon: "lightbulb", title: "Primeiros passos nos investimentos", desc: "Conceitos básicos apresentados de forma acessível" },
    { icon: "bank", title: "Renda fixa", desc: "Entender CDB e Tesouro Direto como possibilidades" },
    { icon: "building", title: "Fundos imobiliários", desc: "Conhecer o conceito de FIIs e como funcionam" },
    { icon: "calendar", title: "Planejamento de longo prazo", desc: "Pensar no futuro financeiro com mais clareza" },
    { icon: "target", title: "Começar com valores pequenos", desc: "Entender que é possível iniciar com pouco" },
  ];

  return (
    <AnimatedSection id="conteudo" bgVariant="gold">
      
      
      <div className="relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#c8ad70] border border-[#c8ad70]/20 bg-[#c8ad70]/5">
              Conteúdo
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            O que você vai <span className="text-gradient-gold">aprender</span>
          </h2>
          <p className="text-[#d8d2c1] text-lg max-w-[600px] mx-auto">
            Um caminho prático para educadores que querem compreender finanças pessoais e investimentos de forma gradual.
          </p>
        </motion.div>

        <div className="learning-list max-w-[920px] mx-auto">
          {topics.map((topic, i) => (
            <motion.article
              key={topic.title}
              className="learning-row"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
            >
              <div className="learning-icon" aria-hidden="true"><ElegantIcon name={topic.icon as ElegantIconName} className="w-6 h-6 elegant-icon-motion" /></div>
              <div className="learning-copy">
                <h3>{topic.title}</h3>
                <p>{topic.desc}</p>
              </div>
              <div className="learning-rule" aria-hidden="true"><ElegantIcon name="target" className="w-5 h-5 elegant-icon-motion" /></div>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ═══════════════════════════════════════════
// INCLUDED MATERIALS SECTION
// ═══════════════════════════════════════════

function IncludedSection() {
  const iconMap: Record<string, string> = {
    book: "book",
    spreadsheet: "spreadsheet",
    calculator: "calculator",
    video: "video",
  };

  return (
    <AnimatedSection id="materiais" bgVariant="dark">
      
      
      <div className="relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#52745b] border border-[#52745b]/20 bg-[#52745b]/5">
              Materiais
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            O que está <span className="text-gradient-accent">incluído</span>
          </h2>
          <p className="text-[#d8d2c1] text-lg max-w-[600px] mx-auto">
            Todo o material que você recebe ao adquirir o produto.
          </p>
        </motion.div>

        <div className="grid gap-5 max-w-[900px] mx-auto">
          {PRODUCT.materials.map((material, i) => (
            <Card3D key={i} delay={i} className="group">
              <div className="flex items-start gap-5 p-6 glass-surface rounded-2xl group-hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden">
                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.1), transparent, rgba(212,168,83,0.1))',
                    padding: '1px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                  }} />
                
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#52745b]/20 to-[#c8ad70]/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  <ElegantIcon name={(iconMap[material.icon] || 'document') as ElegantIconName} className="w-6 h-6 elegant-icon-motion" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-[#f5f1e7] mb-1 group-hover:text-gradient-gold transition-all duration-300">{material.title}</h3>
                  <p className="text-[#d8d2c1] text-sm leading-relaxed">{material.description}</p>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ═══════════════════════════════════════════
// AUTHOR SECTION
// ═══════════════════════════════════════════

function AuthorSection() {
  return (
    <AnimatedSection id="autora" bgVariant="accent">
      
      
      <div className="relative z-10">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#c8ad70] border border-[#c8ad70]/20 bg-[#c8ad70]/5">
                Autora
              </span>
            </motion.div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Sobre a <span className="text-gradient-gold">autora</span>
            </h2>
          </motion.div>

          <Card3D>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 glass-surface rounded-2xl relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#c8ad70]/[0.02] to-[#52745b]/[0.02]" />
              
              <motion.div
                className="flex-shrink-0 relative z-10"
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Animated ring */}
                  <div className="absolute -inset-3 rounded-2xl border border-[#c8ad70]/20"
                     />
                  
                  <img
                    src={PRODUCT.author.photo}
                    alt={`Foto de ${PRODUCT.author.name}`}
                    className="author-portrait-motion w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-[#c8ad70]/20 relative z-10"
                  />
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#52745b]/20 to-[#c8ad70]/20 blur-md -z-10"
                     />
                </div>
              </motion.div>
              
              <motion.div
                className="text-center md:text-left relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-[#f5f1e7] mb-2">{PRODUCT.author.name}</h3>
                <p className="text-[#c8ad70] font-medium mb-4">{PRODUCT.author.role}</p>
                <p className="text-[#d8d2c1] leading-relaxed">
                  Educadora que criou este material a partir da própria experiência em organizar as finanças pessoais 
                  e aprender sobre investimentos. O conteúdo reflete uma trajetória real de quem começou do zero 
                  e busca compartilhar o caminho com outros educadores.
                </p>
              </motion.div>
            </div>
          </Card3D>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ═══════════════════════════════════════════
// OFFER SECTION
// ═══════════════════════════════════════════

function OfferSection() {
  return (
    <AnimatedSection id="oferta" bgVariant="gold">
      
      
      <div className="relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#c8ad70] border border-[#c8ad70]/20 bg-[#c8ad70]/5">
              Oferta
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Sua <span className="text-gradient-gold">oferta</span> completa
          </h2>
        </motion.div>

        <Card3D className="max-w-[600px] mx-auto">
          <div className="p-8 md:p-10 glass-surface rounded-2xl text-center relative overflow-hidden">
            {/* Decorative gradient top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#52745b] via-[#c8ad70] to-[#52745b]"
              style={{ backgroundSize: '100% 100%' }} />
            
            {/* Corner decorations */}
            <div className="absolute top-4 right-4 w-16 h-16 border border-[#c8ad70]/10 rounded-full" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border border-[#52745b]/10 rounded-lg rotate-45" />
            
            <h3 className="text-xl font-bold text-[#f5f1e7] mb-2">{PRODUCT.name}</h3>
            <p className="text-[#b5b29f] text-sm mb-8">Tudo que você recebe ao adquirir o material</p>
            
            {/* Included items */}
            <div className="text-left mb-8 space-y-3">
              {PRODUCT.materials.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4ade80]/10 flex items-center justify-center elegant-icon-motion">
                    <svg className="elegant-icon-motion w-3.5 h-3.5 text-[#c8ad70]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#f5f1e7] text-sm">{item.title}</span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* Price */}
            <div className="mb-8">
              <p className="text-[#b5b29f] text-sm mb-2">Investimento</p>
              <motion.div
                className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {PRODUCT.price.amount}
              </motion.div>
              <p className="text-[#d8d2c1] text-sm">
                ou {PRODUCT.price.installments}
              </p>
              <p className="text-[#b5b29f] text-xs mt-2">{PRODUCT.price.note}</p>
            </div>

            {/* CTA */}
            <AnimatedButton href={PRODUCT.checkoutUrl} variant="offer" className="w-full">
              Acessar a oferta
            </AnimatedButton>

            {/* Trust note */}
            <p className="mt-6 text-xs text-[#b5b29f] leading-relaxed">
              Pagamento processado pela Hotmart. Conteúdo de caráter educativo. 
              Este material não substitui aconselhamento financeiro profissional individual.
            </p>
          </div>
        </Card3D>
      </div>
    </AnimatedSection>
  );
}

// ═══════════════════════════════════════════
// FAQ SECTION
// ═══════════════════════════════════════════

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <AnimatedSection id="faq" bgVariant="dark">
      
      
      <div className="relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#52745b] border border-[#52745b]/20 bg-[#52745b]/5">
              Dúvidas
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Perguntas <span className="text-gradient-accent">frequentes</span>
          </h2>
        </motion.div>

        <div className="max-w-[700px] mx-auto space-y-3">
          {PRODUCT.faq.map((item, i) => (
            <motion.div
              key={i}
              className={`glass-surface rounded-xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'ring-1 ring-[#52745b]/20' : ''
              }`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              layout
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors duration-200 group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-[#f5f1e7] font-medium pr-4 group-hover:text-[#e8e8f0] transition-colors">{item.question}</span>
                <motion.div
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#52745b]/10 flex items-center justify-center"
                  animate={{ rotate: openIndex === i ? 180 : 0, scale: openIndex === i ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-4 h-4 text-[#52745b] elegant-icon-motion"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-[#d8d2c1] text-sm leading-relaxed border-t border-white/5 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ═══════════════════════════════════════════
// FINAL CTA SECTION
// ═══════════════════════════════════════════

function FinalCTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#10291d] via-[#173d2b] to-[#10291d]" />

      <div className="relative z-10 max-w-[700px] mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#c8ad70] border border-[#c8ad70]/20 bg-[#c8ad70]/5">
              Próximo passo
            </span>
          </motion.div>
          
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Dê o <span className="text-gradient-gold">primeiro passo</span>
          </h2>
          <p className="text-[#d8d2c1] text-lg mb-10 max-w-[500px] mx-auto leading-relaxed">
            Educação financeira é um caminho. Este material pode ser o início — prático, acessível e pensado para quem está começando.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatedButton href="#materiais" variant="secondary">
              Conhecer o material
            </AnimatedButton>
          </motion.div>
          
          <p className="mt-8 text-xs text-[#b5b29f]">
            Acesso imediato após confirmação do pagamento via Hotmart
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════

function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/5 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#52745b]/[0.02] rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={PRODUCT.logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-[#b5b29f]">{PRODUCT.name}</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-[#b5b29f] leading-relaxed max-w-[400px]">
              Conteúdo de caráter educativo. Não constitui aconselhamento financeiro personalizado. 
              Resultados individuais podem variar. Consulte um profissional para orientações específicas.
            </p>
          </div>
        </div>
        
        {/* Bottom divider with gradient */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#b5b29f]">
              © {new Date().getFullYear()} {PRODUCT.author.name}. Todos os direitos reservados.
            </p>
            <p className="text-xs text-[#b5b29f]">
              Pagamento seguro via Hotmart
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// NAVIGATION BAR
// ═══════════════════════════════════════════

function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-[#c8ad70]/15 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'py-3 bg-[#10291d]/95 shadow-lg shadow-black/20' : 'py-3 sm:py-4 bg-[#10291d]/88'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Animated border bottom when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#52745b]/20 to-transparent" />
      )}
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <img src={PRODUCT.logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            {scrolled && (
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#c8ad70]/30 to-[#52745b]/30 blur-sm -z-10" />
            )}
          </div>
          <span className="text-sm font-medium text-[#f5f1e7] hidden sm:block">
            {PRODUCT.name}
          </span>
        </motion.div>
        <AnimatedButton href={PRODUCT.checkoutUrl} variant="secondary" className="!px-5 !py-2.5 text-sm">
          Acessar oferta
        </AnimatedButton>
      </div>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  return (
    <div className="min-h-screen bg-[#10291d] text-[#f5f1e7] overflow-x-hidden">

      <NavBar />
      <main>
        <HeroSection />
        <IdentificationSection />
        <SolutionSection />
        <IncludedSection />
        <AuthorSection />
        <OfferSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
