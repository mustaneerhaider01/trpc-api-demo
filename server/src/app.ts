import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";

import appRouter, { createContext } from "./router.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(process.env.PORT);
