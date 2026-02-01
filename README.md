
Add database queries in `server/db.ts`:

```tsx
import { eq } from "drizzle-orm";
import { getDb } from "./_core/db";
import { items, InsertItem } from "../drizzle/schema";

export async function getUserItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(items).where(eq(items.userId, userId));
}

export async function createItem(data: InsertItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(items).values(data);
  return result.insertId;
}

export async function updateItem(id: number, data: Partial<InsertItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(items).set(data).where(eq(items.id, id));
}

export async function deleteItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(items).where(eq(items.id, id));
}
```

---

## tRPC API

### Adding Routes

Define API routes in `server/routers.ts`:

```tsx
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // Public route (no auth required)
  health: publicProcedure.query(() => ({ status: "ok" })),

  // Protected routes (auth required)
  items: router({
    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserItems(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createItem({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        completed: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        return db.updateItem(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteItem(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
```

### Calling from Frontend

Use tRPC hooks in your components:

```tsx
import { trpc } from "@/lib/trpc";

function ItemList() {
  // Query
  const { data: items, isLoading, refetch } = trpc.items.list.useQuery();

  // Mutation
  const createMutation = trpc.items.create.useMutation({
    onSuccess: () => refetch(),
  });

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      title: "New Item",
      description: "Description here",
    });
  };

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ItemCard item={item} />}
    />
  );
}
```

### Input Validation

Use Zod schemas for type-safe validation:

```tsx
import { z } from "zod";

const createItemSchema = z.object({
  title: z.string().min(1, "Title required").max(255),
  description: z.string().max(1000).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.date().optional(),
});

// In router
create: protectedProcedure
  .input(createItemSchema)
  .mutation(({ ctx, input }) => {
    // input is fully typed
  }),