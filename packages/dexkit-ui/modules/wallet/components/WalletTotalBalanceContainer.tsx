import { ChainId } from "@dexkit/core/constants";
import { WalletTotalBalance } from "./WalletTotalBalance";

interface Props {
  chainId?: ChainId;
}

/*export function WalletTotalBalanceCointainer({ chainId }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => (
            <Stack justifyContent="center" alignItems="center">
              <Typography variant="h6">
                <FormattedMessage
                  id="something.went.wrong"
                  defaultMessage="Oops, something went wrong"
                  description="Something went wrong error message"
                />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {String(error)}
              </Typography>
              <Button color="primary" onClick={resetErrorBoundary}>
                <FormattedMessage
                  id="try.again"
                  defaultMessage="Try again"
                  description="Try again"
                />
              </Button>
            </Stack>
          )}
        >
          <Suspense fallback={<Skeleton />}>
            <WalletTotalBalance chainId={chainId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}*/

export function WalletTotalBalanceCointainer({ chainId }: Props) {
  return <WalletTotalBalance chainId={chainId} />;
}
