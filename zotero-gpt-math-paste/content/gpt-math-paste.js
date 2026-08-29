var GPTMathPaste = {
	id: null,
	version: null,
	rootURI: null,
	converter: null,
	windowStates: new Map(),
	syntheticPasteEvents: new WeakSet(),
	prefName: "extensions.zotero-gpt-math-paste.enabled",

	init({ id, version, rootURI, converter }) {
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.converter = converter;
	},

	log(message) {
		Zotero.debug("GPT Math Paste: " + message);
	},

	isEnabled() {
		let value = Zotero.Prefs.get(this.prefName, true);
		return value !== false;
	},

	setEnabled(enabled) {
		Zotero.Prefs.set(this.prefName, Boolean(enabled), true);
		for (let state of this.windowStates.values()) {
			if (state.menuItem) state.menuItem.checked = Boolean(enabled);
		}
	},

	addToAllWindows() {
		for (let window of Zotero.getMainWindows()) {
			this.addToWindow(window);
		}
	},

	addToWindow(window) {
		if (!window?.document || this.windowStates.has(window)) return;
		let state = {
			observer: null,
			frames: new Map(),
			menuItem: null,
			scanTimer: null,
		};
		this.windowStates.set(window, state);

		let toolsPopup = window.document.getElementById("menu_ToolsPopup");
		if (toolsPopup) {
			let menuItem = window.document.createXULElement("menuitem");
			menuItem.id = "gpt-math-paste-toggle";
			menuItem.setAttribute("type", "checkbox");
			menuItem.setAttribute("label", "GPT Math Paste: 自动转换公式");
			menuItem.checked = this.isEnabled();
			menuItem.addEventListener("command", () => this.setEnabled(menuItem.checked));
			let addOnsItem = window.document.getElementById("menu_addons");
			toolsPopup.insertBefore(menuItem, addOnsItem || null);
			state.menuItem = menuItem;
		}

		state.observer = new window.MutationObserver(() => this.scanWindow(window));
		state.observer.observe(window.document.documentElement, { childList: true, subtree: true });
		state.scanTimer = window.setInterval(() => this.scanWindow(window), 1000);
		this.scanWindow(window);
	},

	scanWindow(window) {
		let state = this.windowStates.get(window);
		if (!state) return;
		for (let [iframe, frameState] of state.frames) {
			if (iframe.isConnected) continue;
			this.detachFrame(iframe, frameState);
			state.frames.delete(iframe);
		}
		for (let [iframe, frameState] of state.frames) {
			if (iframe.contentWindow !== frameState.frameWindow) {
				frameState.installPasteHandler();
			}
		}
		for (let noteEditor of window.document.querySelectorAll("note-editor")) {
			this.attachNoteEditor(state, noteEditor);
		}
	},

	detachFrame(iframe, frameState) {
		iframe.removeEventListener("DOMContentLoaded", frameState.domContentLoadedHandler);
		iframe.removeEventListener("load", frameState.loadHandler);
		try {
			frameState.frameWindow?.removeEventListener("paste", frameState.pasteHandler, true);
		}
		catch (error) {
			this.log("Could not detach an editor listener: " + error);
		}
	},

	attachNoteEditor(state, noteEditor) {
		let iframe = noteEditor._iframe || noteEditor.querySelector("#editor-view");
		if (!iframe) return;
		let existingState = state.frames.get(iframe);
		if (existingState) {
			existingState.installPasteHandler();
			return;
		}

		let frameState = {
			frameWindow: null,
			pasteHandler: null,
			loadHandler: null,
			domContentLoadedHandler: null,
			installPasteHandler: null,
		};
		let installPasteHandler = (force = false) => {
			let frameWindow = iframe.contentWindow;
			if (!frameWindow) return;
			if (!force && frameState.frameWindow === frameWindow && frameState.pasteHandler) return;

			try {
				frameState.frameWindow?.removeEventListener("paste", frameState.pasteHandler, true);
			}
			catch (error) {
				this.log("Could not detach a stale editor listener: " + error);
			}
			let pasteHandler = event => this.handlePaste(event, noteEditor);
			frameWindow.addEventListener("paste", pasteHandler, true);
			frameState.frameWindow = frameWindow;
			frameState.pasteHandler = pasteHandler;
		};

		frameState.installPasteHandler = installPasteHandler;
		frameState.domContentLoadedHandler = () => installPasteHandler(true);
		frameState.loadHandler = () => installPasteHandler(true);
		iframe.addEventListener("DOMContentLoaded", frameState.domContentLoadedHandler);
		iframe.addEventListener("load", frameState.loadHandler);
		state.frames.set(iframe, frameState);
		installPasteHandler();
	},

	handlePaste(event, noteEditor) {
		if (this.syntheticPasteEvents.has(event)
			|| !this.isEnabled()
			|| event.defaultPrevented) return;
		let { html, text } = this.readClipboard(event);
		if (!html && !text) return;
		let result;
		try {
			result = this.converter.convertClipboard({
				html,
				text,
				document: event.target?.ownerDocument || noteEditor.ownerDocument,
			});
		}
		catch (error) {
			Zotero.logError(error);
			return;
		}
		if (!result) return;

		// Use Zotero's own EditorInstance insertion path to preserve the current
		// ProseMirror selection and undo history.
		if (this.insertIntoZoteroEditor(event, result.html, noteEditor)) {
			event.preventDefault();
			event.stopImmediatePropagation();
			this.log(`Converted ${result.formulaCount} formula(s) from ${result.source}`);
			return;
		}

		let convertedPaste = this.createPasteEvent(event, result.html, text);
		if (!convertedPaste) {
			this.log("Skipped conversion because this editor cannot create a clipboard event");
			return;
		}

		event.preventDefault();
		event.stopImmediatePropagation();
		event.target.dispatchEvent(convertedPaste);
		this.log(`Converted ${result.formulaCount} formula(s) from ${result.source}`);
	},

	readClipboard(event) {
		let readEventData = type => {
			try {
				return event.clipboardData?.getData(type) || "";
			}
			catch (error) {
				this.log(`Could not read ${type} from the paste event: ${error}`);
				return "";
			}
		};
		let html = readEventData("text/html");
		let text = readEventData("text/plain");
		let getClipboard = Zotero.Utilities?.Internal?.getClipboard;
		if (typeof getClipboard === "function") {
			try {
				html ||= getClipboard.call(Zotero.Utilities.Internal, "text/html") || "";
				text ||= getClipboard.call(Zotero.Utilities.Internal, "text/plain") || "";
			}
			catch (error) {
				this.log("Could not read Zotero's privileged clipboard: " + error);
			}
		}
		return { html, text };
	},

	insertIntoZoteroEditor(event, html, noteEditor) {
		let editorInstance = noteEditor?._editorInstance || noteEditor?.getCurrentInstance?.();
		if (typeof editorInstance?._postMessage === "function") {
			try {
				editorInstance._postMessage({ action: "insertHTML", pos: null, html });
				return true;
			}
			catch (error) {
				this.log("Could not insert converted HTML through Zotero's EditorInstance: " + error);
			}
		}

		let frameWindow = event.target?.ownerDocument?.defaultView;
		let contentWindow = frameWindow?.wrappedJSObject;
		let contentEditor = frameWindow?._currentEditorInstance
			|| contentWindow?._currentEditorInstance;
		let editorCore = contentEditor?._editorCore;
		if (typeof editorCore?.insertHTML !== "function") return false;
		try {
			editorCore.insertHTML(null, html);
			return true;
		}
		catch (error) {
			this.log("Could not insert converted HTML through Zotero's note editor: " + error);
			return false;
		}
	},

	createPasteEvent(originalEvent, html, text) {
		let frameWindow = originalEvent.target?.ownerDocument?.defaultView;
		if (!frameWindow?.DataTransfer || !frameWindow?.ClipboardEvent) return null;
		try {
			let clipboardData = new frameWindow.DataTransfer();
			clipboardData.setData("text/html", html);
			clipboardData.setData("text/plain", text);
			let pasteEvent = new frameWindow.ClipboardEvent("paste", {
				bubbles: true,
				cancelable: true,
				clipboardData,
			});
			if (!pasteEvent.clipboardData) return null;
			this.syntheticPasteEvents.add(pasteEvent);
			return pasteEvent;
		}
		catch (error) {
			Zotero.logError(error);
			return null;
		}
	},

	removeFromWindow(window) {
		let state = this.windowStates.get(window);
		if (!state) return;
		state.observer?.disconnect();
		if (state.scanTimer !== null) window.clearInterval(state.scanTimer);
		state.menuItem?.remove();

		for (let [iframe, frameState] of state.frames) {
			this.detachFrame(iframe, frameState);
		}
		state.frames.clear();
		this.windowStates.delete(window);
	},

	removeFromAllWindows() {
		for (let window of Array.from(this.windowStates.keys())) {
			this.removeFromWindow(window);
		}
	},
};

if (typeof module !== "undefined" && module.exports) {
	module.exports = GPTMathPaste;
}
