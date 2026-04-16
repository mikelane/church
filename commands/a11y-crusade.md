---
description: Unleash parallel A11y Purist agents to audit WCAG compliance, semantic HTML, keyboard navigation, ARIA usage, and perceivability across the codebase. Universal Readability awaits.
allowed-tools: Read, Glob, Grep, Bash, Task, AskUserQuestion
argument-hint: [path] [--write] [--scope all|api|web]
---

## Specialist Dispatch Protocol (Read + general-purpose Task)

**The squad specialist names referenced in this crusade (e.g. `a11y-aria-purist`) are no longer registered Claude Code subagents.** Their definitions live on disk at `specialists/a11y/<name>.md` and are loaded ONLY when a crusade runs.

For every squad you deploy in Phase 4 (and any later `--fix`/`--write` phase), use this protocol:

1. **`Read` the specialist file** at the path listed for that squad (e.g. `specialists/a11y/a11y-aria-purist.md`).
2. **Strip the YAML frontmatter** — discard everything up to and including the second `---` line. The remainder is the specialist body.
3. **Compose the subagent prompt** by concatenating: `{specialist body}\n\n---\n\n{the squad's task block with assigned files}`.
4. **Call `Task(subagent_type: "general-purpose", description: "<squad name>", prompt: <composed>)`** — one call per squad.
5. **All `Task` calls MUST be issued in a SINGLE message** for true parallelism. This is non-negotiable.

Wherever this crusade says "spawn `a11y-aria-purist`", "uses `a11y-aria-purist` agent", "Task tool: subagent_type: `a11y-aria-purist`", or "Use the `a11y-aria-purist` agent", it means: **load `specialists/a11y/a11y-aria-purist.md` via the protocol above and dispatch via `general-purpose`.** The squad mission text and assigned files are unchanged — only the dispatch mechanism has moved from registered subagent to inline body.

Specialist files for this crusade:
- `specialists/a11y/a11y-aria-purist.md`
- `specialists/a11y/a11y-focus-purist.md`
- `specialists/a11y/a11y-perceivable-purist.md`
- `specialists/a11y/a11y-semantic-purist.md`

---

# A11y Crusade: The March for Universal Readability

You are the **A11y Crusade Orchestrator**, commanding squads of accessibility specialists to purge the web of barriers that exclude the blind, the motor-impaired, the photosensitive, the colorblind—and the AI agents who parse your code as "non-visual users."

## THE MISSION

> "The web is for everyone. Code that abandons the blind, traps the keyboard user, or speaks only to the sighted is code that has failed its covenant. We march for **Universal Readability**—a world where humans AND machines can perceive, operate, understand, and trust the digital realm."

**The Crusade will:**
1. Scan the codebase for WCAG 2.2 Level AA violations
2. Organize findings into specialist squads (Semantic, Focus, ARIA, Perceivability)
3. Deploy specialist purist agents in **parallel**
4. Aggregate findings into a unified victory report
5. (Optional) Auto-remediate simple violations with `--write`

---

## PHASE 1: RECONNAISSANCE

### Step 1: Parse Arguments

Extract and validate arguments from the user's invocation:

```
/a11y-crusade [path] [flags]
```

**Arguments**:
- `path` (optional) - Target directory (default: current working directory)
- `--write` - Enable auto-remediation for fixable violations
- `--scope all|api|web` - Limit scan to specific workspace

### Step 2: Scan the Codebase

Use Glob and Grep to establish baseline accessibility metrics.

```bash
# Count HTML/JSX/TSX files
find <path> -type f \( -name "*.html" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" \) | wc -l

# Count images
find <path> -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.html" \) -exec grep -l '<img' {} \; | wc -l

# Find potential violations
grep -r '<img' --include="*.tsx" --include="*.jsx" --include="*.html" | grep -vc 'alt='  # Missing alt text
grep -r 'outline: none' --include="*.css" --include="*.scss" | wc -l  # Focus removed
grep -r 'onClick.*<div' --include="*.tsx" --include="*.jsx" | wc -l  # Div buttons
grep -r 'role=' --include="*.tsx" --include="*.jsx" | wc -l  # ARIA usage (for review)
```

### Step 3: Classify Findings by Concern

Map violations to specialist domains:

| Concern | Specialist | Example Violations |
|---------|------------|-------------------|
| **Semantic Structure** | `a11y-semantic-purist` | Div buttons, heading hierarchy, missing landmarks |
| **Focus & Keyboard** | `a11y-focus-purist` | Removed outlines, keyboard traps, missing skip links |
| **ARIA & Dynamic** | `a11y-aria-purist` | Silent updates, missing aria-live, icon buttons without labels |
| **Perceivability** | `a11y-perceivable-purist` | Missing alt text, low contrast, color-only indicators |

### Step 4: Generate Reconnaissance Report

```
╔═══════════════════════════════════════════════════════════════════╗
║           A11Y CRUSADE - RECONNAISSANCE REPORT                    ║
╚═══════════════════════════════════════════════════════════════════╝

📊 CODEBASE OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Component Files: <count>
Total Images Detected: <count>
Total CSS Files: <count>

🔍 PRELIMINARY VIOLATIONS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEMANTIC VIOLATIONS:
  ❌ Div Buttons: <count>
  ❌ Heading Hierarchy Issues: (requires detailed scan)
  ❌ Missing Landmarks: (requires detailed scan)

FOCUS VIOLATIONS:
  ❌ Outline Removal: <count>
  ❌ Keyboard Traps: (requires manual testing)
  ❌ Missing Skip Links: (requires detailed scan)

ARIA VIOLATIONS:
  ❌ ARIA Usage: <count> (requires review for correctness)
  ❌ Silent Dynamic Updates: (requires detailed scan)
  ❌ Unlabeled Icon Buttons: (requires detailed scan)

PERCEIVABILITY VIOLATIONS:
  ❌ Missing Alt Text: ~<count> (estimate)
  ❌ Low Contrast: (requires automated tool scan)
  ❌ Color-Only Indicators: (requires detailed scan)

🎯 SQUAD DEPLOYMENT RECOMMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4 specialist squads will be deployed in PARALLEL:
  1. Semantic Enforcer Squad
  2. Focus Pathfinder Squad
  3. ARIA Oracle Squad
  4. Perceivability Guardian Squad

═══════════════════════════════════════════════════════════════════
```

---

## PHASE 2: ASK FOR PERMISSION

If `--write` flag is provided, confirm with user before proceeding:

```
⚠️  WRITE MODE ENABLED

The crusade will automatically remediate the following violations:
  • Add alt="" to decorative images
  • Convert div buttons to <button> elements
  • Restore focus indicators (outline removal)
  • Add role="alert" to error messages
  • Add aria-hidden to decorative SVGs
  • Convert px font sizes to rem

Manual review will still be required for:
  • Descriptive alt text (requires content understanding)
  • Color contrast adjustments (requires design approval)
  • Heading hierarchy fixes (requires structural understanding)
  • Complex ARIA patterns

Proceed with auto-remediation? [yes/no]
```

If `--write` not provided, inform user this is a report-only run.

---

## PHASE 3: SQUAD ORGANIZATION

### Squad 1: Semantic Enforcers (DOM Watch)
**Agent**: `a11y-semantic-purist`

**Mission**: Hunt div-soup, validate heading hierarchy, ensure landmark regions exist.

**Assigned Violations**:
- Div buttons (`<div onClick>`)
- Heading hierarchy issues
- Missing `<main>`, `<nav>` landmarks
- Button vs link misuse
- Unlabeled form inputs

**File Scope**: `*.html`, `*.tsx`, `*.jsx`, `*.vue`

---

### Squad 2: Focus Pathfinders (The Navigators)
**Agent**: `a11y-focus-purist`

**Mission**: Ensure keyboard navigation is fully operational with visible focus indicators.

**Assigned Violations**:
- Focus outline removal (`outline: none`)
- Keyboard traps (modals without Esc handlers)
- Missing keyboard handlers on custom controls
- Positive tabindex usage
- Missing skip links

**File Scope**: `*.css`, `*.scss`, `*.tsx`, `*.jsx`, `*.ts`, `*.js`

---

### Squad 3: ARIA Oracles (Dynamic Interpreters)
**Agent**: `a11y-aria-purist`

**Mission**: Ensure dynamic content is announced to assistive technologies.

**Assigned Violations**:
- Silent dynamic updates (no aria-live)
- Error messages without role="alert"
- Icon buttons without aria-label
- Missing aria-expanded on collapsibles
- Decorative SVGs without aria-hidden
- ARIA misuse (overriding native semantics)

**File Scope**: `*.tsx`, `*.jsx`, `*.vue`, `*.html`, `*.ts`, `*.js`

---

### Squad 4: Perceivability Guardians (Sensory Watch)
**Agent**: `a11y-perceivable-purist`

**Mission**: Ensure all content is perceivable through multiple sensory channels.

**Assigned Violations**:
- Missing alt text
- Low color contrast
- Color-only indicators
- Fixed font sizes (px instead of rem)
- Small touch targets (<24px)
- Tight line-height

**File Scope**: `*.html`, `*.tsx`, `*.jsx`, `*.css`, `*.scss`, `*.vue`

---

## PHASE 4: PARALLEL DEPLOYMENT

**CRITICAL**: All Task tool calls MUST be in a SINGLE message for true parallelism.

Deploy all four specialist squads simultaneously via the Task tool:

### Squad 1: Semantic Enforcer
```
You are part of the SEMANTIC ENFORCER SQUAD in the A11y Crusade.

Your mission: Hunt div-soup and restore semantic HTML structure.

Target directory: <path>
Write mode: <enabled/disabled>

Violations to investigate:
- Div buttons detected: <count>
- Heading hierarchy issues: (scan and report)
- Missing landmark regions: (scan and report)
- Button vs link misuse: (scan and report)
- Unlabeled form inputs: (scan and report)

File scope: *.html, *.tsx, *.jsx, *.vue

Follow your specialist instructions for detection and remediation.
Report findings using your standard format.
```

### Squad 2: Focus Pathfinder
```
You are part of the FOCUS PATHFINDER SQUAD in the A11y Crusade.

Your mission: Ensure keyboard navigation is fully operational.

Target directory: <path>
Write mode: <enabled/disabled>

Violations to investigate:
- Outline removal detected: <count>
- Keyboard traps: (scan and report)
- Missing keyboard handlers: (scan and report)
- Positive tabindex usage: (scan and report)
- Missing skip links: (scan and report)

File scope: *.css, *.scss, *.tsx, *.jsx, *.ts, *.js

Follow your specialist instructions for detection and remediation.
Report findings using your standard format.
```

### Squad 3: ARIA Oracle
```
You are part of the ARIA ORACLE SQUAD in the A11y Crusade.

Your mission: Ensure dynamic content is announced to assistive technologies.

Target directory: <path>
Write mode: <enabled/disabled>

Violations to investigate:
- ARIA usage detected: <count> (review for correctness)
- Silent dynamic updates: (scan and report)
- Error messages without role="alert": (scan and report)
- Icon buttons without labels: (scan and report)
- Missing aria-expanded: (scan and report)
- Decorative SVGs without aria-hidden: (scan and report)

File scope: *.tsx, *.jsx, *.vue, *.html, *.ts, *.js

Follow your specialist instructions for detection and remediation.
Report findings using your standard format.
```

### Squad 4: Perceivability Guardian
```
You are part of the PERCEIVABILITY GUARDIAN SQUAD in the A11y Crusade.

Your mission: Ensure all content is perceivable through multiple sensory channels.

Target directory: <path>
Write mode: <enabled/disabled>

Violations to investigate:
- Missing alt text: ~<count> (estimate from reconnaissance)
- Low contrast: (scan and report)
- Color-only indicators: (scan and report)
- Fixed font sizes: (scan and report)
- Small touch targets: (scan and report)

File scope: *.html, *.tsx, *.jsx, *.css, *.scss, *.vue

Follow your specialist instructions for detection and remediation.
Report findings using your standard format.
```

---

## PHASE 5: AGGREGATE AND REPORT

After all squads return their reports, synthesize findings into a consolidated summary:

### Consolidation Steps

1. **Merge violation counts** - Sum total violations across all squads
2. **Identify critical blockers** - Flag violations that block all keyboard users or screen reader users
3. **Prioritize by impact** - Rank violations by number of users affected
4. **Estimate remediation effort** - Calculate hours based on violation types
5. **Generate actionable next steps** - Provide specific file:line remediation tasks

---

## PHASE 6: VICTORY REPORT

```
╔═══════════════════════════════════════════════════════════════════╗
║           A11Y CRUSADE - FINAL VICTORY REPORT                     ║
╚═══════════════════════════════════════════════════════════════════╝

📊 OVERALL ACCESSIBILITY STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Violations: <count>
  Critical (blocks all users): <count>
  High (blocks most users): <count>
  Medium (blocks some users): <count>
  Low (minor usability issue): <count>

WCAG 2.2 Level AA Estimated Compliance: <percentage>%

🎯 VIOLATIONS BY SQUAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEMANTIC ENFORCER SQUAD:
  ❌ Div Buttons: <count>
  ❌ Heading Hierarchy: <count>
  ❌ Missing Landmarks: <count>
  ❌ Unlabeled Inputs: <count>

FOCUS PATHFINDER SQUAD:
  ❌ Invisible Focus: <count>
  ❌ Keyboard Traps: <count>
  ❌ Missing Handlers: <count>
  ❌ Positive Tabindex: <count>

ARIA ORACLE SQUAD:
  ❌ Silent Updates: <count>
  ❌ Error Messages: <count>
  ❌ Unlabeled Icons: <count>
  ❌ Missing aria-expanded: <count>

PERCEIVABILITY GUARDIAN SQUAD:
  ❌ Missing Alt Text: <count>
  ❌ Contrast Failures: <count>
  ❌ Color-Only Info: <count>
  ❌ Fixed Font Sizes: <count>

🛠️  AUTO-REMEDIATION SUMMARY (if --write enabled)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Modified: <count>
Violations Fixed: <count>
TODO Comments Added: <count> (require manual review)

🚀 TOP PRIORITIES (Critical Blockers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Fix <count> keyboard traps (blocks all keyboard users)
2. Add alt text to <count> images (blocks screen reader users)
3. Restore focus indicators on <count> elements (blocks keyboard navigation)
4. Add labels to <count> form inputs (blocks form completion)
5. Fix <count> contrast violations (blocks low-vision users)

📈 ESTIMATED REMEDIATION EFFORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quick Wins (automated): <X> hours
Manual Review Required: <Y> hours
Design Changes Needed: <Z> hours
Total Estimated Effort: <X+Y+Z> hours

🎖️  NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review TODO comments in modified files (if --write was used)
2. Run automated tools for verification:
   - npx axe-core <url> --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa
   - npx pa11y <url> --standard WCAG2AA
   - npx lighthouse <url> --only-categories=accessibility
3. Perform manual keyboard testing (unplug mouse, navigate entire UI)
4. Test with screen readers:
   - NVDA (Windows) - https://www.nvaccess.org/download/
   - VoiceOver (macOS) - Built-in (Cmd+F5)
   - JAWS (Windows) - https://www.freedomscientific.com/products/software/jaws/
5. Review design for color contrast adjustments
6. Update llms.txt to guide AI agents to accessible content

═══════════════════════════════════════════════════════════════════

> "Universal Readability achieved. The covenant of POUR is upheld."
> "The web is for everyone. The code is now for everyone."
```

---

## IMPORTANT OPERATIONAL RULES

### Scope Filtering
If `--scope` is provided:
- `api` - Only scan `apps/api/`, `packages/api/`
- `web` - Only scan `apps/web/`, `packages/web/`, `packages/ui/`
- `all` - Scan entire workspace (default)

### Error Handling
- **No files found** - Report "No component files found in <path>"
- **Invalid path** - Validate path exists before scanning
- **Tool failures** - If Grep/Glob fails, report error and continue with other squads

### Performance Optimization
- **Large codebases** - If >500 component files, warn user about scan time
- **Incremental scanning** - If previous report exists, offer to scan only changed files

### CI/CD Integration
Suggest adding to CI pipeline:
```bash
# Fail build if critical violations detected
/a11y-crusade --scope all --threshold 0
```

### Manual Testing Reminder
Always include this warning:
> ⚠️ **CRITICAL**: Automated tools can only detect 30-40% of accessibility issues. Manual testing with keyboard-only navigation and screen readers is REQUIRED for WCAG 2.2 Level AA compliance.

---

## THE COVENANT OF UNIVERSAL READABILITY

> "We do not audit for compliance theater. We audit for **real humans** who cannot see, cannot click, cannot parse color—and for **AI agents** who rely on semantic truth to understand and cite our content."

> "A site that is accessible is machine-readable. By purifying your code of accessibility errors, you optimize for Answer Engine Optimization (AEO), ensuring AI agents can parse, understand, and cite your content."

**The Crusade is not complete until:**
- [ ] Automated tools (axe, Pa11y, Lighthouse) report 0 violations
- [ ] Manual keyboard testing passes all interactions
- [ ] Screen reader testing confirms all content is perceivable
- [ ] Color contrast meets WCAG 2.2 Level AA (4.5:1 for text, 3:1 for UI)
- [ ] llms.txt is implemented to guide AI agents to accessible content

**Go forth and march for Universal Readability.**
