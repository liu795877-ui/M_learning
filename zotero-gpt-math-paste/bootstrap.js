var GPTMathPaste;
var GPTMathFormulaConverter;

function log(message) {
	Zotero.debug("GPT Math Paste: " + message);
}

function install() {
	log("Installed");
}

async function startup({ id, version, rootURI }) {
	await Zotero.initializationPromise;
	Services.scriptloader.loadSubScript(rootURI + "content/formula-converter.js");
	Services.scriptloader.loadSubScript(rootURI + "content/gpt-math-paste.js");
	GPTMathPaste.init({ id, version, rootURI, converter: GPTMathFormulaConverter });
	GPTMathPaste.addToAllWindows();
	log("Started " + version);
}

function onMainWindowLoad({ window }) {
	GPTMathPaste?.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	GPTMathPaste?.removeFromWindow(window);
}

function shutdown() {
	GPTMathPaste?.removeFromAllWindows();
	GPTMathPaste = undefined;
	GPTMathFormulaConverter = undefined;
	log("Stopped");
}

function uninstall() {
	log("Uninstalled");
}
