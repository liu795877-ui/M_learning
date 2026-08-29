const test = require("node:test");
const assert = require("node:assert/strict");
const { parseHTML } = require("linkedom");
const converter = require("../content/formula-converter.js");

test("converts ChatGPT slash delimiters to Zotero math nodes", () => {
	let result = converter.convertClipboard({
		text: "Inline \\(x^2 + y^2\\) and display:\n\\[\\frac{a}{b}\\]",
	});
	assert.equal(result.formulaCount, 2);
	assert.equal(result.source, "plain-text");
	assert.match(result.html, /<span class="math">\$x\^2 \+ y\^2\$<\/span>/);
	assert.match(result.html, /<pre class="math">\$\$\\frac\{a\}\{b\}\$\$<\/pre>/);
});

test("converts dollar-delimited inline and block formulas", () => {
	let result = converter.convertClipboard({
		text: "Use $K_{k+1}=K_k$ first.\n\n$$\nA^TP+PA=-Q\n$$",
	});
	assert.equal(result.formulaCount, 2);
	assert.match(result.html, /<span class="math">\$K_\{k\+1\}=K_k\$<\/span>/);
	assert.match(result.html, /<pre class="math">\$\$A\^TP\+PA=-Q\$\$<\/pre>/);
});

test("converts GPT plain parentheses and square-bracket formula blocks", () => {
	let result = converter.convertClipboard({
		text: "假设有任意函数 (f(x))，并任意选择矩阵 (A)。总能定义：[\n\\mathcal F\\_A(x)=f(x)-Ax.\n]而不同分解满足：[\nA\\_1x+\\mathcal F\\_1(x)\n======================\n\n# A\\_2x+\\mathcal F\\_2(x)\n\nf(x).\n]",
	});
	assert.equal(result.formulaCount, 4);
	assert.match(result.html, /假设有任意函数 <span class="math">\$f\(x\)\$<\/span>，并任意选择矩阵 <span class="math">\$A\$<\/span>/);
	assert.match(result.html, /<pre class="math">\$\$\\mathcal F_A\(x\)=f\(x\)-Ax\.\$\$<\/pre>/);
	assert.match(result.html, /A_1x\+\\mathcal F_1\(x\)\nA_2x\+\\mathcal F_2\(x\)\nf\(x\)\./);
});

test("does not convert numeric parentheses, citations, or ordinary prose", () => {
	let result = converter.convertClipboard({
		text: "数字 (10)、引用 [1] 和说明 (见上文) 都应保持原样。链接 [文本](https://example.com)。",
	});
	assert.equal(result, null);
});

test("does not convert currency, unmatched delimiters, or code spans", () => {
	let result = converter.convertClipboard({
		text: "Costs $20 and `code $x$` plus an unmatched $value.",
	});
	assert.equal(result, null);
});

test("escapes HTML without changing LaTeX backslashes", () => {
	let result = converter.convertClipboard({ text: "\\(x < y & y > 0\\)" });
	assert.equal(result.html, '<span class="math">$x &lt; y &amp; y &gt; 0$</span>');
});

test("extracts TeX annotations from ChatGPT KaTeX HTML", () => {
	let { document } = parseHTML("<html><body></body></html>");
	let html = [
		"<p>Result <span class=\"katex\">",
		"<span class=\"katex-mathml\"><math><semantics><mrow></mrow>",
		"<annotation encoding=\"application/x-tex\">x^2+y^2</annotation>",
		"</semantics></math></span><span class=\"katex-html\">rendered duplicate</span>",
		"</span>.</p>",
	].join("");
	let result = converter.convertClipboard({ html, text: "Result x2+y2.", document });
	assert.equal(result.formulaCount, 1);
	assert.equal(result.source, "rich-html");
	assert.match(result.html, /Result <span class="math">\$x\^2\+y\^2\$<\/span>\./);
	assert.doesNotMatch(result.html, /rendered duplicate/);
});

test("creates a display node for block MathML", () => {
	let { document } = parseHTML("<html><body></body></html>");
	let html = '<p><span class="katex-display"><span class="katex"><math display="block"><annotation encoding="application/x-tex">\\sum_i x_i</annotation></math></span></span></p>';
	let result = converter.convertClipboard({ html, text: "sum", document });
	assert.equal(result.html, '<pre class="math">$$\\sum_i x_i$$</pre>');
});

test("leaves native Zotero formula HTML to Zotero itself", () => {
	let { document } = parseHTML("<html><body></body></html>");
	let result = converter.convertClipboard({
		html: '<p><span class="math">$x+y$</span></p>',
		text: "$x+y$",
		document,
	});
	assert.equal(result, null);
});
