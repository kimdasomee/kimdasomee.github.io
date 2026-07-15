# AORR State Machine

## 1. Target and Done Criteria
- Target: Build a static professional personal website using only `HTML`, `CSS`, and `JavaScript`, with a top `Games` menu and a snake game controlled by keyboard and mobile touch, then deploy it to GitHub Pages.
- Done criteria:
  - Responsive layout works on desktop, tablet, and mobile.
  - Top navigation includes `Games`.
  - Snake game supports keyboard and touch input.
  - Main content matches the reference profile, and any unverified details are marked `[사람 확인 필요]`.
  - Claude verifier passes the full test suite.
  - GitHub Pages deployment succeeds.

## 2. Act: Minimal Codex Changes
- Codex acts as Worker and changes only what is necessary for one root cause.
- In one retry, fix only one cause and only the related file(s).
- Prefer the smallest possible edit:
  - `HTML`: structure, navigation, anchors, game entry point
  - `CSS`: responsive layout, spacing, readability, game canvas sizing
  - `JavaScript`: snake logic, input handling, state transitions
  - `CONTENT`: profile copy and `[사람 확인 필요]` markers
  - `DEPLOYMENT`: only minimal GitHub Pages related changes
- Avoid unrelated refactors or style rewrites.

## 3. Observe: Verifier Tests and Results
- Verifier role: Claude Code CLI Sonnet.
- Current verified CLI status:
  - `claude` command: available
  - login: available
  - auth status: logged in via `claude.ai`
  - actual Sonnet model: `claude-sonnet-5`
- Verifier runs the same test set before and after changes.
- Required coverage:
  - File existence and relative paths
  - HTML structure and internal links
  - CSS responsiveness
  - JavaScript errors
  - Snake game behavior and input
  - Local HTTP response
  - Viewports: `375px`, `768px`, `1440px`
  - GitHub Pages compatibility
- Verifier report must include:
  - executed by / model
  - command
  - exit code
  - core error
  - related file(s) and line(s)
  - fingerprint
  - final status
- If Claude CLI is unavailable, record `CODEX_FALLBACK` and let Codex perform both edit and verification.

## 4. Reason: Failure Classification
- `HTML`: document structure, semantic tags, navigation, anchors, markup errors
- `CSS`: responsiveness, overflow, layout, readability, canvas sizing
- `JAVASCRIPT`: events, state, rendering, input handling, runtime errors
- `GAME`: collision, scoring, restart, input responsiveness, game loop
- `CONTENT`: missing profile text, unverified facts, missing `[사람 확인 필요]`
- `TEST`: missing verification, no repro, incomplete result capture
- `ENVIRONMENT`: local environment, browser differences, CLI install, path issues
- `GITHUB`: repo access, branch, sync, token/auth issues
- `DEPLOYMENT`: GitHub Pages config, publish path, missing static assets
- `UNKNOWN`: none of the above

## 5. Repeat
- If verification fails, Codex fixes only the single root cause and only the minimal related file(s).
- Claude reruns the exact same test set.
- One retry may not change any unrelated passing area.
- Retry stops only when the same full verification passes.

## 6. Stop and HITL Conditions
- `PASSED`: Claude full verification passes and no further code changes are required before deployment.
- `DEPLOY_APPROVAL_REQUIRED`: deployment is ready but user approval or confirmation is needed.
- `DEPLOYED`: GitHub Pages deployment succeeded.
- `BLOCKED`: the same failure repeats and code-only progress is no longer meaningful.
- `HITL_REQUIRED`: profile facts, game rules, or deployment approval require human input.
- Stop when:
  - key profile facts remain unknown and cannot be safely inferred
  - Claude CLI cannot be used and `CODEX_FALLBACK` is the only option
  - deployment cannot proceed without approval

## 7. Development Loop Table

| Loop | Input | Codex Act | Claude Verify | Pass Criteria | Next State |
|---|---|---|---|---|---|
| 1 | Initial repo, STEP1 analysis, reference profile exists | Build the responsive skeleton, header, intro, core sections, and `Games` entry point only | Basic structure, link, and responsive checks | Layout does not break on mobile or desktop | `ACTING` -> `VERIFYING` |
| 2 | Loop 1 scaffold, confirmed profile copy | Fill only profile copy, CTA, and section content | Content consistency and `[사람 확인 필요]` checks | Content reads cleanly and uncertain items are marked | `VERIFYING` -> `PASSED` or `RETRYING` |
| 3 | Site scaffold and `Games` menu | Implement the minimum snake game behavior: start, move, collision, score, restart | Game behavior, input response, end-state checks | Playable by keyboard with stable loop behavior | `VERIFYING` -> `PASSED` or `RETRYING` |
| 4 | Minimum game behavior, mobile target | Add touch input and mobile-only UI tuning | Mobile control, canvas size, touch responsiveness | Game feels natural on mobile | `VERIFYING` -> `PASSED` or `RETRYING` |
| 5 | Integrated site, deploy-ready build | Minimal cleanup for deploy path, static assets, meta, and errors | GitHub Pages path and full regression checks | Full verification passes | `PASSED` |
| 6 | Approved deploy-ready state | Minimal deployment config changes only | Post-deploy accessibility check | GitHub Pages loads correctly | `DEPLOYED` |

## 8. Self-Correcting TDD Loop

### Purpose
- Use Claude as the Verifier and Codex as the Worker.
- Codex does not repeat tests that Claude already ran.
- The loop is verification-first: change only after the Verifier reports a failure.

### Execution Order
1. Claude runs the pre-change test set.
2. Claude reports failure items, core error, related file(s), and fingerprint.
3. Codex makes the minimum code change for one root cause.
4. Claude reruns the same test set.
5. If it still fails, Claude reports the new result and fingerprint.
6. Codex makes the next minimum change and asks Claude to re-verify.
7. Only when Claude's full test suite passes does the loop reach `PASSED`.

### Retry Rules
- Maximum 3 retries per error.
- If the same fingerprint appears twice, stop.
- One retry changes only one root cause and only the minimum related file(s).
- Test deletion or test weakening is forbidden.

### Failure Record
- Record every failed run with:
  - executor and model
  - command
  - exit code
  - core error
  - related file(s) and line(s)
  - fingerprint
  - final status

### Fallback
- Use `CODEX_FALLBACK` only when Claude CLI cannot be used.
- Record the fallback reason and whether it was used.

### Verified Claude Setup
- Claude command: available
- Login status: logged in
- Auth method: `claude.ai`
- Active Sonnet model: `claude-sonnet-5`

### [사람 확인 필요]
- The exact final website content and snake game rules are still not fully defined from the reference alone.
## 9. Step 9 Execution Order
1. Read `CHANGE_REQUEST.md`, `AORR.md`, `MEMORY.md`, the current code, and the last normal deployed state.
2. Implement Change Items in dependency order with minimal code changes only.
3. Verify each item with Claude before and after the change.
4. Record failures, fingerprints, retry count, and final state in `AORR_LOG.md`.
5. Stop at `DEPLOY_APPROVAL_REQUIRED` until the user approves commit, push, and redeploy.
