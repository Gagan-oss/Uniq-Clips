import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { FOOTER_NAV, MAILTO_ENQUIRY, SITE } from '../config/site';
import { ENQUIRY_TYPES } from '../utils/validation';
import { FormField } from './MeetingsSection';
import { BrandMark, Eyebrow, LineReveal, LuxCard, Reveal, cn, useScrollTo } from './MotionPrimitives';

const INLINE_LINK =
  'text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold';

interface FaqItem {
  q: string;
  a: ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What is UNIQ CLIPS?',
    a: 'UNIQ CLIPS is a clipping agency that connects creators and clippers through short-form content opportunities.',
  },
  {
    q: 'How can I join as a clipper?',
    a: (
      <>
        Join our official{' '}
        <a
          className={INLINE_LINK}
          href={SITE.whopUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Whop community
        </a>{' '}
        using the Join as a Clipper button.
      </>
    ),
  },
  {
    q: 'Is joining the community a guarantee of earnings?',
    a: 'No. Earnings depend on campaign availability, eligibility, approved submissions and campaign-specific terms.',
  },
  {
    q: 'How do creators work with UNIQ CLIPS?',
    a: 'Creators can contact us through email or WhatsApp to discuss potential partnerships.',
  },
  {
    q: 'Where can I find clipping campaigns?',
    a: 'Campaign announcements and available opportunities will be shared through our official community.',
  },
  {
    q: 'How can I contact UNIQ CLIPS?',
    a: (
      <>
        Email us at{' '}
        <a className={INLINE_LINK} href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>{' '}
        or contact us through{' '}
        <a
          className={INLINE_LINK}
          href={SITE.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        .
      </>
    ),
  },
  {
    q: 'Do I need editing experience?',
    a: 'Editing skills are useful. Specific requirements depend on the campaign.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-28 outline-none sm:py-36">
      <div className="mx-auto grid max-w-content gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
          </Reveal>
          <LineReveal
            id="faq-title"
            className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] text-champagne"
            lines={[
              'Questions,',
              <span key="f" className="text-gold-gradient">
                answered.
              </span>,
            ]}
          />
        </div>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              const triggerId = `faq-trigger-${idx}`;
              const panelId = `faq-panel-${idx}`;
              return (
                <div
                  key={item.q}
                  data-state={isOpen ? 'open' : 'closed'}
                  className={cn(
                    'lux-card overflow-hidden rounded-2xl transition-colors',
                    isOpen && 'border-gold/40',
                  )}
                >
                  <h3>
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex((cur) => (cur === idx ? null : idx))}
                      className="group flex w-full items-center gap-5 px-6 py-5 text-left outline-none focus-visible:bg-gold/5 sm:px-8"
                    >
                      <span className="font-display text-xs text-gold/70">Q{idx + 1}</span>
                      <span className="flex-1 font-display text-base tracking-[0.03em] text-champagne sm:text-lg">
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-full border border-gold/25 text-gold transition-transform duration-300',
                          isOpen && 'rotate-180 bg-gold/10',
                        )}
                      >
                        <ChevronDown className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                    className="px-6 pb-6 pt-1 sm:px-8 sm:pl-[4.25rem]"
                  >
                    <p className="leading-relaxed text-champagne/70">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'pending') return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    setStatus('pending');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          enquiryType: fd.get('enquiryType'),
          message: fd.get('message'),
        }),
        signal: AbortSignal.timeout(15000),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setErrorMessage(json.error || 'Submission failed.');
        setStatus('error');
        return;
      }
      form.reset();
      setStatus('success');
    } catch {
      setErrorMessage(null);
      setStatus('error');
    }
  }

  return (
    <form
      id="enquiry-form"
      name="enquiry"
      method="POST"
      onSubmit={handleSubmit}
      onChange={() => {
        if (status === 'success' || status === 'error') {
          setStatus('idle');
          setErrorMessage(null);
        }
      }}
      className="flex flex-col gap-5"
    >
      <fieldset disabled={status === 'pending'} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Enquiry details</legend>

        <FormField id="enq-name" label="Full Name">
          <input
            id="enq-name"
            name="name"
            className="lux-field"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Your full name"
          />
        </FormField>

        <FormField id="enq-email" label="Email Address">
          <input
            id="enq-email"
            name="email"
            type="email"
            className="lux-field"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField id="enq-type" label="Enquiry Type">
            <select
              id="enq-type"
              name="enquiryType"
              className="lux-field"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select an enquiry type
              </option>
              {ENQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField id="enq-message" label="Message">
            <textarea
              id="enq-message"
              name="message"
              className="lux-field min-h-36 resize-y"
              required
              maxLength={3000}
              placeholder="Tell us about your content, campaign or question."
            />
          </FormField>
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'pending'}
          className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] disabled:opacity-70"
        >
          {status === 'pending' ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Submit Enquiry <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-xs text-champagne/45">
          Your enquiry goes directly to the UNIQ CLIPS inbox.
        </p>
      </div>

      <div aria-live="polite">
        {status === 'success' && (
          <p
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-champagne"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
            Thank you — your enquiry was received. We&apos;ll reply by email or WhatsApp.
          </p>
        )}
        {status === 'error' && (
          <p
            role="alert"
            className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-champagne"
          >
            {errorMessage ? `${errorMessage} ` : null}
            Your enquiry could not be sent right now, and nothing was submitted. Your details are
            still in the form — please try again, or email{' '}
            <a className="text-gold underline underline-offset-4" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>{' '}
            directly.
          </p>
        )}
      </div>
    </form>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative py-28 outline-none sm:py-36"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
          </Reveal>
          <LineReveal
            id="contact-title"
            className="mt-6 font-display text-[clamp(2rem,5vw,4rem)] leading-[1.04] text-champagne"
            lines={[
              "Let's build something",
              <span key="g" className="text-gold-gradient">
                great together.
              </span>,
            ]}
          />
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <LuxCard className="p-8">
                <div className="flex items-center gap-4">
                  <span className="gold-medallion size-12">
                    <Mail
                      className="size-[18px] text-champagne transition-transform duration-700"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">Email</p>
                </div>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-6 block break-all font-display text-xl text-champagne transition-colors hover:text-gold sm:text-2xl"
                >
                  {SITE.email}
                </a>
                <a
                  href={MAILTO_ENQUIRY}
                  className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Send an Enquiry <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </LuxCard>
            </Reveal>

            <Reveal delay={0.1}>
              <LuxCard className="p-8">
                <div className="flex items-center gap-4">
                  <span className="gold-medallion size-12">
                    <MessageCircle
                      className="size-[18px] text-champagne transition-transform duration-700"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">WhatsApp</p>
                </div>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block font-display text-xl text-champagne transition-colors hover:text-gold sm:text-2xl"
                >
                  {SITE.whatsappDisplay}
                </a>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-gold mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Chat on WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </LuxCard>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="lux-card rounded-[2rem] p-6 sm:p-10">
              <h3 className="font-display text-2xl text-champagne">Send us an enquiry</h3>
              <p className="mb-8 mt-2 text-sm text-champagne/55">
                Creators, brands and businesses — tell us what you have in mind.
              </p>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const scrollTo = useScrollTo();

  return (
    <footer className="relative border-t border-gold/15 bg-ink/90 pb-10 pt-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <BrandMark className="size-14 ring-1 ring-gold/30" />
              <p className="font-display text-2xl tracking-[0.2em] text-champagne">
                UNIQ <span className="text-gold">CLIPS</span>
              </p>
            </div>
            <p className="mt-6 font-serif text-xl italic text-champagne/75">{SITE.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Explore</p>
            <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2 text-sm text-champagne/70">
              {FOOTER_NAV.map((item, idx) => (
                <li key={item.id} className="flex items-center gap-2">
                  {idx > 0 && (
                    <span aria-hidden="true" className="text-gold/40">
                      |
                    </span>
                  )}
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.id);
                    }}
                    className="transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 text-sm">
            <p className="eyebrow">Get in touch</p>
            <p className="text-champagne/70">
              Email:{' '}
              <a
                href={`mailto:${SITE.email}`}
                className="text-champagne transition-colors hover:text-gold"
              >
                {SITE.email}
              </a>
            </p>
            <p className="text-champagne/70">
              WhatsApp:{' '}
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne transition-colors hover:text-gold"
              >
                {SITE.whatsappDisplay}
              </a>
            </p>
            <p className="text-champagne/70">
              Official Community:{' '}
              <a
                href={SITE.whopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-champagne transition-colors hover:text-gold"
              >
                whop.com/uniq-clips <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </p>
          </div>
        </div>

        <div className="gold-rule mt-16" />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs tracking-[0.2em] text-champagne/40 sm:flex-row">
          <p>© {new Date().getFullYear()} UNIQ CLIPS</p>
          <p>REAL CREATORS · REAL VIEWS · REAL RESULTS</p>
        </div>
      </div>
    </footer>
  );
}
