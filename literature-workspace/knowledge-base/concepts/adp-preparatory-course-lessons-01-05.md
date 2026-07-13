---
title: ADP 预备课程第 1—5 讲总结
topic: ADP 自适应最优控制与机械臂轨迹跟踪
document_type: prerequisite_course_summary
language: zh-CN
formula_style: zotero-markdown
source_status: 基础知识讲义，尚未绑定单篇论文
learner_confirmation: 第 1—3 讲核心主线已口头确认；第 4—5 讲待后续理解检查
created: 2026-07-13
last_updated: 2026-07-13
---

# ADP 预备课程第 1—5 讲总结

> 【基础知识】本文总结进入四篇 ADP 论文正式精读前的共同理论基础，不代表任何一篇论文的原文观点。正式精读时，需要将这里的统一符号映射回各篇论文的原始符号。

## 一、五讲总主线

```text
动态系统与状态反馈
        ↓
闭环稳定性与 Lyapunov 方程
        ↓
LQR、ARE 与 Kleinman Policy Iteration
        ↓
Bellman 原理与 HJB 方程
        ↓
PI、VI 与 Actor–Critic
        ↓
机械臂动力学与误差状态
        ↓
从固定点调节扩展到时变轨迹跟踪
```

最核心的认识是：

> 稳定控制只要求系统能够回到目标；最优控制还要在跟踪误差、控制能量、响应速度和鲁棒性之间，使预先定义的累计代价最小。ADP 使用数据与函数逼近实现近似的策略评价和策略改进，从而避免直接精确求解 HJB 方程。

---

## 二、第 1 讲：闭环稳定、Lyapunov 方程、ARE 与 Kleinman PI

### 2.1 状态反馈与闭环系统

连续时间线性系统为：

$$
\dot{x}=Ax+Bu
$$

采用状态反馈：

$$
u=-Kx
$$

闭环系统变为：

$$
\dot{x}=(A-BK)x
$$

记闭环矩阵为：

$$
A_c=A-BK
$$

如果 $A_c$ 的全部特征值实部小于零，则闭环系统渐近稳定。

### 2.2 Lyapunov 方程

选择二次型 Lyapunov 函数：

$$
V(x)=x^TPx,\qquad P=P^T>0
$$

沿闭环轨迹求导：

$$
\dot V=x^T\left(A_c^TP+PA_c\right)x
$$

如果对某个 $Q_L=Q_L^T>0$，存在 $P>0$ 满足：

$$
A_c^TP+PA_c=-Q_L
$$

则：

$$
\dot V=-x^TQ_Lx<0,\qquad x\neq0
$$

因此，Lyapunov 方程可以用于证明当前闭环策略的稳定性。

### 2.3 固定策略的价值函数

对于固定控制策略 $u=-Kx$，定义：

$$
J_K(x_0)=\int_0^\infty\left(x^TQx+u^TRu\right)dt
$$

代入 $u=-Kx$ 后：

$$
J_K(x_0)=\int_0^\infty x^T\left(Q+K^TRK\right)x\,dt
$$

若 $P_K$ 满足：

$$
(A-BK)^TP_K+P_K(A-BK)+Q+K^TRK=0
$$

则当前策略的累计代价为：

$$
J_K(x_0)=x_0^TP_Kx_0
$$

所以，固定 $K$ 后求解 Lyapunov 方程，本质上是在执行 Policy Evaluation，即策略评价。

### 2.4 ARE 与最优控制

在线性二次型调节问题中，最优价值函数取二次型：

$$
V^*(x)=x^TPx
$$

最优反馈策略为：

$$
u^*=-R^{-1}B^TPx=-K^*x
$$

其中：

$$
K^*=R^{-1}B^TP
$$

矩阵 $P$ 满足连续时间代数 Riccati 方程：

$$
A^TP+PA-PBR^{-1}B^TP+Q=0
$$

ARE 在满足可稳定性、可检测性、$Q\geq0$ 和 $R>0$ 等条件时，用于求 LQR 的最优反馈策略。

### 2.5 Kleinman Policy Iteration

从一个稳定初始增益 $K_0$ 出发，重复以下两步。

策略评价：

$$
(A-BK_i)^TP_i+P_i(A-BK_i)+Q+K_i^TRK_i=0
$$

策略改进：

$$
K_{i+1}=R^{-1}B^TP_i
$$

其主线是：

```text
稳定策略 K_i
    ↓ 策略评价
价值矩阵 P_i
    ↓ 策略改进
新策略 K_{i+1}
```

Kleinman PI 是经典最优控制通向 ADP 的重要桥梁：经典方法利用已知模型精确求解，ADP 则尝试利用数据近似完成相同的评价—改进过程。

---

## 三、第 2 讲：Bellman 原理、HJB 方程与价值函数近似

### 3.1 非线性最优控制问题

考虑控制仿射非线性系统：

$$
\dot{x}=f(x)+g(x)u
$$

定义无限时间性能指标：

$$
J(x_0,u)=\int_0^\infty\left[q(x)+u^TRu\right]dt
$$

最优价值函数为：

$$
V^*(x)=\min_u J(x,u)
$$

### 3.2 Bellman 最优性原理

Bellman 原理表示：一条最优轨迹从任意中间状态继续向后，也必须保持最优。

$$
V^*(x(t))
=
\min_u\left[
\int_t^{t+\Delta t}r(x,u)d\tau
+V^*(x(t+\Delta t))
\right]
$$

直观上：

```text
当前最优总代价
= 当前短时间内的代价
+ 下一状态开始的最优未来代价
```

### 3.3 HJB 方程

对 Bellman 方程取连续时间极限，可得：

$$
0=
\min_u\left[
q(x)+u^TRu
+\nabla V^{*T}(x)\left(f(x)+g(x)u\right)
\right]
$$

对控制输入求极小值，得到：

$$
u^*(x)
=
-\frac{1}{2}R^{-1}g^T(x)\nabla V^*(x)
$$

它说明：最优策略由最优价值函数的梯度决定。

在线性系统 $f(x)=Ax$、$g(x)=B$ 且 $V^*(x)=x^TPx$ 的情况下，HJB 方程退化为 ARE。

### 3.4 为什么需要 ADP

非线性 HJB 通常是难以解析求解的偏微分方程，还会受到模型未知和维数灾难的影响。ADP 因此使用参数化函数逼近价值函数：

$$
\hat V(x)=\hat W_c^T\sigma_c(x)
$$

其中 $\hat W_c$ 是 Critic 权重，$\sigma_c(x)$ 是基函数或神经网络特征。

将近似价值函数和控制策略代回 HJB，可构造 Bellman 误差：

$$
\delta(x)
=
q(x)+\hat u^TR\hat u
+\nabla\hat V^T(x)\left[f(x)+g(x)\hat u(x)\right]
$$

理想情况下 $\delta=0$；实际学习的目标是让 $\delta$ 尽可能接近零。

---

## 四、第 3 讲：PI、VI、Actor–Critic 与数据使用方式

### 4.1 Policy Iteration

PI 从容许初始策略 $u_0$ 开始。固定 $u_i$ 时，价值函数满足：

$$
q(x)+u_i^TRu_i
+\nabla V_i^T\left[f(x)+g(x)u_i\right]
=0
$$

完成策略评价后，执行策略改进：

$$
u_{i+1}(x)
=
-\frac{1}{2}R^{-1}g^T(x)\nabla V_i(x)
$$

PI 通常收敛较快，但常要求初始策略已经能够稳定系统。

### 4.2 Value Iteration

VI 直接进行 Bellman 价值更新：

$$
V_{i+1}(x(t))
=
\min_u\left[
\int_t^{t+\Delta t}r(x,u)d\tau
+V_i(x(t+\Delta t))
\right]
$$

与 PI 相比，VI 通常不在每次迭代中完整评价当前策略，而是通过反复 Bellman backup 逐步逼近最优价值函数。

### 4.3 Actor–Critic

Critic 近似价值函数：

$$
\hat V(x)=\hat W_c^T\sigma_c(x)
$$

可使用 Bellman 误差构造损失：

$$
L_c=\frac{1}{2}\delta^2
$$

Actor 近似控制策略：

$$
\hat u(x)=\hat W_a^T\sigma_a(x)
$$

Critic 回答“当前状态的未来代价有多大”，Actor 回答“当前状态应该采取什么控制动作”。

需要特别区分：

- PI 和 VI 是最优控制问题的迭代路线；
- Actor–Critic 是实现策略与价值函数逼近的一种结构；
- 二者不是同一分类维度。

### 4.4 On-policy、Off-policy 与模型依赖

- On-policy：产生数据的行为策略就是当前被评价的目标策略。
- Off-policy：行为策略与目标策略不同，同一批历史数据可能用于评价多个目标策略。
- Model-based：更新公式显式依赖 $f(x),g(x)$ 或 $A,B$。
- Partially model-free：只消除部分模型依赖。
- Model-free：尽量通过数据完成学习，但通常仍依赖状态可测、控制方向或系统阶数等先验信息。

### 4.5 探索与持续激励

训练数据必须足够丰富，才能识别 Critic 或 Actor 的未知参数。常见行为控制为：

$$
u(t)=\hat u(x(t))+e_{mathrm{ex}}(t)
$$

其中 $e_{mathrm{ex}}(t)$ 是探索或探测信号。探索有利于满足持续激励条件，但可能增加振荡、跟踪误差、执行器负担和真实设备风险。

---

## 五、第 4 讲：机械臂动力学与轨迹跟踪误差

### 5.1 机械臂动力学

标准关节空间动力学为：

$$
M(q)\ddot q+C(q,\dot q)\dot q+G(q)+F(\dot q)+d(t)=\tau
$$

其中：

| 符号 | 含义 |
|---|---|
| $q,\dot q,\ddot q$ | 关节位置、速度和加速度 |
| $M(q)$ | 对称正定惯性矩阵 |
| $C(q,\dot q)\dot q$ | 科氏力与离心力项 |
| $G(q)$ | 重力项 |
| $F(\dot q)$ | 摩擦项 |
| $d(t)$ | 外部扰动或未建模动态 |
| $\tau$ | 关节驱动力矩 |

两个重要结构性质是：

$$
M(q)=M^T(q)>0
$$

以及在标准定义下，$\dot M(q)-2C(q,\dot q)$ 为斜对称矩阵，因此：

$$
y^T\left[\dot M(q)-2C(q,\dot q)\right]y=0
$$

该性质经常用于 Lyapunov 推导中的交叉项抵消。

### 5.2 状态空间形式

定义：

$$
x=
\begin{bmatrix}
q\\
\dot q
\end{bmatrix}
$$

则机械臂可以写成：

$$
\dot x=f(x)+g(x)\tau
$$

阅读论文时要区分：小写 $g(x)$ 是输入矩阵函数，大写 $G(q)$ 是重力项。

### 5.3 跟踪误差与误差状态

本讲采用：

$$
e=q-q_d
$$

因此：

$$
\dot e=\dot q-\dot q_d,
\qquad
\ddot e=\ddot q-\ddot q_d
$$

定义误差状态：

$$
z=
\begin{bmatrix}
e\\
\dot e
\end{bmatrix}
$$

轨迹跟踪目标被转换为：

$$
z(t)\rightarrow0
$$

论文也可能采用 $e=q_d-q$，此时控制律的相应符号会改变，必须先核对误差定义。

### 5.4 滤波误差与计算力矩控制

常用滤波误差为：

$$
s=\dot e+\Lambda e,
\qquad \Lambda>0
$$

若 $s\to0$，则误差满足稳定的一阶系统并趋于零。

在模型准确且忽略扰动时，计算力矩控制可选择：

$$
\tau
=
M(q)\left(\ddot q_d-K_d\dot e-K_pe\right)
+C(q,\dot q)\dot q+G(q)
$$

从而得到：

$$
\ddot e+K_d\dot e+K_pe=0
$$

真实系统存在参数不确定、摩擦、负载变化和扰动，因此常使用基础控制器保证安全，再由 ADP 学习优化或补偿项。

---

## 六、第 5 讲：从调节问题扩展到时变轨迹跟踪

### 6.1 为什么仅使用误差不一定足够

对于参考轨迹 $x_d(t)$，定义：

$$
e=x-x_d
$$

误差动力学为：

$$
\dot e
=
f(e+x_d)+g(e+x_d)u-\dot x_d
$$

相同的当前误差可能对应不同的参考速度和加速度，因此可能需要不同的控制动作。价值函数通常不能简单写成 $V(e)$。

### 6.2 增广系统路线

若参考轨迹由外系统产生：

$$
\dot x_d=h(x_d)
$$

定义增广状态：

$$
\zeta=
\begin{bmatrix}
e\\
x_d
\end{bmatrix}
$$

则可以构造自治增广系统：

$$
\dot\zeta=F(\zeta)+G(\zeta)u
$$

价值函数相应写成：

$$
V^*(\zeta)
$$

性能指标通常只惩罚误差，不惩罚参考信号本身，因此增广状态权重可能采用：

$$
Q_a=
\begin{bmatrix}
Q&0\\
0&0
\end{bmatrix}
$$

### 6.3 稳态或前馈控制

机械臂完美跟踪时，实际力矩一般不为零。理想前馈力矩为：

$$
\tau_d
=
M(q_d)\ddot q_d
+C(q_d,\dot q_d)\dot q_d
+G(q_d)
$$

因此常将实际控制分解为：

$$
\tau=\tau_d+\mu
$$

其中 $\mu$ 是消除跟踪误差的控制偏差。性能指标可以定义为：

$$
J
=
\int_0^\infty
\left[
e^TQe+\mu^TR\mu
\right]dt
$$

当误差趋于零时，$\mu$ 可以趋于零，而实际力矩仍维持在 $\tau_d$ 附近。

### 6.4 无限时间代价的陷阱

如果持续运动所需的总力矩 $\tau_d(t)$ 不趋于零，却直接定义：

$$
J
=
\int_0^\infty
\left[
e^TQe+\tau^TR\tau
\right]dt
$$

即使实现完美跟踪，也可能得到 $J=\infty$。常见处理方式包括：

- 惩罚控制偏差 $\tau-\tau_d$；
- 使用有限时间性能指标；
- 使用折扣性能指标；
- 将参考系统和稳态控制纳入增广建模。

### 6.5 基础控制器加 ADP 优化项

工程上常采用：

$$
\tau=\tau_b+\mu_{\mathrm{adp}}
$$

其中：

- $\tau_b$ 负责基础稳定性和安全；
- $\mu_{\mathrm{adp}}$ 负责进一步降低误差、控制代价或补偿未知动态。

阅读论文时必须确认 Actor 输出的是：总关节力矩、虚拟控制、稳态输入之外的控制偏差，还是未知动力学补偿量。

---

## 七、五讲概念关系表

| 概念 | 解决的问题 | 在 ADP 中的对应角色 |
|---|---|---|
| 状态反馈 | 改变闭环动力学 | Actor 产生控制策略 |
| Lyapunov 方程 | 评价固定策略的稳定性和代价 | Policy Evaluation 的经典形式 |
| ARE | 求解 LQR 最优策略 | 线性二次型 HJB 的特殊形式 |
| Kleinman PI | 迭代求解 ARE | ADP 评价—改进框架的模型驱动原型 |
| Bellman 原理 | 分解当前和未来代价 | 动态规划基础 |
| HJB 方程 | 刻画连续时间最优价值函数 | ADP 希望近似满足的核心方程 |
| Bellman 误差 | 衡量近似价值函数是否满足 HJB | Critic 学习信号 |
| PI / VI | 两种价值与策略更新路线 | ADP 算法分类 |
| Actor–Critic | 参数化实现策略与价值函数 | Actor 控制，Critic 评价 |
| 机械臂误差状态 | 把跟踪转化为趋近原点问题 | ADP 的学习状态 |
| 增广状态 | 加入参考轨迹信息 | 将时变跟踪转为自治问题 |
| 基础控制器 + ADP | 分离安全稳定和性能优化 | 更适合真实机械臂实施 |

---

## 八、统一符号表

| 统一符号 | 含义 | 备注 |
|---|---|---|
| $x$ | 一般系统状态 | 论文中也可能写成 $X$、$z$ 或 $\zeta$ |
| $u$ | 一般控制输入 | 在机械臂中可能对应 $\tau$ 或附加控制量 |
| $V,V^*$ | 当前或最优价值函数 | 也可能记为 $J$ |
| $P,P_i$ | 二次型价值矩阵 | 线性系统或局部二次近似 |
| $K,K_i$ | 状态反馈增益 | $u=-Kx$ |
| $Q,R$ | 状态和控制权重 | $Q\geq0$，$R>0$ |
| $\delta$ | Bellman 误差 | Critic 常用学习信号 |
| $\hat W_c$ | Critic 估计权重 | 近似价值函数 |
| $\hat W_a$ | Actor 估计权重 | 近似控制策略 |
| $q$ | 机械臂关节位置 | 不要与代价函数 $q(x)$ 混淆 |
| $M,C,G$ | 惯性、科氏/离心、重力项 | 机械臂标准动力学 |
| $e$ | 跟踪误差 | 本讲统一取 $e=q-q_d$ |
| $z$ | 误差状态 | 常取 $z=[e^T,\dot e^T]^T$ |
| $\zeta$ | 增广状态 | 可包含误差和参考状态 |
| $\tau$ | 实际关节力矩 | 单位通常为 $\mathrm{N\cdot m}$ |
| $\mu$ | 附加控制或控制偏差 | 必须按论文重新确认 |

---

## 九、进入论文前的阅读检查清单

遇到一篇 ADP 机械臂控制论文，优先回答：

1. 系统是线性还是非线性，连续时间还是离散时间？
2. 控制目标是固定点调节还是时变轨迹跟踪？
3. 误差如何定义，状态或增广状态包含哪些变量？
4. 使用 PI、VI，还是其他迭代路线？
5. Actor 与 Critic 分别近似什么？
6. Bellman 误差如何构造，是否显式依赖系统模型？
7. 使用 On-policy 还是 Off-policy 数据？
8. 是否要求稳定初始策略和持续激励？
9. Actor 输出总力矩、虚拟输入，还是附加补偿量？
10. 性能指标为什么是有限的？
11. 稳定性证明使用了什么 Lyapunov 函数和假设？
12. 作者声称的“model-free”实际上仍需要哪些先验信息？

---

## 十、当前掌握状态与后续课程

### 已由学习者确认理解

- Lyapunov 方程可以评价当前策略；
- ARE 可以求 LQR 最优控制策略；
- Kleinman PI 是经典最优控制连接 ADP 评价—改进思想的重要桥梁；
- Bellman、HJB、PI、VI 和 Actor–Critic 的总体关系已完成学习。

### 待后续巩固

- 机械臂 $M$、$C$、$G$ 各项的物理意义；
- 机械臂结构性质在 Lyapunov 证明中的作用；
- 增广状态与基础控制器两种跟踪 ADP 路线；
- 总控制输入和控制偏差在无限时间代价中的区别。

### 后续三讲

1. Critic 权重学习、Bellman 回归与持续激励；
2. Lyapunov 稳定性证明、权重有界与收敛性；
3. 四篇论文的常见公式、算法框架与正式阅读方法。

