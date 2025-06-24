import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { TRPCRouter } from "../../../server/src/router";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<TRPCRouter>();
