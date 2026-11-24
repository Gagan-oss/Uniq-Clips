import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Clapperboard,
  Compass,
  Eye,
  LayoutGrid,
  Megaphone,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SITE } from '../config/site';
import { Eyebrow, LineReveal, Reveal, usePrefersReducedMotion } from './MotionPrimitives';

const DASHBOARD_METRICS = [
  { icon: Wallet, label: 'Total Earnings' },
  { icon: CheckCircle2, label: 'Approved Clips' },
  { icon: Eye, label: 'Verified Views' },
  { icon: Megaphone, label: 'Available Campaigns' },
] as const;

export function DashboardPreviewSection() {
  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-title"
      className="relative py-24 outline-none sm:py-32"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow>Clipper Dashboard · Preview</Eyebrow>
            </Reveal>
            <LineReveal
              id="dashboard-title"
              className="mt-6 font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.05] text-champagne"
              lines={[
                'Your performance,',
                <span key="d" className="text-gold-gradient">
                  in one place.
                </span>,
              ]}
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-champagne/60">
              A look at the clipper workspace. Figures appear only once an account is connected to
              a real data source.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14" y={60}>
          <div className="lux-card overflow-hidden rounded-[2rem] [transform:perspective(1600px)_rotateX(4deg)] transition-transform duration-700 hover:[transform:perspective(1600px)_rotateX(0deg)] motion-reduce:transform-none">
            <div className="flex items-center justify-between border-b border-gold/12 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((dot) => (
                  <span key={dot} aria-hidden="true" className="size-2.5 rounded-full bg-gold/30" />
                ))}
                <span className="ml-4 hidden text-xs tracking-[0.25em] text-champagne/50 sm:inline">
                  UNIQ CLIPS · DASHBOARD
                </span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-champagne/60">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-champagne/40" />
                Not connected
              </span>
            </div>

            <div className="grid md:grid-cols-[13rem_1fr]">
              <aside
                aria-hidden="true"
                className="hidden flex-col gap-1 border-r border-gold/10 p-5 md:flex"
              >
                {['Overview', 'Campaigns', 'Submissions', 'Payouts'].map((tab, idx) => (
                  <span
                    key={tab}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                      idx === 0 ? 'bg-gold/10 text-champagne' : 'text-champagne/45'
                    }`}
                  >
                    <LayoutGrid className="size-4 text-gold/70" />
                    {tab}
                  </span>
                ))}
              </aside>

              <div className="p-5 sm:p-8">
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {DASHBOARD_METRICS.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <li key={metric.label} className="lux-card rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.2em] text-champagne/55">
                            {metric.label}
                          </p>
                          <Icon className="size-4 text-gold/70" aria-hidden="true" />
                        </div>
                        <div
                          aria-hidden="true"
                          className="mt-5 h-7 w-24 rounded-lg bg-gradient-to-r from-gold/20 via-gold/5 to-transparent"
                        />
                        <p className="mt-4 text-xs text-champagne/45">
                          Connect your account to view your performance.
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/25 bg-ink/50 px-6 py-12 text-center">
                  <span className="gold-medallion size-12">
                    <Sparkles className="size-5 text-champagne" aria-hidden="true" />
                  </span>
                  <p className="mt-5 font-display text-lg text-champagne">No performance data yet</p>
                  <p className="mt-2 max-w-md text-sm text-champagne/55">
                    Campaign activity and verified results will show here once your account is
                    connected.
                  </p>
                  <a
                    href={SITE.whopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-gold mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
                  >
                    Access via the community <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const PROCESS_STEPS = [
  {
    icon: Users,
    title: 'Join the Community',
    body: 'Join the official UNIQ CLIPS community on Whop to get started.',
  },
  {
    icon: Compass,
    title: 'Discover Campaigns',
    body: 'Browse the clipping campaigns that are currently open.',
  },
  {
    icon: Clapperboard,
    title: 'Create and Submit Clips',
    body: 'Cut short-form clips to the brief and submit eligible ones.',
  },
  {
    icon: Award,
    title: 'Earn According to Campaign Terms',
    body: 'Rewards follow each campaign’s terms and verified performance.',
  },
] as const;

export function HowItWorksSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="relative py-28 outline-none sm:py-36"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="text-center">
          <Reveal>
            <Eyebrow className="justify-center">How It Works</Eyebrow>
          </Reveal>
          <LineReveal
            id="how-title"
            className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,4.6vw,3.7rem)] leading-[1.05] text-champagne"
            lineClassName="text-center"
            lines={[
              'Four steps from',
              <span key="h" className="text-gold-gradient">
                footage to feed.
              </span>,
            ]}
          />
        </div>

        <div className="relative mt-20">
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-11 hidden h-px bg-gold/15 lg:block"
          >
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-gold via-champagne to-gold"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <Reveal delay={idx * 0.18} className="h-full">
                    <div className="group flex h-full flex-col items-center text-center [perspective:800px]">
                      <span className="gold-medallion size-[5.5rem]">
                        <Icon
                          className="size-7 text-champagne transition-transform duration-700"
                          aria-hidden="true"
                        />
                      </span>
                      <div className="lux-card mt-8 flex w-full flex-1 flex-col rounded-3xl p-7 transition-transform duration-500 group-hover:-translate-y-2">
                        <span className="font-display text-sm tracking-[0.3em] text-gold">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <h3 className="mt-3 font-display text-lg uppercase leading-snug tracking-[0.06em] text-champagne">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-champagne/60">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

const FLOATING_FRAME_CLASSES = [
  'left-[6%] top-[18%] -rotate-12',
  'left-[16%] bottom-[12%] rotate-6',
  'right-[8%] top-[14%] rotate-12',
  'right-[18%] bottom-[16%] -rotate-6',
] as const;

export function CampaignsSection() {
  return (
    <section
      id="campaigns"
      aria-labelledby="campaigns-title"
      className="relative py-28 outline-none sm:py-36"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal>
          <Eyebrow>Campaigns</Eyebrow>
        </Reveal>
        <LineReveal
          id="campaigns-title"
          className="mt-6 font-display text-[clamp(2rem,4.6vw,3.7rem)] leading-[1.05] text-champagne"
          lines={[
            'Clipping',
            <span key="c" className="text-gold-gradient">
              campaigns.
            </span>,
          ]}
        />

        <Reveal className="mt-14" y={50}>
          <div className="lux-card relative overflow-hidden rounded-[2rem] px-6 py-20 text-center sm:px-12 sm:py-28">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {FLOATING_FRAME_CLASSES.map((cls, idx) => (
                <span
                  key={cls}
                  className={`absolute hidden h-28 w-16 rounded-xl border border-gold/25 bg-gradient-to-b from-gold/10 to-transparent motion-safe:animate-[uc-float_6s_ease-in-out_infinite] sm:block ${cls}`}
                  style={{ animationDelay: `${idx * 0.8}s` }}
                />
              ))}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgb(201_164_92/0.12),transparent_70%)]" />
            </div>

            <div className="relative">
              <span className="gold-medallion mx-auto size-16">
                <Sparkles className="size-6 text-champagne" aria-hidden="true" />
              </span>
              <p className="mt-8 font-display text-2xl tracking-[0.12em] text-gold sm:text-4xl">
                NEW CAMPAIGNS COMING SOON.
              </p>
              <p className="mx-auto mt-6 max-w-md text-champagne/60">
                Campaign announcements and available opportunities are shared first in our official
                community.
              </p>
              <a
                href={SITE.whopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-10 inline-flex items-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Join the community <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
