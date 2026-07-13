# Paper-to-code mapping, reproduction, and audit

## Default mapping

Inventory repository tree, entry points, data flow, configuration, dependencies, and run commands. Create a table: paper section/equation/algorithm/figure; file and function; paper symbol; code variable and shape; implementation status; discrepancy; confidence.

Identify paper-described but absent code, undocumented code behavior, hyperparameters, seeds, data splits, checkpoints, and scripts generating tables/figures.

## Adaptive modes

- `对照代码实现`: mapping only.
- `准备复现`: add environment lock, dataset acquisition, execution order, expected outputs, compute needs, checkpoints, failure modes, and acceptance tests.
- `审查代码`: add paper-consistency review, bugs, leakage, unfair comparison, numerical stability, reproducibility, quality, and migration risks.
- `从代码反推论文`: teach by runtime data flow while linking back to claims and formulas.

Do not run untrusted repository code without inspecting it and explaining material risks. Do not modify the user's repository unless explicitly requested.
