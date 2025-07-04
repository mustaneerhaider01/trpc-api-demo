import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import * as schema from "./schema.js";

const sqlite = new Database(process.env.DB_FILE_NAME);
const db = drizzle({ client: sqlite, schema });

export default db;
