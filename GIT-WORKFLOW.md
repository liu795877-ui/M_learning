# Git 版本维护

本目录是唯一维护源；`C:\Users\LENOVO\.codex\skills\literature-reading` 是安装副本。不要直接在安装副本中长期修改，否则下次同步会产生漂移。

## 日常流程

```powershell
git status
git diff
git add literature-reading literature-workspace
git commit -m "docs(paper): complete one reading stage"
```

知识变更记录在 `literature-workspace/changelog.md`。提交前应按实际文件选择 `git add`，不要机械复制示例命令。

建议提交类型：

- `feat(skill)`：新增 Skill 模块或能力。
- `fix(skill)`：修正规则、链接或模板。
- `docs(paper)`：新增或完善单篇论文笔记。
- `knowledge(...)`：确认后的知识库更新。
- `review(...)`：论文组或阶段复盘。
- `chore(release)`：版本号、打包与发布维护。

## 发布版本

1. 检查差异和待确认内容。
2. 运行 Skill、链接、YAML 和 Markdown 校验。
3. 按语义化版本更新 `VERSION`。
4. 更新 `literature-workspace/changelog.md`。
5. 提交并创建带说明的标签，例如：

```powershell
git commit -m "chore(release): prepare v0.2.0"
git tag -a v0.2.0 -m "Add new literature domain and knowledge workflow"
```

## 同步全局 Skill

在仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-skill.ps1
```

该脚本只同步 `literature-reading/`，不会把个人工作区复制到全局 Skills。

## 回退

优先使用可追溯的反向提交：

```powershell
git log --oneline --decorate
git show <commit>
git revert <commit>
```

不要使用 `git reset --hard` 或强制推送，除非明确理解会丢失什么并专门授权。

## 远程仓库

默认保持本地仓库。需要 GitHub/GitLab 时，先确认使用私有仓库、检查敏感研究信息和大文件，再单独执行添加远程与推送。
