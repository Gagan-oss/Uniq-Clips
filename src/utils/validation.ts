export interface MeetingRequestPayload {
  name: string;
  email: string;
  company: string;
  preferredDate: string;
  whatsapp?: string;
  purpose: string;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  enquiryType: string;
  message: string;
}

export interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

export function validateMeetingRequest(
  raw: Record<string, unknown>,
): ValidationResult<MeetingRequestPayload> {
  const name = cleanString(raw.name, 100);
  const email = cleanString(raw.email, 254);
  const company = cleanString(raw.company, 120);
  const preferredDate = cleanString(raw.preferredDate, 32);
  const whatsapp = cleanString(raw.whatsapp, 30);
  const purpose = cleanString(raw.purpose, 3000);

  if (!name) return { ok: false, error: 'Name is required.' };
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'A valid email address is required.' };
  }
  if (!company) return { ok: false, error: 'Company or creator name is required.' };
  if (!preferredDate) return { ok: false, error: 'Preferred date is required.' };
  if (!purpose) return { ok: false, error: 'Meeting purpose is required.' };

  return {
    ok: true,
    data: {
      name,
      email,
      company,
      preferredDate,
      whatsapp: whatsapp || undefined,
      purpose,
    },
  };
}

export const ENQUIRY_TYPES = [
  'Creator partnership',
  'Brand or business campaign',
  'Clipper question',
  'Agency partnership',
  'Other',
] as const;

export function validateEnquiry(
  raw: Record<string, unknown>,
): ValidationResult<EnquiryPayload> {
  const name = cleanString(raw.name, 100);
  const email = cleanString(raw.email, 254);
  const enquiryType = cleanString(raw.enquiryType, 80);
  const message = cleanString(raw.message, 3000);

  if (!name) return { ok: false, error: 'Full name is required.' };
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'A valid email address is required.' };
  }
  if (!enquiryType) return { ok: false, error: 'Enquiry type is required.' };
  if (!message) return { ok: false, error: 'Message is required.' };

  return {
    ok: true,
    data: {
      name,
      email,
      enquiryType,
      message,
    },
  };
}

export function computeScrollProgress(scrollY: number, scrollHeight: number, innerHeight: number): number {
  const maxScroll = scrollHeight - innerHeight;
  if (maxScroll <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / maxScroll));
}
