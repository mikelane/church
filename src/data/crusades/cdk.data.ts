import type { CrusadeDetail } from '../crusade-detail.types';

export const cdkCrusade: CrusadeDetail = {
  slug: 'cdk',
  name: 'The CDK Crusade',
  command: '/cdk-crusade',
  icon: '☁️',
  tagline:
    'No hardcoded ARNs. No * IAM policies. No environment-coupled stacks. Infrastructure is code — treat it like code.',
  quote:
    '`iam.PolicyStatement.fromJson({ Action: "*", Resource: "*" })`. You have granted everything to everything. The blast radius is the entire AWS account. This is not infrastructure as code. This is infrastructure as prayer.',
  color: 'from-orange-500 to-yellow-700',
  gradientFrom: 'orange-500',
  gradientTo: 'yellow-700',
  description:
    'The CDK Crusade deploys five specialist squads to hunt every infrastructure sin that the TypeScript compiler permits but production does not forgive. Wildcard IAM policies, hardcoded ARNs, L1 constructs when L2 exists, stacks that only deploy to one account, and snapshot tests that validate nothing — none of it survives. `cdk synth` passes. That is not enough. This is.',
  battleCry:
    'The CDK Inquisition deploys. Every hardcoded ARN is a coupling sin. Every wildcard policy is a security catastrophe. No L1 construct escapes scrutiny when an L2 exists.',
  commandments: [
    {
      numeral: 'I',
      text: 'Use L2 constructs over L1 — `CfnBucket` when `Bucket` exists is heresy. The L1 escape hatch is for when the L2 cannot express what you need, not for when you did not look.',
    },
    {
      numeral: 'II',
      text: 'Stacks shall be environment-agnostic — hardcoded account IDs and ARNs are a mortal sin. `this.account` and `this.region` exist. Context exists. Use them.',
    },
    {
      numeral: 'III',
      text: 'IAM policies follow least privilege — `*` on Resource is a confession of failure. Grant methods exist on every L2 construct. When they do not cover your case, enumerate the actions.',
    },
    {
      numeral: 'IV',
      text: 'Cross-stack references use explicit exports — implicit CDK dependencies create hidden coupling that makes independent deployment impossible and outages inevitable.',
    },
    {
      numeral: 'V',
      text: 'Every CDK construct shall have a test — `assertions.Template` is not optional. A snapshot that passes when `Action: "*"` is present is not a test. It is a liability.',
    },
  ],
  specialists: [
    {
      name: 'The Construct Theologian',
      icon: '🏗️',
      focus: 'L1 vs L2 vs L3 hierarchy, construct IDs, RemovalPolicy, SingletonFunction',
      description:
        'Has seen `new s3.CfnBucket(...)` in a file that imports `aws-cdk-lib/aws-s3` on line 3. The L2 was right there. They still reached for the L1. The Theologian fixes it, documents the escape hatches that are genuinely necessary, and makes sure no stateful resource is one `cdk destroy` away from oblivion.',
    },
    {
      name: 'The Stack Architect',
      icon: '🗼',
      focus: 'Environment-agnostic design, hardcoded ARNs, cross-stack references, stack naming',
      description:
        'Reviewed a codebase where account `123456789012` appeared forty-seven times. When someone asked about staging, the answer was "we don\'t have staging." The Architect replaces every hardcoded account ID, decouples cross-stack references, and leaves stacks that deploy anywhere CDK bootstrap has run.',
    },
    {
      name: 'The IAM Inquisitor',
      icon: '🔒',
      focus: 'IAM least privilege, wildcard elimination, public S3 access, security groups',
      description:
        'Read the incident report where a Lambda with `Action: "*", Resource: "*"` deleted three production DynamoDB tables in forty seconds via a misconfigured EventBridge rule. Every wildcard is a BLOCKER. Every CDK Nag suppression with a one-word justification gets sent back for a real answer.',
    },
    {
      name: 'The Context Sentinel',
      icon: '🗝️',
      focus: 'cdk.json discipline, tryGetContext vs CfnParameter, process.env in Stack classes',
      description:
        'Watched a developer run `cdk synth` from their laptop and get a different template than CI produced — same commit, different environment variable. The Sentinel ensures configuration flows through typed props and context values, not scattered `process.env` reads that only work if you happen to have the right variable exported.',
    },
    {
      name: 'The Assertions Apostle',
      icon: '✅',
      focus: 'CDK assertions library, snapshot overreliance, hasResourceProperties coverage',
      description:
        'Has seen `toMatchSnapshot()` as the sole test on a stack containing `Action: "*"`. The snapshot passed. The security audit six months later did not. The Apostle replaces every snapshot-only suite with `hasResourceProperties` assertions that would catch the next wildcard before it reaches the AWS account.',
    },
  ],
  howItWorks: [
    {
      phase: 'Reconnaissance',
      description:
        'Scans CDK TypeScript files, runs `cdk synth` for a baseline, then counts IAM wildcards, hardcoded ARNs, L1 construct usage, snapshot-only tests, and public S3 buckets. Produces a severity-classified report before touching a single file.',
    },
    {
      phase: 'Squad Assignment',
      description:
        'Files are routed by concern. All source files go to the Construct, Stack, Security, and Config squads. Test files and Stack class files go to the Testing squad. Scope filtering lets you deploy one squad when you know where the problem lives.',
    },
    {
      phase: 'Parallel Deployment',
      description:
        'All five squads launch simultaneously via the Task tool in a single message. The IAM Inquisitor carries only security doctrine. The Assertions Apostle carries only testing doctrine. No squad second-guesses another.',
    },
    {
      phase: 'IAM Audit',
      description:
        'The IAM Inquisitor scans every PolicyStatement for wildcard patterns, checks every S3 bucket for public access configuration, audits security group ingress rules, and reads every CDK Nag suppression for a real justification rather than a placeholder.',
    },
    {
      phase: 'Stack Analysis',
      description:
        'The Stack Architect validates that no Stack class body contains a hardcoded account ID, ARN, or region string, and that cross-stack references use explicit CfnOutput exports or SSM parameters rather than implicit CDK synthesis-time coupling.',
    },
    {
      phase: 'Victory Report',
      description:
        'Squad reports are aggregated and sorted by severity — BLOCKER security wildcards first, CRITICAL coupling violations second, WARNING discipline issues third. Before/after metrics for `cdk synth` errors, test failures, and per-squad findings. Infrastructure is code. Treat it like code.',
    },
  ],
} as const;
