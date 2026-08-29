const test = require("node:test");
const assert = require("node:assert/strict");
const converter = require("../content/formula-converter.js");

global.Zotero = {
	debug() {},
	logError(error) {
		throw error;
	},
	Utilities: {
		Internal: {
			getClipboard() {
				return null;
			},
		},
	},
};

const plugin = require("../content/gpt-math-paste.js");

class FakeDataTransfer {
	constructor() {
		this.values = new Map();
	}

	setData(type, value) {
		this.values.set(type, value);
	}

	getData(type) {
		return this.values.get(type) || "";
	}
}

class FakeClipboardEvent {
	constructor(type, options) {
		this.type = type;
		Object.assign(this, options);
	}
}

test("redispatches converted HTML through Zotero's normal paste pipeline", () => {
	let dispatched = null;
	let target = {
		ownerDocument: {
			defaultView: {
				DataTransfer: FakeDataTransfer,
				ClipboardEvent: FakeClipboardEvent,
			},
		},
		dispatchEvent(event) {
			dispatched = event;
			return true;
		},
	};
	let prevented = false;
	let stopped = false;
	let original = {
		target,
		defaultPrevented: false,
		clipboardData: {
			getData(type) {
				return type === "text/plain" ? "Formula \\(x^2\\)" : "";
			},
		},
		preventDefault() {
			prevented = true;
		},
		stopImmediatePropagation() {
			stopped = true;
		},
	};

	plugin.converter = converter;
	plugin.isEnabled = () => true;
	plugin.handlePaste(original, { ownerDocument: target.ownerDocument });

	assert.equal(prevented, true);
	assert.equal(stopped, true);
	assert.ok(dispatched);
	assert.equal(dispatched.type, "paste");
	assert.equal(dispatched.clipboardData.getData("text/plain"), "Formula \\(x^2\\)");
	assert.match(dispatched.clipboardData.getData("text/html"), /<span class="math">\$x\^2\$<\/span>/);
	assert.equal(plugin.syntheticPasteEvents.has(dispatched), true);
});

test("uses Zotero 9's parent EditorInstance insertion API when available", () => {
	let inserted = null;
	let target = {
		ownerDocument: {
			defaultView: {
			},
		},
		dispatchEvent() {
			throw new Error("should not redispatch when insertHTML is available");
		},
	};
	let noteEditor = {
		_editorInstance: {
			_postMessage(message) {
				inserted = message;
			},
		},
	};
	let prevented = false;
	let stopped = false;
	let original = {
		target,
		defaultPrevented: false,
		clipboardData: {
			getData(type) {
				return type === "text/plain" ? "Formula \\(x^2\\)" : "";
			},
		},
		preventDefault() {
			prevented = true;
		},
		stopImmediatePropagation() {
			stopped = true;
		},
	};

	plugin.converter = converter;
	plugin.isEnabled = () => true;
	plugin.handlePaste(original, noteEditor);

	assert.equal(prevented, true);
	assert.equal(stopped, true);
	assert.deepEqual(inserted, {
		action: "insertHTML",
		pos: null,
		html: 'Formula <span class="math">$x^2$</span>',
	});
});

test("falls back to Zotero's privileged clipboard when iframe paste data is empty", () => {
	let requestedTypes = [];
	Zotero.Utilities.Internal.getClipboard = type => {
		requestedTypes.push(type);
		return type === "text/plain" ? "Formula \\(x^2\\)" : "";
	};
	let inserted = null;
	let prevented = false;
	let stopped = false;
	let original = {
		target: { ownerDocument: { defaultView: {} } },
		defaultPrevented: false,
		clipboardData: {
			getData() {
				return "";
			},
		},
		preventDefault() {
			prevented = true;
		},
		stopImmediatePropagation() {
			stopped = true;
		},
	};
	let noteEditor = {
		_editorInstance: {
			_postMessage(message) {
				inserted = message;
			},
		},
	};

	plugin.converter = converter;
	plugin.isEnabled = () => true;
	plugin.handlePaste(original, noteEditor);

	assert.deepEqual(requestedTypes, ["text/html", "text/plain"]);
	assert.equal(prevented, true);
	assert.equal(stopped, true);
	assert.equal(inserted.action, "insertHTML");
	assert.match(inserted.html, /<span class="math">\$x\^2\$<\/span>/);
	Zotero.Utilities.Internal.getClipboard = () => null;
});

test("uses the iframe editor core when the parent instance API is unavailable", () => {
	let inserted = null;
	let frameWindow = {
		_currentEditorInstance: {
			_editorCore: {
				insertHTML(position, html) {
					inserted = { position, html };
				},
			},
		},
	};
	let event = { target: { ownerDocument: { defaultView: frameWindow } } };

	assert.equal(plugin.insertIntoZoteroEditor(event, "<p>converted</p>", {}), true);
	assert.deepEqual(inserted, { position: null, html: "<p>converted</p>" });
});

test("reattaches the paste listener when a note iframe window changes", () => {
	let createEventTarget = () => {
		let listeners = new Map();
		return {
			listeners,
			addEventListener(type, listener) {
				if (!listeners.has(type)) listeners.set(type, new Set());
				listeners.get(type).add(listener);
			},
			removeEventListener(type, listener) {
				listeners.get(type)?.delete(listener);
			},
		};
	};
	let firstWindow = createEventTarget();
	let secondWindow = createEventTarget();
	let iframe = Object.assign(createEventTarget(), { contentWindow: firstWindow });
	let noteEditor = { _iframe: iframe };
	let state = { frames: new Map() };

	plugin.attachNoteEditor(state, noteEditor);
	assert.equal(firstWindow.listeners.get("paste").size, 1);
	assert.equal(iframe.listeners.get("DOMContentLoaded").size, 1);

	iframe.contentWindow = secondWindow;
	plugin.attachNoteEditor(state, noteEditor);
	assert.equal(firstWindow.listeners.get("paste").size, 0);
	assert.equal(secondWindow.listeners.get("paste").size, 1);
	plugin.detachFrame(iframe, state.frames.get(iframe));
});
