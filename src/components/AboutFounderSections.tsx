import { Clapperboard, Scissors, Smartphone, Users } from 'lucide-react';
import { Eyebrow, LineReveal, LuxCard, Reveal } from './MotionPrimitives';

const ABOUT_CARDS = [
  {
    icon: Users,
    title: 'Creators & clippers, connected',
    body: 'UNIQ CLIPS is a clipping agency that brings creators together with talented clippers who know what makes a moment worth watching.',
  },
  {
    icon: Scissors,
    title: 'Long-form, distilled',
    body: 'Streams, podcasts and long videos hold dozens of great moments. We help turn them into engaging short-form clips.',
  },
  {
    icon: Smartphone,
    title: 'Made for vertical',
    body: 'Every clip is shaped for the feeds where short-form lives — TikTok, YouTube Shorts and Instagram Reels.',
  },
] as const;

function FilmToVerticalGraphic() {
  return (
    <div aria-hidden="true" className="mt-12 flex max-w-full items-center gap-3 sm:gap-5">
      <div className="relative h-14 w-28 shrink-0 overflow-hidden rounded-xl border border-gold/30 bg-charcoal sm:h-16 sm:w-40">
        <div className="absolute inset-y-0 left-0 flex w-[200%] gap-1 p-1.5 motion-safe:animate-[uc-film_14s_linear_infinite]">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="h-full flex-1 rounded-sm bg-gradient-to-b from-gold/25 to-gold/5"
            />
          ))}
        </div>
        <Clapperboard className="absolute right-2 top-2 size-3.5 text-gold" />
      </div>

      <div className="gold-rule w-8 shrink-0 sm:w-14" />

      <div className="flex shrink-0 gap-1.5 sm:gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="relative h-16 w-9 rounded-lg border border-gold/50 bg-gradient-to-b from-[#1d1a14] to-ink shadow-[0_10px_30px_-12px_rgb(201_164_92/0.6)] motion-safe:animate-[uc-float_5s_ease-in-out_infinite] sm:h-20 sm:w-11"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <span className="absolute inset-x-2 bottom-2 h-0.5 rounded bg-gold/70" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 outline-none sm:py-36">
      <div className="mx-auto grid max-w-content gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>About UNIQ CLIPS</Eyebrow>
          </Reveal>
          <LineReveal
            id="about-title"
            className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] text-champagne"
            lines={[
              'Where creators',
              <span key="a" className="text-gold-gradient">
                meet clippers.
              </span>,
            ]}
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-reading text-lg leading-relaxed text-champagne/70">
              UNIQ CLIPS is a clipping agency connecting creators with talented clippers. We help
              creators turn long-form content into engaging short-form videos — and give clippers a
              community where their editing skills meet real opportunities.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <FilmToVerticalGraphic />
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 lg:pt-24">
          {ABOUT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Reveal
                key={card.title}
                delay={idx * 0.12}
                className={idx === 1 ? 'lg:-ml-14' : idx === 2 ? 'lg:ml-10' : ''}
              >
                <LuxCard className="p-8 sm:p-10">
                  <div className="flex items-start gap-6">
                    <span className="gold-medallion size-14 shrink-0">
                      <Icon
                        className="size-5 text-champagne transition-transform duration-700"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <p className="text-xs tracking-[0.3em] text-gold/80">
                        {String(idx + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-2 font-display text-xl tracking-[0.04em] text-champagne">
                        {card.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-champagne/65">{card.body}</p>
                    </div>
                  </div>
                </LuxCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CORNER_BRACKETS = [
  '-left-6 -top-6 border-l border-t',
  '-right-6 -top-6 border-r border-t',
  '-left-6 -bottom-6 border-b border-l',
  '-right-6 -bottom-6 border-b border-r',
] as const;

export function FounderSection() {
  return (
    <section
      id="founder"
      aria-labelledby="founder-title"
      className="relative py-28 outline-none sm:py-36"
    >
      <div className="mx-auto grid max-w-content items-center gap-16 px-4 sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-24">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgb(201_164_92/0.28),transparent_65%)] blur-2xl"
          />
          <figure className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2.2rem] border border-gold/25"
            />
            <div
              aria-hidden="true"
              className="absolute -inset-px rounded-[2rem] bg-[linear-gradient(150deg,#f3e6c8,#c9a45c_30%,#6f5527_55%,#c9a45c_80%,#f3e6c8)]"
            />
            <div className="relative overflow-hidden rounded-[1.95rem] bg-ink p-[3px]">
              <img
                src="/img/founder.jpg"
                alt="Portrait of the founder of UNIQ CLIPS"
                width={720}
                height={900}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-[1.8rem] object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[3px] rounded-[1.8rem] bg-gradient-to-t from-ink/85 via-transparent to-gold/10"
              />
              <figcaption className="absolute inset-x-6 bottom-6 flex items-center justify-between">
                <span className="font-display text-sm tracking-[0.28em] text-champagne">
                  UNIQ CLIPS
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
                  Founder
                </span>
              </figcaption>
            </div>
            {CORNER_BRACKETS.map((cls) => (
              <span key={cls} aria-hidden="true" className={`absolute size-6 border-gold/70 ${cls}`} />
            ))}
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>The Founder</Eyebrow>
          </Reveal>
          <LineReveal
            id="founder-title"
            className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] text-champagne"
            lines={[
              'The',
              <span key="f" className="text-gold-gradient">
                Founder
              </span>,
            ]}
          />
          <Reveal delay={0.15}>
            <p className="mt-8 font-display text-sm tracking-[0.34em] text-gold">
              FOUNDER OF UNIQ CLIPS
            </p>
            <div className="gold-rule mt-6 w-40" />
            <p className="mt-8 max-w-reading font-serif text-2xl italic leading-snug text-champagne/85 sm:text-[1.7rem]">
              “Your content. Our strategy. Your growth.”
            </p>
            <p className="mt-6 max-w-reading leading-relaxed text-champagne/65">
              Meet the founder of UNIQ CLIPS — the clipping agency and community bringing creators
              and clippers together around short-form content.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
