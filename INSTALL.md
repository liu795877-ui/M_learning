# 安装与启动

## 全局 Skill

将 `literature-reading/` 目录完整复制到 Codex Skills 目录：

```text
C:\Users\LENOVO\.codex\skills\literature-reading
```

本次交付已按该位置准备安装。后续请在 Git 源仓库根目录运行 `scripts/sync-skill.ps1` 同步安装副本，并重新启动或刷新 Codex。

## 个人工作区

`literature-workspace/` 可以放在任意长期研究目录。不要把它放进全局 Skill 目录，以免升级 Skill 时覆盖个人数据。

## 首次运行

1. 将四篇 PDF 放到 `literature-workspace/inbox/`；建议以 `01-` 至 `04-` 前缀保留导师顺序。
2. 提供 Zotero citation key、代码仓库和截图（如有）。
3. 在 Codex 中进入工作区并运行：

   `使用 $literature-reading 初始化这四篇 ADP 论文：先横向分析关系，再生成自适应阅读顺序和预备课程。`

4. 审阅 `adp-paper-set/` 中生成的候选关系、排序和预备课。
5. 输入：`开始精读推荐顺序的第一篇。`

## 更新 Skill

更新 `literature-reading/` 时不要覆盖 `literature-workspace/`。重要知识库变更保存在工作区 `changelog.md`；推断性跨论文内容先进入 `.pending/`。完整 Git 流程见 [GIT-WORKFLOW.md](GIT-WORKFLOW.md)。
