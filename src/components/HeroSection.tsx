import { ArrowUpRight, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { MAILTO_PARTNERSHIP, SITE } from '../config/site';
import { LineReveal, usePrefersReducedMotion, useScrollTo } from './MotionPrimitives';

const PLATFORMS = ['TikTok', 'YouTube Shorts', 'Instagram Reels'] as const;

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const scrollTo = useScrollTo();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        };

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-end pb-16 pt-28 outline-none md:items-center md:pb-0"
    >
      <div className="mx-auto w-full max-w-content px-4 sm:px-6">
        <div className="max-w-2xl">
          <motion.p {...fadeUp(0.1)} className="eyebrow mb-7 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            Short-form clipping agency
          </motion.p>

          <LineReveal
            as="h1"
            delay={0.2}
            className="font-display text-[clamp(2.6rem,7.4vw,6.2rem)] font-semibold leading-[0.98] tracking-[0.02em] text-champagne"
            lines={[
              'Your Content.',
              <span key="s" className="text-gold-gradient">
                Our Strategy.
              </span>,
              'Your Growth.',
            ]}
          />

          <motion.p
            {...fadeUp(0.75)}
            className="mt-8 max-w-xl text-base leading-relaxed text-champagne/72 sm:text-lg"
          >
            We turn your best moments into viral short-form clips that drive views and growth
            across TikTok, YouTube Shorts and Instagram Reels.
          </motion.p>

          <motion.div
            {...fadeUp(0.9)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href={SITE.whopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] whitespace-nowrap"
            >
              Join as a Clipper <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href={MAILTO_PARTNERSHIP}
              className="btn-ghost-gold inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] whitespace-nowrap"
            >
              <Mail className="size-4" aria-hidden="true" /> Partner With Us
            </a>
          </motion.div>

          <motion.ul
            {...fadeUp(1.05)}
            aria-label="Platforms"
            className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] uppercase tracking-[0.3em] text-champagne/50"
          >
            {PLATFORMS.map((platform, idx) => (
              <li key={platform} className="flex items-center gap-5">
                {idx > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-gold/70" />}
                {platform}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollTo('about')}
        className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-champagne/50 transition-colors hover:text-gold md:flex"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span aria-hidden="true" className="relative h-16 w-px overflow-hidden bg-gold/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gold motion-safe:animate-[uc-scroll-cue_2.2s_ease-in-out_infinite]" />
        </span>
      </button>
    </section>
  );
}
