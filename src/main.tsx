import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./shared/styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </StrictMode>,
);
