import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { food } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const foodRouter = createTRPCRouter({
    addFood: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(food).values({
                name: input.name
            }).returning();
        }),
    getAllFood: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.food.findMany();
    }),
    updateFood: publicProcedure
        .input(z.object({ id: z.string(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db.update(food).set({
                name: input.name
            }).where(eq(food.id, input.id)).returning();

            if (result.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Food not found"
                });
            }
        }),
    deleteFood: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db.delete(food).where(eq(food.id, input.id))
                .returning();

            if (result.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Food not found"
                });
            }
        })
});