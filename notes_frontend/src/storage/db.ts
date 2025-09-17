import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

/**
 * Storage abstraction that uses:
 * - SQLite on native platforms (Android/iOS)
 * - In-memory fallback on web (or when SQLite is unavailable)
 *
 * This prevents crashes/blank screens when running in a web-based preview where SQLite is not supported.
 */

export type Note = {
  id?: number;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
};

type DbAdapter = {
  init(): Promise<void>;
  list(): Promise<Note[]>;
  get(id: number): Promise<Note | null>;
  create(title: string, content: string): Promise<number>;
  update(id: number, title: string, content: string): Promise<void>;
  remove(id: number): Promise<void>;
};

// In-memory fallback for web or when SQLite fails to initialize
class MemoryAdapter implements DbAdapter {
  private notes: Note[] = [];
  private nextId = 1;

  async init(): Promise<void> {
    // nothing to do
  }

  async list(): Promise<Note[]> {
    // Return copy sorted by updated_at desc
    return [...this.notes].sort((a, b) => b.updated_at - a.updated_at);
  }

  async get(id: number): Promise<Note | null> {
    const n = this.notes.find(n => n.id === id);
    return n ? { ...n } : null;
  }

  async create(title: string, content: string): Promise<number> {
    const now = Date.now();
    const id = this.nextId++;
    this.notes.push({
      id,
      title,
      content,
      created_at: now,
      updated_at: now,
    });
    return id;
  }

  async update(id: number, title: string, content: string): Promise<void> {
    const now = Date.now();
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx >= 0) {
      this.notes[idx] = {
        ...this.notes[idx],
        title,
        content,
        updated_at: now,
      };
    }
  }

  async remove(id: number): Promise<void> {
    this.notes = this.notes.filter(n => n.id !== id);
  }
}

class SQLiteAdapter implements DbAdapter {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    // Open DB using async mode (Expo SDK 53 provides openDatabaseAsync)
    // If open or schema creation fails, throw so caller can fallback.
    const db = await SQLite.openDatabaseAsync('notes.db');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    this.db = db;
  }

  private requireDb(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('SQLite database not initialized');
    }
    return this.db;
  }

  async list(): Promise<Note[]> {
    const db = this.requireDb();
    const rows = await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY updated_at DESC;');
    return rows;
  }

  async get(id: number): Promise<Note | null> {
    const db = this.requireDb();
    const row = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?;', [id]);
    return row ?? null;
  }

  async create(title: string, content: string): Promise<number> {
    const db = this.requireDb();
    const now = Date.now();
    const result = await db.runAsync(
      'INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?);',
      [title, content, now, now]
    );
    return result.lastInsertRowId ?? 0;
  }

  async update(id: number, title: string, content: string): Promise<void> {
    const db = this.requireDb();
    const now = Date.now();
    await db.runAsync(
      'UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?;',
      [title, content, now, id]
    );
  }

  async remove(id: number): Promise<void> {
    const db = this.requireDb();
    await db.runAsync('DELETE FROM notes WHERE id = ?;', [id]);
  }
}

let adapter: DbAdapter | null = null;
let initPromise: Promise<void> | null = null;

async function getAdapter(): Promise<DbAdapter> {
  if (adapter) return adapter;

  // Try SQLite on native platforms; otherwise use memory on web
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const sqlite = new SQLiteAdapter();
    try {
      initPromise = sqlite.init();
      await initPromise;
      adapter = sqlite;
      return adapter;
    } catch (err) {
      console.warn('SQLite initialization failed, falling back to in-memory storage:', err);
      const mem = new MemoryAdapter();
      initPromise = mem.init();
      await initPromise;
      adapter = mem;
      return adapter;
    }
  } else {
    // web or other platforms
    const mem = new MemoryAdapter();
    initPromise = mem.init();
    await initPromise;
    adapter = mem;
    return adapter;
  }
}

// PUBLIC_INTERFACE
export async function listNotes(): Promise<Note[]> {
  /** Returns all notes ordered by updated_at desc. */
  const a = await getAdapter();
  try {
    return await a.list();
  } catch (e) {
    console.warn('listNotes error:', e);
    return [];
  }
}

// PUBLIC_INTERFACE
export async function getNote(id: number): Promise<Note | null> {
  /** Returns a single note by id. */
  const a = await getAdapter();
  try {
    return await a.get(id);
  } catch (e) {
    console.warn('getNote error:', e);
    return null;
  }
}

// PUBLIC_INTERFACE
export async function createNote(title: string, content: string): Promise<number> {
  /** Creates a new note and returns its id. */
  const a = await getAdapter();
  try {
    return await a.create(title, content);
  } catch (e) {
    console.warn('createNote error:', e);
    return 0;
  }
}

// PUBLIC_INTERFACE
export async function updateNote(id: number, title: string, content: string): Promise<void> {
  /** Updates an existing note. */
  const a = await getAdapter();
  try {
    await a.update(id, title, content);
  } catch (e) {
    console.warn('updateNote error:', e);
  }
}

// PUBLIC_INTERFACE
export async function deleteNote(id: number): Promise<void> {
  /** Deletes a note by id. */
  const a = await getAdapter();
  try {
    await a.remove(id);
  } catch (e) {
    console.warn('deleteNote error:', e);
  }
}
