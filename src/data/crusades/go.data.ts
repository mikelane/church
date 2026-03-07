import type { CrusadeDetail } from '../crusade-detail.types';

export const goCrusade: CrusadeDetail = {
  slug: 'go',
  name: 'The Go Crusade',
  command: '/go-crusade',
  icon: '🐹',
  tagline:
    'No goroutine leaks. No naked errors. No interface bloat. The compiler is just the beginning.',
  quote:
    '`err != nil` on line 47. You checked the error. But you returned nil anyway. The goroutine is still running. The file is still open. Congratulations — you have created a POLTERGEIST.',
  color: 'from-cyan-700 to-teal-900',
  gradientFrom: 'cyan-700',
  gradientTo: 'teal-900',
  description:
    'The Go Crusade deploys five specialist squads in parallel to hunt every shortcut the compiler permits but correctness does not. Discarded errors, goroutine poltergeists, interface bloat, snake_case heresy, god packages — none of it survives. `go build` passes. That is not enough. This is.',
  battleCry:
    'The Great Gopher Inquisition has begun. No goroutine escapes. No error goes unwrapped. No interface grows fat.',
  commandments: [
    {
      numeral: 'I',
      text: 'Accept interfaces, return structs — never the reverse. The concrete type gives callers everything; the interface gives them only what you decided they deserve.',
    },
    {
      numeral: 'II',
      text: 'Every error shall be wrapped with context, never discarded. `return nil, nil` after `err != nil` is not error handling — it is fraud. The caller deserved to know.',
    },
    {
      numeral: 'III',
      text: 'Goroutines must have exits — no leaks, no orphans. If you cannot point to the mechanism by which this goroutine stops, you have not written a goroutine. You have written a ghost.',
    },
    {
      numeral: 'IV',
      text: 'Package names are singular nouns, not utils, not helpers. A package named `utils` is a junk drawer with an import path. Name the thing the package IS.',
    },
    {
      numeral: 'V',
      text: 'The empty interface is a confession of failure. `interface{}` tells the compiler you have given up. Go 1.18 gave you generics. Use them.',
    },
  ],
  specialists: [
    {
      name: 'The Nil Inquisitor',
      icon: '🔍',
      focus: 'Error handling, %w wrapping, sentinel errors, naked returns with nil error',
      description:
        'Hunts every `if err != nil { return nil, nil }` — the cardinal sin, the poltergeist pattern, the error that never was. Traces every `fmt.Errorf` to verify `%w` wraps the chain. Has read enough post-mortems to know that "something went wrong" is not an error message — it is an apology.',
    },
    {
      name: 'The Interface Minimalist',
      icon: '🔷',
      focus: 'Accept interfaces return structs, interface bloat, -er suffix naming, interface{}/any overuse',
      description:
        'Enforces the fundamental law: accept interfaces, return structs. Finds every constructor returning an interface type and asks why the concrete type was hidden. Counts methods on every interface definition. More than five with no defaults is not an interface — it is a demand list that no external type can meet.',
    },
    {
      name: 'The Goroutine Warden',
      icon: '🔒',
      focus: 'Goroutine leaks, channel patterns, context cancellation, WaitGroup discipline',
      description:
        'Traces every `go func()` to its exit. If there is no `ctx.Done()`, no done channel, no WaitGroup, no channel range — that goroutine is a poltergeist. It will be running after the test ends. It will be running when your graceful shutdown completes. It will be running at 3 AM when you are staring at a goroutine count graph that only goes up.',
    },
    {
      name: 'The MixedCaps Enforcer',
      icon: '✒️',
      focus: 'Go naming conventions, exported vs unexported, receiver names, MixedCaps not snake_case',
      description:
        'There is no snake_case in Go. There is no SCREAMING_SNAKE_CASE. There is no `this`. There is no `self`. There is no `GetName()` — only `Name()`. Every violation is a signal that the developer\'s muscle memory is from another language, and that muscle memory is wrong here.',
    },
    {
      name: 'The Module Architect',
      icon: '🏗️',
      focus: 'Package organization, internal/ boundaries, circular dependencies, god packages',
      description:
        'Has seen `package utils` with 847 lines spanning six unrelated concerns, imported by every package in the module, sitting at the center of a circular dependency that required four hours to untangle. Finds god packages, plans the split, enforces `internal/` boundaries, and verifies that `go.mod` actually reflects what the module depends on.',
    },
  ],
  howItWorks: [
    {
      phase: 'Reconnaissance',
      description:
        'Scans all .go files, runs go build and go vet for a baseline, then counts discarded errors, goroutine launches, interface{} parameters, snake_case violations, and junk-drawer package names. Produces a severity-classified report before touching a single file.',
    },
    {
      phase: 'Squad Assignment',
      description:
        'Files are routed by concern. Error Squad takes all non-test source files. Interface Squad takes all source files. Goroutine Squad takes files with goroutine launches. Naming Squad takes all non-generated source files. Package Squad audits all packages in the module.',
    },
    {
      phase: 'Parallel Deployment',
      description:
        'All five squads launch simultaneously via the Task tool in a single message. Each specialist carries only the doctrine relevant to its concern — the Goroutine Warden knows nothing about acronym capitalization, the MixedCaps Enforcer knows nothing about channel patterns.',
    },
    {
      phase: 'Error Inquisition',
      description:
        'The Nil Inquisitor traces every error handling path. Every `return nil, nil` after `err != nil` is a BLOCKER. Every `fmt.Errorf` without `%w` loses the error chain. Every log-and-return-nil pattern swallows information the operator needed.',
    },
    {
      phase: 'Goroutine Audit',
      description:
        'The Goroutine Warden traces every `go func()` to its exit condition. Goroutines in infinite loops without `ctx.Done()` are poltergeists — they will outlive the request, the test, and eventually the process. Every `time.Sleep` in a goroutine is checked for context-awareness.',
    },
    {
      phase: 'Victory Report',
      description:
        'Squad reports are aggregated, deduplicated, and sorted by severity. Blockers surface first. The final count shows before/after for go build errors, go vet warnings, and per-squad findings. No goroutine escapes. No error goes unwrapped. No interface grows fat.',
    },
  ],
} as const;
