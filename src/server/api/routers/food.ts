import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { food } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const foodRouter = createTRPCRouter({
    addFood: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(food).values({
                name: input.name
            });
        }),
    getAllFood: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.food.findMany();
    }),
    updateFood: publicProcedure
        .input(z.object({ id: z.string(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(food).set({
                name: input.name
            }).where(eq(food.id, input.id))
        }),
    deleteFood: publicProcedure
        .input(z.object({id:z.string()}))
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(food).where(eq(food.id, input.id))
        })
});