import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../lib/auth.ts';

test('hashPassword produces a salt:hash string with two hex parts', () => {
  const h = hashPassword('hunter2');
  const parts = h.split(':');
  assert.equal(parts.length, 2, 'expected salt:hash');
  assert.ok(parts[0].length > 0, 'salt non-empty');
  assert.ok(parts[1].length > 0, 'hash non-empty');
});

test('verifyPassword returns true for the correct password', () => {
  const h = hashPassword('correct horse battery staple');
  assert.equal(verifyPassword('correct horse battery staple', h), true);
});

test('verifyPassword returns false for a wrong password', () => {
  const h = hashPassword('right-answer');
  assert.equal(verifyPassword('wrong-answer', h), false);
});

test('verifyPassword returns false for a malformed stored value', () => {
  assert.equal(verifyPassword('anything', 'not-a-valid-hash'), false);
  assert.equal(verifyPassword('anything', 'onlyonepart'), false);
});

test('hashPassword is salted — same password hashes differently each call', () => {
  const a = hashPassword('same-password');
  const b = hashPassword('same-password');
  assert.notEqual(a, b, 'salts must differ');
  // but both verify the same plaintext
  assert.equal(verifyPassword('same-password', a), true);
  assert.equal(verifyPassword('same-password', b), true);
});
