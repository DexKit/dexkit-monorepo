import { QueryErrorResetBoundary } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface Props {
  fallbackRender: (
    props: FallbackProps
  ) => React.ReactElement<
    unknown,
    string | typeof React.Component | React.FunctionComponent<{}>
  > | null;

  children: React.ReactNode | React.ReactNode[];
}

export function AppErrorBoundary({ fallbackRender, children }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={fallbackRender}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
