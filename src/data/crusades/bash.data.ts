import type { CrusadeDetail } from '../crusade-detail.types';

export const bashCrusade: CrusadeDetail = {
  slug: 'bash',
  name: 'The Bash Crusade',
  command: '/bash-crusade',
  icon: '🐚',
  tagline:
    'Every unquoted variable is a time bomb. Every missing set -e is a silent catastrophe. The shell is not forgiving.',
  quote:
    'Line 47. `rm -rf $TMPDIR/$USER`. `$TMPDIR` was empty. You ran `rm -rf /`. The shell did not ask for confirmation. The shell does not have feelings. You have been warned.',
  color: 'from-zinc-600 to-slate-900',
  gradientFrom: 'zinc-600',
  gradientTo: 'slate-900',
  description:
    'The Bash Crusade deploys five specialist squads against every shell script in the codebase. Missing `set -euo pipefail` headers. Unquoted variables one space away from corrupting a file path. Hardcoded `/tmp` names that two concurrent processes will overwrite. `eval` with user input flowing in. `find | xargs` without null delimiters. The shell does exactly what you wrote. The Inquisition finds where what you wrote is not what you meant.',
  battleCry:
    'The Shell Inquisition activates. Every unquoted variable is a vulnerability. Every missing trap is a resource leak. No script without set -euo pipefail walks free.',
  commandments: [
    {
      numeral: 'I',
      text: 'All scripts begin with `set -euo pipefail` — or they begin with failure. The shell does not stop on error unless you tell it to. It will continue through every catastrophe and report success.',
    },
    {
      numeral: 'II',
      text: 'All variables shall be quoted — `"$var"` not `$var`, always, everywhere. The shell splits on whitespace. Your filenames have spaces. These facts will meet.',
    },
    {
      numeral: 'III',
      text: 'Use `[[ ]]` not `[ ]` — the single bracket is a fossil from another age, a regular command with no special handling of word splitting, no regex, no glob matching. `[[ ]]` is a bash keyword. Use it.',
    },
    {
      numeral: 'IV',
      text: 'Temp files use `mktemp` and are cleaned up in a `trap` on EXIT. A hardcoded `/tmp/name` is a race condition. A cleanup without a trap is cleanup that only happens when things go right.',
    },
    {
      numeral: 'V',
      text: '`eval` is forbidden — if you need `eval`, you need a different language. `${!varname}` replaces eval-for-indirection. A `case` statement replaces eval-for-dispatch. Nothing replaces eval-on-user-input except a security incident.',
    },
  ],
  specialists: [
    {
      name: 'The Errexit Enforcer',
      icon: '🛡️',
      focus: 'set -euo pipefail headers, silent failure patterns, || true masking, ERR traps',
      description:
        'Has read the post-mortem where the deployment script ran through seven failed commands and reported success. The `set -e` line was missing. The database was left inconsistent. Nobody noticed until customers called. Finds every script that trusts the shell to stop on failure without being told to. The shell will not stop.',
    },
    {
      name: 'The Quote Warden',
      icon: '📜',
      focus:
        'Unquoted variable expansions, word splitting, $* vs "$@", IFS manipulation, glob disasters',
      description:
        'Knows what `cp $file /backup/` does when `$file` is "my important report.txt". Knows what `[ -f $path ]` does when `$path` contains a space. Finds every unquoted expansion that is one unusual filename away from breaking something — or deleting something it was not supposed to touch.',
    },
    {
      name: 'The POSIX Apostle',
      icon: '⛪',
      focus: 'Shebangs, [ ] vs [[ ]], echo vs printf, function syntax, bashisms in sh scripts',
      description:
        'A script that declares `#!/bin/sh` and uses `[[` is lying about what it requires. A bash script using `[ ]` everywhere is using a fossil when `[[ ]]` exists. Audits every shebang against the constructs used in the script body, and flags every `echo -e` that belongs in a `printf`.',
    },
    {
      name: 'The Mktemp Sentinel',
      icon: '🏕️',
      focus: 'mktemp usage, trap EXIT cleanup, hardcoded /tmp paths, lock file atomicity',
      description:
        '`/tmp/deploy_backup`. Every deployment script on the server creates that file. Two concurrent deployments write to it simultaneously. The hotfix backup is the CI job\'s data. Has seen this exact incident. Finds every hardcoded temp path, every missing `trap EXIT`, every cleanup that only runs on the happy path.',
    },
    {
      name: 'The Injection Exorcist',
      icon: '☠️',
      focus: 'eval on user input, dynamic command strings, find|xargs without -print0, URL injection',
      description:
        '`eval "backup_dir=$user_input"`. The user typed `$(rm -rf ~)`. The shell expanded it before eval saw it. The home directory was gone before the variable was set. Traces every `eval` to its data sources, hardens every `find | xargs` with null delimiters, and flags every URL constructed from unencoded external input.',
    },
  ],
  howItWorks: [
    {
      phase: 'Reconnaissance',
      description:
        'Scans all `.sh`, `.bash` files and scripts identified by shebang. Runs `bash -n` syntax checks on each script for a baseline, then counts missing `set -euo pipefail` headers, unquoted variables in file operations, `eval` usages, hardcoded `/tmp` paths, and unsafe `find|xargs` pipelines. Produces a severity-classified report before touching a single file.',
    },
    {
      phase: 'Squad Assignment',
      description:
        'All scripts go to all five squads. The Safety Squad hunts missing error flags. The Quoting Squad hunts unquoted expansions. The Portability Squad checks shebangs against constructs. The Tempfile Squad audits every temp resource. The Injection Squad traces every `eval` to its data sources. Scope filtering deploys one squad when you know where the problem is.',
    },
    {
      phase: 'Parallel Deployment',
      description:
        'All five squads launch simultaneously via the Task tool in a single message. Each specialist carries only the doctrine it needs — the Injection Squad knows nothing about portability, the Portability Squad knows nothing about temp file races.',
    },
    {
      phase: 'Fix Verification',
      description:
        'Each specialist runs `bash -n` after applying fixes to verify syntax is intact. Fixes that break syntax are reverted and surfaced as recommendations. The Injection Squad will not replace an `eval` it cannot fully analyze — a flagged `eval` with an explanation is better than a wrong replacement that silently breaks the script.',
    },
    {
      phase: 'Deduplication',
      description:
        'Squad reports are merged and deduplicated. An unquoted variable in an `rm` command flagged by both the Quoting Squad and the Safety Squad becomes one finding with the more specific description. All findings are sorted by severity.',
    },
    {
      phase: 'Victory Report',
      description:
        'Aggregated findings with before/after counts for `bash -n` errors and per-squad results. Blockers surface first with the exact fix required. The shell does not forgive. The Inquisition reports what it found.',
    },
  ],
} as const;
