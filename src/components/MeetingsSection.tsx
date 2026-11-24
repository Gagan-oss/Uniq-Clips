import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  Clapperboard,
  Info,
  Loader2,
  Mic,
  Monitor,
  PhoneOff,
  Send,
  Users,
  Video,
} from 'lucide-react';
import { SITE } from '../config/site';
import { BrandMark, Eyebrow, LineReveal, Reveal, useScrollTo } from './MotionPrimitives';

const WHO_CAN_BOOK = [
  { icon: Clapperboard, label: 'Content Creators' },
  { icon: Building2, label: 'Brands' },
  { icon: Briefcase, label: 'Businesses' },
  { icon: Users, label: 'Potential Agency Partners' },
] as const;

const BOOKING_STEPS = [
  'Submit an enquiry through the website.',
  'Our team reviews your enquiry.',
  'We contact you through email or WhatsApp.',
  'We arrange a suitable meeting date and time.',
  'Receive your personal Google Meet invitation.',
  'Join the private video conference and discuss the partnership.',
] as const;

export function FormField({
  id,
  label,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.7rem] uppercase tracking-[0.24em] text-champagne/70">
        {label}
        {optional && (
          <span className="ml-2 normal-case tracking-normal text-champagne/40">(optional)</span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-champagne/45">{hint}</p>}
    </div>
  );
}

function MeetingPreviewCard() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl [perspective:1400px]">
      <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgb(201_164_92/0.22),transparent_65%)] blur-2xl" />
      <div className="lux-card relative rounded-[1.75rem] p-3 [transform:rotateY(-10deg)_rotateX(6deg)] transition-transform duration-700 hover:[transform:rotateY(0deg)_rotateX(0deg)] motion-reduce:transform-none">
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-champagne/55">
            <Video className="size-3.5 text-gold" /> Private 1-on-1
          </span>
          <span className="rounded-full border border-gold/25 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-champagne/50">
            Invitation after confirmation
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_35%,#2a2418,#0b0b0b_70%)]">
            <BrandMark className="size-20 ring-1 ring-gold/40" />
            <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.6rem] tracking-[0.2em] text-champagne/80">
              UNIQ CLIPS
            </span>
          </div>

          <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl border border-gold/20 bg-[radial-gradient(circle_at_50%_35%,#1d1a14,#080808_70%)]">
            <span className="grid size-20 place-items-center rounded-full border border-gold/40 font-display text-2xl text-gold">
              You
            </span>
            <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.6rem] tracking-[0.2em] text-champagne/80">
              YOUR BRAND
            </span>
            <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/40 motion-safe:animate-pulse" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-3 py-2">
          {[Mic, Video, Monitor].map((Icon, i) => (
            <span
              key={i}
              className="grid size-10 place-items-center rounded-full border border-gold/25 bg-ink text-champagne/80"
            >
              <Icon className="size-4" />
            </span>
          ))}
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-b from-gold to-[#8a6a2f] text-ink">
            <PhoneOff className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

function MeetingRequestForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string>();

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().slice(0, 10));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'pending') return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    setStatus('pending');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/meeting-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          company: fd.get('company'),
          preferredDate: fd.get('preferredDate'),
          whatsapp: fd.get('whatsapp'),
          purpose: fd.get('purpose'),
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
      id="meeting-form"
      name="meeting-request"
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
        <legend className="sr-only">Meeting request details</legend>

        <FormField id="mtg-name" label="Your Name">
          <input
            id="mtg-name"
            name="name"
            className="lux-field"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Full name"
          />
        </FormField>

        <FormField id="mtg-email" label="Email Address">
          <input
            id="mtg-email"
            name="email"
            type="email"
            className="lux-field"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
        </FormField>

        <FormField id="mtg-company" label="Company / Creator Name">
          <input
            id="mtg-company"
            name="company"
            className="lux-field"
            autoComplete="organization"
            required
            maxLength={120}
            placeholder="Brand, business or channel"
          />
        </FormField>

        <FormField
          id="mtg-date"
          label="Preferred Date"
          hint="A preference only — we confirm the final time with you."
        >
          <input
            id="mtg-date"
            name="preferredDate"
            type="date"
            min={minDate}
            className="lux-field"
            required
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField id="mtg-whatsapp" label="WhatsApp Number" optional>
            <input
              id="mtg-whatsapp"
              name="whatsapp"
              type="tel"
              className="lux-field"
              autoComplete="tel"
              maxLength={30}
              placeholder="Include country code"
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField id="mtg-purpose" label="Meeting Purpose">
            <textarea
              id="mtg-purpose"
              name="purpose"
              className="lux-field min-h-32 resize-y"
              required
              maxLength={3000}
              placeholder="What would you like to discuss? A campaign, partnership or idea."
            />
          </FormField>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={status === 'pending'}
        className="btn-gold inline-flex items-center justify-center gap-2 self-start rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] disabled:opacity-70"
      >
        {status === 'pending' ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending request…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" /> Request a Meeting
          </>
        )}
      </button>

      <p className="flex items-start gap-2 text-xs text-champagne/50">
        <Info className="mt-0.5 size-3.5 shrink-0 text-gold/80" aria-hidden="true" />
        Submitting sends a request, not a booking. A Google Meet invitation is only sent after we
        personally confirm a date and time with you.
      </p>

      <div aria-live="polite">
        {status === 'success' && (
          <div
            role="status"
            className="rounded-2xl border border-gold/30 bg-gold/10 p-5 text-sm text-champagne"
          >
            <p className="font-display tracking-[0.12em] text-gold">REQUEST RECEIVED</p>
            <p className="mt-2 text-champagne/80">
              Thank you. Your meeting is <strong className="text-champagne">not booked yet</strong>{' '}
              — our team will review your request and contact you by email or WhatsApp to agree a
              time. Your private Google Meet invitation follows once the meeting is confirmed.
            </p>
          </div>
        )}
        {status === 'error' && (
          <p
            role="alert"
            className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-champagne"
          >
            {errorMessage ? `${errorMessage} ` : null}
            Your request could not be sent right now, and nothing was submitted. Your details are
            still in the form — please try again, or email{' '}
            <a className="text-gold underline underline-offset-4" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

export function MeetingsSection() {
  const scrollTo = useScrollTo();

  function focusMeetingForm() {
    scrollTo('meeting-request');
    window.setTimeout(() => document.getElementById('mtg-name')?.focus({ preventScroll: true }), 900);
  }

  return (
    <section
      id="meetings"
      aria-labelledby="meetings-title"
      className="relative py-28 outline-none sm:py-36"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>Private 1-on-1 Consultations</Eyebrow>
            </Reveal>
            <LineReveal
              id="meetings-title"
              className="mt-6 font-display text-[clamp(2rem,4.6vw,3.7rem)] leading-[1.04] text-champagne"
              lines={[
                "Let's talk business.",
                <span key="m" className="text-gold-gradient">
                  Face to face.
                </span>,
              ]}
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-champagne/70">
                Have an idea, campaign or partnership in mind? Let&apos;s discuss it personally
                through a private 1-on-1 Google Meet video conference.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={focusMeetingForm}
                  className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap"
                >
                  <Calendar className="size-4" aria-hidden="true" /> Request a Meeting
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('contact')}
                  className="btn-ghost-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap"
                >
                  Contact Us
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={60}>
            <MeetingPreviewCard />
          </Reveal>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-12">
            <Reveal>
              <h3 className="font-display text-sm tracking-[0.32em] text-gold">WHO CAN BOOK?</h3>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {WHO_CAN_BOOK.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="lux-card flex items-center gap-3 rounded-2xl p-4 text-sm text-champagne/85"
                    >
                      <Icon className="size-4 shrink-0 text-gold" aria-hidden="true" />
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="font-display text-sm tracking-[0.32em] text-gold">HOW IT WORKS</h3>
              <ol className="mt-6 flex flex-col">
                {BOOKING_STEPS.map((step, idx) => (
                  <li
                    key={step}
                    className="flex gap-5 border-b border-gold/10 py-4 last:border-b-0"
                  >
                    <span className="font-display text-sm text-gold/80">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-champagne/75">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              id="meeting-request"
              className="lux-card scroll-mt-28 rounded-[2rem] p-6 outline-none sm:p-10"
            >
              <h3 className="font-display text-2xl text-champagne">Request a private meeting</h3>
              <p className="mb-8 mt-2 text-sm text-champagne/55">
                Tell us a little about you. We review every request personally.
              </p>
              <MeetingRequestForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
