export const STORAGE_KEY = "dsh-brand-studio/settings/v1";
export const MAX_IMAGE_BYTES = 256 * 1024;
export const MAX_IMAGE_EDGE = 512;

export interface BrandSettings {
  version: 1;
  name: string | null;
  badge: string | null;
  logo: string | null;
  wordmark: string | null;
  customizeTitle: boolean;
  nameMode: "text" | "image";
  logoSize: number;
  logoRadius: number;
}

export const DEFAULT_SETTINGS: Readonly<BrandSettings> = Object.freeze({
  version: 1,
  name: null,
  badge: null,
  logo: null,
  wordmark: null,
  customizeTitle: true,
  nameMode: "text",
  logoSize: 24,
  logoRadius: 6,
});

/** Only our bounded, normalized PNG format may be restored from storage. */
export function isStoredImage(value: unknown): value is string {
  if (typeof value !== "string" || value.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 22) {
    return false;
  }
  if (!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)) return false;
  try {
    const encoded = value.slice(22);
    if (encoded.length % 4 !== 0) return false;
    const header = atob(encoded.slice(0, 44));
    if (header.length < 24 || header.slice(0, 8) !== "\x89PNG\r\n\x1a\n") return false;
    if (header.slice(12, 16) !== "IHDR") return false;
    const dimension = (offset: number) =>
      header.charCodeAt(offset) * 0x1000000 +
      header.charCodeAt(offset + 1) * 0x10000 +
      header.charCodeAt(offset + 2) * 0x100 +
      header.charCodeAt(offset + 3);
    const width = dimension(16);
    const height = dimension(20);
    return width > 0 && height > 0 && width <= MAX_IMAGE_EDGE && height <= MAX_IMAGE_EDGE;
  } catch {
    return false;
  }
}

export function decodeSettings(value: unknown): BrandSettings | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  if (source.version !== 1 || typeof source.customizeTitle !== "boolean") return null;
  const nameMode = source.nameMode ?? (source.wordmark ? "image" : "text");
  const logoSize = source.logoSize ?? 24;
  const logoRadius = source.logoRadius ?? 6;
  if (nameMode !== "text" && nameMode !== "image") return null;
  if (typeof logoSize !== "number" || !Number.isInteger(logoSize) || logoSize < 18 || logoSize > 24)
    return null;
  if (
    typeof logoRadius !== "number" ||
    !Number.isInteger(logoRadius) ||
    logoRadius < 0 ||
    logoRadius > 12
  )
    return null;
  const text = (v: unknown, limit: number, allowEmpty: boolean) =>
    v === null ||
    (typeof v === "string" &&
      v.length <= limit &&
      (allowEmpty || v.trim().length > 0) &&
      !Array.from(v).some(
        (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
      ));
  if (!text(source.name, 64, false) || !text(source.badge, 24, true)) return null;
  if (source.logo !== null && !isStoredImage(source.logo)) return null;
  if (source.wordmark !== null && !isStoredImage(source.wordmark)) return null;
  return {
    version: 1,
    name: typeof source.name === "string" ? source.name.trim() : null,
    badge: typeof source.badge === "string" ? source.badge.trim() : null,
    logo: source.logo as string | null,
    wordmark: source.wordmark as string | null,
    customizeTitle: source.customizeTitle,
    nameMode,
    logoSize,
    logoRadius,
  };
}

export function equalSettings(a: BrandSettings, b: BrandSettings): boolean {
  return (
    a.name === b.name &&
    a.badge === b.badge &&
    a.logo === b.logo &&
    a.wordmark === b.wordmark &&
    a.nameMode === b.nameMode &&
    a.logoSize === b.logoSize &&
    a.logoRadius === b.logoRadius &&
    a.customizeTitle === b.customizeTitle
  );
}

/** Profile entry id declared by this bundle's cordis.patch.yml. */
export const ENTRY_ID = "ui-brand-studio";

/** Global key the host injects into the index document. */
export const BRAND_CONFIG_GLOBAL = "__DSH_BRAND_STUDIO_CONFIG__";

interface RawBrandConfig {
  name?: unknown;
  badge?: unknown;
  logo?: unknown;
  wordmark?: unknown;
  customizeTitle?: unknown;
  nameMode?: unknown;
  logoSize?: unknown;
  logoRadius?: unknown;
}

/**
 * Normalize a raw branding record — from the injected global or a settings
 * view — into settings the UI can render. Anything malformed collapses to the
 * official appearance instead of breaking boot.
 */
export function settingsFromRaw(value: RawBrandConfig): BrandSettings {
  const text = (input: unknown) =>
    typeof input === "string" && input.trim().length > 0 ? input : null;
  return (
    decodeSettings({
      ...DEFAULT_SETTINGS,
      name: text(value.name),
      badge: text(value.badge),
      logo: text(value.logo),
      wordmark: text(value.wordmark),
      customizeTitle:
        typeof value.customizeTitle === "boolean"
          ? value.customizeTitle
          : DEFAULT_SETTINGS.customizeTitle,
      nameMode: value.nameMode ?? DEFAULT_SETTINGS.nameMode,
      logoSize: value.logoSize ?? DEFAULT_SETTINGS.logoSize,
      logoRadius: value.logoRadius ?? DEFAULT_SETTINGS.logoRadius,
    }) ?? { ...DEFAULT_SETTINGS }
  );
}

/**
 * Read the deployment-owned branding the host injects before this bundle runs.
 * The value is already present at boot, so the first render carries the
 * administrator's logo without an async round trip.
 */
export function readServerSettings(
  source: Record<string, unknown> = globalThis as unknown as Record<string, unknown>,
): BrandSettings {
  const raw = source[BRAND_CONFIG_GLOBAL];
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return { ...DEFAULT_SETTINGS };
  return settingsFromRaw(raw as RawBrandConfig);
}
