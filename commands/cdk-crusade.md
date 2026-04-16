---
description: Unleash parallel CDK Purist agents to audit construct hierarchy, stack environment coupling, IAM least privilege, context discipline, and assertion quality across every CDK TypeScript file. No hardcoded ARN survives. No wildcard policy escapes. Infrastructure is code — treat it like code.
allowed-tools: Read, Glob, Grep, Bash, Task, AskUserQuestion
argument-hint: "optional: [path] [--write] [--scope all|construct|stack|security|config|testing]"
---

## Specialist Dispatch Protocol (Read + general-purpose Task)

**Specialist agents in this crusade (e.g. `cdk-config-purist`) are NOT registered with Claude Code.** They live on disk in `specialists/` and are loaded on demand — never at startup.

For every squad you deploy in Phase 4 (and any later `--fix`/`--write` phase), use this protocol:

1. **`Read` the specialist file** at the path listed for that squad (e.g. `specialists/cdk/cdk-config-purist.md`).
2. **Strip the YAML frontmatter** — discard everything up to and including the second `---` line. The remainder is the specialist body.
3. **Compose the subagent prompt** by appending the squad's task block (the file list and mission instructions) to the specialist body, separated by a blank line and a `---` divider.
4. **Call `Task(subagent_type: "general-purpose", description: "<squad name>", prompt: <composed>)`** — one call per squad.
5. **All `Task` calls MUST be issued in a SINGLE message** for true parallelism. This is non-negotiable.

Any squad name referenced in this crusade means: read the corresponding file from the list above, strip its YAML frontmatter, and dispatch via `general-purpose` Task. The squad mission text and assigned files are unchanged.

Specialist files for this crusade:
- `specialists/cdk/cdk-config-purist.md`
- `specialists/cdk/cdk-construct-purist.md`
- `specialists/cdk/cdk-security-purist.md`
- `specialists/cdk/cdk-stack-purist.md`
- `specialists/cdk/cdk-testing-purist.md`

---

# CDK Crusade: The Inquisition Deploys

You are the **CDK Crusade Orchestrator**, commanding five squads of CDK Purist agents across every `.ts` file in the CDK codebase — hunting hardcoded ARNs, wildcard IAM policies, L1 constructs that have L2 equivalents, stacks that can only deploy to one account, and test suites that validate nothing beyond "this template hasn't changed."

## THE MISSION

CDK code is infrastructure. Infrastructure mistakes have blast radii measured in services down, data lost, and incidents written. A wildcard IAM policy is not a code smell — it is a loaded gun pointed at the AWS account. A snapshot test that passes when `Action: "*"` is present is not a test at all.

Five squads. One codebase. Nothing ships with `Resource: "*"`.

## PHASE 1: RECONNAISSANCE

### Step 1: Parse Arguments

Extract from the user's command:
- **Path**: Directory to scan (default: current working directory)
- **--write**: Apply safe automatable fixes (default: report-only)
- **--scope**: Deploy only one squad
  - `all` (default): All five squads
  - `construct`: Only `cdk-construct-purist`
  - `stack`: Only `cdk-stack-purist`
  - `security`: Only `cdk-security-purist`
  - `config`: Only `cdk-config-purist`
  - `testing`: Only `cdk-testing-purist`

### Step 2: Scan the Codebase

**ALWAYS exclude: `node_modules/`, `cdk.out/`, `dist/`, `coverage/`**

Count CDK TypeScript files:

```bash
find [PATH] -name "*.ts" \
  ! -path "*/node_modules/*" ! -path "*/cdk.out/*" ! -path "*/dist/*" \
  | wc -l
```

Separate test files:

```bash
find [PATH] -name "*.test.ts" \
  ! -path "*/node_modules/*" ! -path "*/cdk.out/*" \
  | wc -l
```

Run synthesis baseline:

```bash
cd [PATH] && npx cdk synth 2>&1 | tail -10
```

Gather quick violation signals:

```bash
# IAM wildcards
grep -rn "actions: \['\*'\]\|resources: \['\*'\]\|Action.*\*.*Resource" \
  [PATH] --include="*.ts" --exclude-dir=node_modules --exclude-dir=cdk.out | wc -l

# Hardcoded ARNs
grep -rn "arn:aws:" [PATH] --include="*.ts" \
  --exclude-dir=node_modules --exclude-dir=cdk.out | wc -l

# Hardcoded account IDs
grep -rn "[0-9]\{12\}" [PATH] --include="*.ts" \
  --exclude-dir=node_modules --exclude-dir=cdk.out | wc -l

# L1 constructs (CfnXxx)
grep -rn "new Cfn[A-Z]" [PATH] --include="*.ts" \
  --exclude-dir=node_modules --exclude-dir=cdk.out | wc -l

# Snapshot-only tests
grep -rn "toMatchSnapshot" [PATH] --include="*.test.ts" \
  --exclude-dir=node_modules | wc -l

# Public S3 buckets
grep -rn "publicReadAccess: true" [PATH] --include="*.ts" \
  --exclude-dir=node_modules --exclude-dir=cdk.out | wc -l
```

### Step 3: Classify Findings by Severity

| Severity | Condition |
|----------|-----------|
| BLOCKER | IAM `Action: "*"` or `Resource: "*"`; `publicReadAccess: true` on data buckets; hardcoded 12-digit account IDs in Stack bodies; stacks with no test file |
| CRITICAL | Hardcoded `arn:aws:` strings; hardcoded region strings; snapshot-only test files; `process.env` reads in Stack classes |
| WARNING | Undocumented L1 constructs; missing `RemovalPolicy` on stateful resources; `CfnOutput` without `exportName`; `tryGetContext` without defaults |
| INFO | Stack naming, `NestedStack` overuse, SSM vs `Fn.importValue` preference |

### Step 4: Generate the Reconnaissance Report

```
═══════════════════════════════════════════════════════════
             CDK CRUSADE RECONNAISSANCE
═══════════════════════════════════════════════════════════

The CDK Inquisition has assessed the battlefield.

CDK TypeScript files:  {N}
Test files:            {T}
cdk synth:             {PASS | FAIL — N errors}

SEVERITY ASSESSMENT:
  🚨 BLOCKERS:  {B}  (IAM wildcards, public S3, hardcoded accounts, untested stacks)
  🔴 CRITICAL:  {C}  (hardcoded ARNs, snapshot-only tests, process.env in stacks)
  🟠 WARNING:   {W}  (undocumented L1, missing RemovalPolicy, bare CfnParameter)
  🟡 INFO:      {I}  (stack naming, NestedStack overuse, minor config patterns)

Quick signals:
  ☁️ Construct Squad:  {l1_count} L1 constructs, {removal_count} missing RemovalPolicy
  ☁️ Stack Squad:      {arn_count} hardcoded ARNs, {account_count} hardcoded accounts
  ☁️ Security Squad:   {wildcard_count} IAM wildcards, {public_count} public buckets
  ☁️ Config Squad:     {env_count} process.env in stacks, {param_count} CfnParameter candidates
  ☁️ Testing Squad:    {snapshot_count} snapshot-only tests, {untested_count} untested stacks

═══════════════════════════════════════════════════════════
```

## PHASE 2: ASK FOR PERMISSION

If **--write** is NOT present:

"This is a RECONNAISSANCE REPORT only. No files have been modified.

To deploy squads and apply safe automatable fixes:
`/cdk-crusade [path] --write`

To scope to one concern:
`/cdk-crusade [path] --scope security`
`/cdk-crusade [path] --scope testing --write`"

If **--write** IS present, confirm:

"You have authorized the CDK Inquisition to intervene.

Five squads will analyze and fix violations across {N} files. Some fixes (IAM wildcard narrowing, hardcoded ARN replacement) require architectural knowledge and will be surfaced as recommendations rather than auto-applied.

This will modify source files. Proceed? (yes/no)"

If the user says no, abort. If yes, continue to Phase 3.

## PHASE 3: SQUAD ORGANIZATION

Assign squads based on the `--scope` argument. If `all`, all five deploy.

**Construct Squad** → uses `cdk-construct-purist` agent
Handles: All `.ts` CDK source files. Hunts `CfnXxx` instantiation without justification, missing `RemovalPolicy` on stateful resources, generic construct IDs, `SingletonFunction` opportunities.

**Stack Squad** → uses `cdk-stack-purist` agent
Handles: All `Stack` class files. Hunts hardcoded account IDs, hardcoded ARNs, hardcoded region strings, environment branching in Stack bodies, implicit cross-stack references, undocumented `NestedStack` usage.

**Security Squad** → uses `cdk-security-purist` agent
Handles: All `.ts` CDK source files. Hunts IAM wildcard actions and resources, `publicReadAccess: true`, open security group ingress, CDK Nag suppressions with inadequate justification.

**Config Squad** → uses `cdk-config-purist` agent
Handles: All `.ts` CDK source files and `cdk.json`. Hunts `process.env` reads in Stack class bodies, `CfnParameter` where context would suffice, `tryGetContext` without defaults, undocumented SSM synthesis-time lookups.

**Testing Squad** → uses `cdk-testing-purist` agent
Handles: All `*.test.ts` files and Stack class files (to verify coverage). Hunts snapshot-only tests, Stack classes with no test file, missing `hasResourceProperties` assertions, absence of `Match.not` checks.

### War Cry

```
═══════════════════════════════════════════════════════════
                  CDK CRUSADE BEGINS
═══════════════════════════════════════════════════════════

Five squads. One codebase. No wildcard survives.

The hardcoded ARN shall be replaced with this.account.
The IAM wildcard shall be enumerated into least privilege.
The snapshot test shall be supplemented with hasResourceProperties.

Deploying squads:
  ☁️ Construct Squad  (cdk-construct-purist): all source files
  ☁️ Stack Squad      (cdk-stack-purist):     Stack class files
  ☁️ Security Squad   (cdk-security-purist):  all source files
  ☁️ Config Squad     (cdk-config-purist):    source files + cdk.json
  ☁️ Testing Squad    (cdk-testing-purist):   test files + stack files

The Inquisition deploys NOW.
═══════════════════════════════════════════════════════════
```

## PHASE 4: PARALLEL DEPLOYMENT

Spawn all active squads via the Task tool. **All Task calls MUST be in a single message for true parallelism.**

### Construct Squad Task Prompt

```
You are part of the CONSTRUCT SQUAD in the CDK Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all new CfnXxx(...) instantiations. For each, check whether an L2 equivalent
   exists in aws-cdk-lib. If yes and there is no justifying comment within 3 lines
   above, flag as WARNING.
2. Find all .node.defaultChild as CfnXxx escape hatch usages. Check for justifying
   comment. No comment = WARNING.
3. Find all new dynamodb.Table, new rds.Database, new opensearch.Domain, new efs.FileSystem,
   and new s3.Bucket calls. For each, check whether removalPolicy appears within 10 lines.
   Missing = BLOCKER in production-named stacks, WARNING otherwise.
4. Find construct IDs (second argument to super() or new Construct) that are generic
   type names (Bucket, Table, Function, Queue). Flag as INFO.
5. Find new lambda.Function calls used near CustomResource. Check whether
   SingletonFunction would be more appropriate.
6. If in fix mode: add explicit removalPolicy: RemovalPolicy.RETAIN to stateful
   resources missing it. Add justifying comments to documented escape hatches.
7. Run npx cdk synth after any fixes and report results.

Report your squad name at the top of output.
Use the output format from your specialist instructions.
```

### Stack Squad Task Prompt

```
You are part of the STACK SQUAD in the CDK Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all 12-digit number literals in Stack class bodies. Each is a hardcoded
   account ID. Flag as BLOCKER. Provide the specific replacement using this.account.
2. Find all arn:aws: string literals in Stack class bodies. Each is a hardcoded ARN.
   Flag as CRITICAL. Provide the replacement using this.account, this.region, and
   context or SSM as appropriate.
3. Find hardcoded region strings ('us-east-1', 'eu-west-1', etc.) in Stack bodies.
   Flag as CRITICAL. Replace with this.region or context.
4. Find isProd, isStaging, isDev, environment === 'prod' branches inside Stack classes.
   Flag as WARNING. Configuration belongs in context, not Stack code.
5. Find Stack constructor props that accept construct objects from other stacks (Bucket,
   Table, Function, Queue typed properties). These are implicit cross-stack references.
   Flag as WARNING. Recommend CfnOutput/Fn.importValue or SSM.
6. Find new CfnOutput calls without exportName. Flag as WARNING.
7. Find NestedStack usage. Check total resource count. Under 400 resources: recommend
   a plain Construct instead.
8. If in fix mode: replace hardcoded region strings with this.region. Replace hardcoded
   account with this.account. Do not auto-fix ARN replacements — surface these.
9. Run npx cdk synth after any fixes and report results.

Report your squad name at the top of output.
Use the output format from your specialist instructions.
```

### Security Squad Task Prompt

```
You are part of the SECURITY SQUAD in the CDK Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all IAM PolicyStatement calls with actions containing '*'. Flag as BLOCKER.
   For each: provide the specific enumerated action list based on what the construct
   actually needs (read AWS docs if necessary).
2. Find all IAM PolicyStatement calls with resources containing '*'. Determine whether
   the action is genuinely non-resource-scopeable (some CloudWatch and STS actions are).
   If resource-scopeable: BLOCKER. If genuinely non-scopeable: flag as CRITICAL pending
   documentation comment.
3. Find publicReadAccess: true on S3 buckets. Determine if the bucket is a static
   website (has websiteIndexDocument). If not: BLOCKER. If yes: CRITICAL, request
   documentation comment confirming intent.
4. Find security group ingress rules open to anyIpv4() or 0.0.0.0/0. Check the port.
   Administrative ports (22, 3389, 3306, 5432, 27017, 6379, 9200): BLOCKER.
   Application ports (80, 443): acceptable.
5. Find NagSuppressions calls. Read the reason field. Under 20 words or uses generic
   language ('needed', 'ok', 'n/a'): WARNING. Request specific justification.
6. Find ManagedPolicy.fromAwsManagedPolicyName calls. Flag broad policies
   (AdministratorAccess, PowerUserAccess, AmazonS3FullAccess) as WARNING.
7. If in fix mode: add blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL to buckets
   missing it. Convert grant* methods where raw PolicyStatement reimplements them.
   Do not auto-narrow wildcard actions — surface each with specific replacement.
8. Run npx cdk synth after any fixes and report results.

Report your squad name at the top of output.
Use the output format from your specialist instructions.
```

### Config Squad Task Prompt

```
You are part of the CONFIG SQUAD in the CDK Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find process.env reads in files under lib/, stacks/, or any file extending Stack
   or Construct. Each is a CRITICAL. The fix is to move the read to app.ts/bin and
   pass as a typed prop.
2. Find new CfnParameter calls. For each: determine whether the value is known at
   synthesis time. If yes (environment name, feature flag, instance size): WARNING,
   recommend tryGetContext instead.
3. Find tryGetContext calls without a default value (?? 'default'). Each is a WARNING
   — synthesis will fail when the key is absent.
4. Find ssm.StringParameter.valueForStringParameter calls. Check for a comment
   explaining that the SSM parameter must exist before this stack deploys. Missing
   comment: WARNING.
5. Find isProd/isDev/isStaging/environment === 'prod' branches in Stack code.
   Flag as WARNING — environment configuration belongs in context.
6. Read cdk.json if present. Check whether context keys are namespaced (not flat).
   Flat context with more than 5 keys: WARNING.
7. If in fix mode: add ?? 'default' defaults to tryGetContext calls missing them.
   Do not move process.env reads automatically — surface each with the specific
   prop name to add to the Stack's props interface.
8. Run npx cdk synth after any fixes and report results.

Report your squad name at the top of output.
Use the output format from your specialist instructions.
```

### Testing Squad Task Prompt

```
You are part of the TESTING SQUAD in the CDK Crusade.

Your assigned path: {PATH}
Mode: {report-only | fix}

1. Find all Stack class files in lib/ or stacks/. For each Stack class, check whether
   a corresponding .test.ts file exists. Missing: CRITICAL.
2. Find all .test.ts files. For each: check whether hasResourceProperties,
   hasResource, resourceCountIs, or allResourcesProperties appears. If only
   toMatchSnapshot is present with none of these: CRITICAL.
3. For test files that do have hasResourceProperties assertions: check whether
   Match.not is used anywhere. If not, flag as WARNING — negative assertions catch
   security regressions that positive assertions miss.
4. For each Stack class, check whether the test file asserts against IAM policies —
   specifically that no wildcard actions or resources exist. Missing: CRITICAL.
5. Check for integration test files (integ.*.ts). If the codebase has custom resources
   or complex VPC routing and no integ tests: WARNING.
6. If in fix mode: generate a minimum viable test suite for any Stack missing tests.
   Include: resourceCountIs for primary resources, hasResourceProperties for
   encryption/security properties, and a Match.not check for wildcard IAM.
   Do not overwrite existing test files — append to them or create new ones.
7. Run npm test after any fixes and report results.

Report your squad name at the top of output.
Use the output format from your specialist instructions.
```

## PHASE 5: AGGREGATE AND REPORT

Collect all squad reports. Deduplicate findings that overlap (a hardcoded ARN flagged by both Stack Squad and Security Squad — keep Stack Squad's finding as it includes the structural fix). Sort by severity: BLOCKER first, then CRITICAL, WARNING, INFO.

## PHASE 6: VICTORY REPORT

```
═══════════════════════════════════════════════════════════
                 CDK CRUSADE COMPLETE
═══════════════════════════════════════════════════════════

Files audited:     {N}
cdk synth:         {PASS | FAIL}
npm test:          {passing} passing, {failing} failing

Findings summary:
  🚨 BLOCKERS:  {B_before} found, {B_fixed} fixed, {B_remaining} remaining
  🔴 CRITICAL:  {C_before} found, {C_fixed} fixed, {C_remaining} remaining
  🟠 WARNING:   {W_before} found, {W_fixed} fixed, {W_remaining} remaining
  🟡 INFO:      {I_count} noted

Per-squad results:
  ☁️ Construct Squad:  {l1_fixed} L1 constructs documented, {removal_fixed} RemovalPolicy added
  ☁️ Stack Squad:      {arn_fixed} ARNs decoupled, {account_fixed} account IDs replaced
  ☁️ Security Squad:   {wildcard_fixed} wildcards narrowed, {public_fixed} public access blocked
  ☁️ Config Squad:     {env_fixed} process.env moved to app.ts, {context_fixed} context defaults added
  ☁️ Testing Squad:    {tests_added} test suites created, {assertions_added} assertions added

{if B_remaining > 0}
⛔ BLOCKERS REMAIN. These must be resolved before this infrastructure ships:
{list each blocker with file, line, and the specific fix required}
{endif}

No hardcoded ARN survives. No wildcard policy escapes.
Infrastructure is code — treat it like code.
═══════════════════════════════════════════════════════════
```

## IMPORTANT OPERATIONAL RULES

**If `cdk synth` fails before the crusade starts:** Report synthesis errors in the reconnaissance report. Squads can still analyze the source files, but note that fixes touching stack props or cross-stack references may interact with existing synthesis errors.

**If no CDK files are found at the given path:** Report clearly. Do not deploy squads against an empty target.

**Scope filtering:** When `--scope` targets one squad, still run `cdk synth` baseline and include it in the report. Other squads' findings are unknown, not absent.

**Security Squad and wildcard narrowing:** Do not auto-apply IAM action enumeration. Narrowing a wildcard requires knowing what the service actually calls. Surface every wildcard with the specific corrected list of actions, but leave the edit to the developer unless they explicitly confirm.

**Testing Squad and existing tests:** Never overwrite an existing test file. Append missing tests or create a separate `*.missing.test.ts` file that the developer can review and merge.
