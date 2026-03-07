import type { CrusadeDetail } from '../crusade-detail.types';

export const dockerCrusade: CrusadeDetail = {
  slug: 'docker',
  name: 'The Docker Crusade',
  command: '/docker-crusade',
  icon: '🐳',
  tagline: 'Every layer is permanent. Every secret is forever. Build once, regret never.',
  quote:
    "You ran `apt-get install` in one layer and `rm -rf /var/cache/apt` in the next. The cache IS STILL IN THE IMAGE. You just made it invisible. Congratulations on your 2.3GB container.",
  color: 'from-blue-600 to-blue-900',
  gradientFrom: 'blue-600',
  gradientTo: 'blue-900',
  description:
    'The Docker Crusade deploys five specialist squads in parallel to hunt every sin baked into your container configuration. Layer cache violations that turn 3-minute builds into 45-minute ordeals. Secrets immortalized in image history that no layer deletion can erase. Root processes, bloated single-stage builds, shell-form CMDs that silently swallow SIGTERM, and compose files with no network isolation and no restart policies. The image ships clean or it does not ship.',
  battleCry:
    'The Layer Inquisition sees all. No secret hides in history. No cache bloats the final image. No root process escapes judgment.',
  commandments: [
    {
      numeral: 'I',
      text: 'Multi-stage builds are not optional — they are mandatory. The compiler does not belong in the production image.',
    },
    {
      numeral: 'II',
      text: 'Secrets belong in build args and runtime env — never in layers. `docker history --no-trunc` is available to anyone who can pull your image.',
    },
    {
      numeral: 'III',
      text: 'No process shall run as root — USER is not a suggestion. Root inside a container is still root.',
    },
    {
      numeral: 'IV',
      text: 'COPY is righteous; ADD is heresy except for local tar extraction. An ADD with an unverified URL is an external dependency with no integrity check.',
    },
    {
      numeral: 'V',
      text: 'Every HEALTHCHECK is a promise to the orchestrator. Without it, a deadlocked service and a healthy one look identical from the outside.',
    },
  ],
  specialists: [
    {
      name: 'The Layer Archaeologist',
      icon: '🗂️',
      focus: 'RUN consolidation, cache-efficient ordering, layer size analysis',
      description:
        'Digs through layer history to find the `COPY . .` on line 4 that forces a full dependency reinstall on every source change, and the split `apt-get update` / `apt-get install` that serves stale packages while appearing cached. Cache invalidation flows downward — invalidate one layer and everything beneath it rebuilds. The Archaeologist makes that invisible architecture visible.',
    },
    {
      name: 'The Root Exorcist',
      icon: '🔒',
      focus: 'Non-root USER, secrets in ENV/ARG, .dockerignore for credential files',
      description:
        'Has run `docker history --no-trunc` on production images and watched Stripe live keys scroll past in layer metadata from eighteen months ago, rotated never. Hunts every ENV instruction with a credential pattern, every COPY of a `.env` file, every Dockerfile with no USER instruction. The damage from a secret in a layer is permanent. The Exorcist finds it before the image is pushed.',
    },
    {
      name: 'The Image Surgeon',
      icon: '🔬',
      focus: 'Multi-stage builds, .dockerignore completeness, base image selection',
      description:
        'Has performed the autopsy on 2.3 GB production images and found TypeScript compilers, Jest test runners, and 340 devDependencies with no business being there. Audits every FROM statement for multi-stage discipline, every .dockerignore for the node_modules and dist entries that keep build artifacts out of the image, and every base image choice for the slim or distroless alternative that would cut the size by 80%.',
    },
    {
      name: 'The Signal Warden',
      icon: '📡',
      focus: 'HEALTHCHECK, ENTRYPOINT/CMD semantics, PID 1 signal handling, WORKDIR',
      description:
        'Lived through the incident where `docker stop` took ten seconds on every container and graceful shutdown never ran because `CMD node server.js` (shell form) made `/bin/sh` PID 1, and `/bin/sh` does not forward SIGTERM. Enforces exec-form CMD, correct ENTRYPOINT semantics, init systems for zombie reaping, and HEALTHCHECK intervals that actually match the application\'s startup time.',
    },
    {
      name: 'The Orchestration Sentinel',
      icon: '🕸️',
      focus: 'Restart policies, depends_on health conditions, network isolation, volume hygiene',
      description:
        'Has watched applications crash on startup for two years because `depends_on: [db]` waits for the container to start, not for Postgres to finish `initdb`. Enforces `condition: service_healthy`, explicit network definitions that keep databases off the frontend network, restart policies that survive transient failures, and flags every Docker socket mount that grants a container full control of the host daemon.',
    },
  ],
  howItWorks: [
    {
      phase: 'Reconnaissance',
      description:
        'Scans all Dockerfiles and compose files, counts violations by severity — secrets in ENV, missing USER, single-stage builds, shell-form CMDs, bare depends_on — and produces a classified report before touching a single file.',
    },
    {
      phase: 'Squad Assignment',
      description:
        'All Dockerfiles go to the Layer, Security, and Size squads. Config squad covers Dockerfiles and compose files. Compose squad handles compose files exclusively. Scope filtering lets you deploy one squad when you know where the problem lives.',
    },
    {
      phase: 'Parallel Deployment',
      description:
        'All five squads launch simultaneously via the Task tool in a single message. Each specialist carries only the doctrine it needs — the Layer Archaeologist knows nothing about restart policies; the Compose Sentinel knows nothing about multi-stage builds.',
    },
    {
      phase: 'Secret Handling',
      description:
        'Secrets found in ENV or ARG instructions are reported by variable name only — values never appear in output. Every secret finding includes a rotation instruction, because fixing the Dockerfile without rotating the credential is not a fix.',
    },
    {
      phase: 'Safe Fixes',
      description:
        'In --write mode, squads apply automatable fixes: exec-form CMD conversion, .dockerignore creation, USER instruction addition for known base images, RUN chain consolidation. Multi-stage conversion and network redesign surface as recommendations — they require knowing what the application actually needs at runtime.',
    },
    {
      phase: 'Victory Report',
      description:
        'Squad reports are aggregated, deduplicated, and sorted by severity. Blockers surface first. Any remaining blockers are listed explicitly — the crusade is not complete until secrets are rotated and root processes are exorcised.',
    },
  ],
} as const;
