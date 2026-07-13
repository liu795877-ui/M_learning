# ADP 文献工作区

这是个人数据区，与全局 `literature-reading` Skill 分离。升级 Skill 不应覆盖此目录。

## 首次使用

1. 将导师给出的四篇 PDF 放入 `inbox/`。如有 Zotero citation key、导师顺序、截图和代码仓库，也一并提供。
2. 在 Codex 中输入：`使用 $literature-reading 初始化这四篇 ADP 论文：先横向分析关系，再生成自适应阅读顺序和预备课程。`
3. 检查 `adp-paper-set/` 的横向表、排序与前置知识，再输入：`开始精读推荐顺序的第一篇。`
4. 每个阶段结束后确认理解题；完成后生成 Zotero 双版本笔记。

## 文件流转

- 新材料：`inbox/`
- 精读中：`papers/reading/<citation-key>/`
- 已完成：`papers/completed/<citation-key>/`
- 暂缓：`papers/skipped/<citation-key>/`
- 跨论文候选结论：`.pending/`
- 确认后的长期知识：`knowledge-base/`

## 单篇论文目录

优先使用 Zotero citation key；没有时使用 `YYYY-FirstAuthor-Short-Title`。目录内采用 `quick-note.md`、`full-note.md`、`formula-notes.md`、`figure-notes.md`、`code-map.md` 和 `reading-state.yaml`。

## 写入原则

元数据和原文定位可以直接写入；单篇解释进入论文笔记；跨论文关系、创新判断、研究问题和知识等级提升先进入待确认区。任何重要更新都记录在 `changelog.md`。
