"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | null = null;

function getClientQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
  }
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getClientQueryClient();
  // const [queryClient] = useState(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         queries: {
  //           staleTime: 60 * 1000,
  //         },
  //       },
  //     }),
  // );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
