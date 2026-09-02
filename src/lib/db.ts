import "server-only";
import { DuckDBInstance, type DuckDBConnection } from "@duckdb/node-api";
import fs from "node:fs";
import path from "node:path";
import { seedContent, ensureBaselineFields } from "./seed";

/**
 * DuckDB is the single HTAP store for Torotech:
 *  - transactional rows (content, leads, page events, field definitions)
 *  - analytical queries (traffic rollups, funnel, lead source breakdowns)
 * One embedded instance per process; queries are serialised through a small
 * promise queue so writes never interleave.
 */

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DB_FILE = process.env.DUCKDB_PATH ?? path.join(DATA_DIR, "torotech.duckdb");

type Row = Record<string, unknown>;

class Database {
  private conn: DuckDBConnection | null = null;
  private ready: Promise<void> | null = null;
  private queue: Promise<unknown> = Promise.resolve();

  private async init() {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.mkdirSync(path.join(DATA_DIR, "uploads"), { recursive: true });
    const instance = await DuckDBInstance.fromCache(DB_FILE);
    this.conn = await instance.connect();
    await this.migrate();
  }

  private ensure() {
    if (!this.ready) this.ready = this.init();
    return this.ready;
  }

  /** Run a statement and return rows as JSON-safe objects. */
  async query<T extends Row = Row>(sql: string, params?: Record<string, unknown> | unknown[]): Promise<T[]> {
    await this.ensure();
    const run = () => runRaw<T>(this.conn!, sql, params);
    const p = this.queue.then(run, run);
    this.queue = p.catch(() => undefined);
    return p;
  }

  async exec(sql: string, params?: Record<string, unknown> | unknown[]) {
    await this.query(sql, params);
  }

  private async migrate() {
    const conn = this.conn!;
    await conn.run(`
      CREATE TABLE IF NOT EXISTS content (
        id VARCHAR PRIMARY KEY,
        type VARCHAR NOT NULL,          -- service | case_study | post | page
        slug VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        excerpt VARCHAR,
        body VARCHAR,
        cover VARCHAR,
        status VARCHAR NOT NULL DEFAULT 'draft',
        tags VARCHAR DEFAULT '[]',      -- JSON array
        data VARCHAR DEFAULT '{}',      -- schema-flexible custom fields (JSON)
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        published_at TIMESTAMP
      );
      CREATE UNIQUE INDEX IF NOT EXISTS content_type_slug ON content(type, slug);

      CREATE TABLE IF NOT EXISTS field_defs (
        id VARCHAR PRIMARY KEY,
        entity VARCHAR NOT NULL,        -- service | case_study | post | page | lead
        key VARCHAR NOT NULL,
        label VARCHAR NOT NULL,
        type VARCHAR NOT NULL,          -- text | textarea | number | boolean | select | url | date
        options VARCHAR DEFAULT '[]',
        required BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT now()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS field_entity_key ON field_defs(entity, key);

      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        company VARCHAR,
        message VARCHAR,
        interest VARCHAR,
        source VARCHAR,
        page VARCHAR,
        data VARCHAR DEFAULT '{}',
        status VARCHAR DEFAULT 'new',   -- new | contacted | qualified | won | lost
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR PRIMARY KEY,
        ts TIMESTAMP DEFAULT now(),
        kind VARCHAR NOT NULL,          -- pageview | cta | lead
        path VARCHAR,
        referrer VARCHAR,
        ref_host VARCHAR,
        visitor VARCHAR,                -- daily-salted hash, never the raw IP
        device VARCHAR,                 -- mobile | desktop | bot
        ua VARCHAR,
        country VARCHAR,
        data VARCHAR DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR PRIMARY KEY,
        value VARCHAR
      );
    `);
    const seedable = { exec: (sql: string, params?: unknown[]) => runRaw(conn, sql, params).then(() => undefined) };
    const [{ n }] = await runRaw<{ n: number }>(conn, "SELECT count(*)::INTEGER AS n FROM content");
    // Seed through the raw connection: the public query() waits on init, which is still running here.
    if (n === 0) await seedContent(seedable);
    await ensureBaselineFields(seedable);
  }
}

async function runRaw<T extends Row = Row>(
  conn: DuckDBConnection,
  sql: string,
  params?: Record<string, unknown> | unknown[],
): Promise<T[]> {
  if (params === undefined) {
    const reader = await conn.runAndReadAll(sql);
    return reader.getRowObjectsJson() as unknown as T[];
  }
  const prepared = await conn.prepare(sql);
  if (Array.isArray(params)) {
    params.forEach((p, i) => bindValue(prepared, i + 1, p));
  } else {
    for (const name of Object.keys(params)) bindValue(prepared, prepared.parameterIndex(name), params[name]);
  }
  const reader = await prepared.runAndReadAll();
  return reader.getRowObjectsJson() as unknown as T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bindValue(prepared: any, idx: number, value: unknown) {
  if (value === null || value === undefined) prepared.bindNull(idx);
  else if (typeof value === "boolean") prepared.bindBoolean(idx, value);
  else if (typeof value === "number") {
    if (Number.isInteger(value)) prepared.bindInteger(idx, value);
    else prepared.bindDouble(idx, value);
  } else if (typeof value === "bigint") prepared.bindBigInt(idx, value);
  else if (value instanceof Date) prepared.bindVarchar(idx, value.toISOString());
  else if (typeof value === "object") prepared.bindVarchar(idx, JSON.stringify(value));
  else prepared.bindVarchar(idx, String(value));
}

const globalForDb = globalThis as unknown as { __torotechDb?: Database };
export const db = globalForDb.__torotechDb ?? new Database();
globalForDb.__torotechDb = db;

export { DATA_DIR };
export function newId() {
  return crypto.randomUUID();
}
