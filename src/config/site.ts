export const SITE = {
  name: 'UNIQ CLIPS',
  tagline: 'Your Content. Our Strategy. Your Growth.',
  email: 'gagantyson2@gmail.com',
  whatsappDisplay: '+91 6360912171',
  whatsappUrl: 'https://wa.me/916360912171',
  whopUrl: 'https://whop.com/uniq-clips',
} as const;

export const MAILTO_PARTNERSHIP = `mailto:${SITE.email}?subject=Partnership%20enquiry%20%E2%80%94%20UNIQ%20CLIPS&body=Hi%20UNIQ%20CLIPS%2C%0A%0AI%20would%20like%20to%20discuss%20a%20partnership.%0A%0AName%3A%0AChannel%20%2F%20brand%3A%0APlatforms%3A%0AWhat%20I%20have%20in%20mind%3A%0A%0AThanks!`;

export const MAILTO_ENQUIRY = `mailto:${SITE.email}?subject=Enquiry%20%E2%80%94%20UNIQ%20CLIPS`;

export const WHATSAPP_PARTNERSHIP = `${SITE.whatsappUrl}?text=Hi%20UNIQ%20CLIPS%2C%20I%20would%20like%20to%20discuss%20a%20partnership.`;

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'creators', label: 'For Creators' },
  { id: 'clippers', label: 'For Clippers' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;

export const FOOTER_NAV = [
  { id: 'home', label: 'Home' },
  { id: 'creators', label: 'Creators' },
  { id: 'clippers', label: 'Clippers' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;
