import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";
import { ThirdwebProvider } from "thirdweb/react";
const App = dynamic(() => import("@/modules/admin/dashboard"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [queryClient] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          suspense: false,
          staleTime: 60 * 1000,
        },
      },
    })
  );

  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThirdwebProvider>
  );
};

export default Home;
