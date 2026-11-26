---
name: tooling-gotchas
description: Windows tooling gotchas found while building the pop-up spike (eslint magic numbers, playwright under bun, headless screenshots)
metadata:
  type: feedback
---

- `no-magic-numbers` flags numbers in expressions even inside a const initialiser (`30 * DEG`), and array/object literal elements in some cases. Only a bare `const X = 30;` is clean. Name every operand.
- `no-continue`, `sonarjs/no-nested-conditional`, `sonarjs/regex-complexity` (build big regexes with `new RegExp` + `String.raw`), `sonarjs/prefer-specific-assertions` (use `toHaveLength` on `mock.calls`) are all errors.
- Test files may carry a top-of-file `eslint-disable no-magic-numbers` with a reason.
- Playwright `chromium.launch()` hangs under bun on Windows. Headless screenshot instead: run `chrome-headless-shell.exe --headless --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --virtual-time-budget=25000 --screenshot=<abs path> <url>` directly (found under `%LOCALAPPDATA%/ms-playwright`).
- No `node` or `python` on PATH; use `bun run script.ts` for scripted edits. Bash heredocs with apostrophes in comments can fail; use the Write tool.
