# Paper anchor protocol

Use this protocol whenever beginning, continuing, or resuming deep reading. Its purpose is to make every explanation answer: “Where exactly are we in the paper?”

## 1. Verify the source before teaching

Identify the paper and attachment by title, DOI/citation key when available, Zotero item/attachment key, file fingerprint or version note, and Zotero PDF page count. Detect missing pages, broken OCR, mismatched versions, or extraction errors.

If page, section, or numbered-object location cannot be verified:

- label the claim `【未能确认】`;
- do not mark the source unit explained or advance paper progress;
- try a rendered page/crop, a better extraction method, or a reliable copy;
- allow background tutoring only under `【知识补偿】` and keep it outside paper progress.

## 2. Pre-scan anchors

Before the first deep-reading unit, record:

- Zotero PDF page-to-section map;
- equations, theorems, algorithms, figures, and tables by number and page;
- abstract, claimed contributions, method entry, experiments, and conclusion;
- source-quality warnings and version differences;
- recommended deep-read, skim, and defer scope;
- the first unit and its Zotero link.

Pre-scan is navigation work, not reading completion.

## 3. Display the navigation map

At the start of every session or `继续精读`, show a compact section tree using:

- `✅` explained or understood;
- `▶` current;
- `⏳` unread;
- `⏭` deliberately deferred.

Show the current Zotero page, section, equation/figure/table/algorithm number, short opening phrase, logical role, previous unit, next unit, and Zotero link. Report verified scopes, never a fabricated percentage.

## 4. Teach one complete source unit

A unit is exactly one coherent paragraph cluster, formula chain, theorem/proof, algorithm block, or figure/table with its explanatory prose. Use [../templates/deep-reading-unit.md](../templates/deep-reading-unit.md).

Keep these content classes separate:

1. `【论文原文】`: shortest necessary excerpt plus exact location.
2. `【中文翻译】`: faithful translation without added conclusions.
3. `【学习解释】`: meaning, author intent, and role in the whole paper.
4. `【知识补偿】`: only the prerequisite needed to resume the source.
5. `【推断解释】` or `【批判性分析】`: analysis with explicit basis.
6. `【返回锚点】`: the exact next source location and Zotero link.

Use the mandatory mainline pattern:

```text
【论文主线】current verified source
       ↓
【知识补偿】temporary detour; progress frozen
       ↓
【返回锚点】resume the same source chain
```

## 5. Record truthful progress

Use independent unit states:

- `unread`
- `located`
- `explained`
- `needs_prerequisite`
- `needs_restatement`
- `understood`
- `needs_review`
- `deferred`

The Skill may set `located` and `explained` after source verification. Set `understood` only after explicit user confirmation or a passed check. Record the reason and revisit condition for `deferred`.

Only verified source content that has actually been explained advances paper progress. Examples, generic derivations, external materials, and prerequisite lessons do not.

## 6. Synchronize safely

After each unit update:

- the Zotero full-note navigation map;
- the corresponding unit block;
- local `reading-state.yaml` with completed scope, current anchor, return anchor, next anchor, detours, open questions, and check status;
- workspace `changelog.md` for consequential corrections or version conflicts.

When opening a schema v1 reading state, migrate `current_location.page` to `current_location.zotero_page`, preserve all existing stage/open-question data, initialize new anchor fields empty, and record the migration. Never replace an existing state file from the template wholesale.

When Zotero and local state conflict, re-check the paper source and Zotero annotations. Repair both from verified evidence and record the resolution.

## 7. Interpret control commands

- `继续精读`: resume from the saved exact anchor.
- `我读到哪了`: show the navigation map and current state.
- `回到论文`: stop the prerequisite detour and use the return anchor.
- `打开当前位置`: return the current Zotero deep link.
- `展开这个公式`: apply the key-formula chain and textbook-level derivation.
- `查看前后文`: show source context and logical neighbors.
- `重新讲解`: switch to intuition, engineering example, numeric example, or code mapping without advancing progress.
- `标记已理解`: run/record the understanding confirmation.
- `暂时跳过`: record reason and revisit condition, then move to the next verified unit.
