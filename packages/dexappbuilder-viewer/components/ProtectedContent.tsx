import { GatedConditionView } from "@dexkit/ui/components/gated-content/GatedConditionView";
import { useAuth } from "@dexkit/ui/hooks/auth";
import { useCheckGatedConditions } from "@dexkit/ui/hooks/gatedConditions";
import {
  GatedCondition,
  GatedPageLayout,
} from "@dexkit/ui/modules/wizard/types";
import { PageSectionsLayout } from "@dexkit/ui/modules/wizard/types/config";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { SectionsRenderer } from "./SectionsRenderer";

import { useProtectedAppConfig } from "@dexkit/ui/hooks/app/useProtectedAppConfig";
import { AppPageSection } from "@dexkit/ui/modules/wizard/types/section";

const hasError = (
  data: { sections?: AppPageSection[] } | null | undefined
): boolean => {
  if (!data) return true;
  if (!data.sections) return true;
  return false;
};

export default function ProtectedContent({
  isProtected,
  conditions,
  site,
  page,
  layout,
  pageLayout,
  slug,
}: {
  isProtected: boolean;
  layout?: GatedPageLayout;
  pageLayout?: PageSectionsLayout;
  conditions?: GatedCondition[];
  site: string;
  slug?: string;
  page: string;
}) {
  const { account } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [showError, setShowError] = useState(false);

  const {
    data: conditionsData,
    isLoading: isCheckingConditions,
    refetch,
    isError,
  } = useCheckGatedConditions({
    conditions,
    account,
  });

  const { data: protectedConfigResponse } = useProtectedAppConfig({
    isProtected,
    domain: site,
    slug,
    page,
    result: conditionsData?.result,
  });

  const handleRetry = () => {
    setRetryCount((prev: any) => prev + 1);
    setShowError(false);
    refetch();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (
      hasError(protectedConfigResponse) &&
      account &&
      isLoggedIn &&
      !isCheckingConditions
    ) {
      timer = setTimeout(() => {
        setShowError(true);
      }, 1500);
    } else {
      setShowError(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [protectedConfigResponse, account, isLoggedIn, isCheckingConditions]);

  if (protectedConfigResponse?.sections) {
    return (
      <SectionsRenderer
        sections={protectedConfigResponse.sections}
        layout={pageLayout}
      />
    );
  }

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, sm: 8 }}>
          {showError &&
            hasError(protectedConfigResponse) &&
            account &&
            isLoggedIn && (
              <Stack spacing={3} my={4} alignItems="center">
                <Alert severity="error" sx={{ width: "100%" }}>
                  <Typography variant="body1">
                    {conditionsData &&
                      "errorMessage" in conditionsData &&
                      conditionsData.errorMessage ? (
                      conditionsData.errorMessage
                    ) : (
                      <FormattedMessage
                        id="error.checking.conditions"
                        defaultMessage="There was an error while checking your assets. Please try again."
                      />
                    )}
                  </Typography>
                </Alert>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                >
                  <FormattedMessage id="retry" defaultMessage="Retry" />
                </Button>
              </Stack>
            )}

          <GatedConditionView
            account={account}
            conditions={conditions}
            layout={layout}
            isLoggedIn={isLoggedIn}
            result={conditionsData?.result}
            partialResults={conditionsData?.partialResults}
            balances={conditionsData?.balances}
            isLoading={isCheckingConditions}
            onRetry={handleRetry}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
