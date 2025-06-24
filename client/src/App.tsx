import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import AppLayout from "./components/AppLayout";
import type { TRPCRouter } from "../../server/src/router";
import { TRPCProvider } from "./lib/trpc";
import PostDetails from "./pages/PostDetails";
import ManagePost from "./pages/ManagePost";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 60 seconds
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function App() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<TRPCRouter>({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL,
        }),
      ],
    })
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "posts/:postId",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <PostDetails />,
            },
            {
              path: "edit",
              element: <ManagePost />,
            },
          ],
        },
        {
          path: "create",
          element: <ManagePost />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors theme="light" position="top-center" />
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export default App;
