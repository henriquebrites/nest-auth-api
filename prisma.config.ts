// import { config } from "dotenv";
// import { expand } from "dotenv-expand";
// import { defineConfig } from "prisma/config";

// // Load .env and resolve ${VAR} references (e.g. DATABASE_URL built from DB_*).
// expand(config());

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   datasource: {
//     url: process.env["DATABASE_URL"],
//   },
// });

import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
