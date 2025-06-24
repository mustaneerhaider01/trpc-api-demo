import "dotenv/config";

import db from "../db/drizzle.js";
import * as schema from "../db/schema.js";

const main = async () => {
  try {
    console.log("🔄 Reseting the database");

    await db.delete(schema.posts);

    console.log("✅ Database reseted");
  } catch (err) {
    console.log("❌ Failed to reset the database", err);
  }
};

main();
