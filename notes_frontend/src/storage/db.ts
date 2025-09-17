import * as SQLite from 'expo-sqlite';

/**
 * Create or get the SQLite database instance.
 * Ensures the notes table exists.
 */
export async function getDb() {
  // Open DB using async mode (Expo SDK 53 provides openDatabaseAsync)
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

  return db;
}

export type Note = {
  id?: number;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
};

// PUBLIC_INTERFACE
export async function listNotes(): Promise<Note[]> {
  /** Returns all notes ordered by updated_at desc. */
  const db = await getDb();
  const rows = await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY updated_at DESC;');
  return rows;
}

// PUBLIC_INTERFACE
export async function getNote(id: number): Promise<Note | null> {
  /** Returns a single note by id. */
  const db = await getDb();
  const row = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?;', [id]);
  return row ?? null;
}

// PUBLIC_INTERFACE
export async function createNote(title: string, content: string): Promise<number> {
  /** Creates a new note and returns its id. */
  const db = await getDb();
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?);',
    [title, content, now, now]
  );
  return result.lastInsertRowId ?? 0;
}

// PUBLIC_INTERFACE
export async function updateNote(id: number, title: string, content: string): Promise<void> {
  /** Updates an existing note. */
  const db = await getDb();
  const now = Date.now();
  await db.runAsync(
    'UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?;',
    [title, content, now, id]
  );
}

// PUBLIC_INTERFACE
export async function deleteNote(id: number): Promise<void> {
  /** Deletes a note by id. */
  const db = await getDb();
  await db.runAsync('DELETE FROM notes WHERE id = ?;', [id]);
}
