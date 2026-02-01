import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ephyRouter } from "./routers/ephy";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  ephy: ephyRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Analyse d'étiquettes de produits phytosanitaires
  analyzeLabel: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const { invokeLLM } = await import("./_core/llm");
      
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Tu es un expert en analyse d'étiquettes de produits phytosanitaires français.

Ta mission : extraire EXACTEMENT les informations telles qu'elles apparaissent sur l'étiquette.

INFORMATIONS À EXTRAIRE :

1. **Nom commercial** (OBLIGATOIRE) :
   - C'est le nom de marque du produit, généralement en GROS caractères en haut de l'étiquette
   - Copie-le EXACTEMENT comme il est écrit (majuscules, minuscules, espaces, tirets, apostrophes)
   - Exemples : "ROUNDUP ULTRA", "Glyphos 360", "CALYPSO SC 480", "CINCH PRO"
   - ATTENTION : Ne confonds PAS les lettres similaires :
     * C et N sont différents
     * I et l (L minuscule) sont différents
     * O et 0 (zéro) sont différents
   - Vérifie lettre par lettre avant de répondre

2. **Second nom commercial** (OPTIONNEL) :
   - Certains produits ont un second nom ou nom alternatif
   - Si présent, copie-le exactement
   - Sinon, mets null

3. **Numéro AMM** (OBLIGATOIRE) :
   - Format : EXACTEMENT 7 chiffres (exemple : 2150918, 8800006, 9800336)
   - Cherche "AMM" ou "N° AMM" ou "Autorisation de Mise sur le Marché" sur l'étiquette
   - Le numéro AMM est généralement près du bas de l'étiquette ou dans une section "Informations réglementaires"
   - Vérifie chaque chiffre individuellement (0 vs O, 1 vs I, 2 vs Z, 5 vs S, 8 vs B)
   - Si tu ne trouves pas de numéro à 7 chiffres, mets null
   - IMPORTANT : Ne confonds PAS le numéro AMM avec d'autres numéros (lot, code-barres, etc.)

4. **Fonction** (OPTIONNEL) :
   - Type de produit : herbicide, fongicide, insecticide, etc.
   - Si visible, copie-le
   - Sinon, mets null

RÉPONSE ATTENDUE (JSON) :
{
  "productName": "NOM EXACT DU PRODUIT",
  "secondName": "second nom si présent ou null",
  "amm": "7 chiffres ou null",
  "function": "fonction ou null"
}

ATTENTION :
- Ne modifie JAMAIS le nom commercial (pas de correction, pas de traduction)
- Si l'étiquette est floue ou illisible, mets null pour les champs concernés
- Sois précis et exact
- Vérifie chaque lettre et chaque chiffre individuellement
- Pour les lettres : évite les confusions (C vs N, I vs l, O vs 0)
- Pour les chiffres de l'AMM : vérifie deux fois (0 vs O, 1 vs I, 2 vs Z, 5 vs S, 8 vs B, 9 vs g)
- Le numéro AMM doit être cohérent avec le nom du produit`,
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: input.imageUrl,
                  },
                },
                {
                  type: "text",
                  text: "Analyse cette étiquette de produit phytosanitaire et extrait le nom commercial, le numéro AMM et la fonction.",
                },
              ],
            },
          ],
          response_format: {
            type: "json_object",
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== 'string') {
          throw new Error("Aucune réponse de l'IA");
        }

        const parsed = JSON.parse(content);
        return {
          success: true,
          data: {
            productName: parsed.productName || null,
            secondName: parsed.secondName || null,
            amm: parsed.amm || null,
            function: parsed.function || null,
          },
        };
      } catch (error) {
        console.error("Erreur lors de l'analyse de l'étiquette:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        };
      }
    }),
});

export type AppRouter = typeof appRouter;
