// Unit test (runs in Node, not in the app): npm test
/// <reference types="node" />
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatIndianMobile, isValidOtp, toE164IndianMobile } from './phone';

describe('toE164IndianMobile', () => {
  it('accepts the common ways people type a number', () => {
    for (const input of [
      '9876543210',
      '98765 43210',
      '+91 98765 43210',
      '+91-9876543210',
      '919876543210',
      '09876543210',
    ]) {
      assert.equal(toE164IndianMobile(input), '+919876543210', input);
    }
  });

  it('rejects numbers that are not Indian mobiles', () => {
    for (const input of [
      '',
      '12345',
      '5876543210',
      '98765432101',
      '+1 415 555 2671',
      'abcdefghij',
    ]) {
      assert.equal(toE164IndianMobile(input), null, input);
    }
  });
});

describe('formatIndianMobile', () => {
  it('splits into 5 + 5 digits', () => {
    assert.equal(formatIndianMobile('+919876543210'), '+91 98765 43210');
  });
});

describe('isValidOtp', () => {
  it('needs exactly 6 digits', () => {
    assert.equal(isValidOtp('123456'), true);
    assert.equal(isValidOtp('12345'), false);
    assert.equal(isValidOtp('1234567'), false);
    assert.equal(isValidOtp('12a456'), false);
  });
});
