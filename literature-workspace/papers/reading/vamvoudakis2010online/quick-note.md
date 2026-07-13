---
title: "Online actor–critic algorithm to solve the continuous-time infinite horizon optimal control problem"
authors: ["Kyriakos G. Vamvoudakis", "Frank L. Lewis"]
year: 2010
venue: "Automatica 46, 878–888"
doi: "10.1016/j.automatica.2010.02.018"
citation_key: "vamvoudakis2010online"
language: "English"
research_domain: ["ADP", "continuous-time nonlinear control", "actor-critic"]
control_task: "infinite-horizon optimal regulation"
system_type: "continuous-time control-affine nonlinear system with known dynamics"
reading_status: "screened"
relevance: "high"
difficulty: "high"
source_file: "inbox/Vamvoudakis和Lewis - 2010 - Online actor–critic algorithm to solve the continuous-time infinite horizon optimal control problem.pdf"
code_repository: ""
last_updated: "2026-07-13"
---

# 快速复习：Vamvoudakis & Lewis (2010)

## 一句话结论

【论文原文】作者提出连续时间非线性系统的同步在线 Policy Iteration，用 Actor 与 Critic 同时逼近最优控制和价值函数，并把闭环稳定纳入在线学习设计。

## 关键原文

**原文位置**：PDF p. 1，Abstract。

> “online algorithm based on policy iteration”

**中文翻译**：一种基于策略迭代的在线算法。

**学习解释**：它不是先离线训练再部署，而是让价值估计与控制策略随系统运行同步更新。

**全文作用**：概括本文的算法身份；后续 Sec. 3–4 分别给出 Critic 与同步 Actor–Critic 更新。

## 方法主线

```text
已知非线性动态 + 初始可容许策略
  -> Critic 逼近当前价值函数
  -> Actor 逼近由价值梯度得到的控制
  -> 同步连续更新
  -> PE 下收敛 + Lyapunov 闭环稳定
```

## 必须先学

- 非线性状态方程与控制仿射形式。
- 无限时域性能指标、价值函数、Hamiltonian 与 HJB。
- 可容许策略、Policy Iteration、Actor–Critic。
- PE 与复合 Lyapunov 函数。

## 可信度与局限

【批判性分析】理论价值高，但系统动态需已知，且工程证据为仿真；不能直接当作“未知机械臂可在线学习”的证据。

## 阅读建议

在 P2 和 ADP 预备课之后精读。重点读 PDF p. 2–7；附录证明先抓路线，再按需要展开。
