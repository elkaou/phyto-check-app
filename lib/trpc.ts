// lib/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://10.0.2.2:3000/trpc', // Remplacez par l'URL de votre backend (Android)
      // url: 'http://localhost:3000/trpc', // Pour iOS/macOS
    }),
  ],
});

export const createTRPCClient = () => trpc;
