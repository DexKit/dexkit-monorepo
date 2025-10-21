import {
  BooleanInput,
  Button,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  TopToolbar,
  useNotify,
  useRecordContext,
} from "react-admin";
import { HidePoweredByField } from "../../components/HidePoweredByField";
import { HolderTextField } from "../../components/HolderTextField";
import {
  useDisableDexKitSignature,
  useRemoveDomainMutation,
} from "../../hooks/payment";

const SiteActions = () => {
  const record = useRecordContext();
  const removeCustomDomainMutation = useRemoveDomainMutation();
  const removeSignatureMutation = useDisableDexKitSignature();
  const notify = useNotify();

  function handleRemoveCustomDomain() {
    try {
      removeCustomDomainMutation.mutateAsync({ siteId: Number(record?.id) });
      notify("Domain removed", { type: "success" });
    } catch {
      notify("Failed to remove domain", { type: "warning" });
    }
  }

  function handleRemoveSignature() {
    try {
      removeSignatureMutation.mutateAsync({ siteId: Number(record?.id) });
      notify("hide signature removed", { type: "success" });
    } catch {
      notify("Failed to remove show signature", { type: "warning" });
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
      <Button color="error" variant="contained" onClick={handleRemoveSignature}>
        <>Disable Signature</>
      </Button>
    </TopToolbar>
  );
};

export const SiteEdit = () => (
  <Edit actions={<SiteActions />}>
    <SimpleForm>
      <TextInput source="slug" disabled />
      <TextInput source="owner" disabled />
      {/*  <TextInput source="id" />
      <DateInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="slug" />
      <TextInput source="owner" />
      <TextInput source="type" />
      <TextInput source="domain" />
      <TextInput source="email" />
      <TextInput source="isTemplate" />
      <TextInput source="config" />
      <TextInput source="signature" />
      <TextInput source="message" />
      <TextInput source="cname" />
      <TextInput source="domainSetupResponse" />
      <TextInput source="verifyDomainRawData" />
      <TextInput source="domainStatus" />
      <TextInput source="previewUrl" />*/}
      <NumberInput source="featuredScore" />
      <BooleanInput source="isTemplate" />
      <HidePoweredByField
        source="config"
        label="HidePoweredBy"
        showLabel={true}
      />
      <HolderTextField source="owner" label="HoldKit" showLabel={true} />
      {/* <TextInput source="signature" />
      {/* <TextInput source="config" />*/}
      {/* <TextInput source="domainSetupResponse" />
      {/*   <NumberInput source="nftId" />*/}
    </SimpleForm>
  </Edit>
);
