var GPTMathFormulaConverter = (() => {
	"use strict";

	const NATIVE_MATH_SELECTOR = "span.math, pre.math";
	function isEscaped(text, index) {
		let count = 0;
		for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) {
			count++;
		}
		return count % 2 === 1;
	}

	function findClosing(text, start, delimiter, singleLine) {
		let index = start;
		while ((index = text.indexOf(delimiter, index)) !== -1) {
			if (singleLine && text.slice(start, index).includes("\n")) {
				return -1;
			}
			if (!isEscaped(text, index)) {
				if (delimiter === "$" && (text[index - 1] === "$" || text[index + 1] === "$")) {
					index++;
					continue;
				}
				return index;
			}
			index += delimiter.length;
		}
		return -1;
	}

	function isNumericOnly(tex) {
		return /^[+-]?(?:\d[\d,.]*)(?:\s*(?:USD|EUR|CNY|RMB|元|美元|欧元))?$/i.test(tex);
	}

	// GPT sometimes escapes a subscript underscore while copying plain text.
	// Zotero's math editor expects the regular TeX subscript form instead.
	function normalizeMathText(tex) {
		return String(tex || "")
			.replace(/[\u200B-\u200D\uFEFF]/g, "")
			.replace(/\\_/g, "_");
	}

	function findBalanced(text, start, opening, closing) {
		let depth = 0;
		for (let index = start; index < text.length; index++) {
			if (isEscaped(text, index)) continue;
			if (text[index] === opening) {
				depth++;
				continue;
			}
			if (text[index] === closing) {
				depth--;
				if (depth === 0) return index;
			}
		}
		return -1;
	}

	function isInlineMathCandidate(tex) {
		tex = normalizeMathText(tex).trim();
		if (!tex || isNumericOnly(tex) || /[\r\n]/.test(tex)) return false;
		if (/^(?:https?:|mailto:|www\.)/i.test(tex)) return false;

		// Commands, operators, and explicit subscripts/superscripts are strong
		// signals that the parenthesized text is math rather than prose.
		if (/\\[A-Za-z]+/.test(tex) || /[=^_<>+\-*\/]/.test(tex)) return true;
		if (/^[A-Za-z][A-Za-z0-9]*\s*\([^()]*\)$/.test(tex)) return true;

		// Short identifiers cover common copied variables such as (A), (f),
		// and (Ax), while longer words such as (therefore) remain plain text.
		return /^[A-Za-z][A-Za-z0-9]*$/.test(tex) && tex.length <= 3;
	}

	function cleanDisplayMath(tex) {
		let lines = normalizeMathText(tex)
			.replace(/\r\n?/g, "\n")
			.trim()
			.split("\n");
		let cleaned = [];
		for (let line of lines) {
			if (/^\s*={3,}\s*$/.test(line)) continue;
			// A copied Markdown heading can appear inside a formula block.
			line = line.replace(/^\s*#{1,6}\s+/, "");
			if (!line.trim()) continue;
			cleaned.push(line);
		}
		return cleaned.join("\n").trim();
	}

	function isDisplayMathCandidate(tex) {
		tex = cleanDisplayMath(tex);
		if (!tex) return false;
		if (/=[^=]|\^|_|\\[A-Za-z]+/.test(tex)) return true;
		// Permit a multiline expression such as a copied matrix even when it
		// has no equality sign, but do not turn a one-line [text] into math.
		return tex.includes("\n") && /[+\-*\/<>()]/.test(tex);
	}

	function pushText(tokens, value) {
		if (!value) return;
		let previous = tokens[tokens.length - 1];
		if (previous?.type === "text") {
			previous.value += value;
		}
		else {
			tokens.push({ type: "text", value });
		}
	}

	function tokenize(text) {
		text = String(text || "").replace(/\r\n?/g, "\n");
		let tokens = [];
		let formulaCount = 0;
		let cursor = 0;

		while (cursor < text.length) {
			if (text[cursor] === "`") {
				let run = 1;
				while (text[cursor + run] === "`") run++;
				let fence = "`".repeat(run);
				let end = text.indexOf(fence, cursor + run);
				if (end !== -1) {
					pushText(tokens, text.slice(cursor, end + run));
					cursor = end + run;
					continue;
				}
			}

			if (text[cursor] === "[") {
				let end = findBalanced(text, cursor, "[", "]");
				let raw = end === -1 ? "" : text.slice(cursor + 1, end);
				let looksLikeMarkdownLink = end !== -1 && text[end + 1] === "(" && !raw.includes("\n");
				let looksLikeMarkdownImage = cursor > 0 && text[cursor - 1] === "!";
				if (end !== -1 && !looksLikeMarkdownLink && !looksLikeMarkdownImage) {
					let tex = cleanDisplayMath(raw);
					if (isDisplayMathCandidate(tex)) {
						tokens.push({ type: "display", value: tex });
						formulaCount++;
						cursor = end + 1;
						continue;
					}
				}
			}

			if (text[cursor] === "(") {
				// Do not parse the destination of a Markdown link: [label](url).
				if (cursor > 0 && text[cursor - 1] === "]") {
					pushText(tokens, text[cursor]);
					cursor++;
					continue;
				}
				let end = findBalanced(text, cursor, "(", ")");
				if (end !== -1) {
					let raw = text.slice(cursor + 1, end);
					if (isInlineMathCandidate(raw)) {
						tokens.push({ type: "inline", value: normalizeMathText(raw).trim() });
						formulaCount++;
						cursor = end + 1;
						continue;
					}
				}
			}

			let opening = null;
			let closing = null;
			let type = null;
			let singleLine = false;

			if (text.startsWith("\\[", cursor) && !isEscaped(text, cursor)) {
				opening = "\\[";
				closing = "\\]";
				type = "display";
			}
			else if (text.startsWith("\\(", cursor) && !isEscaped(text, cursor)) {
				opening = "\\(";
				closing = "\\)";
				type = "inline";
				singleLine = true;
			}
			else if (text.startsWith("$$", cursor) && !isEscaped(text, cursor)) {
				opening = "$$";
				closing = "$$";
				type = "display";
			}
			else if (text[cursor] === "$" && !isEscaped(text, cursor)
				&& text[cursor - 1] !== "$" && text[cursor + 1] !== "$") {
				opening = "$";
				closing = "$";
				type = "inline";
				singleLine = true;
			}

			if (!opening) {
				pushText(tokens, text[cursor]);
				cursor++;
				continue;
			}

			let end = findClosing(text, cursor + opening.length, closing, singleLine);
			if (end === -1) {
				pushText(tokens, opening);
				cursor += opening.length;
				continue;
			}

			let raw = text.slice(cursor + opening.length, end);
			let tex = normalizeMathText(raw).trim();
			let invalidDollarMath = opening === "$" && (
				!raw || /^\s|\s$/.test(raw) || isNumericOnly(tex)
			);
			if (!tex || invalidDollarMath) {
				pushText(tokens, text.slice(cursor, end + closing.length));
			}
			else {
				tokens.push({ type, value: tex });
				formulaCount++;
			}
			cursor = end + closing.length;
		}

		return { tokens, formulaCount };
	}

	function escapeHTML(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function renderInlineToken(token) {
		if (token.type === "inline") {
			return `<span class="math">$${escapeHTML(token.value)}$</span>`;
		}
		return escapeHTML(token.value).replace(/\n/g, "<br>");
	}

	function renderPlainText(result) {
		let { tokens } = result;
		let hasDisplay = tokens.some(token => token.type === "display");
		let hasParagraphBreak = tokens.some(token => token.type === "text" && /\n{2,}/.test(token.value));

		if (!hasDisplay && !hasParagraphBreak) {
			return tokens.map(renderInlineToken).join("");
		}

		let blocks = [];
		let current = "";
		let flushParagraph = () => {
			if (current) {
				blocks.push(`<p>${current}</p>`);
				current = "";
			}
		};

		for (let token of tokens) {
			if (token.type === "display") {
				flushParagraph();
				blocks.push(`<pre class="math">$$${escapeHTML(token.value)}$$</pre>`);
				continue;
			}
			if (token.type === "inline") {
				current += renderInlineToken(token);
				continue;
			}

			let pieces = token.value.split(/(\n{2,})/);
			for (let piece of pieces) {
				if (/^\n{2,}$/.test(piece)) {
					flushParagraph();
				}
				else {
					current += escapeHTML(piece).replace(/\n/g, "<br>");
				}
			}
		}
		flushParagraph();
		return blocks.join("");
	}

	function stripDelimiters(tex) {
		tex = normalizeMathText(tex).trim();
		let pairs = [["\\[", "\\]"], ["\\(", "\\)"], ["$$", "$$"], ["$", "$"]];
		for (let [open, close] of pairs) {
			if (tex.startsWith(open) && tex.endsWith(close) && tex.length >= open.length + close.length) {
				return normalizeMathText(tex.slice(open.length, -close.length).trim());
			}
		}
		return tex;
	}

	function hasOnlyWrapperPath(node, ancestor) {
		while (node && node !== ancestor) {
			for (let sibling of node.parentNode?.childNodes || []) {
				if (sibling === node) continue;
				if (sibling.nodeType === 3 && !sibling.textContent.trim()) continue;
				if (sibling.nodeType === 8) continue;
				return false;
			}
			node = node.parentNode;
		}
		return node === ancestor;
	}

	function isDisplayMath(element) {
		if (element.getAttribute?.("display") === "block") return true;
		let displayContainer = element.closest?.(".katex-display, .math-display, .display-math, [data-display='true']");
		return Boolean(displayContainer);
	}

	function createMathNode(doc, tex, display) {
		let element = doc.createElement(display ? "pre" : "span");
		element.className = "math";
		element.textContent = (display ? "$$" : "$") + tex + (display ? "$$" : "$");
		return element;
	}

	function getAnnotationTex(mathElement) {
		for (let annotation of mathElement.querySelectorAll?.("annotation") || []) {
			let encoding = (annotation.getAttribute("encoding") || "").toLowerCase();
			if (["application/x-tex", "application/x-latex", "text/x-tex"].includes(encoding)) {
				return stripDelimiters(annotation.textContent);
			}
		}
		return "";
	}

	function isNativeZoteroMath(root) {
		for (let element of root.querySelectorAll(NATIVE_MATH_SELECTOR)) {
			let text = element.textContent.trim();
			if (element.matches("pre.math") && text.startsWith("$$") && text.endsWith("$$")) return true;
			if (element.matches("span.math") && text.startsWith("$") && text.endsWith("$")) return true;
		}
		return false;
	}

	function replaceFormulaElement(root, element, tex, display) {
		tex = stripDelimiters(tex);
		if (!tex || !root.contains(element)) return false;

		let target = display
			? element.closest?.(".katex-display, .math-display, .display-math") || element
			: element.closest?.(".katex, mjx-container") || element;
		let paragraph = target.closest?.("p");
		if (display && paragraph && root.contains(paragraph) && hasOnlyWrapperPath(target, paragraph)) {
			target = paragraph;
		}

		target.replaceWith(createMathNode(root.ownerDocument, tex, display));
		return true;
	}

	function convertRichHTML(html, sourceDocument) {
		if (!html || !sourceDocument) return null;
		let doc = sourceDocument.implementation?.createHTMLDocument?.("");
		if (!doc && sourceDocument.defaultView?.DOMParser) {
			doc = new sourceDocument.defaultView.DOMParser().parseFromString("<html><body></body></html>", "text/html");
		}
		if (!doc) return null;
		let root = doc.createElement("div");
		root.innerHTML = html;
		doc.body.appendChild(root);

		if (isNativeZoteroMath(root)) {
			return { alreadyNative: true, formulaCount: 0, html };
		}

		let formulaCount = 0;
		for (let math of Array.from(root.querySelectorAll("math"))) {
			let tex = getAnnotationTex(math);
			if (tex && replaceFormulaElement(root, math, tex, isDisplayMath(math))) {
				formulaCount++;
			}
		}

		for (let element of Array.from(root.querySelectorAll("[data-latex], [data-tex], script[type^='math/tex']"))) {
			if (!root.contains(element) || element.closest(NATIVE_MATH_SELECTOR)) continue;
			let tex = element.getAttribute("data-latex")
				|| element.getAttribute("data-tex")
				|| element.textContent;
			let display = isDisplayMath(element) || (element.getAttribute("type") || "").includes("mode=display");
			if (replaceFormulaElement(root, element, tex, display)) formulaCount++;
		}

		return { alreadyNative: false, formulaCount, html: root.innerHTML };
	}

	function convertClipboard({ html = "", text = "", document = null } = {}) {
		let plain = tokenize(text);
		let rich = convertRichHTML(html, document);
		if (rich?.alreadyNative) return null;

		if (rich?.formulaCount && rich.formulaCount >= plain.formulaCount) {
			return { html: rich.html, formulaCount: rich.formulaCount, source: "rich-html" };
		}
		if (plain.formulaCount) {
			return { html: renderPlainText(plain), formulaCount: plain.formulaCount, source: "plain-text" };
		}
		if (rich?.formulaCount) {
			return { html: rich.html, formulaCount: rich.formulaCount, source: "rich-html" };
		}
		return null;
	}

	return {
		convertClipboard,
		convertRichHTML,
		escapeHTML,
		renderPlainText,
		stripDelimiters,
		tokenize,
	};
})();

if (typeof module !== "undefined" && module.exports) {
	module.exports = GPTMathFormulaConverter;
}
