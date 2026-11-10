import type { ObservableSnapshot } from "@deepseek-ai/dsh-client-store";
import {
  type BrandSettings,
  DEFAULT_SETTINGS,
  decodeSettings,
  equalSettings,
  readServerSettings,
} from "./settings.ts";

/** Persists branding where the host owns it (the profile settings document). */
export interface BrandWriter {
  save(settings: BrandSettings): Promise<BrandSettings>;
}

export class BrandStore implements ObservableSnapshot<BrandSettings> {
  private snapshot: BrandSettings;
  private readonly listeners = new Set<() => void>();
  private readonly writer: BrandWriter | null;

  constructor(writer: BrandWriter | null = null, initial: BrandSettings = readServerSettings()) {
    this.writer = writer;
    this.snapshot = decodeSettings(initial) ?? { ...DEFAULT_SETTINGS };
  }

  getSnapshot = (): BrandSettings => this.snapshot;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Persist through the writer and adopt the value the host echoes back. The
   * previous branding stays active when the write fails, so a refused edit
   * never leaves the page in a half-applied state.
   */
  async commit(value: BrandSettings): Promise<BrandSettings> {
    const settings = decodeSettings(value);
    if (!settings) throw new Error("invalid-settings");
    if (!this.writer) throw new Error("save-unavailable");
    const next = decodeSettings(await this.writer.save(settings)) ?? settings;
    this.publish(next);
    return this.snapshot;
  }

  /** Adopt a server view without writing. */
  accept(value: BrandSettings): void {
    const settings = decodeSettings(value);
    if (settings) this.publish(settings);
  }

  private publish(value: BrandSettings): void {
    if (equalSettings(value, this.snapshot)) return;
    this.snapshot = value;
    for (const listener of this.listeners) listener();
  }
}
