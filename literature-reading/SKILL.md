---
name: literature-reading
description: Read, screen, teach, compare, reproduce, and critically assess academic papers with strict source tracing, cross-disciplinary prerequisite tutoring, formula/proof explanation, paper-to-code mapping, Zotero Markdown notes, and a persistent research knowledge base. Use for PDF papers, Zotero items or notes, paper screenshots, companion repositories, multi-paper reading sets, ADP/adaptive optimal control, robot control, machine vision, research-direction discovery, literature screening, deep reading, formula derivation, figure analysis, reproduction planning, or requests such as 快速筛选、精读论文、解释公式、对照代码、生成 Zotero 笔记、更新知识库、阶段复盘.
---

# Literature Reading

Use a mentor-style, evidence-first workflow for a software-engineering student crossing into mechanical engineering. Preserve the user's project data separately from this global skill.

## Start every task

1. Locate the project workspace. Prefer a user-specified path; otherwise search upward for `project-config.yaml`. If none exists, use the bundled templates to propose or create one only when the user authorized file creation.
2. Read `project-config.yaml`, `learner-profile.md`, and the current paper's `reading-state.yaml` when present.
3. Inspect available inputs: PDF, Zotero metadata/note, screenshots, repository, existing notes, and previous reading state. Do not claim to have read unavailable material.
4. Select the minimum relevant files below and read each selected file completely before acting.
5. State the current mode, scope, source boundary, and next stopping point.

## Route the request

- Quick screening, multi-paper triage, ordering: read [modules/paper-screening.md](modules/paper-screening.md).
- Staged deep reading, translation, teaching, checks: read [modules/deep-reading.md](modules/deep-reading.md), [modules/paper-anchor-protocol.md](modules/paper-anchor-protocol.md), and [modules/prerequisite-tutor.md](modules/prerequisite-tutor.md).
- Formula, algorithm, theorem, proof: also read [modules/formula-and-proof.md](modules/formula-and-proof.md).
- Figures, tables, curves, screenshots: read [modules/figure-analysis.md](modules/figure-analysis.md).
- Repository mapping, reproduction, code audit: read [modules/paper-code-map.md](modules/paper-code-map.md).
- Zotero notes, citation keys, diagrams: read [modules/zotero-notes.md](modules/zotero-notes.md).
- Persistent concepts, relationships, research questions, reviews: read [modules/knowledge-base-update.md](modules/knowledge-base-update.md).
- Git versioning, release, rollback, and installation sync: read [modules/version-control.md](modules/version-control.md).
- ADP or adaptive optimal control: read [domains/adp-control.md](domains/adp-control.md).
- Manipulator/robot control: read [domains/robot-control.md](domains/robot-control.md).
- Vision, 3D vision, point cloud: read [domains/machine-vision.md](domains/machine-vision.md).

## Use intelligent dual mode

### Quick mode

Produce a bounded screening report: problem, importance, claimed contribution, evidence, relevance, difficulty, prerequisites, credibility, recommended sections, and `精读 / 补背景后精读 / 仅作参考 / 暂缓` recommendation. Stop before a long tutorial unless asked.

### Deep mode

Before teaching, build a verifiable Zotero/PDF anchor index. Then proceed through complete source-grounded units rather than detached numbered lessons:

1. Source inventory and quick positioning.
2. Minimal prerequisite course.
3. Argument and technical-route map.
4. Core method and symbol dictionary.
5. Formula, algorithm, and proof analysis.
6. Figures, experiments, and credibility.
7. Paper-code mapping or reproduction when sources exist.
8. Research implications and research-question funnel.
9. Quick/full Zotero notes, reading state, and proposed knowledge updates.

Pause after each source unit unless the user requests one-pass output. Use 2–3 short checks for ordinary content; require the user to restate core algorithms or proofs in their own words. Save the exact current and return anchors. Never count prerequisite tutoring or an anchor pre-scan as paper-reading progress.

## Enforce source labels

Label material at paragraph or claim level:

- `【论文原文】`: explicitly supported by the current paper; add section/page/equation/figure/table location.
- `【基础知识】`: external prerequisite knowledge; cite the external source.
- `【推断解释】`: a reasoned inference from paper text, equations, figures, or code; state the basis.
- `【批判性分析】`: an evaluation of novelty, validity, fairness, limitations, or transferability.
- `【未能确认】`: insufficient or unreadable evidence; never guess.

Never convert a secondary citation into an original-source conclusion. Distinguish the author's claimed novelty, confirmed novelty, experimentally supported claims, and unverified claims.

## External supplementation

Automatically fill only knowledge gaps necessary for the current reading. Prefer, in order: textbooks or authoritative university courses; authoritative reviews; original method papers; official code/project documentation; other high-quality primary papers. Use current web/library tools when a source must be verified. Cite all external claims and stop expanding when the paper becomes understandable.

## Respect the learner profile

Default profile: mathematics 2/4; mechanics, control, robotics, vision 0/4; machine learning 2/4; Python 3/4; C++/ROS 3/4; English paper reading 2/4. Teach through intuition, engineering scene, prerequisite chain, small numerical example, derivation, pseudocode/code mapping, then learner restatement. Reuse programming knowledge without assuming control or mechanical intuition.

Never upgrade mastery automatically. Record an evidence-based recommendation and wait for user confirmation before changing `learner-profile.md`.

## Formula, diagram, and Markdown rules

- Ordinary formulas: define every variable, dimension/unit when relevant, role, assumptions, and derivation logic.
- Core algorithms: provide textbook-level derivation when needed; expose omitted steps.
- Proofs: begin with goal, intuition, route, key theorem/inequality, assumptions, and applicability; expand line by line only for core claims or on request.
- Preserve paper symbols locally and maintain a unified cross-paper concept symbol; check matrix/tensor dimensions.
- Zotero Markdown uses `$...$` inline and standalone `$$` blocks with delimiters on separate lines. Do not use `\(...\)` or `\[...\]`.
- Provide a Markdown hierarchy tree and Mermaid source; for complex methods also provide an ASCII mainline.

## Write safely

Follow the schema in [schemas/write-policy.yaml](schemas/write-policy.yaml). Read before editing, patch only relevant sections, preserve uncertain/conflicting content, and append source/date/confidence to consequential updates. Write deterministic metadata to paper records; write explanations to paper notes; route cross-paper relationships, novelty claims, and research ideas to `.pending/` or pending knowledge-base sections until user confirmation. Append `changelog.md`; never overwrite user material silently.

When the workspace is a Git repository, keep one coherent commit per completed reading stage or confirmed knowledge update. Never commit secrets, large source PDFs, datasets, model weights, caches, or nested external repositories. Do not push, publish, rewrite history, or create a remote unless the user explicitly requests it.

Use [templates/quick-note.md](templates/quick-note.md), [templates/full-note.md](templates/full-note.md), [templates/reading-state.yaml](templates/reading-state.yaml), and [schemas/paper-metadata.yaml](schemas/paper-metadata.yaml) when creating artifacts.

## Research priority

Optimize decisions in this order: publishable research > learn supervisor direction > reproduce > improve > master's thesis > review writing > group presentation. Convert limitations into research candidates only through evidence search, theoretical feasibility, engineering feasibility, testable hypothesis, baselines/metrics, risks, and supervisor discussion. Never label a module swap or parameter tweak as innovation without evidence.

## Finish every task

Report: completed scope; evidence boundary; unresolved items; saved files; exact continuation point; pending confirmations; and the next highest-value action. For a paper set, preserve both supervisor order and the recommended adaptive order with reasons.
