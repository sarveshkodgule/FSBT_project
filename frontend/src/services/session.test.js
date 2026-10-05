import test from 'node:test';
import assert from 'node:assert/strict';
import { readSavedUser } from './session.js';

test('saved sessions recover from invalid or inaccessible storage', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    for (const value of [null, '{broken', '[]', '42', '{"name":"Player"}']) {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true, value: { getItem: () => value },
      });
      assert.equal(readSavedUser(), null);
    }
    const user = { name: 'Player', token: 'test-token' };
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true, value: { getItem: () => JSON.stringify(user) },
    });
    assert.deepEqual(readSavedUser(), user);
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true, get() { throw new Error('Storage unavailable'); },
    });
    assert.equal(readSavedUser(), null);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});
