# ADP and adaptive optimal control

## Recognition checklist

Classify each paper before teaching it:

- continuous/discrete time;
- linear/nonlinear/affine system;
- regulation/tracking/robust control;
- known, partially known, or unknown dynamics;
- model-based, model-free, data-driven, or hybrid;
- policy iteration, value iteration, actor-critic, Q-function, integral RL, or off-policy formulation;
- online/offline learning;
- critic/actor approximation basis or neural network;
- exploration/persistent excitation/concurrent learning/history stack requirement;
- stability, boundedness, convergence, and optimality claims;
- simulation, hardware, or manipulator validation.

## Prerequisite spine

Teach only the required branch:

`dynamic system → state-space and feedback → stability/Lyapunov → cost functional → optimal control → Bellman principle → HJB/Riccati → approximation and residual error → PI/VI/actor-critic → tracking augmentation → manipulator application`.

Distinguish finite/infinite horizon, value/cost/Q functions, admissible policy, Bellman error, HJB equation, algebraic Riccati equation, actor and critic weights, on/off-policy data, and PE-like conditions.

## Core audit points

Check admissibility of the initial policy, positive definiteness of costs, system controllability/stabilizability assumptions, approximation error treatment, excitation/rank conditions, weight vs policy convergence, closed-loop stability during learning, use of nominal dynamics, control constraints, and whether tracking is reduced to regulation through an augmented system.

Do not conflate reinforcement learning terminology with guarantees from adaptive control. State exactly which signal is measurable, which dynamics are assumed, what is learned, and what theorem guarantees.

## Four-paper set

Before deep reading, fill the project's `adp-paper-set/` files. Extract shared prerequisites and build a cross-paper symbol table for state, error/augmented state, control, value function, cost matrices, actor/critic weights, Bellman error, basis functions, and excitation data. Recommend an adaptive order while retaining the supervisor's order.
