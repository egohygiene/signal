import { describe, expect, it } from 'vitest';

import { logger, rollingBuffer } from './logger';
import { type LogEntry, RollingBuffer } from './rollingBuffer';

describe('RollingBuffer', () => {
  it('stores pushed entries', () => {
    const buf = new RollingBuffer(3);
    const entry: LogEntry = { level: 'info', time: Date.now(), msg: 'hello' };
    buf.push(entry);
    expect(buf.size).toBe(1);
    expect(buf.getAll()[0]).toBe(entry);
  });

  it('discards oldest entries when capacity is exceeded', () => {
    const buf = new RollingBuffer(2);
    const a: LogEntry = { level: 'info', time: 1, msg: 'a' };
    const b: LogEntry = { level: 'info', time: 2, msg: 'b' };
    const c: LogEntry = { level: 'info', time: 3, msg: 'c' };
    buf.push(a);
    buf.push(b);
    buf.push(c);
    expect(buf.size).toBe(2);
    expect(buf.getAll()[0]).toBe(b);
    expect(buf.getAll()[1]).toBe(c);
  });

  it('clears all entries', () => {
    const buf = new RollingBuffer(10);
    buf.push({ level: 'info', time: Date.now(), msg: 'x' });
    buf.clear();
    expect(buf.size).toBe(0);
  });

  it('returns empty array when no entries exist', () => {
    const buf = new RollingBuffer(10);
    expect(buf.getAll()).toHaveLength(0);
  });

  it('defaults to capacity of 500', () => {
    const buf = new RollingBuffer();
    for (let index = 0; index < 501; index++) {
      buf.push({ level: 'info', time: index, msg: `msg-${index}` });
    }
    expect(buf.size).toBe(500);
  });
});

describe('logger', () => {
  it('is a pino logger with expected log methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('logging captures entry in rollingBuffer', () => {
    rollingBuffer.clear();
    logger.info('test message');
    expect(rollingBuffer.size).toBeGreaterThan(0);
    const entry = rollingBuffer.getAll().at(-1);
    expect(entry?.level).toBe('info');
    expect(entry?.msg).toContain('test message');
  });

  it('logging with bindings captures structured metadata', () => {
    rollingBuffer.clear();
    const child = logger.child({ requestId: 'abc-123' });
    child.warn('request failed');
    const entry = rollingBuffer.getAll().at(-1);
    expect(entry?.level).toBe('warn');
    expect(entry?.requestId).toBe('abc-123');
  });

  it('does not throw when logging an error', () => {
    expect(() => {
      logger.error(new Error('boom'), 'something went wrong');
    }).not.toThrow();
  });
});

describe('logger level', () => {
  it('has a level property', () => {
    expect(typeof logger.level).toBe('string');
  });

  it('level is info or debug', () => {
    expect(['debug', 'info']).toContain(logger.level);
  });
});
