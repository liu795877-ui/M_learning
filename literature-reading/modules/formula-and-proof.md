# Formula, algorithm, and proof analysis

## Formula card

For each important equation record:

- exact paper location and original notation;
- source lineage: preceding equation, definition, or assumption;
- purpose in the argument;
- variable dictionary: meaning, type, dimension, unit, dependency;
- assumptions and boundary/initial conditions;
- derivation from the preceding equation, including omitted algebra when material;
- derivation provenance: separate `【作者步骤】` from `【补全推导】`;
- downstream destination: the next equation, algorithm step, theorem, or experiment that consumes it;
- physical/control interpretation;
- code-level input, intermediate values, output, and tensor shape;
- dimension/unit check and unresolved inconsistency.

Maintain original and unified symbols without silently replacing the paper notation.

Apply the full chain `来源 -> 当前作用 -> 作者步骤/补全推导 -> 后续去向` to key equations only. For ordinary equations, keep variable definitions and derivation logic without manufacturing an artificial lineage. If an exact formula anchor cannot be verified, label `【未能确认】`, do not treat it as paper content, and do not advance reading progress.

## Algorithm depth

For core algorithms expand: problem definition, objective, assumptions, Bellman/HJB or other governing relation, approximation choice, update rule, stopping criterion, guarantee, computational path, and pseudocode. Separate what is generic theory from what this paper changes.

## Proof ladder

Start with proof target, engineering meaning, dependency theorem, route map, key inequality, assumptions, and exact conclusion. Expand line by line when the proof is central or the user asks. Label author-provided steps, filled omissions, inference, and unverifiable steps separately. Check whether the theorem proves stability, asymptotic convergence, boundedness, or optimality; never treat these as interchangeable.
