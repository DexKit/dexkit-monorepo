import {
  BooleanInput,
  Button,
  Edit,
  SimpleForm,
  TextInput,
  TopToolbar,
  useNotify,
  useRecordContext,
} from "react-admin";
import { useRemoveDomainMutation } from "../../hooks/payment";

const FeatUsageActions = () => {
  const record = useRecordContext();
  const removeCustomDomainMutation = useRemoveDomainMutation();
  const notify = useNotify();

  function handleRemoveCustomDomain() {
    try {
      removeCustomDomainMutation.mutateAsync({ siteId: record?.siteId });
      notify("Domain removed", { type: "success" });
    } catch {
      notify("Failed to remove domain", { type: "warning" });
    }
  }

  return (
    <TopToolbar>
      <Button
        color="error"
        variant="contained"
        onClick={handleRemoveCustomDomain}
      >
        <>Remove Custom Domain</>
      </Button>
    </TopToolbar>
  );
};

export const FeatUsageEdit = () => {
  return (
    <>
      <Edit actions={<FeatUsageActions />}>
        <SimpleForm>
          <TextInput source="account" disabled variant="outlined" />
          <TextInput source="slug" disabled variant="outlined" />
          <TextInput source="site.slug" disabled variant="outlined" />
          <TextInput source="site.domain" disabled variant="outlined" />
          <BooleanInput source="active"></BooleanInput>
        </SimpleForm>
      </Edit>
    </>
  );
};
