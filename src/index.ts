import type { Context } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";

/** Profile entry id declared by this bundle's cordis.patch.yml. */
export const ENTRY_ID = "ui-brand-studio";

/** Global the browser reads before the client plugin boots. */
export const BRAND_CONFIG_GLOBAL = "__DSH_BRAND_STUDIO_CONFIG__";

/**
 * Deployment-owned branding. Every field is `volatile`, so the native settings
 * editor can write it live from the Branding panel. That panel is only
 * reachable by an administrator — an ordinary user's sidebar hides every
 * settings entry — and `settings.mutate` is administrator-only at the RPC
 * fence, so the write path is guarded without the client judging roles.
 */
export const Config = z.object({
  version: z.const(1).default(1),
  name: z.string().default("").volatile(),
  badge: z.string().default("").volatile(),
  logo: z.string().default("").volatile(),
  wordmark: z.string().default("").volatile(),
  customizeTitle: z.boolean().default(true).volatile(),
  nameMode: z.union(["text", "image"]).default("text").volatile(),
  logoSize: z.number().min(18).max(24).default(24).volatile(),
  logoRadius: z.number().min(0).max(12).default(6).volatile(),
});

export interface BrandConfig {
  version: 1;
  name: string;
  badge: string;
  logo: string;
  wordmark: string;
  customizeTitle: boolean;
  nameMode: "text" | "image";
  logoSize: number;
  logoRadius: number;
}

interface SettingsView {
  ns: string;
  value?: Partial<BrandConfig>;
}

interface SettingsHost {
  settings: {
    configure(presentation: { auto?: boolean }, owner?: unknown): () => void;
    describe(): SettingsView[];
  };
}

/** Only the fields the browser needs; keeps unrelated config out of the page. */
function pick(config: BrandConfig): BrandConfig {
  return {
    version: 1,
    name: config.name,
    badge: config.badge,
    logo: config.logo,
    wordmark: config.wordmark,
    customizeTitle: config.customizeTitle,
    nameMode: config.nameMode,
    logoSize: config.logoSize,
    logoRadius: config.logoRadius,
  };
}

interface IndexRow {
  kind: "global";
  name: string;
  value: unknown;
}

export function apply(ctx: Context, config: BrandConfig): void {
  // The plugin has its own Branding page; suppress the generic generated form.
  ctx.inject(["settings"], (scope) => {
    (scope as unknown as SettingsHost).settings.configure(
      { auto: false },
      (ctx as unknown as { fiber: unknown }).fiber,
    );
  });

  const events = ctx as unknown as {
    on(name: string, listener: (table: IndexRow[]) => void): void;
  };
  events.on("webserver/index-inject", (table) => {
    // Prefer the live value so an administrator's save reaches every browser on
    // the next page load, without waiting for a plugin restart.
    let value = pick(config);
    try {
      const settings = ctx.get("settings") as SettingsHost["settings"] | undefined;
      const view = settings?.describe().find((row) => row.ns === ENTRY_ID);
      if (view?.value) value = pick({ ...value, ...view.value });
    } catch {
      // describe() is best-effort; the composition value is a safe fallback.
    }
    table.push({ kind: "global", name: BRAND_CONFIG_GLOBAL, value });
  });
}
