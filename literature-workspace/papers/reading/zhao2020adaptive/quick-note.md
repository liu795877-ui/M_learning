---
title: "Adaptive dynamic programming based robust control of nonlinear systems with unmatched uncertainties"
authors: ["Jun Zhao", "Jing Na", "Guanbin Gao"]
year: 2020
venue: "Neurocomputing 395, 56–65"
doi: "10.1016/j.neucom.2020.02.025"
citation_key: "zhao2020adaptive"
language: "English"
research_domain: ["ADP", "robust nonlinear control", "unmatched uncertainties"]
control_task: "robust regulation"
system_type: "continuous-time nonlinear uncertain system"
reading_status: "screened"
relevance: "very_high"
difficulty: "very_high"
source_file: "inbox/Zhao 等 - 2020 - Adaptive dynamic programming based robust control of nonlinear systems with unmatched uncertainties.pdf"
code_repository: ""
last_updated: "2026-07-13"
---

# 快速复习：Zhao, Na & Gao (2020)

## 一句话结论

【论文原文】本文把含不匹配不确定性的非线性鲁棒控制问题转化为辅助标称系统的最优控制问题，并用单 Critic 与参数估计误差自适应律在线求解。

## 关键原文

**原文位置**：PDF p. 1，Abstract。

> “transform the robust control problem into an equivalent optimal control problem”

**中文翻译**：把鲁棒控制问题转化为一个等价的最优控制问题。

**学习解释**：作者先改变问题表达，使“不确定系统怎样鲁棒稳定”变为“构造出的标称辅助系统怎样最优”，然后使用 ADP 近似 HJB 解。

**全文作用**：这是本文所有算法与证明的逻辑起点；如果等价关系不成立，后面的单 Critic 学习就不能推出原系统鲁棒稳定。

## 方法主线

```text
不匹配不确定性
  -> 伪逆投影分成匹配部分和残差
  -> 引入辅助控制与构造代价
  -> 证明鲁棒问题等价于最优问题
  -> 单 Critic 逼近 HJB
  -> 参数估计误差驱动更新
  -> 稳定与收敛证明
```

## 必须先学

- P1 的 HJB、价值函数逼近、PE 与 Lyapunov 主线。
- 匹配/不匹配不确定性、Moore–Penrose 伪逆、投影矩阵。
- 辅助系统、鲁棒稳定、不确定性上界。

## 可信度与局限

【批判性分析】本文的核心价值是问题转化和单 Critic 收敛设计；但只有两个仿真例，尚未证明在机械臂传感噪声、力矩饱和和实时计算约束下可直接工作。

## 阅读建议

在 P1 之后精读。Sec. 2 的等价性与 Sec. 3 的自适应律必须逐式理解，不能只看框图和仿真。
