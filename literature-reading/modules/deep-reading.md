# Staged deep reading and adaptive translation

## Stage contract

At each stage state: goal, source range, cognitive load, must-master items, skippable details, deliverable, and stopping point. Reuse existing notes and `reading-state.yaml`; do not restart completed stages without reason.

Read `paper-anchor-protocol.md` completely before any deep-reading action. Treat the paper, not a generic lesson sequence, as the progress axis. Divide work into complete source units: a coherent paragraph cluster, key formula chain, theorem/proof, algorithm block, or figure/table with its explanatory prose.

Before the first unit, perform anchor pre-scan. Build the section/page index, numbered-object index, source-quality warnings, recommended deep/skim/defer scope, and first Zotero anchor. Pre-scan establishes navigation only and never counts as explained paper content.

For every unit use the sequence `论文主线 -> 知识补偿 -> 返回锚点`. A prerequisite detour must preserve the exact return location. Do not advance paper progress during a detour.

## English handling

- Abstract, definitions, contributions, and key conclusions: provide a short original excerpt, faithful Chinese translation, plain explanation, and logical role. Respect quotation limits when using external sources.
- Ordinary background: translate/explain by paragraph, not sentence mechanically.
- Complex sentences: identify main clause, modifiers, logical connectors, and referents.
- First terminology occurrence: `中文（English, abbreviation）`; keep one translation thereafter.
- Formula-adjacent text: explain how prose constrains or motivates the formula.
- Ambiguity: present alternatives and label `【未能确认】` if unresolved.

## Reading output

For each source unit record: Zotero page, section/subsection, numbered object, short opening phrase, Zotero link, author purpose, claims, dependencies, method logic, evidence, hidden assumptions, confusing points, and role in the paper's argument. Ordinary checks use 2–3 short questions. For a core algorithm ask the learner to explain input, state, update loop, output, and guarantee in their own words.

Track `located`, `explained`, and `understood` separately. The Skill may set `located` and `explained` from verified evidence; only user confirmation or a passed understanding check may set `understood`.
