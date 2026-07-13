# Codex 文献阅读 Skill 与 ADP 工作区

本交付包含两个相互分离的部分：

- `literature-reading/`：可安装到 Codex 全局 Skills 目录的通用 Skill。
- `literature-workspace/`：个人 ADP 自适应最优控制与机械臂控制文献工作区。

## 已实现能力

- 智能双模式：快速筛选与分阶段导师式精读。
- 跨专业知识补偿、普通公式逻辑解释、关键算法教材级推导、证明分层展开。
- 严格溯源标签与自动分层外部资料补充。
- 图表审查、论文—代码映射、复现计划与代码审查。
- Zotero Markdown 双版本笔记、citation key 命名、双轨符号和维度检查。
- Markdown 层级树、Mermaid 与复杂方法 ASCII 主线。
- 个人知识地图、研究问题漏斗、分级写入、版本记录与阶段复盘。
- 四篇 ADP 论文集的横向分析、排序、预备课、符号表与复现计划占位配置。

## 入口

- 安装步骤：[INSTALL.md](INSTALL.md)
- 常用命令：[literature-workspace/COMMANDS.md](literature-workspace/COMMANDS.md)
- 示例工作流：[EXAMPLE-WORKFLOW.md](EXAMPLE-WORKFLOW.md)
- 自检清单：[SELF-CHECK.md](SELF-CHECK.md)
- Git 版本维护：[GIT-WORKFLOW.md](GIT-WORKFLOW.md)
- 个人画像：[literature-workspace/learner-profile.md](literature-workspace/learner-profile.md)

## 版本维护原则

本交付目录是 Git 维护源，全局 Skills 目录是安装副本。Skill、Markdown/YAML 知识库、阅读状态和复盘记录纳入版本控制；PDF、数据集、模型权重、缓存和外部仓库默认排除。当前版本见 `VERSION`。

## 四篇论文上传后的首条命令

`使用 $literature-reading 初始化这四篇 ADP 论文：先横向分析关系，再生成自适应阅读顺序和预备课程。`
