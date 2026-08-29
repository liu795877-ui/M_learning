# Zotero Markdown and citation workflow

Create two notes per completed paper:

- `quick-note.md`: fast recall of problem, method, contribution, evidence, limitations, relevance, and next use.
- `full-note.master.md`: Git-tracked canonical note for prerequisite lessons, staged analysis, formulas/proofs, figures, experiments, code mapping, critique, research implications, and learning checks.
- `full-note.md`: optional Better Notes bidirectional mirror. Zotero owns this file; Codex must not edit it directly.

## Better Notes isolation protocol

Never let Git/Codex and Better Notes share a writable source-of-truth file. A file containing Better Notes fields such as `$version`, `$libraryID`, or `$itemKey` is a sync artifact unless the project explicitly says otherwise.

1. Read `project-config.yaml` and resolve `notes.full` as the master and `notes.zotero_mirror` as the mirror.
2. Edit only the master. Keep it free of Better Notes synchronization fields.
3. Before publishing, run `scripts/zotero-note-bridge.ps1 -Action Status -PaperDirectory <dir>`.
4. If the mirror changed since the baseline, run `Capture`; compare and merge user additions into the master. Do not publish over it.
5. Run `Publish` only after the master passes structural checks. The bridge backs up the mirror, preserves its Better Notes identifiers, writes the master into the mirror, and records a new baseline.
6. Treat abrupt shrinkage, missing headings, an unclosed frontmatter block, or `TypeError`/serialization text as corruption. Preserve the mirror for diagnosis and restore only from the master or Git.

Git should track the master and ignore the mirror, Better Notes attachments, synchronization state, and automatic conflict copies.

Use citation key as directory identity when stable; otherwise use `YYYY-FirstAuthor-Short-Title`. Keep aliases in indexes if renamed. Preserve title, authors, year, venue, DOI, citation key, language, domain, task, system type, status, relevance, difficulty, source file, repository, and update date in YAML frontmatter.

Use `[@citationKey]` where supported. Identify foundational, source-method, and comparison papers; propose missing items for Zotero import with DOI and reason. Verify primary sources before reusing important claims.

Markdown rules: blank lines around headings, lists, and display formulas; `$...$` inline; standalone `$$` delimiters on separate lines; `aligned` for multi-line derivations; no `\(...\)` or `\[...\]`. Avoid HTML folding as a default.

Always include:

1. a Markdown hierarchy tree;
2. editable Mermaid source;
3. an ASCII mainline for complex methods.

Mermaid is supplementary: the hierarchy tree must remain understandable in Zotero without rendering.

## Zotero anchors and evidence

- Use the page number displayed by the Zotero PDF reader as the canonical page coordinate. Do not add a second printed-journal page coordinate unless the user later requests it.
- When the Zotero item/attachment key is available, provide a `zotero://open-pdf/...` deep link to the page; otherwise write `Zotero PDF p. X` and mark the missing key.
- Link an existing Zotero annotation for a key formula, figure, table, or algorithm when available.
- For key formulas, complex figures, algorithm blocks, and suspected typesetting errors, keep a local evidence crop next to the explanation. Still transcribe formulas as copyable LaTeX. Never guess an unreadable character.
- Keep a readable navigation map at the top of the Zotero full note and synchronize its deterministic state with `reading-state.yaml`.
- Update an existing unit by its paper ID, Zotero page, section, and numbered object. Do not create duplicates. Preserve dated corrections and PDF-version changes rather than silently overwriting them.

Use [../templates/deep-reading-unit.md](../templates/deep-reading-unit.md) for each source-grounded unit.
