import { getWindowUrl } from "@dexkit/core/utils/browser";
import AppConfirmDialog from "@dexkit/ui/components/AppConfirmDialog";
import ShareDialog from "@dexkit/ui/components/dialogs/ShareDialog";
import FormInfoCard from "@dexkit/ui/modules/forms/components/FormInfoCard";
import {
  useCloseFormMutation,
  useFormQuery,
} from "@dexkit/ui/modules/forms/hooks";
import { UserContractPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ContractFormView from "@dexkit/web3forms/components/ContractFormView";
import { Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface Props {
  section?: UserContractPageSection;
}

export default function UserContractSection({ section }: Props) {
  const formQuery = useFormQuery({ id: section?.formId });

  const [showConfirmClone, setShowConfirmClone] = useState(false);

  const cloneFormMutation = useCloseFormMutation();

  const handleCloneForm = () => {
    setShowConfirmClone(true);
  };

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/forms/${formQuery.data?.id}/edit`);
  };

  const { account } = useWeb3React();

  const [showShare, setShowShare] = useState(false);

  const handleCloseShare = () => {
    setShowShare(false);
  };

  const handleShowShare = () => {
    setShowShare(true);
  };

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmClone = async () => {
    if (formQuery.data?.id) {
      try {
        let result = await cloneFormMutation.mutateAsync({
          id: formQuery.data?.id,
        });
        setShowConfirmClone(false);
        enqueueSnackbar(
          formatMessage({
            id: "form.created.successfully",
            defaultMessage: "Fomr created successfully",
          }),
          {
            variant: "success",
          }
        );

        router.push(`/forms/${result.id}`);
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
      }
    }
  };

  const handleCloseClone = () => {
    setShowConfirmClone(false);
  };

  return (
    <>
      <ShareDialog
        dialogProps={{
          open: showShare,
          onClose: handleCloseShare,
          maxWidth: "sm",
          fullWidth: true,
        }}
        url={`${getWindowUrl()}/forms/${formQuery.data?.id}`}
      />
      <AppConfirmDialog
        onConfirm={handleConfirmClone}
        DialogProps={{
          maxWidth: "sm",
          fullWidth: true,
          open: showConfirmClone,
          onClose: handleCloseClone,
        }}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.clone.this.form"
            defaultMessage="Do you really want to clone this form?"
          />
        </Typography>
      </AppConfirmDialog>
      <Container sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {!section?.hideFormInfo && (
            <Grid size={12}>
              <FormInfoCard
                onClone={handleCloneForm}
                onEdit={handleEdit}
                onShare={handleShowShare}
                account={account}
                contractAddress={formQuery.data?.params.contractAddress}
                chainId={formQuery.data?.params.chainId}
                creatorAddress={formQuery.data?.creatorAddress}
                name={formQuery.data?.name}
                description={formQuery.data?.description}
                isLoading={formQuery.isLoading}
                templateId={formQuery.data?.templateId}
              />
            </Grid>
          )}
          <Grid size={12}>
            {formQuery.data?.params ? (
              <ContractFormView params={formQuery.data?.params} />
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
