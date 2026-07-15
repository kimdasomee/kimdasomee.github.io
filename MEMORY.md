# MEMORY

- Goal: Build an AI-inspired responsive personal site with staged Flappy Bird unlocks for GitHub Pages.
- Scope / Out of Scope: Static HTML/CSS/JS, Home/About/Experience/Projects/Research/Contact, Games menu, stage-gated unlocks / no backend, frameworks, external services, large rewrites, test weakening, secret logging.
- Execution: Mode = `CODEX_WORKER + CLAUDE_VERIFIER`; Claude model = `claude-sonnet-5`; Last test = `PASS`.
- Current State: status = `DEPLOY_APPROVAL_REQUIRED`; completed loop = `4`; next loop = `deployment approval`; Retry = `1`; fingerprint = `script.js:154,398,443:double-rAF-restart-race`; blocker = `none`; current commit = `bc251877cc0abe327452e0e41307ff7614eec5bd`; last normal commit = `a32f3366201b7fc5315e02eddc0657ba2896b3ed` / `https://kimdasomee.github.io`; rollback = restore `index.html`, `styles.css`, `script.js` to `a32f3366201b7fc5315e02eddc0657ba2896b3ed`.
- Acceptance: Full Claude verification passes, local HTTP returns 200, responsive on `375px`, `768px`, `1440px`, and GitHub Pages is ready for the approved commit.
- Guardrails: Do not generate unverified personal info; do not delete existing content arbitrarily; do not weaken tests; do not do large rewrites; do not add backend/external services/frameworks; do not print/log/store tokens.
- Retry / HITL: One retry fixes one root cause and only minimal related files; max 3 retries per error; same fingerprint twice stops; HITL required for profile facts, game-rule changes, and deployment approval.

## Recent Loops
| Loop | Status | Execution Mode·Model | Changed Files | Test Result | Retry | Next Work |
|---|---|---|---|---|---|---|
| 2 | PASS | `claude-sonnet-5` | `index.html`, `script.js`, `styles.css` | pre FAIL / post PASS / local HTTP 200 | 0 | deployment approval gate |
| 3 | PASS | `claude-sonnet-5` | `CHANGE_REQUEST.md`, `AORR.md` | analysis only | 0 | implement change items |
| 4 | PASS | `claude-sonnet-5` | `index.html`, `script.js`, `styles.css`, `AORR.md`, `AORR_LOG.md`, `MEMORY.md` | node check PASS / local HTTP 200 / Claude PASS after retry | 1 | deployment approval gate |
