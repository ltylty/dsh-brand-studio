import z from "@deepseek-ai/schemastery";
//#region src/index.ts
/** Profile entry id declared by this bundle's cordis.patch.yml. */
const ENTRY_ID = "ui-brand-studio";
/** Global the browser reads before the client plugin boots. */
const BRAND_CONFIG_GLOBAL = "__DSH_BRAND_STUDIO_CONFIG__";
/**
* Deployment-owned branding. Every field is `volatile`, so the native settings
* editor can write it live from the Branding panel. That panel is only
* reachable by an administrator — an ordinary user's sidebar hides every
* settings entry — and `settings.mutate` is administrator-only at the RPC
* fence, so the write path is guarded without the client judging roles.
*/
const Config = z.object({
	version: z.const(1).default(1),
	name: z.string().default("").volatile(),
	badge: z.string().default("").volatile(),
	logo: z.string().default("").volatile(),
	wordmark: z.string().default("").volatile(),
	customizeTitle: z.boolean().default(true).volatile(),
	nameMode: z.union(["text", "image"]).default("text").volatile(),
	logoSize: z.number().min(18).max(24).default(24).volatile(),
	logoRadius: z.number().min(0).max(12).default(6).volatile()
});
/** Only the fields the browser needs; keeps unrelated config out of the page. */
function pick(config) {
	return {
		version: 1,
		name: config.name,
		badge: config.badge,
		logo: config.logo,
		wordmark: config.wordmark,
		customizeTitle: config.customizeTitle,
		nameMode: config.nameMode,
		logoSize: config.logoSize,
		logoRadius: config.logoRadius
	};
}
function apply(ctx, config) {
	ctx.inject(["settings"], (scope) => {
		scope.settings.configure({ auto: false }, ctx.fiber);
	});
	ctx.on("webserver/index-inject", (table) => {
		let value = pick(config);
		try {
			const view = ctx.get("settings")?.describe().find((row) => row.ns === ENTRY_ID);
			if (view?.value) value = pick({
				...value,
				...view.value
			});
		} catch {}
		table.push({
			kind: "global",
			name: BRAND_CONFIG_GLOBAL,
			value
		});
	});
}
//#endregion
export { BRAND_CONFIG_GLOBAL, Config, ENTRY_ID, apply };
