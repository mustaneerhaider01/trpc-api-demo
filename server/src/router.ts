import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import moment from "moment";

import db from "./db/drizzle.js";
import { posts } from "./db/schema.js";
import { createPostSchema, updatePostSchema } from "./validations/posts.js";

// created for each request
export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions) => ({}); // no context

// Get the context type
export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;

const appRouter = t.router({
  getAll: publicProcedure.query(() => {
    const allPosts = db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .all();

    return { posts: allPosts };
  }),
  getById: publicProcedure
    .input(z.number({ required_error: "post id is required" }))
    .query(({ input }) => {
      const post = db.select().from(posts).where(eq(posts.id, input)).get();

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return { post };
    }),
  create: publicProcedure.input(createPostSchema).mutation(({ input }) => {
    const insertedId = db
      .insert(posts)
      .values({
        title: input.title,
        content: input.content,
        createdAt: moment().unix(),
      })
      .run().lastInsertRowid;

    return { message: "Post created successfully", postId: insertedId };
  }),
  delete: publicProcedure
    .input(z.number({ required_error: "post id is required" }))
    .mutation(({ input }) => {
      const post = db.select().from(posts).where(eq(posts.id, input)).get();

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      db.delete(posts).where(eq(posts.id, input)).run();

      return { message: "Post deleted successfully" };
    }),
  update: publicProcedure.input(updatePostSchema).mutation(({ input }) => {
    const postId = input.id;
    const post = db.select().from(posts).where(eq(posts.id, postId)).get();

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    db.update(posts)
      .set({
        ...(input.title && { title: input.title }),
        ...(input.content && { content: input.content }),
      })
      .where(eq(posts.id, postId))
      .run();

    return { message: "Post updated successfully" };
  }),
});

export default appRouter;

// Export the router type to be imported on the client side
export type TRPCRouter = typeof appRouter;
