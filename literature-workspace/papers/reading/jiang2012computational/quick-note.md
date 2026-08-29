---
title: "Computational adaptive optimal control for continuous-time linear systems with completely unknown dynamics"
authors: ["Yu Jiang", "Zhong-Ping Jiang"]
year: 2012
venue: "Automatica 48(10), 2699–2704"
doi: "10.1016/j.automatica.2012.06.096"
citation_key: "jiang2012computational"
language: "English"
research_domain: ["ADP", "data-driven control", "LQR"]
control_task: "continuous-time LQR regulation"
system_type: "continuous-time linear system with unknown A and B"
reading_status: "screened_source_warning"
relevance: "high"
difficulty: "medium"
source_file: "inbox/Jiang和Jiang - 2012 - Computational adaptive optimal control for continuous-time linear systems with completely unknown dy.pdf"
code_repository: ""
last_updated: "2026-07-13"
---

# 快速复习：Jiang & Jiang (2012)

## 来源警告

【未能确认】当前 PDF 的封面年份、收稿日期和参考文献被异常改为 2018 前后信息；正式元数据由 Elsevier 记录确认为 2012。逐式精读前必须换用可靠原版。详见 `../../../adp-paper-set/source-audit.md`。

## 一句话结论

【论文原文】本文在未知 $A,B$ 的连续时间线性系统上，用输入—状态数据迭代求解 ARE，并可重复使用固定时间区间数据获得收敛的最优反馈增益。

## 关键原文

**原文位置**：PDF p. 1，Abstract；正式元数据见 Elsevier DOI 页面。

> “without requiring the a priori knowledge of the system matrices”

**中文翻译**：不要求事先知道系统矩阵。

**学习解释**：算法不是先辨识 $A,B$ 再做 LQR，而是把策略评价/改进改写成可由测量数据求解的线性方程。

**全文作用**：点明 P2 与 P1 的最大差异：P2 追求线性系统下真正不依赖模型矩阵的数据驱动 PI。

## 方法主线

```text
初始稳定 K_0 + 探索输入
  -> 采集固定区间的 x,u 积分数据
  -> 满足秩条件
  -> 联立求 P_k 与 K_{k+1}
  -> 重复使用同一批数据迭代
  -> 收敛到 LQR 解
```

## 必须先学

- 状态空间、Hurwitz 稳定、LQR、Lyapunov 方程、ARE。
- Kleinman PI、矩阵向量化、最小二乘、满列秩。

## 可信度与局限

【批判性分析】这是最适合当前学习者的数学入口，但初始稳定控制器和足够丰富的数据不是“免费条件”；实际机械臂上探索噪声与状态测量会成为工程约束。

## 阅读建议

作为正式第一篇精读。先完成预备课程 A–C，再读 Sec. 2–3；来源版本替换前不展开参考文献谱系和附录逐式核对。
