import "dotenv/config";
import moment from "moment";

import db from "../db/drizzle.js";
import * as schema from "../db/schema.js";

const main = async () => {
  try {
    console.log("🔄 Seeding the database");

    const now = moment();

    await db.insert(schema.posts).values([
      {
        id: 1,
        title: "How to Learn TypeScript in 2025",
        content:
          "TypeScript is essential for large-scale JavaScript applications. Begin with types, interfaces, and generics to build confidence.",
        createdAt: now.clone().subtract(10, "minutes").unix(),
      },
      {
        id: 2,
        title: "The Rise of Edge Functions",
        content:
          "Edge functions enable running server-side code geographically closer to the user, improving latency and performance.",
        createdAt: now.clone().subtract(9, "minutes").unix(),
      },
      {
        id: 3,
        title: "React Server Components Explained",
        content:
          "RSCs let you render parts of a React tree on the server by default, reducing bundle size and improving load time.",
        createdAt: now.clone().subtract(8, "minutes").unix(),
      },
      {
        id: 4,
        title: "Why SQLite is Perfect for Local Dev",
        content:
          "SQLite is a file-based, zero-config database ideal for prototyping, testing, and even production in some cases.",
        createdAt: now.clone().subtract(7, "minutes").unix(),
      },
      {
        id: 5,
        title: "Building a Fullstack App with tRPC",
        content:
          "With tRPC, you can create typesafe APIs without needing REST or GraphQL schemas. It's perfect with Next.js.",
        createdAt: now.clone().subtract(6, "minutes").unix(),
      },
      {
        id: 6,
        title: "New Features in JavaScript ES2025",
        content:
          "The latest proposal introduces pattern matching, decorators, and improvements to async functions.",
        createdAt: now.clone().subtract(5, "minutes").unix(),
      },
      {
        id: 7,
        title: "Drizzle ORM vs Prisma: Which to Choose?",
        content:
          "Drizzle offers a lightweight alternative with SQL-first approach, while Prisma provides powerful tooling.",
        createdAt: now.clone().subtract(4, "minutes").unix(),
      },
      {
        id: 8,
        title: "Effective Data Seeding in Node.js",
        content:
          "Use libraries like Faker or manually crafted data with Moment.js to create realistic seed data in development.",
        createdAt: now.clone().subtract(3, "minutes").unix(),
      },
      {
        id: 9,
        title: "SQLite in Production: Myth or Reality?",
        content:
          "With modern sync tools like Litestream, you can replicate and back up SQLite databases reliably for production.",
        createdAt: now.clone().subtract(2, "minutes").unix(),
      },
      {
        id: 10,
        title: "Deploying tRPC with Express",
        content:
          "You can run a tRPC API on any backend, including Express or Fastify, and connect it seamlessly with a React frontend.",
        createdAt: now.clone().subtract(1, "minute").unix(),
      },
    ]);

    console.log("✅ Seeding finished");
  } catch (err) {
    console.log("❌ Failed to seed the database", err);
  }
};

main();
