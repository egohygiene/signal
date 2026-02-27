export interface LogEntry {
  level: string;
  time: number;
  msg: string;
  [key: string]: unknown;
}

export class RollingBuffer {
  private readonly capacity: number;
  private readonly entries: LogEntry[];

  constructor(capacity = 500) {
    this.capacity = capacity;
    this.entries = [];
  }

  push(entry: LogEntry): void {
    if (this.entries.length >= this.capacity) {
      this.entries.shift();
    }
    this.entries.push(entry);
  }

  getAll(): readonly LogEntry[] {
    return this.entries;
  }

  clear(): void {
    this.entries.length = 0;
  }

  get size(): number {
    return this.entries.length;
  }
}
