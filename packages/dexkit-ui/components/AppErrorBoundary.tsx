import { QueryErrorResetBoundary } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface Props {
  fallbackRender: (props: FallbackProps) => React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
}

export function AppErrorBoundary({ fallbackRender, children }: Props) {
  // Temporalmente deshabilitado ErrorBoundary debido a problemas de tipo
  return (
    <QueryErrorResetBoundary>
      {({ reset }: { reset: () => void }) => (
        <div>
          {children}
        </div>
      )}
    </QueryErrorResetBoundary>
  );
}
