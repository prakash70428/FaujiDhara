// Unit test (runs in Node, not in the app): npm test
/// <reference types="node" />
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { cleanProfileInput, hasErrors, validateProfile } from './profileRules';

const VALID = {
  role: 'FAUJI' as const,
  fullName: 'Ramesh Singh',
  stateId: 'rajasthan',
  district: 'Jhunjhunu',
};

describe('validateProfile', () => {
  it('passes a complete profile', () => {
    assert.equal(hasErrors(validateProfile(VALID)), false);
  });

  it('accepts names written in Hindi', () => {
    assert.equal(hasErrors(validateProfile({ ...VALID, fullName: 'रमेश सिंह' })), false);
  });

  it('flags every missing field', () => {
    const errors = validateProfile({});
    assert.deepEqual(Object.keys(errors).sort(), ['district', 'fullName', 'role', 'stateId']);
  });

  it('rejects too-short and non-letter names', () => {
    assert.ok(validateProfile({ ...VALID, fullName: ' R ' }).fullName);
    assert.ok(validateProfile({ ...VALID, fullName: 'Ramesh123' }).fullName);
    assert.ok(validateProfile({ ...VALID, fullName: 'x'.repeat(61) }).fullName);
  });
});

describe('cleanProfileInput', () => {
  it('trims and collapses spaces', () => {
    const clean = cleanProfileInput({
      ...VALID,
      fullName: '  Ramesh   Singh ',
      district: ' Jhunjhunu ',
    });
    assert.equal(clean.fullName, 'Ramesh Singh');
    assert.equal(clean.district, 'Jhunjhunu');
  });
});
