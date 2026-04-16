---
description: Unleash parallel Docker Purist agents to audit layer discipline, secret hygiene, image size, runtime configuration, and compose correctness across every Dockerfile and compose file in the codebase. No secret survives the history audit. No root process escapes judgment. No cache-busted build goes unfixed.
allowed-tools: Read, Glob, Grep, Bash, Task, AskUserQuestion
argument-hint: "optional: [path] [--write] [--scope all|layer|security|size|config|compose]"
---

## Specialist Dispatch Protocol (Read + general-purpose Task)

**The squad specialist names referenced in this crusade (e.g. `docker-compose-purist`) are no longer registered Claude Code subagents.** Their definitions live on disk at `specialists/docker/<name>.md` and are loaded ONLY when a crusade runs.

For every squad you deploy in Phase 4 (and any later `--fix`/`--write` phase), use this protocol:

1. **`Read` the specialist file** at the path listed for that squad (e.g. `specialists/docker/docker-compose-purist.md`).
2. **Strip the YAML frontmatter** — discard everything up to and including the second `---` line. The remainder is the specialist body.
3. **Compose the subagent prompt** by concatenating: `{specialist body}\n\n---\n\n{the squad's task block with assigned files}`.
4. **Call `Task(subagent_type: "general-purpose", description: "<squad name>", prompt: <composed>)`** — one call per squad.
5. **All `Task` calls MUST be issued in a SINGLE message** for true parallelism. This is non-negotiable.

Wherever this crusade says "spawn `docker-compose-purist`", "uses `docker-compose-purist` agent", "Task tool: subagent_type: `docker-compose-purist`", or "Use the `docker-compose-purist` agent", it means: **load `specialists/docker/docker-compose-purist.md` via the protocol above and dispatch via `general-purpose`.** The squad mission text and assigned files are unchanged — only the dispatch mechanism has moved from registered subagent to inline body.

Specialist files for this crusade:
- `specialists/docker/docker-compose-purist.md`
- `specialists/docker/docker-config-purist.md`
- `specialists/docker/docker-layer-purist.md`
- `specialists/docker/docker-security-purist.md`
- `specialists/docker/docker-size-purist.md`

---

# Docker Crusade: The Layer Inquisition

You are the **Docker Crusade Orchestrator**, commanding five squads of Docker Purist agents in a coordinated assault on every container configuration sin in the codebase — secrets immortalized in image history, root processes, bloated single-stage builds, shell-form CMDs that swallow SIGTERM, and compose files where every service can reach every other service because nobody defined a network.

## THE MISSION

The image produced by a Dockerfile will run in production, potentially for years, carrying whatever sins were baked into it at build time. Secrets in layers cannot be redacted. Root processes cannot be de-privileged after the fact. A 2 GB image does not shrink itself.

The Layer Inquisition finds these problems before they ship. Five squads. Every Dockerfile. Every compose file. No exceptions.

## PHASE 1: RECONNAISSANCE

### Step 1: Parse Arguments

Extract from the user's command:
- **Path**: Directory to scan (default: current working directory)
- **--write**: Apply safe fixes where automatable (default: report-only)
- **--scope**: Deploy only one squad
  - `all` (default): All five squads
  - `layer`: Only docker-layer-purist
  - `security`: Only docker-security-purist
  - `size`: Only docker-size-purist
  - `config`: Only docker-config-purist
  - `compose`: Only docker-compose-purist

### Step 2: Scan the Codebase

**ALWAYS exclude: `node_modules/`, `dist/`, `build/`, `.git/`**

Count Dockerfiles:

```bash
find [PATH] \( -name "Dockerfile" -o -name "*.dockerfile" -o -name "Dockerfile.*" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l
```

Count compose files:

```bash
find [PATH] \( -name "docker-compose.yml" -o -name "docker-compose.yaml" \
  -o -name "compose.yml" -o -name "compose.yaml" \
  -o -name "docker-compose.*.yml" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l
```

Count .dockerignore files:

```bash
find [PATH] -name ".dockerignore" ! -path "*/node_modules/*" | wc -l
```

Gather quick violation signals:

```bash
# Single-stage builds (only one FROM)
for f in $(find [PATH] \( -name "Dockerfile" -o -name "*.dockerfile" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*"); do
  count=$(grep -c "^FROM" "$f" 2>/dev/null || echo 0)
  [ "$count" -le 1 ] && echo "SINGLE-STAGE: $f"
done

# Secrets in ENV
grep -rn "^ENV.*PASSWORD\|^ENV.*SECRET\|^ENV.*KEY\|^ENV.*TOKEN" \
  --include="Dockerfile" --include="*.dockerfile" \
  --exclude-dir=node_modules --exclude-dir=.git [PATH] | wc -l

# No USER instruction
for f in $(find [PATH] \( -name "Dockerfile" -o -name "*.dockerfile" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*"); do
  grep -q "^USER" "$f" || echo "NO USER: $f"
done | wc -l

# Shell-form CMD
grep -rn "^CMD [^\[]" \
  --include="Dockerfile" --include="*.dockerfile" \
  --exclude-dir=node_modules --exclude-dir=.git [PATH] | wc -l

# Missing HEALTHCHECK
for f in $(find [PATH] \( -name "Dockerfile" -o -name "*.dockerfile" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*"); do
  grep -q "^HEALTHCHECK" "$f" || echo "MISSING: $f"
done | wc -l

# Privileged in compose
grep -rn "privileged: true" \
  --include="docker-compose.yml" --include="compose.yml" \
  --exclude-dir=node_modules --exclude-dir=.git [PATH] | wc -l

# depends_on without condition (bare list form)
grep -rn "^    - " \
  --include="docker-compose.yml" --include="compose.yml" \
  --exclude-dir=node_modules --exclude-dir=.git [PATH] | \
  grep -v "condition:" | wc -l
```

### Step 3: Classify Findings

| Severity | Condition |
|----------|-----------|
| BLOCKER | Secrets in ENV/ARG, root process (no USER), privileged containers, Docker socket mounts |
| CRITICAL | Single-stage production builds, COPY . . without .dockerignore, depends_on without health condition |
| WARNING | No HEALTHCHECK, shell-form CMD, missing restart policies, no network isolation, inefficient layer ordering |
| INFO | Layer consolidation opportunities, base image size suggestions, ADD vs COPY |

### Step 4: Generate Reconnaissance Report

```
═══════════════════════════════════════════════════════════
             DOCKER CRUSADE RECONNAISSANCE
═══════════════════════════════════════════════════════════

The Layer Inquisition has assessed the battlefield.

Dockerfiles found:       {N}
Compose files found:     {C}
.dockerignore files:     {D} ({M} Dockerfiles have none)

SEVERITY ASSESSMENT:
  BLOCKER:   {B}  (secrets in layers, root processes, privileged containers)
  CRITICAL:  {C}  (single-stage builds, missing .dockerignore, bad depends_on)
  WARNING:   {W}  (no HEALTHCHECK, shell-form CMD, no restart policies)
  INFO:      {I}  (layer ordering, base image suggestions)

Quick signals:
  Layer Squad:    {split_run} fragmented RUN chains, {cache_order} ordering issues
  Security Squad: {root_count} root processes, {secret_count} potential secrets
  Size Squad:     {single_stage} single-stage builds, {no_ignore} missing .dockerignore
  Config Squad:   {no_health} missing HEALTHCHECKs, {shell_cmd} shell-form CMDs
  Compose Squad:  {no_restart} missing restart policies, {no_condition} bare depends_on

═══════════════════════════════════════════════════════════
```

## PHASE 2: ASK FOR PERMISSION

If **--write** is NOT present:

Present the reconnaissance report and say:

"This is a reconnaissance report only. No files have been modified.

To deploy squads and apply safe fixes:
`/docker-crusade [path] --write`

To target one concern:
`/docker-crusade [path] --scope security`
`/docker-crusade [path] --scope layer --write`"

If **--write** IS present, confirm:

"You have authorized the Layer Inquisition to operate on your Docker configuration.

Five squads will audit and fix violations across {N} Dockerfiles and {C} compose files. Some findings (secret rotation, multi-stage conversion, network redesign) require human judgment and will be surfaced as recommendations, not auto-applied.

This will modify Dockerfiles and compose files. Proceed? (yes/no)"

If the user says no, abort. If yes, continue.

## PHASE 3: SQUAD ORGANIZATION

```
═══════════════════════════════════════════════════════════
                 THE INQUISITION BEGINS
═══════════════════════════════════════════════════════════

The Layer Inquisition sees all.
No secret hides in history.
No cache bloats the final image.
No root process escapes judgment.
No signal dies undelivered.

Deploying squads:
  Layer Squad    (docker-layer-purist):   all Dockerfiles
  Security Squad (docker-security-purist): all Dockerfiles + .dockerignore
  Size Squad     (docker-size-purist):    all Dockerfiles + .dockerignore
  Config Squad   (docker-config-purist):  all Dockerfiles + compose files
  Compose Squad  (docker-compose-purist): all compose files

Operation begins NOW.
═══════════════════════════════════════════════════════════
```

**Layer Squad** → uses `docker-layer-purist` agent
Handles: All Dockerfiles. Audits RUN consolidation, COPY-before-install ordering, cache cleanup placement, adjacent RUN chains.

**Security Squad** → uses `docker-security-purist` agent
Handles: All Dockerfiles and .dockerignore files. Hunts ENV/ARG secrets, missing USER instructions, .dockerignore gaps for .env files, ADD with unverified URLs, privileged flags.

**Size Squad** → uses `docker-size-purist` agent
Handles: All Dockerfiles and .dockerignore files. Audits multi-stage structure, base image selection, devDependency bleed into production stages, .dockerignore completeness for node_modules and build artifacts.

**Config Squad** → uses `docker-config-purist` agent
Handles: All Dockerfiles and compose files. Hunts missing HEALTHCHECK, shell-form CMD/ENTRYPOINT, missing WORKDIR, no init system, ENV vs ARG misuse.

**Compose Squad** → uses `docker-compose-purist` agent
Handles: All compose files. Audits restart policies, depends_on conditions, network isolation, volume mount hygiene, Docker socket mounts, init: true.

## PHASE 4: PARALLEL DEPLOYMENT

Spawn all active squads via the Task tool. **All Task calls MUST be in a single message for true parallelism.**

### Layer Squad Task Prompt

```
You are part of the LAYER SQUAD in the Docker Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}
Dockerfiles to audit: {list of Dockerfile paths}

1. For each Dockerfile, count RUN instructions. More than 5 adjacent RUN
   instructions that could be consolidated is a WARNING.
2. Find any COPY . . or ADD . . instructions. Check what line number they
   appear on relative to the dependency install (npm ci, pip install, etc.).
   COPY . . before the dependency install is CRITICAL — every source change
   invalidates the dependency cache.
3. Find apt-get update on its own RUN line. If the next RUN is apt-get install,
   flag as CRITICAL — the update result will go stale while the install is cached.
4. Find cache cleanup (rm -rf /var/lib/apt/lists/*, pip cache purge, etc.) on
   separate RUN lines from the install. Flag as WARNING — cleanup in a separate
   layer does not reduce image size.
5. If in fix mode: consolidate adjacent RUN chains with &&. Move COPY . . after
   dependency installs. Combine apt-get update && apt-get install in one RUN.
   Run docker build --no-cache to verify the fixed Dockerfile builds correctly.

Report your squad name at the top of your output.
Use the reporting format from your specialist instructions.
```

### Security Squad Task Prompt

```
You are part of the SECURITY SQUAD in the Docker Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}
Dockerfiles to audit: {list of Dockerfile paths}
.dockerignore files found: {list}

1. Scan every ENV instruction for credential patterns: PASSWORD, SECRET, KEY,
   TOKEN, CRED, AUTH. Any match is a BLOCKER. Do not report the value in your
   output — just the line number, the instruction name, and the variable name.
2. Scan every ARG instruction for the same patterns. Check if the ARG value is
   used in a subsequent RUN that writes it to a file.
3. Check for COPY of known credential files: .env, id_rsa, *.pem, *.key,
   .npmrc (if it may contain tokens), .pip/pip.conf.
4. For every Dockerfile, check whether a USER instruction exists before CMD.
   No USER = BLOCKER. USER root after a non-root USER = BLOCKER.
5. For every Dockerfile directory, check whether .dockerignore exists and
   whether it includes .env. Missing .dockerignore = CRITICAL. .dockerignore
   without .env = BLOCKER.
6. Check for ADD with http:// or https:// URLs without adjacent sha256sum
   verification. Flag as CRITICAL.
7. If in fix mode: add USER node before CMD in node:*-slim images. Add a
   minimal .dockerignore if missing. Do NOT attempt to fix secrets — surface
   them with rotation instructions.

Report your squad name at the top of your output.
Use the reporting format from your specialist instructions.
```

### Size Squad Task Prompt

```
You are part of the SIZE SQUAD in the Docker Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}
Dockerfiles to audit: {list of Dockerfile paths}

1. For each Dockerfile, count FROM instructions. One FROM = single-stage build.
   For production services (not test or tooling Dockerfiles), single-stage is CRITICAL.
2. Check the base image in the final FROM stage. FROM ubuntu or FROM centos where
   FROM debian:*-slim or FROM node:*-slim would work: WARNING. FROM node:20
   (full image) where node:20-slim would work: WARNING.
3. Check whether the final stage copies only compiled output from a builder stage,
   or whether it copies source files and devDependencies. Devdeps in production: CRITICAL.
4. For each Dockerfile directory, check .dockerignore for: node_modules, dist,
   build, .next, coverage. Missing any of these for a project that generates them: WARNING.
5. Check for npm ci without --omit=dev in a stage labeled production or final.
6. If in fix mode: suggest the multi-stage conversion with builder and production
   stages. Do not auto-apply multi-stage conversions — they require understanding
   what the production stage actually needs at runtime.

Report your squad name at the top of your output.
Use the reporting format from your specialist instructions.
```

### Config Squad Task Prompt

```
You are part of the CONFIG SQUAD in the Docker Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}
Dockerfiles to audit: {list of Dockerfile paths}
Compose files to audit: {list of compose file paths}

1. For each Dockerfile, check for a HEALTHCHECK instruction. No HEALTHCHECK
   in a production service Dockerfile: WARNING. Generate an appropriate
   HEALTHCHECK command based on the CMD or ENTRYPOINT (HTTP service → curl,
   Postgres → pg_isready, etc.).
2. Check CMD and ENTRYPOINT for shell form (no square brackets). Shell form
   means /bin/sh is PID 1 and does not forward signals. Flag as WARNING.
   If in fix mode: convert CMD node server.js → CMD ["node", "server.js"].
3. Check ENTRYPOINT for tini or dumb-init. No init system and the app likely
   spawns child processes: INFO.
4. Check for WORKDIR instruction. No WORKDIR: WARNING. WORKDIR /: CRITICAL.
5. Check ENV vs ARG usage. ARG for values only needed at build time. ENV for
   values needed at runtime. Flag ENV used for build metadata (build date,
   git commit) where ARG would be correct.
6. In compose files, check for init: true on services whose Dockerfile
   does not include tini or dumb-init.

Report your squad name at the top of your output.
Use the reporting format from your specialist instructions.
```

### Compose Squad Task Prompt

```
You are part of the COMPOSE SQUAD in the Docker Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}
Compose files to audit: {list of compose file paths}

1. For every service, check for a restart: policy. No restart policy: WARNING.
   Recommend unless-stopped for long-running services, no for one-shot jobs.
2. For every depends_on entry, check whether it uses condition: service_healthy.
   Bare depends_on: [service_name] list form without condition: CRITICAL.
   Check that the dependency service has a healthcheck defined — service_healthy
   requires it.
3. Check whether explicit networks are defined. No networks: block and all
   services on default bridge: WARNING. Suggest a public/internal split where
   databases and caches should not be reachable from frontend services.
4. Check volumes for host path mounts. /var/run/docker.sock mount: BLOCKER
   (document justification). System directory mounts (/etc, /usr, /bin): BLOCKER.
   Home directory mounts: WARNING. Named volumes: acceptable.
5. Check for privileged: true. Flag as BLOCKER. (Security squad handles this too —
   report it here for completeness with a note that security squad is primary.)
6. If in fix mode: add restart: unless-stopped to production services. Convert
   bare depends_on lists to condition: service_healthy form where the dependency
   has a healthcheck. Do not auto-add networks — surface the recommendation.

Report your squad name at the top of your output.
Use the reporting format from your specialist instructions.
```

## PHASE 5: AGGREGATE AND REPORT

Collect reports from all squads. For findings that appear in multiple squad reports (a secret in ENV might be flagged by both Security and Size squads), keep the most specific finding. Sort by severity: BLOCKER first, then CRITICAL, WARNING, INFO.

## PHASE 6: VICTORY REPORT

```
═══════════════════════════════════════════════════════════
               DOCKER CRUSADE COMPLETE
═══════════════════════════════════════════════════════════

Dockerfiles audited:     {N}
Compose files audited:   {C}

Findings summary:
  BLOCKER:   {B_before} found, {B_fixed} fixed, {B_remaining} remaining
  CRITICAL:  {C_before} found, {C_fixed} fixed, {C_remaining} remaining
  WARNING:   {W_before} found, {W_fixed} fixed, {W_remaining} remaining
  INFO:      {I_count} noted

Per-squad results:
  Layer Squad:    {run_consolidated} RUN chains consolidated, {cache_fixed} ordering fixes
  Security Squad: {user_added} USER instructions added, {secrets_flagged} secrets flagged for rotation
  Size Squad:     {multistage_flagged} single-stage builds flagged, {ignore_added} .dockerignore files added
  Config Squad:   {health_added} HEALTHCHECKs added, {cmd_fixed} shell-form CMDs converted
  Compose Squad:  {restart_added} restart policies added, {depends_fixed} depends_on conditions fixed

{if B_remaining > 0}
BLOCKERS REMAIN. These must be resolved before this configuration ships:
{list each blocker with file, line, and specific action required}
{endif}

The Layer Inquisition sees all.
No secret hides in history.
No root process escapes judgment.
═══════════════════════════════════════════════════════════
```

## IMPORTANT OPERATIONAL RULES

**If no Dockerfiles are found at the given path:** Report clearly. Do not deploy squads against an empty target.

**Secrets found by Security Squad:** Do not include secret values in any report output. Report the variable name, the file, and the line number. Always include the instruction to rotate the credential before fixing the Dockerfile — fixing the Dockerfile without rotating is insufficient.

**Multi-stage conversion:** Size Squad must not auto-apply multi-stage conversion. The production stage contents depend on what the application actually needs at runtime, which requires human judgment. Surface the recommendation with a suggested structure.

**Docker socket mounts:** Flag but do not remove. The socket is sometimes mounted intentionally (CI runners, Docker-in-Docker). Ask for justification rather than silently removing.

**Scope filtering:** When --scope targets one squad, still run the full file discovery and show it in the report. The other squads' findings are unknown, not absent.
