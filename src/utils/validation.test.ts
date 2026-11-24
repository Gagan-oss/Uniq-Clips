import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeScrollProgress,
  validateEnquiry,
  validateMeetingRequest,
} from './validation';

test('validateMeetingRequest accepts valid payload and trims whitespace', () => {
  const result = validateMeetingRequest({
    name: '  Alex Rivera  ',
    email: 'alex@creator.io',
    company: 'Rivera Studios',
    preferredDate: '2026-12-01',
    whatsapp: '+1 555 0100',
    purpose: 'Monthly clipping campaign',
  });
  assert.equal(result.ok, true);
  assert.equal(result.data?.name, 'Alex Rivera');
  assert.equal(result.data?.email, 'alex@creator.io');
});

test('validateMeetingRequest rejects invalid email or missing required fields', () => {
  const badEmail = validateMeetingRequest({
    name: 'Alex',
    email: 'not-an-email',
    company: 'Studio',
    preferredDate: '2026-12-01',
    purpose: 'Campaign',
  });
  assert.equal(badEmail.ok, false);

  const missingCompany = validateMeetingRequest({
    name: 'Alex',
    email: 'alex@example.com',
    company: '   ',
    preferredDate: '2026-12-01',
    purpose: 'Campaign',
  });
  assert.equal(missingCompany.ok, false);
});

test('validateEnquiry validates required fields', () => {
  const valid = validateEnquiry({
    name: 'Jordan',
    email: 'jordan@brand.co',
    enquiryType: 'Creator partnership',
    message: 'Looking for short-form distribution.',
  });
  assert.equal(valid.ok, true);

  const missingMsg = validateEnquiry({
    name: 'Jordan',
    email: 'jordan@brand.co',
    enquiryType: 'Creator partnership',
    message: '',
  });
  assert.equal(missingMsg.ok, false);
});

test('computeScrollProgress clamps cleanly between 0 and 1', () => {
  assert.equal(computeScrollProgress(0, 2000, 1000), 0);
  assert.equal(computeScrollProgress(500, 2000, 1000), 0.5);
  assert.equal(computeScrollProgress(1500, 2000, 1000), 1);
  assert.equal(computeScrollProgress(100, 800, 1000), 0);
});
