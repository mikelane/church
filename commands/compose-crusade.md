---
description: Unleash parallel Compose Purist agents to audit composable architecture, state discipline, effect hygiene, recomposition performance, and modifier chains across the codebase. No impure composable survives.
allowed-tools: Read, Glob, Grep, Bash, Task, AskUserQuestion
argument-hint: [path] [--scope arch|state|effects|perf|modifiers|all] [--write]
---

## Specialist Dispatch Protocol (Read + general-purpose Task)

**Specialist agents in this crusade (e.g. `compose-arch-purist`) are NOT registered with Claude Code.** They live on disk in `specialists/` and are loaded on demand — never at startup.

For every squad you deploy in Phase 4 (and any later `--fix`/`--write` phase), use this protocol:

1. **`Read` the specialist file** at the path listed for that squad (e.g. `specialists/compose/compose-arch-purist.md`).
2. **Strip the YAML frontmatter** — discard everything up to and including the second `---` line. The remainder is the specialist body.
3. **Compose the subagent prompt** by appending the squad's task block (the file list and mission instructions) to the specialist body, separated by a blank line and a `---` divider.
4. **Call `Task(subagent_type: "general-purpose", description: "<squad name>", prompt: <composed>)`** — one call per squad.
5. **All `Task` calls MUST be issued in a SINGLE message** for true parallelism. This is non-negotiable.

Any squad name referenced in this crusade means: read the corresponding file from the list above, strip its YAML frontmatter, and dispatch via `general-purpose` Task. The squad mission text and assigned files are unchanged.

Specialist files for this crusade:
- `specialists/compose/compose-arch-purist.md`
- `specialists/compose/compose-effects-purist.md`
- `specialists/compose/compose-modifier-purist.md`
- `specialists/compose/compose-perf-purist.md`
- `specialists/compose/compose-state-purist.md`

---

# Compose Crusade: The War Against Impure Composables

Deploy parallel Compose Purist agents to audit every composable, every state holder, every side effect. No tier violation escapes. No rogue LaunchedEffect survives. No modifier ordering sin remains hidden.

## War Cry

```
╔════════════════════════════════════════════════════════════════╗
║              THE COMPOSE PURISTS DESCEND                       ║
║                                                                ║
║  {N} Squads Deployed. Every Composable Will Be Classified.    ║
║  Every Effect Will Be CLEANSED.                                ║
║  The Composition Local Demands PURITY.                         ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Command Arguments

```bash
/compose-crusade [path] [--scope arch|state|effects|perf|modifiers|all] [--write]
```

| Argument | Default | Description |
|----------|---------|-------------|
| `path` | `.` | Root path to audit (absolute path required for agents) |
| `--scope` | `all` | Focus area: `arch` (tier compliance), `state` (state hoisting), `effects` (LaunchedEffect/DisposableEffect), `perf` (stability & recomposition), `modifiers` (chain ordering), `all` (complete audit) |
| `--write` | `false` | If present, squads will REFACTOR composables, not just report |

### Examples
```bash
/compose-crusade
/compose-crusade /workspace/app/src/main/java/com/example/ui --scope arch
/compose-crusade /workspace/app/src/main/java/com/example/features --scope effects --write
/compose-crusade /workspace/app/src/main/java/com/example --scope state
/compose-crusade /workspace/app/src/main/java/com/example/ui --scope modifiers
```

---

## Battle Plan: The Six Phases

### Phase 1: Reconnaissance

**Mission**: Map all composables and classify the battlefield.

1. **Determine absolute path**: Convert user-provided path to absolute
2. **Discover Kotlin files**: Glob for `*.kt` files containing `@Composable` (excluding tests, build dirs)
3. **Count composables**: Total composable functions, ViewModels, state holders, modifier extensions
4. **Scan imports**: Extract import patterns to pre-classify tiers
5. **Identify frameworks**: Detect Navigation Compose/Voyager, Hilt/Koin, ViewModel/Circuit
6. **Scan for red flags**: Grep for `LaunchedEffect(Unit)`, `items` without `key`, `background` before `clip`, `mutableStateOf` without `remember`

**Intelligence Report Format**:
```
=== RECONNAISSANCE REPORT ===
Target Path: /absolute/path/to/audit
Scope: {arch|state|effects|perf|modifiers|all}
Write Mode: {ENABLED|DISABLED}

Composable Files: {count}    ViewModel Files: {count}
State Holders: {count}       Modifier Extensions: {count}

Frameworks: Navigation={detected}, DI={detected}, Arch={detected}

Red Flags:
  LaunchedEffect(Unit): {count}    items() without key: {count}
  background before clip: {count}  mutableStateOf w/o remember: {count}

SQUADS DEPLOYING: 5
```

---

### Phase 2: Ask Permission

- If `--write` NOT set: report-only audit, proceed immediately.
- If `--write` IS set: confirm with user before proceeding:
```
AskUserQuestion: Write mode will REFACTOR composable files, extract state holders, and restructure modifier chains. This changes file structure. Confirm? (yes/no)
```

---

### Phase 3: Squad Organization

Deploy squads based on scope. If `--scope all`, deploy all five. Otherwise deploy only the matching squad.

**Architecture Squad** → `compose-arch-purist`
Handles: Composable tier classification (Screen/Stateful/Stateless), ViewModel coupling, navigation args, parameter conventions

**State Squad** → `compose-state-purist`
Handles: remember/rememberSaveable, state hoisting, derivedStateOf, snapshotFlow, MutableState exposure, ViewModel state patterns

**Effects Squad** → `compose-effects-purist`
Handles: LaunchedEffect keys, DisposableEffect cleanup, SideEffect idempotency, rememberCoroutineScope vs LaunchedEffect, produceState

**Performance Squad** → `compose-perf-purist`
Handles: @Stable/@Immutable annotations, lambda stability, lazy list keys, remember for computations, recomposition scope

**Modifier Squad** → `compose-modifier-purist`
Handles: Modifier ordering, modifier parameter conventions, composed{} vs Modifier.Node, chain extraction, accessibility modifiers

---

### Phase 4: Parallel Deployment

**CRITICAL: All 5 Task tool calls MUST be in a SINGLE message for true parallelism.**

#### Architecture Task (`compose-arch-purist`)
```
You are the Architecture Squad of the Compose Crusade.
Target: {absolute_path} | Scope: {arch|all} | Write Mode: {true|false}

MISSION: Classify every composable into the Three-Tier Architecture.
- Screen Composable: Entry point from navigation. Owns ViewModel. Passes state down.
- Stateful Composable: Manages local UI state (remember, animations). No ViewModel access.
- Stateless Composable: Pure function of parameters. No state. No side effects.

1. Glob *.kt files containing @Composable
2. Classify each composable:
   - References ViewModel/hiltViewModel()/koinViewModel()? → Screen
   - Calls remember/rememberSaveable/mutableStateOf? → Stateful
   - Only reads parameters? → Stateless
   - Does ALL of the above? → MIXED (violation)
3. Screen Composables rendering UI primitives directly → WARNING
4. Stateful Composables accessing ViewModels → WARNING
5. Stateless Composables creating state → WARNING
{IF WRITE MODE} 6. Split MIXED composables into proper tiers {/IF}

Report findings with classification and violations.
```

#### State Task (`compose-state-purist`)
```
You are the State Squad of the Compose Crusade.
Target: {absolute_path} | Scope: {state|all} | Write Mode: {true|false}

MISSION: Enforce the Doctrine of State Hoisting.

1. Grep mutableStateOf calls:
   a. Not wrapped in remember? → CRITICAL: state lost on recomposition
   b. Inside a stateless composable? → WARNING: hoisting violation
2. Scan ViewModel files:
   a. Public MutableState/MutableStateFlow? → WARNING: mutable exposure
   b. LiveData without StateFlow? → INFO: prefer StateFlow
3. Find computed state without derivedStateOf → WARNING
4. Find TextField state with remember but not rememberSaveable → WARNING
5. Find form state lost on config change → CRITICAL
{IF WRITE MODE} 6. Wrap bare mutableStateOf in remember, add derivedStateOf, convert to rememberSaveable {/IF}

Report with file:line references and code snippets.
```

#### Effects Task (`compose-effects-purist`)
```
You are the Effects Squad of the Compose Crusade.
Target: {absolute_path} | Scope: {effects|all} | Write Mode: {true|false}

MISSION: Purge every effect heresy from the composition.

1. Grep LaunchedEffect calls:
   a. Key is Unit/true/constant? → CRITICAL: lifecycle abuse, never restarts
   b. Missing referenced changing values in keys? → WARNING: stale closure
2. Grep DisposableEffect calls:
   a. onDispose empty or missing? → CRITICAL: resource leak
   b. Registers listener without unregister? → CRITICAL
3. Grep SideEffect calls:
   a. Network/DB write inside? → CRITICAL: must be idempotent
4. Grep rememberCoroutineScope:
   a. One-shot tied to composition? → WARNING: use LaunchedEffect
5. Count effects per composable: 4+ → WARNING
{IF WRITE MODE} 6. Fix keys, add cleanup, convert one-shots to LaunchedEffect {/IF}

Report with file:line references and code snippets.
```

#### Performance Task (`compose-perf-purist`)
```
You are the Performance Squad of the Compose Crusade.
Target: {absolute_path} | Scope: {perf|all} | Write Mode: {true|false}

MISSION: Eliminate unnecessary recompositions and enforce stability.

1. Data classes as composable params without @Stable/@Immutable? → WARNING
   - Contains var/mutable collections? → CRITICAL: inherently unstable
2. Lambda params capturing ViewModel/repository? → WARNING: unstable lambda
3. LazyColumn/LazyRow items() without key? → WARNING: incorrect diffing
   - Key is index? → WARNING: use stable ID
4. .filter()/.sort()/.map() without remember? → WARNING: recalculated
5. State read in parent only child needs? → INFO: scope too wide
   - Multiple reads without derivedStateOf? → WARNING
{IF WRITE MODE} 6. Add annotations, keys, remember, derivedStateOf {/IF}

Report with estimated recomposition impact.
```

#### Modifier Task (`compose-modifier-purist`)
```
You are the Modifier Squad of the Compose Crusade.
Target: {absolute_path} | Scope: {modifiers|all} | Write Mode: {true|false}

MISSION: Enforce the Sacred Order of Modifiers.

1. Modifier chain ordering:
   a. .background() before .clip()? → WARNING: bleeds outside shape
   b. .clickable() after .padding()? → WARNING: reduced click target
   c. .size()/.width()/.height() after .weight()? → WARNING: weight ignored
   d. .border() before .clip()? → WARNING: bleeds outside shape
2. Composable signatures:
   a. No modifier param on layout composable? → WARNING
   b. modifier not first optional param? → INFO
   c. Non-Modifier default? → CRITICAL: breaks chain
3. composed {} block? → INFO: prefer Modifier.Node
4. Same 3+ modifier chain duplicated? → WARNING: extract
5. Clickable without contentDescription? → WARNING: accessibility
{IF WRITE MODE} 6. Reorder chains, add modifier param, extract duplicates {/IF}

Report with file:line references and correct ordering examples.
```

---

### Phase 5: Aggregate & Report

1. **Merge** all squad reports into a single list
2. **Deduplicate** findings on same file/line
3. **Classify** by severity (CRITICAL > WARNING > INFO)
4. **Extract** top 5 worst offending files

---

### Phase 6: Victory Report

```
╔════════════════════════════════════════════════════════════════╗
║                   COMPOSE CRUSADE COMPLETE                      ║
╚════════════════════════════════════════════════════════════════╝

BATTLEFIELD SUMMARY
-------------------
Target: {absolute_path}
Scope: {scope}
Composables Audited: {count}  |  ViewModels: {count}
Effects Inspected: {count}    |  Modifier Chains: {count}

SQUAD REPORTS
-------------
✓ Architecture Squad:  {count} issues
✓ State Squad:         {count} issues
✓ Effects Squad:       {count} issues
✓ Performance Squad:   {count} issues
✓ Modifier Squad:      {count} issues

COMPOSABLE TIER CENSUS
----------------------
Screen Composables:    {count}    Stateful Composables:  {count}
Stateless Composables: {count}    UNCLASSIFIED (mixed):  {count} ⚠️

SEVERITY BREAKDOWN
------------------
CRITICAL: {count}
  • God Composables (mixed tiers)     • LaunchedEffect(Unit) abuse
  • Missing DisposableEffect cleanup  • mutableStateOf w/o remember
  • Unstable var/mutable classes      • Non-idempotent SideEffect

WARNING: {count}
  • State hoisting violations    • Missing derivedStateOf
  • Modifier ordering issues     • Missing lazy list keys
  • Exposed MutableState         • Unstable lambdas
  • Missing modifier param       • Missing rememberSaveable
  • Duplicated modifier chains   • Missing accessibility modifiers

INFO: {count}
  • composed {} → Modifier.Node  • Modifier param convention
  • State read scope too wide    • LiveData → StateFlow

{IF WRITE MODE}
REFACTORING: {count} composables split, {count} keys corrected,
{count} cleanups added, {count} modifiers reordered
{/IF}

TOP PRIORITY TARGETS
--------------------
{Top 5 CRITICAL issues with file paths}

═══════════════════════════════════════════════════════════════

{IF clean} THE COMPOSITION LOCAL BLESSES THIS CODEBASE. AMEN.
{ELSE} HERESY DETECTED: {count} CRITICAL issues remain. CLEANSE THEM.
{/IF}
```

---

## Severity Classification

**CRITICAL** (Must Fix Immediately):
- Composables spanning all three tiers (God Composables)
- `LaunchedEffect(Unit)` lifecycle abuse
- Missing `DisposableEffect` cleanup (resource leaks)
- `mutableStateOf` without `remember` (state lost every recomposition)
- Unstable classes with `var`/mutable collections (recomposition cascades)
- Non-idempotent `SideEffect` operations
- Modifier parameter with non-Modifier default

**WARNING** (Below Standard):
- State hoisting violations
- Missing `derivedStateOf` for computed state
- Modifier ordering (`background` before `clip`, `clickable` after `padding`)
- Missing `key` in lazy list `items`
- `MutableState`/`MutableStateFlow` exposed from ViewModel
- Unstable lambda parameters
- Missing `modifier: Modifier = Modifier` parameter
- Missing `rememberSaveable` for user input
- Duplicated modifier chains
- Missing `contentDescription` on interactive elements
- `rememberCoroutineScope` where `LaunchedEffect` fits

**INFO** (Quality Improvements):
- `composed {}` instead of `Modifier.Node`
- Modifier parameter not first optional parameter
- State read scope wider than necessary
- `LiveData` where `StateFlow` preferred

---

## Implementation Workflow

### Step 1: Parse Arguments
```kotlin
val args = parseArguments(userInput)
// args.path, args.scope ("arch"|"state"|"effects"|"perf"|"modifiers"|"all"), args.write
```

### Step 2: Resolve Absolute Path
```bash
cd {args.path} && pwd
```

### Step 3: Run Reconnaissance
```bash
grep -rl "@Composable" --include="*.kt" {path} | grep -v "/build/" | grep -v "/test/" | wc -l
grep -rn "LaunchedEffect(Unit)" --include="*.kt" {path} | grep -v "/build/" | wc -l
grep -rn "mutableStateOf" --include="*.kt" {path} | grep -v "remember" | grep -v "/build/" | wc -l
```

### Step 4: Deploy Squads in Parallel
```kotlin
// ALL squads deployed in a single message for true parallelism
Task(agent = "compose-arch-purist", task = architectureMission)
Task(agent = "compose-state-purist", task = stateMission)
Task(agent = "compose-effects-purist", task = effectsMission)
Task(agent = "compose-perf-purist", task = performanceMission)
Task(agent = "compose-modifier-purist", task = modifierMission)
```

**CRITICAL**: All 5 Task calls MUST be in a single message for true parallelism.

### Steps 5-7: Wait, Aggregate, Report
Monitor squads, merge/deduplicate findings, generate Victory Report with tier census and severity breakdown.

---

## Edge Cases

**Invalid Path**: `ERROR: Target path does not exist: {path}. Provide a valid path.`

**No Kotlin Files**: `WARNING: No Kotlin files found in {path}. Verify path points to Kotlin/Compose codebase.`

**No Composables**: `WARNING: No @Composable functions found. Kotlin files exist but no Compose detected. Verify path points to a Compose UI module.`

**Write Mode**: Always confirm with `AskUserQuestion` before refactoring.

---

## Victory Conditions

**Full Victory**: Zero CRITICAL, zero WARNING, all composables properly tiered.
> "COMPLETE VICTORY. The Composition Local blesses this codebase. Composables are PURE, effects are CLEAN, state is HOISTED, modifiers flow in SACRED ORDER. AMEN."

**Partial Victory**: Zero CRITICAL, some WARNING remain.
> "CRITICAL HERESIES PURGED. {count} WARNING items remain. PROGRESS IS BLESSED."

**Ongoing Battle**: CRITICAL issues present.
> "HERESY PERSISTS. {count} CRITICAL violations corrupt the composition tree. CLEANSE THEM."

---

## Success Metrics

1. **All squads complete** — No errors, all reports received
2. **Composables classified** — Every composable in exactly one tier
3. **Effects verified** — No LaunchedEffect(Unit), all DisposableEffect cleanup present
4. **State hoisted** — State at proper scope
5. **Recomposition minimized** — Stable params, proper keys, derivedStateOf used
6. **Modifiers ordered** — Sacred ordering maintained
7. **Priority targets listed** — Top 5 critical issues with file paths
8. **(Write mode) Refactored** — Mixed composables split, effects corrected, modifiers reordered

A composable should do ONE thing well. If it sources state AND manages effects AND renders complex UI, it is THREE composables waiting to be born.

**The Composition Local demands PURITY. AMEN.**
