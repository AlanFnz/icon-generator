import { z } from "zod";

import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "you do not have enough credits",
        });
      }
      let url;
      try {
        const response = await openai.createImage({
          prompt: input.prompt,
          n: 1,
          size: "1024x1024",
        });

        url = response.data.data[0]?.url;
      } catch (error) {
        console.log("error", error);
      }

      return {
        imageUrl: url,
      };
    }),
});
