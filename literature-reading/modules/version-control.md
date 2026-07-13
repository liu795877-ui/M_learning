# Git version control

Treat the delivery repository as the source of truth and the global Codex Skills directory as a deployed copy.

## Track

- Skill instructions, modules, domains, templates, schemas, and UI metadata.
- Workspace Markdown/YAML notes, knowledge maps, reading state, indexes, pending proposals, reviews, and changelog.
- Root documentation, version file, and maintenance scripts.

## Do not track by default

- PDF/source documents, datasets, model weights, checkpoints, rendered figures, caches, temporary files, credentials, environment files, and nested external repositories.
- Use Git LFS only after the user explicitly chooses to version large binaries.

## Commit boundaries

Create one focused commit for one logical outcome, such as:

- `feat(skill): add nonlinear ADP domain guidance`
- `docs(paper): complete wang2024 critic derivation`
- `knowledge(control): confirm Lyapunov concept entry`
- `review(adp-set): add four-paper synthesis`
- `chore(release): prepare v0.2.0`

Before committing, inspect `git diff`, validate the skill, check internal links/configuration, and update `changelog.md` when the change affects knowledge or behavior. Never commit pending content as confirmed merely to make the tree clean.

## Version policy

Use semantic versions in root `VERSION`:

- MAJOR: incompatible workspace/schema or workflow changes.
- MINOR: new domain, module, major knowledge-map capability, or backward-compatible schema extension.
- PATCH: corrections, wording, link fixes, or small knowledge updates.

Create annotated tags only for validated releases. Do not tag routine reading-stage commits.

## Sync and rollback

Run the root `scripts/sync-skill.ps1` after validated Skill changes to deploy `literature-reading/` into the configured global Skills directory. The script must not copy the personal workspace into the global Skill location.

For rollback, first inspect `git log` and `git diff`. Prefer creating a new revert commit with `git revert <commit>`; do not use destructive reset or forced push without explicit user authorization.

## Remote safety

Default to local Git only. Before adding or pushing to a remote, confirm repository visibility, exclude confidential research material, scan for secrets and oversized files, and obtain explicit user authorization.
