import type { CrusadeDetail } from '../crusade-detail.types';

export const sqlCrusade: CrusadeDetail = {
  slug: 'sql',
  name: 'The SQL Crusade',
  command: '/sql-crusade',
  icon: '🗄️',
  tagline:
    'No SELECT *. No N+1. No VARCHAR(255) when TEXT exists. The query planner sees your shame.',
  quote:
    "SELECT * FROM users. You fetched 47 columns. You needed 3. The query planner wept. The network groaned. The junior dev asked why the API is slow and you said \"we're working on it.\"",
  color: 'from-slate-600 to-blue-900',
  gradientFrom: 'slate-600',
  gradientTo: 'blue-900',
  description:
    'The SQL Crusade deploys five specialist squads in parallel to audit every layer of database access — query shape, index coverage, schema correctness, migration safety, and injection vectors. Schema decisions made at launch are still running five years later. This crusade finds the ones that will hurt before they do.',
  battleCry:
    'The Query Inquisition has opened its eyes. Every missing index is a crime. Every SELECT * is a confession. Every raw string query is an invitation to disaster.',
  commandments: [
    {
      numeral: 'I',
      text: 'SELECT * is forbidden — name every column you require. You paid for 47 columns and used one. The query planner cannot do an index-only scan. The network does not forget.',
    },
    {
      numeral: 'II',
      text: 'Every foreign key shall have an index — N+1 is original sin. One query for 100 users, then 100 queries for their posts. The table grows. The incident follows.',
    },
    {
      numeral: 'III',
      text: 'Use TIMESTAMPTZ not TIMESTAMP — time zones are not optional. Your dev server is UTC. Production might not be. TIMESTAMP WITHOUT TIME ZONE is a trap with a slow trigger.',
    },
    {
      numeral: 'IV',
      text: 'Parameterized queries only — string formatting is SQL injection. OWASP has documented this since 2003. Bobby Tables is a web comic from 2007. Use bind parameters.',
    },
    {
      numeral: 'V',
      text: 'Every migration shall be reversible — down() is not a suggestion. You write it now, while you still understand what upgrade() does. Not later, while production is burning.',
    },
  ],
  specialists: [
    {
      name: 'The Query Inquisitor',
      icon: '🔍',
      focus: 'SELECT *, N+1 patterns, OFFSET pagination, implicit type casts',
      description:
        'Has watched EXPLAIN ANALYZE output reveal a sequential scan on a million-row table where an index scan should have been. Hunts every query that fetches more than it needs or runs more times than it should. Will not rest until the ORM call has a select: clause and the loop has a join.',
    },
    {
      name: 'The Index Architect',
      icon: '🏗️',
      focus: 'Missing FK indexes, over-indexing, partial indexes, covering indexes',
      description:
        'Has run pg_stat_user_indexes on production and found 23 indexes with zero scans — pure write overhead, no read benefit. Has also found foreign key columns with no index being scanned sequentially on million-row tables. Cross-references every REFERENCES declaration against every CREATE INDEX statement.',
    },
    {
      name: 'The Schema Theologian',
      icon: '📐',
      focus: 'TIMESTAMPTZ, TEXT vs VARCHAR(255), BIGSERIAL vs SERIAL, NUMERIC vs FLOAT',
      description:
        'Was in the room when a SERIAL primary key column hit 2,147,483,647 on a four-year-old table. Knows that VARCHAR(255) is a MySQL habit with no storage benefit in PostgreSQL. Knows that FLOAT for money is fraud waiting to compound. Every column type is a permanent decision — gets them right the first time.',
    },
    {
      name: 'The Migration Warden',
      icon: '🔒',
      focus: 'Reversible migrations, zero-downtime patterns, safe destructive operations',
      description:
        'Has read post-mortems containing the sentence "the downgrade function was not implemented because we did not anticipate needing to roll back." More than once. Knows expand/migrate/contract by reflex. Knows that ADD COLUMN NOT NULL without a default locks a 50-million-row table. Writes downgrade() before leaving the migration file.',
    },
    {
      name: 'The Injection Sentinel',
      icon: '🛡️',
      focus: 'Parameterized queries, RLS, credential exposure, GRANT discipline',
      description:
        'Not looking for exotic edge cases — looking for f-strings wrapping SQL, template literals inside $queryRaw, .format() calls on query strings. The ones that appear in breach reports. The ones that get exploited with inputs the developer did not imagine. Here to show them before someone else does.',
    },
  ],
  howItWorks: [
    {
      phase: 'Reconnaissance',
      description:
        'Scans SQL files, migration directories, ORM models, and Prisma schemas. Counts SELECT * occurrences, foreign key declarations vs index declarations, TIMESTAMP columns, migration files without downgrade functions, and string-formatted SQL patterns. Produces a severity-classified report before touching anything.',
    },
    {
      phase: 'Squad Assignment',
      description:
        'Query Squad takes all SQL and ORM files. Index Squad cross-references foreign keys against index declarations. Schema Squad audits every column type. Migration Squad opens every file in migrations/ and checks for rollback paths and locking patterns. Security Squad reads every database access point for injection vectors.',
    },
    {
      phase: 'Parallel Deployment',
      description:
        'All five squads launch simultaneously via the Task tool in a single message. Each specialist carries only the doctrine it needs — the Migration Warden knows nothing about SELECT *, the Index Architect knows nothing about injection vectors.',
    },
    {
      phase: 'Security Sweep',
      description:
        'The Injection Sentinel flags every string-formatted SQL query with the exact parameterized replacement using the ORM or driver already in use in that file. Injection fixes are never auto-applied — the developer must review and apply them. A wrong automatic rewrite is worse than the finding.',
    },
    {
      phase: 'Schema and Migration Fixes',
      description:
        'With --write, the Schema Squad converts TIMESTAMP to TIMESTAMPTZ, VARCHAR(255) to TEXT, and SERIAL to BIGSERIAL in schema files. The Migration Squad adds downgrade stubs — not placeholders, but real inverse operations derived from reading upgrade(). Human judgment required before applying.',
    },
    {
      phase: 'Victory Report',
      description:
        'Squad reports are aggregated and sorted by severity. BLOCKERs — injection vectors, credentials in source, destructive migrations without rollback — are listed individually before everything else. Each one gets the specific file, line, and exact fix. No SELECT *. No N+1. No string-formatted SQL.',
    },
  ],
} as const;
