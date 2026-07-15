import { createHash } from 'node:crypto';

export function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

export function serializeJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
