import pino, { type Level, type LogEvent } from 'pino';

import { type LogEntry, RollingBuffer } from './rollingBuffer';

const isDevelopment = import.meta.env.DEV;

export const rollingBuffer = new RollingBuffer(500);

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  browser: {
    asObject: true,
    transmit: {
      send(level: Level, logEvent: LogEvent) {
        const messages = logEvent.messages;
        const bindings = logEvent.bindings.reduce<Record<string, unknown>>(
          (acc, b) => ({ ...acc, ...b }),
          {},
        );

        const mergedMsg = messages
          .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m) : String(m)))
          .join(' ');

        const entry: LogEntry = {
          level,
          time: logEvent.ts,
          msg: mergedMsg,
          ...bindings,
        };

        rollingBuffer.push(entry);
      },
    },
  },
});
