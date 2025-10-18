import ClaimAirdropDialog from "@dexkit/ui/modules/token/components/ClaimAirdropDialog";
import AddIcon from "@mui/icons-material/Add";
import { Button, Grid } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { FormInput } from "../types";
export interface ImageInputProps {
  el: FormInput;
}

export function MerkleTreeFileInput({ el }: ImageInputProps) {
  const { setFieldValue, values } = useFormikContext<any>();

  useEffect(() => {
    setFieldValue(el?.ref as string, "0x");
  }, []);

  const [showDialog, setShowDialog] = useState(false);

  const handleToggle = () => {
    setShowDialog((value) => !value);
    // setFieldValue(name, undefined);
  };

  return (
    <>
      <ClaimAirdropDialog
        dialogProps={{
          open: showDialog,
          fullWidth: true,
          maxWidth: "lg",
          onClose: handleToggle,
        }}
        value={values[values[el?.ref as string]]}
        onConfirm={({ data, merkleProof }) => {
          if (!data) {
            setFieldValue(el?.ref as string, "0x");
          } else {
            setFieldValue(el?.ref as string, merkleProof);
            setFieldValue(merkleProof, data);
          }
        }}
      />
      <Grid container spacing={2}>
        <Grid size={12}>
          <Field
            component={TextField}
            name={el.ref as string}
            size="small"
            fullWidth
            disabled={el.locked}
            label={el.label}
            helperText={el.helperText}
            required
            InputLabelProps={{
              shrink: values[el?.ref as string] ? true : false,
            }}
          />
        </Grid>
        <Grid size={12}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              handleToggle();
            }}
            variant="outlined"
          >
            <FormattedMessage
              id="add.airdrop.list"
              defaultMessage="Add airdrop list"
            />
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
