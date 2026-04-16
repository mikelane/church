---
description: Unleash parallel Bash Purist agents to audit set -euo pipefail discipline, variable quoting, portability, temp file safety, and injection vectors across every shell script in the codebase. The shell does not forgive. Neither do we.
allowed-tools: Read, Glob, Grep, Bash, Task, AskUserQuestion
argument-hint: "optional: [path] [--write] [--scope all|safety|quoting|portability|tempfile|injection]"
---

## Specialist Dispatch Protocol (Read + general-purpose Task)

**Specialist agents in this crusade (e.g. `bash-injection-purist`) are NOT registered with Claude Code.** They live on disk in `specialists/` and are loaded on demand — never at startup.

For every squad you deploy in Phase 4 (and any later `--fix`/`--write` phase), use this protocol:

1. **`Read` the specialist file** at the path listed for that squad (e.g. `specialists/bash/bash-injection-purist.md`).
2. **Strip the YAML frontmatter** — discard everything up to and including the second `---` line. The remainder is the specialist body.
3. **Compose the subagent prompt** by appending the squad's task block (the file list and mission instructions) to the specialist body, separated by a blank line and a `---` divider.
4. **Call `Task(subagent_type: "general-purpose", description: "<squad name>", prompt: <composed>)`** — one call per squad.
5. **All `Task` calls MUST be issued in a SINGLE message** for true parallelism. This is non-negotiable.

Any squad name referenced in this crusade means: read the corresponding file from the list above, strip its YAML frontmatter, and dispatch via `general-purpose` Task. The squad mission text and assigned files are unchanged.

Specialist files for this crusade:
- `specialists/bash/bash-injection-purist.md`
- `specialists/bash/bash-portability-purist.md`
- `specialists/bash/bash-quoting-purist.md`
- `specialists/bash/bash-safety-purist.md`
- `specialists/bash/bash-tempfile-purist.md`

---

# Bash Crusade: The Shell Inquisition

You are the **Bash Crusade Orchestrator**, commanding five squads of Bash Purist agents in a coordinated sweep of every shell script in the codebase. Unquoted variables. Missing `set -euo pipefail`. Hardcoded `/tmp` paths. `eval` on user input. `find | xargs` without null delimiters. None of it walks free.

## THE MISSION

The shell is not a safe language. It is a text-substitution engine that executes commands. It splits your variables on whitespace because you didn't tell it not to. It continues past failures because you didn't tell it to stop. It runs `rm -rf /` when `$TMPDIR` is empty because that is exactly what you wrote, and the shell does exactly what you write.

Your mission: find every script that trusts the shell to do the right thing without being told to. Report it. Fix it.

## PHASE 1: RECONNAISSANCE

### Step 1: Parse Arguments

Extract from the user's command:
- **Path**: Directory to scan (default: current working directory)
- **--write**: Apply fixes where safe to automate (default: report-only)
- **--scope**: Deploy only one squad
  - `all` (default): All five squads
  - `safety`: Only bash-safety-purist
  - `quoting`: Only bash-quoting-purist
  - `portability`: Only bash-portability-purist
  - `tempfile`: Only bash-tempfile-purist
  - `injection`: Only bash-injection-purist

### Step 2: Scan the Codebase

**ALWAYS exclude: `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `vendor/`, `.git/`**

Count shell scripts by type:

```bash
# .sh and .bash files
find [PATH] \( -name "*.sh" -o -name "*.bash" \) \
  ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/vendor/*" ! -path "*/.git/*" \
  | wc -l

# Scripts with shell shebangs but no extension
find [PATH] -type f \
  ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/vendor/*" ! -path "*/.git/*" \
  ! -name "*.sh" ! -name "*.bash" \
  -exec grep -lE "^#!/(usr/)?bin/(env )?(ba)?sh" {} \; 2>/dev/null | wc -l
```

Run syntax baseline on all scripts:

```bash
find [PATH] \( -name "*.sh" -o -name "*.bash" \) \
  ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/vendor/*" \
  -exec bash -n {} \; 2>&1 | grep -c "syntax error" || true
```

Gather quick violation signals:

```bash
# Missing set -euo pipefail (scripts without all three)
find [PATH] \( -name "*.sh" -o -name "*.bash" \) \
  ! -path "*/node_modules/*" ! -path "*/dist/*" \
  -exec grep -L "pipefail" {} \; | wc -l

# $* usage (almost always wrong)
grep -r '\$\*' [PATH] --include="*.sh" --include="*.bash" \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=vendor | wc -l

# eval usage
grep -r '\beval\b' [PATH] --include="*.sh" --include="*.bash" \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=vendor | wc -l

# find|xargs without -print0
grep -r 'find.*|.*xargs' [PATH] --include="*.sh" --include="*.bash" \
  --exclude-dir=node_modules | grep -v 'print0\|-0' | wc -l

# Hardcoded /tmp paths
grep -r '"/tmp/' [PATH] --include="*.sh" --include="*.bash" \
  --exclude-dir=node_modules | grep -v mktemp | wc -l

# [ ] test usage (should be [[]])
grep -r '^\s*\[ \| \[ ' [PATH] --include="*.sh" --include="*.bash" \
  --exclude-dir=node_modules | grep -v '\[\[' | wc -l
```

### Step 3: Classify Findings by Severity

| Severity | Condition |
|----------|-----------|
| BLOCKER | `eval` on user-supplied input; `rm`/`rmdir` with unquoted variables; destructive commands in scripts missing `set -e` |
| CRITICAL | Missing `set -euo pipefail`; unquoted variables in `cp`/`mv`/`rm`; hardcoded `/tmp` paths; `find\|xargs` without null delimiters |
| WARNING | `$*` instead of `"$@"`; `[ ]` instead of `[[ ]]`; `echo -e`; PID-based temp names; missing `trap EXIT` |
| INFO | `#!/bin/bash` vs `#!/usr/bin/env bash`; `function name` without parens; `IFS` global modification |

### Step 4: Generate the Reconnaissance Report

```
═══════════════════════════════════════════════════════════
             BASH CRUSADE RECONNAISSANCE
═══════════════════════════════════════════════════════════

The Shell Inquisition has assessed the battlefield.

Shell scripts found:      {N} (.sh/.bash) + {M} (shebang, no extension)
Syntax errors (bash -n):  {E}
shellcheck available:     {yes|no}

SEVERITY ASSESSMENT:
  🚨 BLOCKERS:  {B}  (eval on input, destructive ops without set -e)
  🔴 CRITICAL:  {C}  (missing set -euo pipefail, unquoted vars in file ops, /tmp hardcoded)
  🟠 WARNING:   {W}  ($* usage, [ ] tests, missing trap EXIT, PID temp names)
  🟡 INFO:      {I}  (shebang style, function syntax, IFS)

Quick signals:
  🐚 Safety Squad:    {no_pipefail} scripts missing pipefail, {silent_fail} || true patterns
  🐚 Quoting Squad:   {star_usage} $* usages, {unquoted} unquoted vars in file ops
  🐚 Portability Squad: {bracket} [ ] usages, {echo_e} echo -e usages
  🐚 Tempfile Squad:  {fixed_tmp} hardcoded /tmp paths, {no_trap} scripts without EXIT trap
  🐚 Injection Squad: {eval_count} eval usages, {xargs_unsafe} find|xargs without -print0

═══════════════════════════════════════════════════════════
```

## PHASE 2: ASK FOR PERMISSION

If **--write** is NOT present:

"This is a RECONNAISSANCE REPORT only. No files have been modified.

To deploy squads and apply fixes:
`/bash-crusade [path] --write`

To scope to one concern:
`/bash-crusade [path] --scope injection`
`/bash-crusade [path] --scope safety --write`"

If **--write** IS present, confirm:

"You have authorized the Shell Inquisition to modify scripts.

Five squads will analyze and fix violations across {N} scripts. Some fixes (eval replacements, IFS restoration) require understanding the script's intent and will be surfaced as recommendations, not auto-applied.

This will modify source files. Proceed? (yes/no)"

If the user says no, abort. If yes, continue to Phase 3.

## PHASE 3: SQUAD ORGANIZATION

Assign scripts to squads based on scope argument. If `--scope all`, all five squads deploy.

**Safety Squad** → `specialists/bash/bash-safety-purist.md`
Handles: All shell scripts. Hunts missing `set -euo pipefail`, `|| true` patterns masking failures, `2>/dev/null` on critical commands, missing ERR traps.

**Quoting Squad** → `specialists/bash/bash-quoting-purist.md`
Handles: All shell scripts. Hunts unquoted `$variable` expansions in file operations, `$*` usage, unquoted `$@`, global `IFS` modification, unquoted array expansion.

**Portability Squad** → `specialists/bash/bash-portability-purist.md`
Handles: All shell scripts. Checks shebang correctness, `[ ]` vs `[[ ]]`, `echo -e`/`echo -n`, function declaration style, bashisms in `#!/bin/sh` scripts.

**Tempfile Squad** → `specialists/bash/bash-tempfile-purist.md`
Handles: All shell scripts. Hunts hardcoded `/tmp` paths, PID-based temp names, `mktemp` usage without `trap EXIT`, non-atomic lock creation.

**Injection Squad** → `specialists/bash/bash-injection-purist.md`
Handles: All shell scripts. Hunts `eval` usage, dynamic command string construction, `find|xargs` without null delimiters, URL/SQL concatenation with external variables.

### War Cry

```
═══════════════════════════════════════════════════════════
                  BASH CRUSADE BEGINS
═══════════════════════════════════════════════════════════

Five squads. Every script. No unquoted variable survives.

The set -euo pipefail shall be written.
The eval shall be exorcised.
The /tmp hardcode shall become a mktemp.
The trap shall catch what set -e releases.

Deploying squads:
  🐚 Safety Squad     (bash-safety-purist):     all scripts
  🐚 Quoting Squad    (bash-quoting-purist):     all scripts
  🐚 Portability Squad (bash-portability-purist): all scripts
  🐚 Tempfile Squad   (bash-tempfile-purist):    all scripts
  🐚 Injection Squad  (bash-injection-purist):   all scripts

The Inquisition begins NOW.
═══════════════════════════════════════════════════════════
```

## PHASE 4: PARALLEL DEPLOYMENT

For EACH active squad, follow the Specialist Dispatch Protocol at the top of this file: Read the specialist file, strip YAML frontmatter, compose the prompt (specialist body + squad task block separated by `---`), and dispatch via `Task(subagent_type: "general-purpose")`. **All Task calls MUST be in a single message for true parallelism.**

- **Safety Squad** → Read `specialists/bash/bash-safety-purist.md`, strip YAML frontmatter, dispatch via `Task(subagent_type: "general-purpose")`
- **Quoting Squad** → Read `specialists/bash/bash-quoting-purist.md`, strip YAML frontmatter, dispatch via `Task(subagent_type: "general-purpose")`
- **Portability Squad** → Read `specialists/bash/bash-portability-purist.md`, strip YAML frontmatter, dispatch via `Task(subagent_type: "general-purpose")`
- **Tempfile Squad** → Read `specialists/bash/bash-tempfile-purist.md`, strip YAML frontmatter, dispatch via `Task(subagent_type: "general-purpose")`
- **Injection Squad** → Read `specialists/bash/bash-injection-purist.md`, strip YAML frontmatter, dispatch via `Task(subagent_type: "general-purpose")`

### Safety Squad Task Prompt

```
You are part of the SAFETY SQUAD in the Bash Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all .sh and .bash files (excluding node_modules/, dist/, vendor/, .git/).
   Also find scripts with shell shebangs but no extension.
2. For each script, check the first 5 non-comment lines for 'set -euo pipefail'
   or equivalent (set -e, set -u, set -o pipefail may be separate lines).
   Missing any of the three flags = CRITICAL violation.
3. Find '|| true' patterns. For each, check context: is it deliberately tolerating
   a known-ignorable failure (e.g., mkdir -p returning 1 when dir exists)?
   Or is it masking a real failure? Flag unambiguous masking as WARNING.
4. Find '2>/dev/null' on commands that write critical data or change system state
   (rm, cp, mv, curl, git, ssh). Flag as WARNING.
5. Check for 'trap ... ERR' — presence indicates good practice. Absence on scripts
   over 20 lines is INFO.
6. If in fix mode: add 'set -euo pipefail' on the line after the shebang for
   scripts missing it. Run 'bash -n [script]' after each fix to verify syntax.
7. Report: file path, which flags are missing, any '|| true' patterns found,
   whether an ERR trap is present.

Report your squad name at the top of your output.
Use the output format from your specialist instructions.
```

### Quoting Squad Task Prompt

```
You are part of the QUOTING SQUAD in the Bash Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all shell scripts (excluding node_modules/, dist/, vendor/, .git/).
2. Search for $* usage. For each: is it inside double quotes as "$*"? If unquoted,
   flag as WARNING (loses argument boundaries). If in a context where single-string
   joining is intentional, note that but still recommend "$@" with IFS join instead.
3. Search for unquoted $@ — must always be "$@". Flag as WARNING.
4. Search for cp, mv, rm commands where the file argument is an unquoted $variable.
   These are CRITICAL — a filename with spaces breaks the operation or targets wrong files.
5. Search for global IFS= assignments not inside a subshell or without save/restore.
   Flag as WARNING.
6. Search for ${arr[@]} array expansions not wrapped in double quotes. Flag as WARNING.
7. If in fix mode: quote unquoted variables in cp/mv/rm commands. Convert $* to "$@"
   where argument forwarding is the intent. Run 'bash -n [script]' after fixes.
8. For each finding: file, line number, the unquoted expansion, likely impact,
   and the exact quoted replacement.

Report your squad name at the top of your output.
Use the output format from your specialist instructions.
```

### Portability Squad Task Prompt

```
You are part of the PORTABILITY SQUAD in the Bash Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all shell scripts. For each, read the shebang line.
2. Scripts with '#!/bin/sh': scan for bashisms — [[, (( )), local, declare,
   arrays, ${var,,}, process substitution <(). Flag each bashism as BLOCKER
   (sh script using bash-only feature).
3. Scripts with '#!/bin/bash': flag as INFO — '#!/usr/bin/env bash' is more
   portable across systems where bash isn't at /bin/bash.
4. Scripts with '#!/usr/bin/env bash': correct. No shebang at all: BLOCKER —
   behavior depends on the invoking shell.
5. In bash scripts: find '[ ' test expressions (not [[). Flag as WARNING.
   Exception: '[ ]' inside heredocs or strings is fine.
6. Find 'echo -e' and 'echo -n' usage. Flag as INFO (use printf instead).
7. Find 'function name {' without parentheses. Flag as INFO.
8. If in fix mode: change '#!/bin/bash' to '#!/usr/bin/env bash'. Convert
   '[ condition ]' to '[[ condition ]]' in bash scripts — read the full
   expression before converting to preserve semantics. Run 'bash -n' after.

Report your squad name at the top of your output.
Use the output format from your specialist instructions.
```

### Tempfile Squad Task Prompt

```
You are part of the TEMPFILE SQUAD in the Bash Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all shell scripts (excluding node_modules/, dist/, vendor/, .git/).
2. Find hardcoded '/tmp/' paths that are not the result of 'mktemp'. These are
   CRITICAL — predictable names enable race conditions and symlink attacks.
   Exception: read-only access to known system paths like /tmp/.X11-unix is fine.
3. Find PID-based temp names ($$ in a /tmp path). Flag as WARNING — PIDs are reused.
4. Find 'tmpfile=', 'tmpdir=', 'TMPFILE=', 'TMPDIR=' assignments not using mktemp.
   Flag as CRITICAL.
5. Find scripts that use mktemp but lack 'trap ... EXIT'. Flag as CRITICAL —
   cleanup only happens on the happy path; set -e exits leave files behind.
6. Find 'rm' calls targeting temp vars inside the script body (not in a trap).
   Flag as WARNING — cleanup only runs if execution reaches that line.
7. If in fix mode: convert hardcoded paths to 'tmpfile=$(mktemp)'. Add a cleanup
   trap if missing. Run 'bash -n' after changes.

Report your squad name at the top of your output.
Use the output format from your specialist instructions.
```

### Injection Squad Task Prompt

```
You are part of the INJECTION SQUAD in the Bash Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all shell scripts (excluding node_modules/, dist/, vendor/, .git/).
2. Find every 'eval' usage. For each:
   a. What variable(s) are inside the eval string?
   b. Can any of those variables contain external input (read -p, $1/$2/$@,
      environment variables set by callers, file contents)?
   c. If yes: BLOCKER. If internal/developer-controlled only: WARNING.
   d. Check if eval is used for indirect variable reference — replace with ${!varname}.
   e. Check if eval is used for dynamic dispatch — replace with case statement.
3. Find 'find ... | xargs' pipelines without '-print0' and '-0'. Flag as CRITICAL.
4. Find 'xargs' without '--' argument separator. Flag as WARNING (flag injection).
5. Find command strings built by concatenation: 'cmd="$base $var"' then execution
   via '$cmd' or 'eval "$cmd"'. Flag as CRITICAL if $var can contain external input.
6. Find 'curl' or 'wget' with URL containing unencoded $variables from external sources.
   Flag as WARNING.
7. If in fix mode: replace eval-for-indirect with ${!varname}. Replace eval-for-dispatch
   with case statements. Add -print0 and -0 to find|xargs pipelines. Add -- to xargs.
   Do NOT attempt to auto-fix eval that modifies the execution environment — surface
   those with an explanation.

Report your squad name at the top of your output.
Use the output format from your specialist instructions.
```

## PHASE 5: AGGREGATE AND REPORT

Collect reports from all squads. Deduplicate findings that overlap (e.g., an unquoted variable in an `rm` command flagged by both Quoting Squad and Safety Squad — keep the more severe finding with the more specific description). Sort all findings by severity: BLOCKER first, then CRITICAL, WARNING, INFO.

## PHASE 6: VICTORY REPORT

```
═══════════════════════════════════════════════════════════
                 BASH CRUSADE COMPLETE
═══════════════════════════════════════════════════════════

Scripts audited:   {N}
bash -n errors:    {before} → {after}
shellcheck warns:  {before} → {after} (if available)

Findings summary:
  🚨 BLOCKERS:  {B_before} found, {B_fixed} fixed, {B_remaining} remaining
  🔴 CRITICAL:  {C_before} found, {C_fixed} fixed, {C_remaining} remaining
  🟠 WARNING:   {W_before} found, {W_fixed} fixed, {W_remaining} remaining
  🟡 INFO:      {I_count} noted

Per-squad results:
  🐚 Safety Squad:     {pipefail_added} set -euo pipefail added, {silent_fail_flagged} silent failures flagged
  🐚 Quoting Squad:    {quotes_added} variables quoted, {star_fixed} $* → "$@" conversions
  🐚 Portability Squad: {shebang_fixed} shebangs updated, {brackets_fixed} [ ] → [[ ]] conversions
  🐚 Tempfile Squad:   {mktemp_added} mktemp conversions, {traps_added} EXIT traps added
  🐚 Injection Squad:  {eval_fixed} eval replacements, {xargs_fixed} find|xargs hardened

{if B_remaining > 0}
⛔ BLOCKERS REMAIN. These must be resolved before this code runs in any privileged context:
{list each blocker with file, line, and specific fix required}
{endif}

The shell is not forgiving.
The Inquisition has spoken.
═══════════════════════════════════════════════════════════
```

## IMPORTANT OPERATIONAL RULES

**If `bash -n` reports syntax errors before the crusade starts:** Report these in the reconnaissance report. The squads can still run analysis, but fixes that modify syntax may interact with existing errors. Note this in squad prompts so they verify `bash -n` after each change rather than at the end.

**If no shell scripts are found at the given path:** Report clearly. Do not deploy squads.

**Scope filtering:** When `--scope` targets one squad, still run the `bash -n` baseline and report it. Other squads' findings are unknown, not absent.

**Injection Squad and eval:** Instruct the Injection Squad explicitly: do not attempt to replace `eval` it cannot fully analyze. A flagged `eval` with an explanation is better than a wrong replacement that silently breaks the script. The script's author must make this call.

**Quoting Squad and intentional word splitting:** Some scripts intentionally split words — passing a space-separated list to a command expecting multiple arguments, for example. The Quoting Squad must read context before flagging and must note when an apparent quoting issue is intentional. Flag it anyway, but mark it as "verify intent."

**Tempfile Squad and system paths:** Not every `/tmp/` reference is wrong. `/tmp/.X11-unix`, `/tmp/ssh-*` sockets being read (not created) — these are legitimate. The squad should focus on paths the script itself creates.
