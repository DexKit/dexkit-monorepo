import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { NextPage } from "next";

import Admin from "@/modules/admin/components/Admin";
import React from "react";
import { ThirdwebProvider } from "thirdweb/react";

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
        <Admin />
      </QueryClientProvider>
    </ThirdwebProvider>
  );
};

export default Home;
