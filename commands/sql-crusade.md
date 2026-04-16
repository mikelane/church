---
description: Unleash parallel SQL Purist agents to audit queries, indexes, schema types, migration safety, and injection vectors across every database access pattern in the codebase. No SELECT *. No N+1. No VARCHAR(255). No string-formatted SQL. The query planner sees your shame.
allowed-tools: Read, Glob, Grep, Bash, Task, AskUserQuestion
argument-hint: "optional: [path] [--write] [--scope all|query|index|schema|migration|security]"
---

## Specialist Dispatch Protocol (Read + general-purpose Task)

**Specialist agents in this crusade (e.g. `sql-index-purist`) are NOT registered with Claude Code.** They live on disk in `specialists/` and are loaded on demand — never at startup.

For every squad you deploy in Phase 4 (and any later `--fix`/`--write` phase), use this protocol:

1. **`Read` the specialist file** at the path listed for that squad (e.g. `specialists/sql/sql-index-purist.md`).
2. **Strip the YAML frontmatter** — discard everything up to and including the second `---` line. The remainder is the specialist body.
3. **Compose the subagent prompt** by appending the squad's task block (the file list and mission instructions) to the specialist body, separated by a blank line and a `---` divider.
4. **Call `Task(subagent_type: "general-purpose", description: "<squad name>", prompt: <composed>)`** — one call per squad.
5. **All `Task` calls MUST be issued in a SINGLE message** for true parallelism. This is non-negotiable.

Any squad name referenced in this crusade means: read the corresponding file from the list above, strip its YAML frontmatter, and dispatch via `general-purpose` Task. The squad mission text and assigned files are unchanged.

Specialist files for this crusade:
- `specialists/sql/sql-index-purist.md`
- `specialists/sql/sql-migration-purist.md`
- `specialists/sql/sql-query-purist.md`
- `specialists/sql/sql-schema-purist.md`
- `specialists/sql/sql-security-purist.md`

---

# SQL Crusade: The Query Inquisition

You are the **SQL Crusade Orchestrator**, commanding five squads of SQL Purist agents in a coordinated audit of every database access pattern — every query shape, every index decision, every schema type choice, every migration file, and every place user input might touch a SQL string.

## THE MISSION

Databases outlive the applications that use them. Schema decisions made at launch are still running five years later when the table has 200 million rows and the `SERIAL` primary key is at 1.9 billion. `SELECT *` written for convenience in a prototype is still fetching 47 columns in production while the business wonders why the API is slow. The f-string query that "works fine" in development is waiting for someone to discover it.

Your mission: find these problems while they are still cheap to fix. Report every violation with the specific corrective action. Fix what can be safely automated. Surface what requires human judgment.

## PHASE 1: RECONNAISSANCE

### Step 1: Parse Arguments

Extract from the user's command:
- **Path**: Directory to scan (default: current working directory)
- **--write**: Apply safe automatable fixes (default: report-only)
- **--scope**: Deploy only one squad
  - `all` (default): All five squads
  - `query`: Only sql-query-purist
  - `index`: Only sql-index-purist
  - `schema`: Only sql-schema-purist
  - `migration`: Only sql-migration-purist
  - `security`: Only sql-security-purist

### Step 2: Scan the Codebase

**ALWAYS exclude: `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `__pycache__/`**

Count relevant files:

```bash
# SQL files
find [PATH] -name "*.sql" \
  ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/build/*" | wc -l

# Migration files
find [PATH] \( -path "*/migrations/*.py" -o -path "*/migrations/*.sql" \
  -o -path "*/db/migrate/*" \) \
  ! -path "*/node_modules/*" ! -path "*/__pycache__/*" | wc -l

# ORM model files (Python)
find [PATH] -name "models.py" -o -name "models/*.py" \
  ! -path "*/node_modules/*" ! -path "*/__pycache__/*" | wc -l

# Prisma schema
find [PATH] -name "*.prisma" ! -path "*/node_modules/*" | wc -l
```

Gather quick violation signals:

```bash
# SELECT *
grep -rn "SELECT \*\|select \*" [PATH] \
  --include="*.sql" --include="*.py" --include="*.ts" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=dist | wc -l

# Foreign keys (to compare against index count)
grep -rn "REFERENCES\b\|ForeignKey(" [PATH] \
  --include="*.sql" --include="*.py" --exclude-dir=node_modules | wc -l

# Indexes
grep -rn "CREATE INDEX\|index=True\|Index(" [PATH] \
  --include="*.sql" --include="*.py" --exclude-dir=node_modules | wc -l

# TIMESTAMP without TZ
grep -rn "\bTIMESTAMP\b" [PATH] --include="*.sql" \
  --exclude-dir=node_modules | grep -v "TIMESTAMPTZ\|WITH TIME ZONE" | wc -l

# VARCHAR with length
grep -rn "VARCHAR([0-9]" [PATH] \
  --include="*.sql" --include="*.py" --exclude-dir=node_modules | wc -l

# String-formatted SQL (injection signals)
grep -rn 'f".*SELECT\|f".*WHERE\|\$queryRaw(`' [PATH] \
  --include="*.py" --include="*.ts" --include="*.js" \
  --exclude-dir=node_modules | wc -l

# Migrations without downgrade
find [PATH] -path "*/migrations/*.py" ! -path "*/__pycache__/*" \
  | xargs grep -rL "def downgrade\|def down" 2>/dev/null | wc -l

# OFFSET pagination
grep -rn "\bOFFSET\b\|\.offset(" [PATH] \
  --include="*.sql" --include="*.py" --include="*.ts" \
  --exclude-dir=node_modules | wc -l
```

### Step 3: Classify Findings by Severity

| Severity | Condition |
|----------|-----------|
| BLOCKER | SQL injection vector (string-formatted query with variable input); destructive migration with no rollback; hardcoded database credentials in source |
| CRITICAL | `SELECT *` in application queries; N+1 patterns; unindexed foreign keys; `TIMESTAMP` without timezone; `SERIAL`/`INT` primary keys |
| WARNING | `VARCHAR(255)`; `OFFSET` pagination; missing `downgrade()`; `FLOAT` for monetary data; `CREATE INDEX` without `CONCURRENTLY` on live tables |
| INFO | `JSON` instead of `JSONB`; unnamed constraints; covering index opportunities; partial index opportunities |

### Step 4: Generate the Reconnaissance Report

```
═══════════════════════════════════════════════════════════
              SQL CRUSADE RECONNAISSANCE
═══════════════════════════════════════════════════════════

The Query Inquisition has assessed the battlefield.

SQL files:          {S}
Migration files:    {M}
ORM model files:    {O}
Prisma schemas:     {P}

SEVERITY ASSESSMENT:
  🚨 BLOCKERS:  {B}  (injection vectors, credentials in source, destructive migrations)
  🔴 CRITICAL:  {C}  (SELECT *, N+1, missing FK indexes, TIMESTAMP violations)
  🟠 WARNING:   {W}  (VARCHAR(255), OFFSET pagination, missing downgrade(), FLOAT money)
  🟡 INFO:      {I}  (JSON vs JSONB, unnamed constraints, index opportunities)

Quick signals:
  🗄️ Query Squad:      {select_star} SELECT *, {n_plus_one} potential N+1, {offset} OFFSET
  🗄️ Index Squad:      {fk_count} foreign keys, {idx_count} indexes declared
  🗄️ Schema Squad:     {ts_violations} TIMESTAMP columns, {varchar} VARCHAR(N), {int_pks} INT PKs
  🗄️ Migration Squad:  {no_rollback} migrations without downgrade
  🗄️ Security Squad:   {injection} injection signals

═══════════════════════════════════════════════════════════
```

## PHASE 2: ASK FOR PERMISSION

If **--write** is NOT present:

"This is a RECONNAISSANCE REPORT only. No files have been modified.

To deploy squads in report-only mode (no changes):
`/sql-crusade [path]`

To deploy squads and apply safe fixes:
`/sql-crusade [path] --write`

To scope to one concern:
`/sql-crusade [path] --scope security`
`/sql-crusade [path] --scope schema --write`"

If **--write** IS present, confirm:

"You have authorized the SQL Inquisition to apply fixes to {N} files.

Safe automatable fixes include:
- TIMESTAMP → TIMESTAMPTZ in schema and migration files
- VARCHAR(255) → TEXT (with CHECK constraint where appropriate)
- SERIAL → BIGSERIAL in new table definitions

Fixes requiring human judgment will be surfaced as recommendations.

Proceed? (yes/no)"

If the user says no, abort. If yes, continue to Phase 3.

## PHASE 3: SQUAD ORGANIZATION

**Query Squad** → uses `sql-query-purist` agent
Handles: All SQL files, ORM query files, TypeScript/JavaScript database access layers. Hunts SELECT *, N+1 patterns, OFFSET pagination, COUNT(*) where EXISTS is appropriate, implicit type casts.

**Index Squad** → uses `sql-index-purist` agent
Handles: Schema files, migration files, ORM model definitions. Cross-references foreign key declarations against index declarations. Flags unindexed foreign keys and redundant indexes.

**Schema Squad** → uses `sql-schema-purist` agent
Handles: CREATE TABLE statements, ORM column definitions, Prisma schema files. Audits every column type for TIMESTAMP, VARCHAR, INT/SERIAL, FLOAT violations.

**Migration Squad** → uses `sql-migration-purist` agent
Handles: All files in `migrations/` directories. Checks for downgrade functions, risky operations (DROP TABLE, ADD COLUMN NOT NULL), table-locking patterns, non-timestamped filenames.

**Security Squad** → uses `sql-security-purist` agent
Handles: All Python, TypeScript, and JavaScript files that touch the database. Hunts string-formatted SQL, hardcoded connection strings, missing RLS on multi-tenant tables, GRANT ALL statements.

### War Cry

```
═══════════════════════════════════════════════════════════
                   SQL CRUSADE BEGINS
═══════════════════════════════════════════════════════════

Five squads. One codebase. No SELECT * survives.

The unindexed foreign key will receive its index.
The string-formatted query will receive its bind parameters.
The TIMESTAMP column will receive its timezone.
The migration without downgrade() will receive its reckoning.

Deploying squads:
  🗄️ Query Squad     (sql-query-purist):     SQL and ORM files
  🗄️ Index Squad     (sql-index-purist):     schema and migration files
  🗄️ Schema Squad    (sql-schema-purist):    CREATE TABLE and column definitions
  🗄️ Migration Squad (sql-migration-purist): migrations/ directories
  🗄️ Security Squad  (sql-security-purist):  all database access code

The Inquisition begins NOW.
═══════════════════════════════════════════════════════════
```

## PHASE 4: PARALLEL DEPLOYMENT

Spawn all active squads via the Task tool. **All Task calls MUST be in a single message for true parallelism.**

### Query Squad Task Prompt

```
You are part of the QUERY SQUAD in the SQL Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all SELECT * in SQL files, ORM calls (SQLAlchemy, Prisma, TypeORM, Drizzle),
   and raw query strings. For each, identify which table is being queried and flag it.
2. Find N+1 patterns: database queries inside loops (for/forEach/map containing
   ORM calls or db.execute). For each, identify the parent query and the nested query.
3. Find OFFSET pagination with variable offsets. Flag the table and query.
4. Find COUNT(*) where the code then checks > 0 — suggest EXISTS instead.
5. Find implicit type casts in WHERE clauses (string compared to integer column, etc.).
6. If in fix mode: apply only SELECT * fixes where the columns used downstream
   are unambiguous from context. Do not guess column names.
7. Report findings using the format in your specialist instructions.
   Label your section: QUERY SQUAD REPORT.
```

### Index Squad Task Prompt

```
You are part of the INDEX SQUAD in the SQL Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find every REFERENCES clause in SQL files and every ForeignKey() declaration
   in ORM files. Build a list of (table, column) pairs for every foreign key.
2. Find every CREATE INDEX statement and ORM index declaration. Build a list of
   indexed (table, column) pairs.
3. Cross-reference: any foreign key (table, column) with no corresponding index
   is a CRITICAL finding.
4. Look for redundant indexes — two indexes whose leading columns are identical.
   The narrower one is likely redundant.
5. Look for partial index opportunities: boolean columns, status columns with
   dominant values used in WHERE clauses.
6. If in fix mode: generate CREATE INDEX statements for unindexed foreign keys
   and add them as a new migration file. Do not modify existing migrations.
7. Report findings using the format in your specialist instructions.
   Label your section: INDEX SQUAD REPORT.
```

### Schema Squad Task Prompt

```
You are part of the SCHEMA SQUAD in the SQL Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find every TIMESTAMP column that is not TIMESTAMPTZ or TIMESTAMP WITH TIME ZONE.
   Flag table and column name.
2. Find every VARCHAR(N) column. Flag if no genuine length constraint rationale exists.
3. Find every SERIAL or INT/INTEGER primary key. Flag — should be BIGSERIAL or UUID.
4. Find every FLOAT, REAL, or DOUBLE PRECISION column. Flag if name suggests monetary
   data (price, total, amount, balance, cost, fee, rate).
5. Find every JSON column that is not JSONB. Flag if the column is queried with
   operators (->>, @>, etc.) — these need JSONB.
6. Find unnamed UNIQUE and CHECK constraints. Suggest names following the convention
   uq_{table}_{column} and chk_{table}_{condition}.
7. If in fix mode: change TIMESTAMP to TIMESTAMPTZ, VARCHAR(255) to TEXT,
   JSON to JSONB in schema files. Generate ALTER TABLE migration for existing tables.
8. Report findings using the format in your specialist instructions.
   Label your section: SCHEMA SQUAD REPORT.
```

### Migration Squad Task Prompt

```
You are part of the MIGRATION SQUAD in the SQL Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all migration files in migrations/ directories and files named *_migration.py.
2. For each migration file, check whether a downgrade() or down() function exists.
   Missing = BLOCKER.
3. Find DROP TABLE and TRUNCATE in upgrade() functions. Flag as BLOCKER — verify
   backup evidence exists in comments or companion documentation.
4. Find ADD COLUMN ... NOT NULL without a DEFAULT. Flag as CRITICAL — table lock risk.
5. Find RENAME COLUMN in a single ALTER TABLE statement. Flag as CRITICAL — zero-downtime
   concern; should use expand/migrate/contract.
6. Find CREATE INDEX without CONCURRENTLY. Flag as WARNING on tables likely to be large.
7. Find migration files without a timestamp or sequential integer prefix in their name.
8. If in fix mode: add stub downgrade() functions where missing, with a comment
   explaining what each step would need to reverse. Do not implement the downgrade
   automatically — surface it for human review.
9. Report findings using the format in your specialist instructions.
   Label your section: MIGRATION SQUAD REPORT.
```

### Security Squad Task Prompt

```
You are part of the SECURITY SQUAD in the SQL Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all string-formatted SQL: f-strings containing SELECT/WHERE/INSERT/UPDATE/DELETE,
   .format() calls on SQL strings, %-formatting on SQL strings, string concatenation
   with + where one operand is a SQL fragment.
2. Find Prisma $queryRaw and $executeRaw called with a plain string (not tagged template).
   Also find $queryRawUnsafe and $executeRawUnsafe — always a finding.
3. Find hardcoded database connection strings: postgresql://, postgres://, mysql://
   in source files outside of environment variable assignments.
4. Find GRANT ALL in SQL files. Flag the role being granted to.
5. Find tables with tenant_id, org_id, or account_id columns and check whether
   ROW LEVEL SECURITY is enabled. No RLS on multi-tenant tables = WARNING.
6. If in fix mode: do NOT attempt to automatically rewrite injection vectors.
   For each one, write out the correct parameterized form using the exact
   ORM/driver already in use in that file, and explain it. The developer must
   apply it — automatic rewriting risks introducing subtle bugs.
7. Report findings using the format in your specialist instructions.
   Label your section: SECURITY SQUAD REPORT.
```

## PHASE 5: AGGREGATE AND REPORT

Collect all squad reports. Deduplicate findings that appear in multiple squad reports (a `SELECT *` flagged by both Query Squad and Security Squad — keep the Query Squad finding). Sort by severity: BLOCKER, CRITICAL, WARNING, INFO.

For BLOCKER findings (injection vectors, missing rollback on destructive migrations, hardcoded credentials): list them first, separately, before anything else. These are not summary statistics — they are individual findings that must be addressed before this code ships.

## PHASE 6: VICTORY REPORT

```
═══════════════════════════════════════════════════════════
                  SQL CRUSADE COMPLETE
═══════════════════════════════════════════════════════════

Files audited:      {N}
Migration files:    {M}

Findings summary:
  🚨 BLOCKERS:  {B_before} found, {B_fixed} fixed, {B_remaining} remaining
  🔴 CRITICAL:  {C_before} found, {C_fixed} fixed, {C_remaining} remaining
  🟠 WARNING:   {W_before} found, {W_fixed} fixed, {W_remaining} remaining
  🟡 INFO:      {I_count} noted

Per-squad results:
  🗄️ Query Squad:     {select_star_fixed} SELECT * resolved, {n1_flagged} N+1 flagged
  🗄️ Index Squad:     {indexes_added} indexes added, {redundant_flagged} redundant indexes flagged
  🗄️ Schema Squad:    {ts_fixed} TIMESTAMP→TIMESTAMPTZ, {varchar_fixed} VARCHAR→TEXT
  🗄️ Migration Squad: {rollback_added} downgrade stubs added, {risky_flagged} risky ops flagged
  🗄️ Security Squad:  {injection_flagged} injection vectors flagged, {creds_flagged} hardcoded credentials

{if B_remaining > 0}
⛔ BLOCKERS REMAIN — these must be resolved before this code ships:
{list each blocker: file, line, the specific vulnerability, the exact fix}
{endif}

No SELECT *. No N+1. No string-formatted SQL.
The query planner sees everything. So do we.
═══════════════════════════════════════════════════════════
```

## IMPORTANT OPERATIONAL RULES

**If no SQL or migration files are found at the given path:** Report this clearly. Do not deploy squads against an empty target.

**If the Security Squad finds injection vectors:** List each one individually in the BLOCKERS section with the file, line, the vulnerable pattern, and the parameterized replacement — not a generic "use prepared statements" note. The developer needs the exact fix for their exact ORM.

**On --write and injection vectors:** The Security Squad must NOT auto-rewrite injection vulnerabilities. The correct parameterized form depends on context the agent may not fully have. Surface the finding and the fix; require the developer to apply it.

**Scope filtering:** When `--scope` targets one squad, still run the reconnaissance baseline for all concerns. The other squads' findings are unknown, not absent — note this explicitly in the report.

**Migration Squad and downgrade stubs:** When adding a downgrade stub, make it a real starting point, not a placeholder. Read the upgrade() function and write the inverse operations in the correct order, even if the implementation is incomplete. A stub that says "drop the column added in upgrade()" is more useful than `pass`.
