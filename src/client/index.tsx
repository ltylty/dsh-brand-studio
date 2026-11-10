import type { Context } from "@deepseek-ai/cordis";
import type {} from "@deepseek-ai/dsh-client-locale/client";
import type {} from "@deepseek-ai/dsh-client-ui-renderer/client";
import type {} from "@deepseek-ai/dsh-client-ui-settings/client";
import type {} from "@deepseek-ai/dsh-client-ui-sidebar/client";
import { BrandMark, BrandName } from "./Brand.tsx";
import { BrandingPanel } from "./BrandingPanel.tsx";
import { en, NS, zh } from "./locales.ts";
import { type BrandSettings, ENTRY_ID, settingsFromRaw } from "./settings.ts";
import { BrandStore } from "./store.ts";
import { installStyles } from "./styles.ts";
import { installTitle } from "./title.ts";

export const inject = ["slots", "locale", "remote", "remote.settings"];

interface SettingsView {
  ns: string;
  value?: Record<string, unknown>;
  revision: number;
}

interface SettingsRemote {
  mutate(
    ns: string,
    ops: Array<{ op: "set"; path: string[]; value: unknown }>,
    expectedRevision?: number,
  ): Promise<SettingsView | undefined>;
}

function settingsToOps(settings: BrandSettings) {
  return [
    { op: "set" as const, path: ["name"], value: settings.name ?? "" },
    { op: "set" as const, path: ["badge"], value: settings.badge ?? "" },
    { op: "set" as const, path: ["logo"], value: settings.logo ?? "" },
    { op: "set" as const, path: ["wordmark"], value: settings.wordmark ?? "" },
    { op: "set" as const, path: ["customizeTitle"], value: settings.customizeTitle },
    { op: "set" as const, path: ["nameMode"], value: settings.nameMode },
    { op: "set" as const, path: ["logoSize"], value: settings.logoSize },
    { op: "set" as const, path: ["logoRadius"], value: settings.logoRadius },
  ];
}

export function apply(ctx: Context): void {
  const remote = (ctx as unknown as { remote: { settings: SettingsRemote } }).remote.settings;
  const store = new BrandStore({
    async save(settings) {
      const view = await remote.mutate(ENTRY_ID, settingsToOps(settings));
      return view?.value ? settingsFromRaw(view.value) : settings;
    },
  });
  const face = () => ({ hooks: { settings: store } });
  ctx.effect(installStyles, "brand-studio: styles");
  ctx.effect(() => ctx.locale.register(NS, { en, zh }), "brand-studio: locale");
  ctx.effect(() => installTitle(store), "brand-studio: title");

  for (const slot of ["sidebar.brand.mark", "conversation.hero.brand.mark"] as const)
    ctx.slots.inject(slot, () => {
      let release: (() => void) | undefined;
      const sync = () => {
        if (store.getSnapshot().logo !== null) {
          if (!release) {
            try {
              release = ctx.slots.register({ name: slot, priority: -10, inject: face }, BrandMark);
            } catch (error) {
              console.warn(
                "[dsh-brand-studio] Cannot replace the logo slot; check for a conflicting branding plugin.",
                error,
              );
            }
          }
        } else {
          release?.();
          release = undefined;
        }
      };
      sync();
      const unsubscribe = store.subscribe(sync);
      return () => {
        unsubscribe();
        release?.();
      };
    });
  ctx.slots.inject("sidebar.brand.name", () => {
    let release: (() => void) | undefined;
    const sync = () => {
      const settings = store.getSnapshot();
      if (
        settings.name !== null ||
        settings.badge !== null ||
        (settings.nameMode === "image" && settings.wordmark !== null)
      ) {
        if (!release) {
          try {
            release = ctx.slots.register(
              { name: "sidebar.brand.name", priority: -10, inject: face },
              BrandName,
            );
          } catch (error) {
            console.warn(
              "[dsh-brand-studio] Cannot replace the name slot; check for a conflicting branding plugin.",
              error,
            );
          }
        }
      } else {
        release?.();
        release = undefined;
      }
    };
    sync();
    const unsubscribe = store.subscribe(sync);
    return () => {
      unsubscribe();
      release?.();
    };
  });
  ctx.slots.inject("settings.section", () =>
    ctx.slots.register(
      {
        name: "settings.section",
        id: "dsh-brand-studio",
        order: 1000,
        label: () => ctx.locale.bind(NS)("nav"),
        locale: NS,
        inject: () => ({
          ...face(),
          save: (settings: BrandSettings) => store.commit(settings),
        }),
      },
      BrandingPanel,
    ),
  );
}
