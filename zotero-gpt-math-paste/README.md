# GPT Math Paste for Zotero

把从 ChatGPT 复制的公式自动转换为 Zotero 笔记中的**原生可编辑公式**，而不是图片或普通文本。

## 支持范围

- ChatGPT/KaTeX 剪贴板中的 MathML + TeX annotation
- 行内公式：`\(...\)` 与 `$...$`
- 独立公式：`\[...\]` 与 `$$...$$`
- GPT 纯文本复制格式：数学特征明显的 `(f(x))`、`(A)` 行内公式，以及 `[...]` 独立公式块
- 自动修正 GPT 常见的 `\_` 下标转义，并清除公式块中的纯等号分隔线和行首 Markdown `#`
- 保留 ChatGPT 富文本中的段落、列表、粗体和链接
- 跳过代码块、行内代码、金额和未配对的定界符
- 已经是 Zotero 原生公式的内容交回 Zotero 自己处理

转换后的 Zotero 笔记 HTML 为：

```html
<span class="math">$x^2+y^2$</span>
<pre class="math">$$\frac{a}{b}$$</pre>
```

这正是 Zotero 7-10 笔记编辑器使用的公式节点格式，所以粘贴后可以双击继续编辑 LaTeX。

## 安装

1. 打开 Zotero。
2. 进入“工具 -> 插件”。
3. 点击右上角齿轮，选择“Install Plugin From File...”。
4. 选择 `build/zotero-gpt-math-paste-0.1.3.xpi`。
5. 打开任意 Zotero 笔记，直接从 ChatGPT 复制并粘贴。

安装后默认启用。可在 Zotero 的“工具”菜单中取消勾选 `GPT Math Paste: 自动转换公式`，临时停用自动转换。

## 本地开发

需要 Node.js 20+ 与 PowerShell 7/Windows PowerShell 5.1。

```powershell
npm install
npm test
npm run build
```

插件没有运行时第三方依赖；`linkedom` 仅用于测试剪贴板 HTML 转换。

## 已知边界

- 富文本中的公式必须带 TeX annotation（ChatGPT 当前的 KaTeX 复制格式包含它）。只有渲染后的 MathML、没有 TeX 源码时，插件不会猜测公式。
- Zotero 的笔记编辑器属于内部实现。本插件已对 Zotero 7 的源码接口和本机 Zotero 9.0.6 的打包源码做过核对；版本清单允许 Zotero 6.999-10.*，大版本更新后仍应重新运行测试并做一次手动粘贴验证。
