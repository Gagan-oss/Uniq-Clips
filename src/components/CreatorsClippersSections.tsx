import {
  ArrowUpRight,
  Compass,
  Film,
  Globe,
  Handshake,
  Info,
  Mail,
  MessageCircle,
  Network,
} from 'lucide-react';
import { MAILTO_PARTNERSHIP, SITE, WHATSAPP_PARTNERSHIP } from '../config/site';
import { Eyebrow, LineReveal, LuxCard, Reveal, cn } from './MotionPrimitives';

const CREATOR_BENEFITS = [
  {
    icon: Film,
    title: 'Long-form into short-form',
    body: 'Turn streams, podcasts and long videos into short clips built for vertical feeds.',
  },
  {
    icon: Globe,
    title: 'Reach new audiences',
    body: 'Put your best moments in front of viewers on TikTok, YouTube Shorts and Instagram Reels.',
  },
  {
    icon: Handshake,
    title: 'Dedicated clippers',
    body: 'Work with clippers from our community who focus on your content and style.',
  },
  {
    icon: Compass,
    title: 'Clipping campaigns',
    body: 'Explore campaign-based clipping, shaped around your goals and your terms.',
  },
  {
    icon: Network,
    title: 'Distribution opportunities',
    body: 'Build ongoing content distribution opportunities across short-form platforms.',
  },
] as const;

export function CreatorsSection() {
  return (
    <section
      id="creators"
      aria-labelledby="creators-title"
      className="relative py-28 outline-none sm:py-36"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>For Creators</Eyebrow>
            </Reveal>
            <LineReveal
              id="creators-title"
              className="mt-6 font-display text-[clamp(2.1rem,5vw,4.1rem)] leading-[1.03] text-champagne"
              lines={[
                'Grow your content',
                <span key="c">
                  with <span className="text-gold-gradient">UNIQ CLIPS</span>
                </span>,
              ]}
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-md text-lg leading-relaxed text-champagne/70 lg:justify-self-end">
              You create the long-form. We help it travel further as short-form — with clippers who
              care about getting your moments right.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-6">
          {CREATOR_BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={(idx % 3) * 0.1}
                className={cn(idx < 2 ? 'md:col-span-3' : 'md:col-span-2', idx === 1 && 'md:translate-y-10')}
              >
                <LuxCard className="h-full p-8">
                  <div className="flex items-center justify-between">
                    <span className="gold-medallion size-12">
                      <Icon
                        className="size-[18px] text-champagne transition-transform duration-700"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-display text-3xl text-gold/25">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-lg tracking-[0.05em] text-champagne">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-champagne/62">{item.body}</p>
                </LuxCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-20">
          <div className="lux-card flex flex-col items-start justify-between gap-8 rounded-3xl p-8 sm:p-12 md:flex-row md:items-center">
            <div>
              <p className="font-display text-2xl text-champagne sm:text-3xl">
                Ready to put your content to work?
              </p>
              <p className="mt-3 text-champagne/60">
                Send us an email or message us on WhatsApp to discuss a partnership.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={MAILTO_PARTNERSHIP}
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap"
              >
                <Mail className="size-4" aria-hidden="true" /> Partner With Us
              </a>
              <a
                href={WHATSAPP_PARTNERSHIP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap"
              >
                <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp{' '}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const CLIPPER_STEPS = [
  {
    title: 'Join our community',
    body: 'Become part of the official UNIQ CLIPS community on Whop.',
  },
  {
    title: 'Discover available campaigns',
    body: 'See which clipping campaigns are open and read each brief.',
  },
  {
    title: 'Create short-form content',
    body: 'Edit standout moments into clips made for vertical feeds.',
  },
  {
    title: 'Submit eligible clips',
    body: 'Send in clips that meet the campaign’s requirements.',
  },
  {
    title: 'Earn according to the terms',
    body: 'Rewards follow each campaign’s actual terms and verified performance.',
  },
] as const;

export function ClippersSection() {
  return (
    <section
      id="clippers"
      aria-labelledby="clippers-title"
      className="relative py-28 outline-none sm:py-36"
    >
      <div className="mx-auto grid max-w-content gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>For Clippers</Eyebrow>
          </Reveal>
          <LineReveal
            id="clippers-title"
            className="mt-6 font-display text-[clamp(2rem,4.6vw,3.7rem)] leading-[1.04] text-champagne"
            lines={[
              'Turn your',
              'editing skills',
              <span key="o" className="text-gold-gradient">
                into opportunities.
              </span>,
            ]}
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-champagne/70">
              If you know how to find the moment and cut it clean, there&apos;s a place for you in
              the UNIQ CLIPS community.
            </p>
            <a
              href={SITE.whopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-10 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em]"
            >
              Join as a Clipper <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <p className="mt-6 flex max-w-md items-start gap-2.5 text-sm text-champagne/50">
              <Info className="mt-0.5 size-4 shrink-0 text-gold/80" aria-hidden="true" />
              Joining the community does not guarantee earnings. Rewards depend on campaign
              availability, eligibility, approved submissions and each campaign&apos;s terms.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-[2.6rem] top-8 w-px bg-gradient-to-b from-gold/60 via-gold/25 to-transparent"
          />
          <ol className="relative flex flex-col gap-4">
            {CLIPPER_STEPS.map((step, idx) => (
              <li key={step.title}>
                <Reveal delay={idx * 0.08}>
                  <div className="group relative flex gap-6 rounded-2xl p-4 transition-colors duration-500 hover:bg-gold/[0.04]">
                    <span className="relative z-10 grid size-[3.2rem] shrink-0 place-items-center rounded-full border border-gold/40 bg-ink font-display text-sm text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="pt-2">
                      <h3 className="font-display text-lg tracking-[0.05em] text-champagne">
                        {step.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-champagne/60">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
