# Manipulator and robot control

## Required physical model

Identify generalized coordinates, joint space vs task space, reference trajectory, error definition, actuator input, coordinate frame, and units. When needed, teach:

`frames and homogeneous transforms → forward/inverse kinematics → Jacobian and singularity → velocity/force mapping → manipulator dynamics → tracking error dynamics → feedback and optimal/adaptive control`.

Use the standard dynamics only after defining every term:

$$
M(q)\ddot q + C(q,\dot q)\dot q + g(q) + f(\dot q) + d(t) = \tau.
$$

Check dimensions, units, frame conventions, positive definiteness of $M(q)$, skew-symmetry properties used in proofs, uncertainty/disturbance assumptions, actuator saturation, state measurement, and sampling/implementation constraints.

## Evidence hierarchy

Distinguish toy dynamics, numerical manipulator model, physics simulator, hardware-in-the-loop, and physical robot. For tracking, inspect reference smoothness, initial error, trajectory frequency, torque limits, error norm, transient/steady-state behavior, disturbance tests, and comparison-controller tuning.

When translating to code, map joint arrays, state ordering, controller period, numerical integration, torque commands, saturation, and ROS topics/services/actions.
