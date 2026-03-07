import type { CrusadeDetail } from '../crusade-detail.types';

export const androidCrusade: CrusadeDetail = {
  slug: 'android',
  name: 'The Android Crusade',
  command: '/android-crusade',
  icon: '🤖',
  tagline:
    'No lifecycle violations. No ViewModel data in Activities. No WorkManager misuse. The Android framework does not forgive.',
  quote:
    'You stored a Context reference in your ViewModel. The Activity rotated. The ViewModel survived. The Context did not. You have created a MEMORY LEAK that will haunt users until they force-kill the app.',
  color: 'from-green-600 to-emerald-900',
  gradientFrom: 'green-600',
  gradientTo: 'emerald-900',
  description:
    'The Android Crusade deploys five specialist squads in parallel to find every place your code makes peace with the wrong abstraction. Context references in ViewModels leak Activities through configuration changes. Missing Room migrations delete user data on the next release. IntentService crashes on API 31+. WorkManager exists for a reason. The framework has a lifecycle — this crusade enforces it.',
  battleCry:
    'The Android Tribunal convenes. Every lifecycle violation is judged. Every leaked Context is sentenced. No ViewModel holds UI references and lives.',
  commandments: [
    {
      numeral: 'I',
      text: 'ViewModels shall never hold references to Activities, Fragments, or Views — the ViewModel survives configuration changes, and it must not drag the dead Activity behind it.',
    },
    {
      numeral: 'II',
      text: 'Every configuration change shall be survived — `onSaveInstanceState` is not optional, and an app that loses user input on rotation is an app that does not respect the user.',
    },
    {
      numeral: 'III',
      text: 'Background work belongs to WorkManager — Services are for foreground work the user can see, not silent background sync that drains the battery and crashes on API 31+.',
    },
    {
      numeral: 'IV',
      text: 'Hilt provides — manual dependency construction inside Android components is untestable heresy that couples your code to the framework forever.',
    },
    {
      numeral: 'V',
      text: '`fallbackToDestructiveMigration()` is a sin — Room migrations are mandatory, and deleting user data because you could not write four lines of migration SQL is unforgivable.',
    },
  ],
  specialists: [
    {
      name: 'The Lifecycle Warden',
      icon: '⚖️',
      focus: 'Activity/Fragment lifecycle callbacks, BroadcastReceiver symmetry, onSaveInstanceState',
      description:
        'Traces every `onCreate` to its `onDestroy`. Has read crash reports caused by receivers registered in `onCreate` and never unregistered — the receiver outliving the Activity, delivering events to a ghost. Every `registerReceiver` gets a symmetric `unregisterReceiver`. Every `observe(this` in a Fragment gets replaced with `viewLifecycleOwner`. Every binding gets nulled in `onDestroyView`.',
    },
    {
      name: 'The ViewModel Theologian',
      icon: '🧠',
      focus: 'ViewModel purity, StateFlow/LiveData patterns, Context leak prevention, viewModelScope',
      description:
        'Has memorized the exact crash path: Context stored in ViewModel field → Activity rotates → ViewModel survives with dead Context reference → garbage collector cannot reclaim Activity → OOM. Enforces pure state management in every ViewModel subclass. No Context. No Activity. No View. `viewModelScope` only. UI state as sealed classes.',
    },
    {
      name: 'The Room Architect',
      icon: '🗄️',
      focus: '@Entity design, DAO patterns, migration strategy, fallbackToDestructiveMigration elimination',
      description:
        'Has seen `fallbackToDestructiveMigration` called on a production database and will not let it happen again. Every `@Database` version increment gets a `Migration` object. Every DAO method is `suspend` or returns `Flow`. `exportSchema = true` so the audit trail lives in version control. TypeConverters handle null. Nothing ships without the migration written.',
    },
    {
      name: 'The Hilt Inquisitor',
      icon: '💉',
      focus: 'Hilt scoping, @Provides vs @Binds, module organization, manual DI elimination',
      description:
        'Has untangled enough manual dependency graphs inside Activities to know that manual DI is not DI — it is coupling disguised as initialization code. Every Android component gets `@AndroidEntryPoint`. Every ViewModel gets `@HiltViewModel`. `@Binds` replaces `@Provides` wherever there is no construction code. Scope mismatches between `@Singleton` and Activity-tied components are treated as the memory leaks they are.',
    },
    {
      name: 'The WorkManager Apostle',
      icon: '⚙️',
      focus: 'WorkManager patterns, Service/IntentService migration, battery constraints, Doze mode',
      description:
        'Carries the battery usage screenshot as evidence. 23% of total battery used by background Services running without constraints, without backoff, without awareness that the phone is in Doze mode. `IntentService` is deprecated and crashes on API 31+. `AlarmManager` is for alarm clocks. Everything else belongs to WorkManager, with network constraints and battery-not-low requirements.',
    },
  ],
  howItWorks: [
    {
      phase: 'Reconnaissance',
      description:
        'Scans all Kotlin and Java files, runs `./gradlew compileDebugKotlin` for a build baseline, then counts Context references in ViewModel fields, `fallbackToDestructiveMigration` calls, asymmetric receiver registrations, `IntentService` subclasses, and `Thread {}` blocks. Produces a severity-classified report before touching a single file.',
    },
    {
      phase: 'Squad Assignment',
      description:
        'Files are routed by concern. Activity and Fragment subclasses go to the Lifecycle Squad. ViewModel subclasses go to the ViewModel Squad. Room entities, DAOs, and database builders go to the Room Squad. Hilt modules and annotated components go to the Injection Squad. Services, Workers, and BroadcastReceivers go to the Background Squad.',
    },
    {
      phase: 'Parallel Deployment',
      description:
        'All five squads launch simultaneously via the Task tool in a single message. Each specialist carries only the doctrine it needs — the Room Squad knows nothing about foreground service types, the Background Squad knows nothing about ViewModel scoping.',
    },
    {
      phase: 'Context Leak Hunt',
      description:
        'The ViewModel Theologian scans every ViewModel subclass for Context, Activity, Fragment, and View field declarations. Each one is a memory leak with a configuration change waiting to trigger it. GlobalScope usages get replaced with viewModelScope. Sealed UI state classes replace multiple independent LiveData flags.',
    },
    {
      phase: 'Schema Safety Audit',
      description:
        'The Room Architect verifies every `@Database` version has a corresponding `Migration` object, every DAO method is reactive or suspended, and no `fallbackToDestructiveMigration` exists in any database builder. Missing migrations are surfaced as BLOCKERs with the schema version gap identified — the developer writes the SQL, the architect verifies the structure.',
    },
    {
      phase: 'Victory Report',
      description:
        'Squad reports are aggregated, deduplicated, and sorted by severity. BLOCKERs surface first. The final count shows before/after for build errors and per-squad findings. Remaining BLOCKERs are listed individually with file, line, and exact fix required. The Tribunal does not close until every leak is named.',
    },
  ],
} as const;
