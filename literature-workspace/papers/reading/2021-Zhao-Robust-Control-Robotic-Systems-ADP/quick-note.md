---
title: "基于自适应动态规划的机器人系统鲁棒控制研究"
authors: ["赵军"]
year: 2021
venue: "昆明理工大学博士学位论文"
doi: ""
citation_key: ""
language: "Chinese"
research_domain: ["ADP", "robot manipulator control", "robust control", "output feedback"]
control_task: "robot robust regulation, tracking, and output-feedback tracking"
system_type: "serial industrial robot; PUMA560 simulation and SCARA experiment"
reading_status: "screened_and_map_read"
relevance: "very_high"
difficulty: "high_by_chapter"
source_file: "inbox/基于自适应动态规划的机器人系统鲁棒控制研究_赵军.pdf"
code_repository: ""
last_updated: "2026-07-13"
---

# 快速复习：赵军博士论文 (2021)

## 一句话结论

【论文原文】论文围绕不确定机器人系统，依次研究 ADP 鲁棒镇定、ADP 鲁棒跟踪、输入/输出数据驱动输出反馈鲁棒控制和输出反馈鲁棒跟踪，并以 PUMA560 和 SCARA 验证。

## 原文位置

- PDF p. 5–6：中文摘要与四项研究内容。
- PDF p. 10–12：目录与章节依赖。
- PDF p. 127–129：成果、创新点和作者承认的局限。
- PDF p. 147：博士期间发表成果，列出 P3。

## 研究结构

```text
第1章 领域地图
  -> 第2章 ADP 机器人鲁棒镇定
  -> 第3章 ADP 机器人鲁棒跟踪
  -> 第4章 输入/输出数据驱动输出反馈鲁棒控制
  -> 第5章 输入/输出数据驱动输出反馈鲁棒跟踪
  -> 第6章 总结与局限
```

## 与 P3 的关系

【推断解释】第 2 章与 P3 共享鲁棒—最优等价、单 Critic 和参数估计误差路线；论文成果页也列出 P3，因此第 2 章可作为该方法的机器人化扩展入口。正式精读时仍需逐式核对。

## 关键工程证据

【论文原文】论文使用 PUMA560 仿真和自制 SCARA 平台实验，声称在模型误差下具有较快收敛、较低能耗和鲁棒性（PDF p. 6、p. 127–128）。

## 局限

【论文原文】作者承认输出反馈跟踪参数维数高、复杂参考信号受硬件计算能力限制，速度/力矩难测且数值微分对噪声敏感，实验平台只有 2 自由度（PDF p. 129）。

【批判性分析】这些局限比摘要中的性能主张更值得用于后续选题，但需要外部检索确认是否已被后续工作解决。

## 阅读建议

先地图式阅读，再在 P3 后精读第 2 章；第 3–5 章按“跟踪”和“输出反馈”研究需求逐章进入，不建议一次读完 150 页。
