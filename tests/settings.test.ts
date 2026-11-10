import assert from "node:assert/strict";
import test from "node:test";
import type { BrandSettings } from "../src/client/settings.ts";
import {
  DEFAULT_SETTINGS,
  decodeSettings,
  isStoredImage,
  readServerSettings,
  settingsFromRaw,
} from "../src/client/settings.ts";
import { BrandStore } from "../src/client/store.ts";

const PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aKx8AAAAASUVORK5CYII=";

test("untrusted saved settings cannot introduce URLs, control characters, or unsupported schemas", () => {
  assert.equal(decodeSettings({ ...DEFAULT_SETTINGS, version: 2 }), null);
  assert.equal(decodeSettings({ ...DEFAULT_SETTINGS, name: "bad\nname" }), null);
  assert.equal(decodeSettings({ ...DEFAULT_SETTINGS, logo: "https://example.com/logo.png" }), null);
  assert.equal(isStoredImage("data:image/svg+xml;base64,PHN2Zz4="), false);
  assert.equal(isStoredImage("data:image/png;base64,YWJjZA=="), false);
  assert.equal(
    decodeSettings({ ...DEFAULT_SETTINGS, name: " 大肥鱼 ", badge: "" })?.name,
    "大肥鱼",
  );
});

test("injected branding is normalized and malformed input falls back to official defaults", () => {
  const config = {
    name: "DFY",
    badge: "",
    logo: PNG,
    wordmark: "",
    customizeTitle: false,
    nameMode: "image",
    logoSize: 20,
    logoRadius: 3,
  };
  const settings = settingsFromRaw(config);
  assert.equal(settings.name, "DFY");
  assert.equal(settings.badge, null);
  assert.equal(settings.logo, PNG);
  assert.equal(settings.wordmark, null);
  assert.equal(settings.nameMode, "image");
  assert.equal(settings.logoSize, 20);
  assert.deepEqual(readServerSettings({ __DSH_BRAND_STUDIO_CONFIG__: config }), settings);
  assert.deepEqual(readServerSettings({}), { ...DEFAULT_SETTINGS });
  assert.deepEqual(readServerSettings({ __DSH_BRAND_STUDIO_CONFIG__: null }), {
    ...DEFAULT_SETTINGS,
  });
  assert.deepEqual(readServerSettings({ __DSH_BRAND_STUDIO_CONFIG__: { logo: "https://x" } }), {
    ...DEFAULT_SETTINGS,
  });
});

test("a refused write retains the prior active settings and emits no change", async () => {
  const store = new BrandStore({
    save: async () => {
      throw new Error("forbidden");
    },
  });
  let changes = 0;
  store.subscribe(() => changes++);
  const previous = store.getSnapshot();
  await assert.rejects(() => store.commit({ ...DEFAULT_SETTINGS, name: "DFY" }), /forbidden/);
  assert.equal(store.getSnapshot(), previous);
  assert.equal(changes, 0);
});

test("commit adopts the host echo and a writer-less store refuses to write", async () => {
  const captured: BrandSettings[] = [];
  const store = new BrandStore({
    save: async (settings) => {
      captured.push(settings);
      return { ...settings, name: "ECHO" };
    },
  });
  const next = await store.commit({ ...DEFAULT_SETTINGS, name: "DFY" });
  assert.equal(captured[0]?.name, "DFY");
  assert.equal(next.name, "ECHO");
  assert.equal(store.getSnapshot().name, "ECHO");

  const fixed = new BrandStore(null, { ...DEFAULT_SETTINGS, name: "BASE" });
  assert.equal(fixed.getSnapshot().name, "BASE");
  await assert.rejects(
    () => fixed.commit({ ...DEFAULT_SETTINGS, name: "DFY" }),
    /save-unavailable/,
  );
  assert.equal(fixed.getSnapshot().name, "BASE");
});

test("older saved settings retain title choice and migrate image mode and logo controls", () => {
  const old = {
    version: 1,
    name: "DFY",
    badge: null,
    logo: null,
    wordmark: null,
    customizeTitle: false,
  };
  const migrated = decodeSettings(old);
  assert.equal(migrated?.customizeTitle, false);
  assert.equal(migrated?.nameMode, "text");
  assert.equal(migrated?.logoSize, 24);
  assert.equal(migrated?.logoRadius, 6);
  assert.equal(DEFAULT_SETTINGS.customizeTitle, true);
  assert.equal(decodeSettings({ ...DEFAULT_SETTINGS, logoSize: 999 }), null);
  assert.equal(decodeSettings({ ...DEFAULT_SETTINGS, logoRadius: -1 }), null);
  assert.equal(decodeSettings({ ...DEFAULT_SETTINGS, nameMode: "unknown" }), null);
});
