# Formula, algorithm, and proof analysis

## Formula card

For each important equation record:

- exact paper location and original notation;
- purpose in the argument;
- variable dictionary: meaning, type, dimension, unit, dependency;
- assumptions and boundary/initial conditions;
- derivation from the preceding equation, including omitted algebra when material;
- physical/control interpretation;
- code-level input, intermediate values, output, and tensor shape;
- dimension/unit check and unresolved inconsistency.

Maintain original and unified symbols without silently replacing the paper notation.

## Algorithm depth

For core algorithms expand: problem definition, objective, assumptions, Bellman/HJB or other governing relation, approximation choice, update rule, stopping criterion, guarantee, computational path, and pseudocode. Separate what is generic theory from what this paper changes.

## Proof ladder

Start with proof target, engineering meaning, dependency theorem, route map, key inequality, assumptions, and exact conclusion. Expand line by line when the proof is central or the user asks. Label author-provided steps, filled omissions, inference, and unverifiable steps separately. Check whether the theorem proves stability, asymptotic convergence, boundedness, or optimality; never treat these as interchangeable.
