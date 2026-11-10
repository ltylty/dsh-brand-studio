window.__ModuleLoader__.load({
	id: "dsh-brand-studio",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region src/client/Brand.tsx
		function LogoImage({ settings, size, className = "" }) {
			const edge = size * settings.logoSize / 24;
			return settings.logo ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				className: `dbs-mark ${className}`,
				src: settings.logo,
				width: edge,
				height: edge,
				style: {
					width: edge,
					height: edge,
					borderRadius: size * settings.logoRadius / 24,
					overflow: "hidden"
				},
				alt: settings.name ?? "Logo",
				draggable: false
			}) : null;
		}
		function BrandMark({ size, className, useSettings }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LogoImage, {
				settings: useSettings((settings) => settings),
				size,
				...className ? { className } : {}
			});
		}
		/** Crop the public artwork component, preserving its exact vector typography. */
		function OfficialArtwork({ part }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: `dbs-official-${part}`,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.BrandWordmark, { includeMark: false })
			});
		}
		function BrandLabel({ settings }) {
			const name = settings.name ?? "DeepSeek";
			const badge = settings.badge ?? "HARNESS";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dbs-name",
				children: [settings.nameMode === "image" && settings.wordmark ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
					className: "dbs-wordmark",
					src: settings.wordmark,
					alt: name,
					draggable: false
				}) : settings.name === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OfficialArtwork, { part: "name" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dbs-name-text",
					children: name
				}), badge && (badge === "HARNESS" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OfficialArtwork, { part: "badge" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dbs-badge",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dbs-badge-text",
						children: badge
					})
				}))]
			});
		}
		function BrandName({ useSettings }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandLabel, { settings: useSettings((settings) => settings) });
		}
		const DEFAULT_SETTINGS = Object.freeze({
			version: 1,
			name: null,
			badge: null,
			logo: null,
			wordmark: null,
			customizeTitle: true,
			nameMode: "text",
			logoSize: 24,
			logoRadius: 6
		});
		/** Only our bounded, normalized PNG format may be restored from storage. */
		function isStoredImage(value) {
			if (typeof value !== "string" || value.length > Math.ceil(262144 / 3) * 4 + 22) return false;
			if (!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)) return false;
			try {
				const encoded = value.slice(22);
				if (encoded.length % 4 !== 0) return false;
				const header = atob(encoded.slice(0, 44));
				if (header.length < 24 || header.slice(0, 8) !== "PNG\r\n\n") return false;
				if (header.slice(12, 16) !== "IHDR") return false;
				const dimension = (offset) => header.charCodeAt(offset) * 16777216 + header.charCodeAt(offset + 1) * 65536 + header.charCodeAt(offset + 2) * 256 + header.charCodeAt(offset + 3);
				const width = dimension(16);
				const height = dimension(20);
				return width > 0 && height > 0 && width <= 512 && height <= 512;
			} catch {
				return false;
			}
		}
		function decodeSettings(value) {
			if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
			const source = value;
			if (source.version !== 1 || typeof source.customizeTitle !== "boolean") return null;
			const nameMode = source.nameMode ?? (source.wordmark ? "image" : "text");
			const logoSize = source.logoSize ?? 24;
			const logoRadius = source.logoRadius ?? 6;
			if (nameMode !== "text" && nameMode !== "image") return null;
			if (typeof logoSize !== "number" || !Number.isInteger(logoSize) || logoSize < 18 || logoSize > 24) return null;
			if (typeof logoRadius !== "number" || !Number.isInteger(logoRadius) || logoRadius < 0 || logoRadius > 12) return null;
			const text = (v, limit, allowEmpty) => v === null || typeof v === "string" && v.length <= limit && (allowEmpty || v.trim().length > 0) && !Array.from(v).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
			if (!text(source.name, 64, false) || !text(source.badge, 24, true)) return null;
			if (source.logo !== null && !isStoredImage(source.logo)) return null;
			if (source.wordmark !== null && !isStoredImage(source.wordmark)) return null;
			return {
				version: 1,
				name: typeof source.name === "string" ? source.name.trim() : null,
				badge: typeof source.badge === "string" ? source.badge.trim() : null,
				logo: source.logo,
				wordmark: source.wordmark,
				customizeTitle: source.customizeTitle,
				nameMode,
				logoSize,
				logoRadius
			};
		}
		function equalSettings(a, b) {
			return a.name === b.name && a.badge === b.badge && a.logo === b.logo && a.wordmark === b.wordmark && a.nameMode === b.nameMode && a.logoSize === b.logoSize && a.logoRadius === b.logoRadius && a.customizeTitle === b.customizeTitle;
		}
		/** Profile entry id declared by this bundle's cordis.patch.yml. */
		const ENTRY_ID = "ui-brand-studio";
		/** Global key the host injects into the index document. */
		const BRAND_CONFIG_GLOBAL = "__DSH_BRAND_STUDIO_CONFIG__";
		/**
		* Normalize a raw branding record — from the injected global or a settings
		* view — into settings the UI can render. Anything malformed collapses to the
		* official appearance instead of breaking boot.
		*/
		function settingsFromRaw(value) {
			const text = (input) => typeof input === "string" && input.trim().length > 0 ? input : null;
			return decodeSettings({
				...DEFAULT_SETTINGS,
				name: text(value.name),
				badge: text(value.badge),
				logo: text(value.logo),
				wordmark: text(value.wordmark),
				customizeTitle: typeof value.customizeTitle === "boolean" ? value.customizeTitle : DEFAULT_SETTINGS.customizeTitle,
				nameMode: value.nameMode ?? DEFAULT_SETTINGS.nameMode,
				logoSize: value.logoSize ?? DEFAULT_SETTINGS.logoSize,
				logoRadius: value.logoRadius ?? DEFAULT_SETTINGS.logoRadius
			}) ?? { ...DEFAULT_SETTINGS };
		}
		/**
		* Read the deployment-owned branding the host injects before this bundle runs.
		* The value is already present at boot, so the first render carries the
		* administrator's logo without an async round trip.
		*/
		function readServerSettings(source = globalThis) {
			const raw = source[BRAND_CONFIG_GLOBAL];
			if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return { ...DEFAULT_SETTINGS };
			return settingsFromRaw(raw);
		}
		const MAX_PIXELS = 16e6;
		/** Check actual raster signatures; reject APNG/animated WebP before decoding. */
		function validateRaster(bytes) {
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const tag = (offset) => String.fromCharCode(...bytes.slice(offset, offset + 4));
			if (bytes.length >= 24 && bytes[0] === 137 && tag(1) === "PNG\r" && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) {
				for (let offset = 8; offset + 12 <= bytes.length;) {
					const size = view.getUint32(offset);
					if (offset + size + 12 > bytes.length) throw new Error("image-invalid");
					if (tag(offset + 4) === "acTL") throw new Error("image-format");
					offset += size + 12;
				}
				return;
			}
			if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return;
			if (bytes.length >= 12 && tag(0) === "RIFF" && tag(8) === "WEBP") {
				for (let offset = 12; offset + 8 <= bytes.length;) {
					const size = view.getUint32(offset + 4, true);
					if (offset + size + 8 > bytes.length) throw new Error("image-invalid");
					if (tag(offset) === "ANIM" || tag(offset) === "ANMF") throw new Error("image-format");
					offset += 8 + size + size % 2;
				}
				return;
			}
			throw new Error("image-format");
		}
		async function normalizeImage(file) {
			if (!file.size || file.size > 5242880) throw new Error("image-size");
			validateRaster(new Uint8Array(await file.arrayBuffer()));
			const url = URL.createObjectURL(file);
			const image = new Image();
			try {
				image.src = url;
				await image.decode();
				if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > MAX_PIXELS) throw new Error("image-dimensions");
				const canvas = document.createElement("canvas");
				try {
					const context = canvas.getContext("2d");
					if (!context) throw new Error("image-invalid");
					for (let edge = 512; edge >= 128; edge = Math.floor(edge * .75)) {
						const scale = Math.min(1, edge / Math.max(image.naturalWidth, image.naturalHeight));
						canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
						canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
						context.drawImage(image, 0, 0, canvas.width, canvas.height);
						const result = canvas.toDataURL("image/png");
						if (result.length <= Math.ceil(262144 / 3) * 4 + 22 && isStoredImage(result)) return result;
					}
					throw new Error("image-size");
				} finally {
					canvas.width = 0;
					canvas.height = 0;
				}
			} catch (error) {
				if (error instanceof Error && error.message.startsWith("image-")) throw error;
				throw new Error("image-invalid");
			} finally {
				image.src = "";
				URL.revokeObjectURL(url);
			}
		}
		//#endregion
		//#region src/client/BrandingPanel.tsx
		function BrandingPanel({ useSettings, save, t }) {
			const saved = useSettings((settings) => settings);
			const [draft, setDraft] = (0, react.useState)(saved);
			const [error, setError] = (0, react.useState)(null);
			const [message, setMessage] = (0, react.useState)(false);
			const [busy, setBusy] = (0, react.useState)(false);
			const base = (0, react.useRef)(saved);
			const generation = (0, react.useRef)(0);
			const id = (0, react.useId)();
			const logoInput = (0, react.useRef)(null);
			const wordmarkInput = (0, react.useRef)(null);
			const dirty = !equalSettings(draft, saved);
			const conflict = saved !== base.current;
			(0, react.useEffect)(() => () => {
				generation.current++;
			}, []);
			const edit = (patch) => {
				setDraft((current) => ({
					...current,
					...patch
				}));
				setError(null);
				setMessage(false);
			};
			const cancel = () => {
				generation.current++;
				base.current = saved;
				setDraft(saved);
				setBusy(false);
				setError(null);
				setMessage(false);
			};
			const choose = async (file, key) => {
				const ticket = ++generation.current;
				setBusy(true);
				setError(null);
				try {
					const image = await normalizeImage(file);
					if (ticket === generation.current) edit({ [key]: image });
				} catch (reason) {
					if (ticket === generation.current) {
						const code = reason instanceof Error ? reason.message : "image-invalid";
						setError(Object.hasOwn(imageErrors, code) ? code : "image-invalid");
					}
				} finally {
					if (ticket === generation.current) setBusy(false);
				}
			};
			const apply = async () => {
				setBusy(true);
				try {
					const next = await save(draft);
					base.current = next;
					setDraft(next);
					setError(null);
					setMessage(true);
				} catch {
					setError("storageError");
					setMessage(false);
				} finally {
					setBusy(false);
				}
			};
			const imageControl = (key) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dbs-upload",
				children: [
					draft[key] && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
						className: "dbs-image-preview",
						src: draft[key],
						alt: t(key)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: key === "logo" ? logoInput : wordmarkInput,
						hidden: true,
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						disabled: busy,
						onChange: (event) => {
							const file = event.currentTarget.files?.[0];
							event.currentTarget.value = "";
							if (file) choose(file, key);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						disabled: busy,
						onClick: () => (key === "logo" ? logoInput : wordmarkInput).current?.click(),
						children: t("choose")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						type: "button",
						size: "sm",
						disabled: busy || draft[key] === null,
						onClick: () => edit({ [key]: null }),
						children: t("reset")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", {
						className: "dbs-muted",
						children: t("imageHint")
					})
				]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dbs-panel",
				"aria-labelledby": `${id}-heading`,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						id: `${id}-heading`,
						children: t("nav")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dbs-group",
						"aria-labelledby": `${id}-preview`,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							id: `${id}-preview`,
							children: t("preview")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dbs-preview",
							children: [draft.logo ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LogoImage, {
								settings: draft,
								size: 24
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.FishLogo, { size: 24 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandLabel, { settings: draft })]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dbs-group",
						"aria-labelledby": `${id}-logo`,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								id: `${id}-logo`,
								children: t("logo")
							}),
							imageControl("logo"),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dbs-grid",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "dbs-field",
									htmlFor: `${id}-logo-size`,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
										t("logoSize"),
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("output", { children: [draft.logoSize, " px"] })
									] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										id: `${id}-logo-size`,
										type: "range",
										min: 18,
										max: 24,
										step: 1,
										disabled: !draft.logo,
										value: draft.logoSize,
										onChange: (event) => edit({ logoSize: Number(event.currentTarget.value) })
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "dbs-field",
									htmlFor: `${id}-logo-radius`,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
										t("logoRadius"),
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("output", { children: [draft.logoRadius, " px"] })
									] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										id: `${id}-logo-radius`,
										type: "range",
										min: 0,
										max: 12,
										step: 1,
										disabled: !draft.logo,
										value: draft.logoRadius,
										onChange: (event) => edit({ logoRadius: Number(event.currentTarget.value) })
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dbs-group",
						"aria-labelledby": `${id}-label`,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								id: `${id}-label`,
								children: t("brandLabel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SegmentedTabs, {
								label: t("nameMode"),
								value: draft.nameMode,
								onChange: (nameMode) => edit({ nameMode }),
								items: [{
									value: "text",
									label: t("textMode"),
									id: `${id}-text-tab`,
									panelId: `${id}-text-panel`
								}, {
									value: "image",
									label: t("imageMode"),
									id: `${id}-image-tab`,
									panelId: `${id}-image-panel`
								}]
							}),
							draft.nameMode === "text" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								role: "tabpanel",
								id: `${id}-text-panel`,
								"aria-labelledby": `${id}-text-tab`,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "dbs-field",
									htmlFor: `${id}-name`,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("name") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: `${id}-name`,
										maxLength: 64,
										value: draft.name ?? "",
										placeholder: "DeepSeek",
										onChange: (event) => edit({ name: event.currentTarget.value.trim() ? event.currentTarget.value : null })
									})]
								})
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								role: "tabpanel",
								id: `${id}-image-panel`,
								"aria-labelledby": `${id}-image-tab`,
								children: imageControl("wordmark")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dbs-field",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: `${id}-badge`,
										children: t("badge")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dbs-row",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
											id: `${id}-badge`,
											maxLength: 24,
											value: draft.badge ?? "HARNESS",
											onChange: (event) => edit({ badge: event.currentTarget.value })
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											type: "button",
											size: "sm",
											disabled: draft.badge === null,
											onClick: () => edit({ badge: null }),
											children: t("reset")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", {
										className: "dbs-muted",
										children: t("badgeHint")
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dbs-group",
						"aria-labelledby": `${id}-title`,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							id: `${id}-title`,
							children: t("pageTitle")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Checkbox, {
							checked: draft.customizeTitle,
							onChange: (customizeTitle) => edit({ customizeTitle }),
							label: t("title")
						})]
					}),
					busy && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: t("processing")
					}),
					conflict && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "alert",
						children: t("conflict")
					}),
					error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "alert",
						children: t(error)
					}),
					message && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: t("saved")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dbs-actions",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								type: "button",
								disabled: !dirty || busy || conflict,
								onClick: apply,
								children: t("apply")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								onClick: cancel,
								children: t("cancel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								disabled: busy,
								onClick: () => edit({ ...DEFAULT_SETTINGS }),
								children: t("resetAll")
							})
						]
					})
				]
			});
		}
		const imageErrors = {
			"image-format": true,
			"image-size": true,
			"image-dimensions": true,
			"image-invalid": true
		};
		//#endregion
		//#region src/client/locales.ts
		const NS = "dsh.brand-studio";
		const en = {
			nav: "Branding",
			heading: "Branding",
			pageTitle: "Page title",
			intro: "Branding is shared by everyone on this deployment. Only an administrator can edit it.",
			brandLabel: "Brand label",
			nameMode: "Display as",
			textMode: "Text",
			imageMode: "Image",
			wordmarkHint: "Replaces the brand text, not the logo. Text is kept for switching back and page titles.",
			logoSize: "Sidebar logo size",
			logoRadius: "Logo corner radius",
			logoHint: "The same logo appears in new chats, scaled to fit that area. Size and rounding are based on the sidebar logo.",
			name: "Brand name",
			nameHint: "Leave empty to use the official name.",
			badge: "Badge text",
			badgeHint: "Leave empty to hide.",
			logo: "Logo",
			wordmark: "Brand text image",
			imageHint: "PNG / JPEG / static WebP · up to 5 MB",
			choose: "Choose image",
			reset: "Reset",
			resetAll: "Reset all",
			title: "Use brand name (keep session name)",
			titleHint: "Keeps the current session name. Desktop window titles follow where supported.",
			preview: "Preview",
			official: "Official branding",
			apply: "Apply",
			cancel: "Cancel",
			saved: "Branding saved.",
			processing: "Preparing image…",
			storageError: "Could not save. Only an administrator can change the branding.",
			conflict: "Branding changed elsewhere. Cancel to load the latest settings before editing again.",
			"image-format": "Choose a PNG, JPEG or non-animated WebP image. SVG and animated images are not supported.",
			"image-size": "The image is too large. Choose a file up to 5 MB.",
			"image-dimensions": "The image exceeds 16 megapixels. Choose a smaller image.",
			"image-invalid": "This image could not be read. Try a different file."
		};
		const zh = {
			nav: "品牌",
			heading: "品牌",
			pageTitle: "页面标题",
			intro: "品牌设置由本部署的所有人共享，仅管理员可修改。",
			brandLabel: "品牌文字区域",
			nameMode: "显示方式",
			textMode: "文字",
			imageMode: "图片",
			wordmarkHint: "替换品牌文字，不是 logo。原文字保留，便于切回文字模式和设置页面标题。",
			logoSize: "侧边栏 logo 大小",
			logoRadius: "Logo 圆角",
			logoHint: "同一张 logo 也会显示在新会话中，并按该区域缩放。大小和圆角以侧边栏 logo 为基准。",
			name: "品牌名称",
			nameHint: "留空使用官方名称。",
			badge: "徽章文字",
			badgeHint: "留空隐藏徽章。",
			logo: "Logo",
			wordmark: "品牌文字图片",
			imageHint: "PNG / JPEG / 静态 WebP · 不超过 5 MB",
			choose: "选择图片",
			reset: "重置",
			resetAll: "全部重置",
			title: "使用品牌名称（保留会话名称）",
			titleHint: "保留当前会话名称。桌面应用允许时，窗口标题也会跟随。",
			preview: "预览",
			official: "官方品牌",
			apply: "应用",
			cancel: "取消",
			saved: "品牌设置已保存。",
			processing: "正在处理图片…",
			storageError: "保存失败，仅管理员可以修改品牌设置。",
			conflict: "品牌设置已被修改。请先取消，载入最新设置后再编辑。",
			"image-format": "请选择 PNG、JPEG 或静态 WebP 图片，不支持 SVG 和动态图。",
			"image-size": "图片过大，请选择不超过 5 MB 的文件。",
			"image-dimensions": "图片超过 1600 万像素，请使用更小的图片。",
			"image-invalid": "无法读取这张图片，请尝试其他文件。"
		};
		//#endregion
		//#region src/client/store.ts
		var BrandStore = class {
			snapshot;
			listeners = /* @__PURE__ */ new Set();
			writer;
			constructor(writer = null, initial = readServerSettings()) {
				this.writer = writer;
				this.snapshot = decodeSettings(initial) ?? { ...DEFAULT_SETTINGS };
			}
			getSnapshot = () => this.snapshot;
			subscribe = (listener) => {
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
			async commit(value) {
				const settings = decodeSettings(value);
				if (!settings) throw new Error("invalid-settings");
				if (!this.writer) throw new Error("save-unavailable");
				const next = decodeSettings(await this.writer.save(settings)) ?? settings;
				this.publish(next);
				return this.snapshot;
			}
			/** Adopt a server view without writing. */
			accept(value) {
				const settings = decodeSettings(value);
				if (settings) this.publish(settings);
			}
			publish(value) {
				if (equalSettings(value, this.snapshot)) return;
				this.snapshot = value;
				for (const listener of this.listeners) listener();
			}
		};
		//#endregion
		//#region src/client/styles.ts
		const CSS = `
.dbs-mark { object-fit: contain; flex-shrink: 0; }
.dbs-name { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; min-width: 0; height: 24px; overflow: hidden; }
.dbs-name-text { font-weight: 600; font-size: 16px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.dbs-wordmark { max-width: 135px; max-height: 24px; object-fit: contain; }
.dbs-official-name { position: relative; display: inline-block; width: 96px; height: 24px; flex-shrink: 0; overflow: hidden; }
.dbs-official-name svg, .dbs-official-badge svg { width: 156px; height: 24px; flex-shrink: 0; }
.dbs-official-name svg { position: absolute; left: 0; top: 0; max-width: none; }
.dbs-official-badge { position: relative; display: inline-block; width: 52px; height: 14px; border-radius: 3px; corner-shape: round; flex-shrink: 0; overflow: hidden; transform: translateY(.5px); }
.dbs-official-badge svg { position: absolute; left: -103.348px; top: -5.5px; max-width: none; }
.dbs-badge { display: inline-flex; align-items: center; height: 14px; box-sizing: border-box; padding: 0 3.5px; border-radius: 3px; corner-shape: round; font-family: var(--dsw-font-family, sans-serif); font-size: 10px; font-weight: 600; line-height: 14px; letter-spacing: 0; background: var(--dsw-alias-label-primary, #222); color: var(--dsw-alias-label-primary-inverted, #fff); white-space: nowrap; max-width: 100px; overflow: hidden; text-overflow: ellipsis; transform: translateY(.5px); }
.dbs-badge-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; transform: translateY(-.5px); }
.dbs-panel { color: var(--dsw-alias-label-primary); width: 100%; max-width: 640px; display: flex; flex-direction: column; gap: 24px; font-size: 13px; line-height: 20px; }
.dbs-panel h2, .dbs-panel h3, .dbs-panel p { margin: 0; }
.dbs-panel h2 { font-size: 18px; font-weight: 500; line-height: 26px; }
.dbs-panel h3 { font-size: 14px; font-weight: 500; }
.dbs-group { display: flex; flex-direction: column; gap: 12px; }
.dbs-group + .dbs-group { padding-top: 20px; border-top: .5px solid var(--dsw-alias-border-l3); }
.dbs-muted { color: var(--dsw-alias-label-tertiary); font-size: 12px; line-height: 18px; }
.dbs-preview { display: flex; align-items: center; gap: 8px; min-height: 32px; }
.dbs-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.dbs-row { display: flex; align-items: center; gap: 8px; }
.dbs-row > span { min-width: 0; flex: 1; }
.dbs-row > button { flex-shrink: 0; }
.dbs-upload { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.dbs-upload .dbs-muted { flex-basis: 100%; }
.dbs-image-preview { width: 40px; height: 40px; object-fit: contain; border-radius: var(--dsw-radius-sm); }
.dbs-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.dbs-field output { color: var(--dsw-alias-label-tertiary); margin-left: 6px; font-variant-numeric: tabular-nums; }
.dbs-field input[type=range] { width: 100%; margin: 0; accent-color: var(--dsw-alias-brand-primary); }
.dbs-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.dbs-panel [role=alert] { color: var(--dsw-alias-state-error-primary); }
@media (max-width: 440px) { .dbs-grid { grid-template-columns: 1fr; gap: 12px; } }
`;
		function installStyles() {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-brand-studio";
			tag.textContent = CSS;
			document.head.append(tag);
			return () => tag.remove();
		}
		//#endregion
		//#region src/client/title.ts
		const OFFICIAL_TITLE = "DeepSeek Harness";
		const SUFFIX = ` — ${OFFICIAL_TITLE}`;
		function brandTitle(upstream, name) {
			if (upstream === OFFICIAL_TITLE) return name;
			if (upstream.endsWith(SUFFIX)) return upstream.slice(0, -16) + name;
			return null;
		}
		/** Own only known upstream title formats. No body observation or interval polling. */
		function installTitle(store) {
			let original = null;
			let written = null;
			let observer = null;
			let windowStart = 0;
			let writes = 0;
			let blocked = false;
			const restore = () => {
				if (written !== null && original !== null && document.title === written) document.title = original;
				original = null;
				written = null;
			};
			const update = () => {
				const settings = store.getSnapshot();
				if (!settings.customizeTitle || blocked) return;
				const current = document.title;
				const source = current === written && original !== null ? original : current;
				const next = brandTitle(source, settings.name ?? OFFICIAL_TITLE);
				if (next === null) {
					original = null;
					written = null;
					return;
				}
				original = source;
				if (current === next) return;
				const now = Date.now();
				if (now - windowStart > 100) {
					windowStart = now;
					writes = 0;
				}
				if (++writes > 8) {
					blocked = true;
					observer?.disconnect();
					restore();
					console.warn("[dsh-brand-studio] Title customization stopped: another title writer may be active.");
					return;
				}
				written = next;
				document.title = next;
			};
			const synchronize = () => {
				if (!store.getSnapshot().customizeTitle) {
					observer?.disconnect();
					observer = null;
					restore();
					blocked = false;
					return;
				}
				if (!observer && !blocked) {
					observer = new MutationObserver(() => {
						if (document.title !== written) update();
					});
					observer.observe(document.head, {
						childList: true,
						characterData: true,
						subtree: true
					});
				}
				update();
			};
			const unsubscribe = store.subscribe(synchronize);
			synchronize();
			return () => {
				unsubscribe();
				observer?.disconnect();
				restore();
			};
		}
		//#endregion
		//#region src/client/index.tsx
		const inject = [
			"slots",
			"locale",
			"remote",
			"remote.settings"
		];
		function settingsToOps(settings) {
			return [
				{
					op: "set",
					path: ["name"],
					value: settings.name ?? ""
				},
				{
					op: "set",
					path: ["badge"],
					value: settings.badge ?? ""
				},
				{
					op: "set",
					path: ["logo"],
					value: settings.logo ?? ""
				},
				{
					op: "set",
					path: ["wordmark"],
					value: settings.wordmark ?? ""
				},
				{
					op: "set",
					path: ["customizeTitle"],
					value: settings.customizeTitle
				},
				{
					op: "set",
					path: ["nameMode"],
					value: settings.nameMode
				},
				{
					op: "set",
					path: ["logoSize"],
					value: settings.logoSize
				},
				{
					op: "set",
					path: ["logoRadius"],
					value: settings.logoRadius
				}
			];
		}
		function apply(ctx) {
			const remote = ctx.remote.settings;
			const store = new BrandStore({ async save(settings) {
				const view = await remote.mutate(ENTRY_ID, settingsToOps(settings));
				return view?.value ? settingsFromRaw(view.value) : settings;
			} });
			const face = () => ({ hooks: { settings: store } });
			ctx.effect(installStyles, "brand-studio: styles");
			ctx.effect(() => ctx.locale.register(NS, {
				en,
				zh
			}), "brand-studio: locale");
			ctx.effect(() => installTitle(store), "brand-studio: title");
			for (const slot of ["sidebar.brand.mark", "conversation.hero.brand.mark"]) ctx.slots.inject(slot, () => {
				let release;
				const sync = () => {
					if (store.getSnapshot().logo !== null) {
						if (!release) try {
							release = ctx.slots.register({
								name: slot,
								priority: -10,
								inject: face
							}, BrandMark);
						} catch (error) {
							console.warn("[dsh-brand-studio] Cannot replace the logo slot; check for a conflicting branding plugin.", error);
						}
					} else {
						release?.();
						release = void 0;
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
				let release;
				const sync = () => {
					const settings = store.getSnapshot();
					if (settings.name !== null || settings.badge !== null || settings.nameMode === "image" && settings.wordmark !== null) {
						if (!release) try {
							release = ctx.slots.register({
								name: "sidebar.brand.name",
								priority: -10,
								inject: face
							}, BrandName);
						} catch (error) {
							console.warn("[dsh-brand-studio] Cannot replace the name slot; check for a conflicting branding plugin.", error);
						}
					} else {
						release?.();
						release = void 0;
					}
				};
				sync();
				const unsubscribe = store.subscribe(sync);
				return () => {
					unsubscribe();
					release?.();
				};
			});
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-brand-studio",
				order: 1e3,
				label: () => ctx.locale.bind(NS)("nav"),
				locale: NS,
				inject: () => ({
					...face(),
					save: (settings) => store.commit(settings)
				})
			}, BrandingPanel));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map