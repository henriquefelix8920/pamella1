import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { PRODUCT } from './config';
import { HeroScene, SectionScene } from './components/Scene3D';

// ═══════════════════════════════════════════
// ANIMATED BUTTON COMPONENT
// ═══════════════════════════════════════════

function AnimatedButton({ children, href, variant = 'primary', className = '' }: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary';
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

  const baseClasses = variant === 'primary'
    ? 'relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white rounded-xl overflow-hidden transition-all duration-500 group'
    : 'relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl overflow-hidden transition-all duration-500 border group';

  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-[#6c63ff] to-[#8b83ff] hover:shadow-[0_0_40px_rgba(108,99,255,0.4)] hover:scale-[1.02]'
    : 'border-[#d4a853]/30 text-[#d4a853] hover:border-[#d4a853]/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:scale-[1.02]';

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
            background: variant === 'primary' ? 'rgba(108,99,255,0.6)' : 'rgba(212,168,83,0.6)'
          }}
        />
      )}
      
      {/* Border glow animation */}
      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.3), transparent, rgba(212,168,83,0.3))',
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <motion.svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
    default: 'bg-[#0a0a0f]',
    accent: 'bg-gradient-to-b from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f]',
    gold: 'bg-gradient-to-b from-[#0a0a0f] via-[#12100a] to-[#0a0a0f]',
    dark: 'bg-gradient-to-b from-[#0a0a0f] via-[#08080d] to-[#0a0a0f]',
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
            animation: 'gradient-shift 8s ease infinite',
            backgroundSize: '200% 200%',
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
// CURSOR GLOW EFFECT
// ═══════════════════════════════════════════

function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);
    
    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[100] mix-blend-screen hidden md:block"
      animate={{ x: pos.x - 150, y: pos.y - 150 }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
    >
      <div className="w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.08)_0%,transparent_70%)]" />
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src={PRODUCT.heroVideo}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/50" />
      </div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(108,99,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'gradient-shift 20s linear infinite',
        }} />
      </div>

      {/* 3D Scene */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Animated orbs */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#6c63ff]/10 blur-[100px]"
          style={{ animation: 'morph 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#d4a853]/8 blur-[120px]"
          style={{ animation: 'morph 10s ease-in-out infinite reverse' }} />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 text-center"
        style={{ y, opacity, scale }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <img
            src={PRODUCT.logo}
            alt="Logo"
            className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-[#d4a853]/30 shadow-[0_0_30px_rgba(212,168,83,0.2)]"
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-sm text-[#b8b8c8]">Material de Educação Financeira para Educadores</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <span className="block text-[#f8f8fc]">Invista no seu</span>
          <span className="block text-gradient-gold">futuro financeiro</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-[#b8b8c8] max-w-[600px] mx-auto mb-10 leading-relaxed"
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
          <AnimatedButton href={PRODUCT.checkoutUrl} variant="primary">
            Conhecer o material
          </AnimatedButton>
          <a
            href="#conteudo"
            className="inline-flex items-center gap-2 px-6 py-4 text-[#b8b8c8] hover:text-white transition-colors duration-300"
          >
            <span>Saiba mais</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </a>
        </motion.div>

        {/* Price hint */}
        <motion.p
          className="mt-8 text-sm text-[#7a7a8e]"
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/20 to-[#d4a853]/20 rounded-3xl blur-3xl scale-110" />
            
            {/* Mockup card */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                transform: 'translateZ(40px)',
              }}>
              {/* Inner content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a853] to-[#e8c47a] mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(212,168,83,0.3)]">
                  <svg className="w-8 h-8 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Investimento Inicial
                </h3>
                <p className="text-[#d4a853] text-sm font-medium mb-4">para Educadores</p>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d4a853]/50 to-transparent mb-4" />
                <p className="text-xs text-[#b8b8c8] leading-relaxed">
                  Guia prático de educação financeira
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 border border-[#d4a853]/10 rounded-full" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-[#6c63ff]/10 rounded-lg rotate-45" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" 
                style={{ animation: 'shimmer 3s ease-in-out infinite' }} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#b8b8c8]/30 flex items-start justify-center p-1">
          <motion.div
            className="w-1.5 h-3 rounded-full bg-[#6c63ff]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
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
      <Suspense fallback={null}>
        <SectionScene color1="#6c63ff" color2="#8b83ff" />
      </Suspense>
      
      {/* Animated morphing shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#6c63ff]/[0.03] blur-3xl"
          style={{ animation: 'morph 12s ease-in-out infinite' }} />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-[#d4a853]/[0.03] blur-3xl"
          style={{ animation: 'morph 15s ease-in-out infinite reverse' }} />
      </div>
      
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
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#6c63ff] border border-[#6c63ff]/20 bg-[#6c63ff]/5">
              Identificação
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Este material pode ser <span className="text-gradient-accent">para você</span> se...
          </h2>
          <p className="text-[#b8b8c8] text-lg max-w-[600px] mx-auto">
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
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c63ff]/20 to-[#6c63ff]/5 flex items-center justify-center group-hover:from-[#6c63ff]/30 group-hover:to-[#6c63ff]/10 transition-all duration-300">
                <svg className="w-4 h-4 text-[#6c63ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    { icon: "📊", title: "Organização financeira", desc: "Compreender suas receitas e despesas de forma clara" },
    { icon: "💡", title: "Primeiros passos nos investimentos", desc: "Conceitos básicos apresentados de forma acessível" },
    { icon: "🏦", title: "Renda fixa", desc: "Entender CDB e Tesouro Direto como possibilidades" },
    { icon: "🏢", title: "Fundos imobiliários", desc: "Conhecer o conceito de FIIs e como funcionam" },
    { icon: "📅", title: "Planejamento de longo prazo", desc: "Pensar no futuro financeiro com mais clareza" },
    { icon: "🎯", title: "Começar com valores pequenos", desc: "Entender que é possível iniciar com pouco" },
  ];

  return (
    <AnimatedSection id="conteudo" bgVariant="gold">
      <Suspense fallback={null}>
        <SectionScene color1="#d4a853" color2="#6c63ff" />
      </Suspense>
      
      {/* Animated background lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#d4a853]/10 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: '-10%',
              right: '-10%',
              transform: `rotate(${-5 + i * 2}deg)`,
              animation: `shimmer ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
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
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#d4a853] border border-[#d4a853]/20 bg-[#d4a853]/5">
              Conteúdo
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            O que você vai <span className="text-gradient-gold">aprender</span>
          </h2>
          <p className="text-[#b8b8c8] text-lg max-w-[600px] mx-auto">
            Um caminho prático para educadores que querem compreender finanças pessoais e investimentos de forma gradual.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, i) => (
            <Card3D key={i} delay={i}>
              <div className="p-6 h-full glass-surface rounded-2xl hover:bg-white/[0.04] transition-all duration-300 group relative overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/0 to-[#6c63ff]/0 group-hover:from-[#d4a853]/5 group-hover:to-[#6c63ff]/5 transition-all duration-500 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/10 to-[#6c63ff]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{topic.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#f8f8fc] mb-2">{topic.title}</h3>
                  <p className="text-[#b8b8c8] text-sm leading-relaxed">{topic.desc}</p>
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
// INCLUDED MATERIALS SECTION
// ═══════════════════════════════════════════

function IncludedSection() {
  const iconMap: Record<string, string> = {
    book: "📘",
    spreadsheet: "📊",
    calculator: "🧮",
    video: "🎬",
  };

  return (
    <AnimatedSection id="materiais" bgVariant="dark">
      <Suspense fallback={null}>
        <SectionScene color1="#6c63ff" color2="#d4a853" />
      </Suspense>
      
      {/* Animated background dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#6c63ff]/10"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `glow-pulse ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
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
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#6c63ff] border border-[#6c63ff]/20 bg-[#6c63ff]/5">
              Materiais
            </span>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            O que está <span className="text-gradient-accent">incluído</span>
          </h2>
          <p className="text-[#b8b8c8] text-lg max-w-[600px] mx-auto">
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
                
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#6c63ff]/20 to-[#d4a853]/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {iconMap[material.icon] || '📄'}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-[#f8f8fc] mb-1 group-hover:text-gradient-gold transition-all duration-300">{material.title}</h3>
                  <p className="text-[#b8b8c8] text-sm leading-relaxed">{material.description}</p>
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
      <Suspense fallback={null}>
        <SectionScene color1="#d4a853" color2="#6c63ff" />
      </Suspense>
      
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#d4a853]/[0.03] rounded-full blur-3xl"
          style={{ animation: 'morph 10s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#6c63ff]/[0.03] rounded-full blur-3xl"
          style={{ animation: 'morph 12s ease-in-out infinite reverse' }} />
      </div>
      
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
              <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#d4a853] border border-[#d4a853]/20 bg-[#d4a853]/5">
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/[0.02] to-[#6c63ff]/[0.02]" />
              
              <motion.div
                className="flex-shrink-0 relative z-10"
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Animated ring */}
                  <div className="absolute -inset-3 rounded-2xl border border-[#d4a853]/20"
                    style={{ animation: 'rotate-slow 20s linear infinite' }} />
                  
                  <img
                    src={PRODUCT.author.photo}
                    alt={`Foto de ${PRODUCT.author.name}`}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-[#d4a853]/20 relative z-10"
                  />
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#6c63ff]/20 to-[#d4a853]/20 blur-md -z-10"
                    style={{ animation: 'glow-pulse 4s ease-in-out infinite' }} />
                </div>
              </motion.div>
              
              <motion.div
                className="text-center md:text-left relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-[#f8f8fc] mb-2">{PRODUCT.author.name}</h3>
                <p className="text-[#d4a853] font-medium mb-4">{PRODUCT.author.role}</p>
                <p className="text-[#b8b8c8] leading-relaxed">
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
      <Suspense fallback={null}>
        <SectionScene color1="#d4a853" color2="#6c63ff" />
      </Suspense>
      
      {/* Animated rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full border border-[#d4a853]/[0.05]"
          style={{ animation: 'rotate-slow 30s linear infinite' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[#6c63ff]/[0.05]"
          style={{ animation: 'rotate-slow 20s linear infinite reverse' }} />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-[#d4a853]/[0.08]"
          style={{ animation: 'rotate-slow 15s linear infinite' }} />
      </div>
      
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
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#d4a853] border border-[#d4a853]/20 bg-[#d4a853]/5">
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
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c63ff] via-[#d4a853] to-[#6c63ff]"
              style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
            
            {/* Corner decorations */}
            <div className="absolute top-4 right-4 w-16 h-16 border border-[#d4a853]/10 rounded-full" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border border-[#6c63ff]/10 rounded-lg rotate-45" />
            
            <h3 className="text-xl font-bold text-[#f8f8fc] mb-2">{PRODUCT.name}</h3>
            <p className="text-[#7a7a8e] text-sm mb-8">Tudo que você recebe ao adquirir o material</p>
            
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
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4ade80]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#e8e8f0] text-sm">{item.title}</span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* Price */}
            <div className="mb-8">
              <p className="text-[#7a7a8e] text-sm mb-2">Investimento</p>
              <motion.div
                className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {PRODUCT.price.amount}
              </motion.div>
              <p className="text-[#b8b8c8] text-sm">
                ou {PRODUCT.price.installments}
              </p>
              <p className="text-[#7a7a8e] text-xs mt-2">{PRODUCT.price.note}</p>
            </div>

            {/* CTA */}
            <AnimatedButton href={PRODUCT.checkoutUrl} variant="primary" className="w-full">
              Acessar a oferta
            </AnimatedButton>

            {/* Trust note */}
            <p className="mt-6 text-xs text-[#7a7a8e] leading-relaxed">
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
      <Suspense fallback={null}>
        <SectionScene color1="#6c63ff" color2="#8b83ff" />
      </Suspense>
      
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-[#6c63ff]/[0.02] rounded-full blur-3xl"
          style={{ animation: 'morph 10s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-[#d4a853]/[0.02] rounded-full blur-3xl"
          style={{ animation: 'morph 12s ease-in-out infinite reverse' }} />
      </div>
      
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
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#6c63ff] border border-[#6c63ff]/20 bg-[#6c63ff]/5">
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
                openIndex === i ? 'ring-1 ring-[#6c63ff]/20' : ''
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
                <span className="text-[#f8f8fc] font-medium pr-4 group-hover:text-[#e8e8f0] transition-colors">{item.question}</span>
                <motion.div
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center"
                  animate={{ rotate: openIndex === i ? 180 : 0, scale: openIndex === i ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-4 h-4 text-[#6c63ff]"
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
                    <div className="px-5 pb-5 text-[#b8b8c8] text-sm leading-relaxed border-t border-white/5 pt-4">
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
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(108,99,255,0.15) 0%, transparent 60%)',
            animation: 'gradient-shift 6s ease infinite',
            backgroundSize: '200% 200%',
          }}
        />
        {/* Second gradient */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(ellipse at 30% 70%, rgba(212,168,83,0.2) 0%, transparent 50%)',
            animation: 'gradient-shift 10s ease infinite reverse',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
          <div className="absolute inset-0 border border-[#6c63ff]/[0.06] rounded-full"
            style={{ animation: 'rotate-slow 25s linear infinite' }} />
          <div className="absolute inset-8 border border-[#d4a853]/[0.06] rounded-full"
            style={{ animation: 'rotate-slow 20s linear infinite reverse' }} />
          <div className="absolute inset-16 border border-[#6c63ff]/[0.08] rounded-full"
            style={{ animation: 'rotate-slow 15s linear infinite' }} />
        </div>
      </div>

      {/* Floating particles CSS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'rgba(108,99,255,0.5)' : 'rgba(212,168,83,0.5)',
              animation: `particle-float ${8 + Math.random() * 12}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

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
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#d4a853] border border-[#d4a853]/20 bg-[#d4a853]/5">
              Próximo passo
            </span>
          </motion.div>
          
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Dê o <span className="text-gradient-gold">primeiro passo</span>
          </h2>
          <p className="text-[#b8b8c8] text-lg mb-10 max-w-[500px] mx-auto leading-relaxed">
            Educação financeira é um caminho. Este material pode ser o início — prático, acessível e pensado para quem está começando.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatedButton href={PRODUCT.checkoutUrl} variant="primary">
              Conhecer o material
            </AnimatedButton>
          </motion.div>
          
          <p className="mt-8 text-xs text-[#7a7a8e]">
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#6c63ff]/[0.02] rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={PRODUCT.logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-[#7a7a8e]">{PRODUCT.name}</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-[#7a7a8e] leading-relaxed max-w-[400px]">
              Conteúdo de caráter educativo. Não constitui aconselhamento financeiro personalizado. 
              Resultados individuais podem variar. Consulte um profissional para orientações específicas.
            </p>
          </div>
        </div>
        
        {/* Bottom divider with gradient */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#7a7a8e]">
              © {new Date().getFullYear()} {PRODUCT.author.name}. Todos os direitos reservados.
            </p>
            <p className="text-xs text-[#7a7a8e]">
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3 glass-surface shadow-lg shadow-black/20' : 'py-5 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Animated border bottom when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6c63ff]/20 to-transparent" />
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
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#d4a853]/30 to-[#6c63ff]/30 blur-sm -z-10" />
            )}
          </div>
          <span className="text-sm font-medium text-[#f8f8fc] hidden sm:block">
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
    <div className="min-h-screen bg-[#0a0a0f] text-[#f8f8fc] overflow-x-hidden">
      {/* Cinematic overlays */}
      <div className="cinematic-vignette" />
      <div className="film-grain" />
      
      <CursorGlow />
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
