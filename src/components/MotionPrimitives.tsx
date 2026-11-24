import { createContext, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const ScrollContext = createContext<(id: string) => void>(() => {});
const HEADER_OFFSET = -72;

export function ScrollProvider({ children }: { children: ReactNode }) {
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (id === 'home' ? 0 : HEADER_OFFSET);
    window.scrollTo({ top, behavior: 'smooth' });
    try {
      window.history.replaceState(null, '', id === 'home' ? '#' : `#${id}`);
    } catch {
      // Ignore history restrictions in sandboxed iframes
    }
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  return <ScrollContext.Provider value={scrollToSection}>{children}</ScrollContext.Provider>;
}

export function useScrollTo() {
  return useContext(ScrollContext);
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

const EASE_LUX: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Reveal({
  children,
  delay = 0,
  className,
  y = 36,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y, rotateX: 8, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE_LUX }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = 'h2',
  id,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn('block', lineClassName)}
            initial={reduced ? false : { y: '110%', rotateZ: 2 }}
            whileInView={{ y: '0%', rotateZ: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 1.2, delay: delay + i * 0.12, ease: EASE_LUX }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function LuxCard({
  children,
  className,
  maxTilt = 7,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width - 0.5;
    const ry = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${(-ry * maxTilt).toFixed(2)}deg) rotateY(${(rx * maxTilt).toFixed(2)}deg) translateZ(0)`;
    ref.current.style.setProperty('--mx', `${((rx + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${((ry + 0.5) * 100).toFixed(1)}%`);
  }

  function onPointerLeave() {
    if (ref.current) {
      ref.current.style.transform = '';
    }
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        'lux-card group rounded-3xl transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgb(201_164_92/0.14),transparent_60%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3', className)}>
      <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
      {children}
    </p>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/img/uniq-mark.png"
      alt=""
      width={40}
      height={40}
      className={cn('size-10 rounded-full object-cover', className)}
    />
  );
}
