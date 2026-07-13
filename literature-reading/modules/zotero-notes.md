# Zotero Markdown and citation workflow

Create two notes per completed paper:

- `quick-note.md`: fast recall of problem, method, contribution, evidence, limitations, relevance, and next use.
- `full-note.md`: prerequisite lesson, staged analysis, formula/proof cards, figures, experiments, code mapping, critique, research implications, and learning checks.

Use citation key as directory identity when stable; otherwise use `YYYY-FirstAuthor-Short-Title`. Keep aliases in indexes if renamed. Preserve title, authors, year, venue, DOI, citation key, language, domain, task, system type, status, relevance, difficulty, source file, repository, and update date in YAML frontmatter.

Use `[@citationKey]` where supported. Identify foundational, source-method, and comparison papers; propose missing items for Zotero import with DOI and reason. Verify primary sources before reusing important claims.

Markdown rules: blank lines around headings, lists, and display formulas; `$...$` inline; standalone `$$` delimiters on separate lines; `aligned` for multi-line derivations; no `\(...\)` or `\[...\]`. Avoid HTML folding as a default.

Always include:

1. a Markdown hierarchy tree;
2. editable Mermaid source;
3. an ASCII mainline for complex methods.

Mermaid is supplementary: the hierarchy tree must remain understandable in Zotero without rendering.
