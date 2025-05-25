import { Button, FormControlLabel, Grid, Switch, Tooltip } from "@mui/material";

import { Formik } from "formik";
import { FormattedMessage } from "react-intl";
import { CommerceConfig } from "../../wizard/types/config";

export interface CommerceIntegrationFormProps {
  commerce?: CommerceConfig;
  onSave: (config: CommerceConfig) => void;
}

export default function CommerceIntegrationForm({
  commerce,
  onSave,
}: CommerceIntegrationFormProps) {
  const handleSubmit = (values: CommerceConfig) => {
    onSave(values);
  };

  return (
    <Formik
      initialValues={commerce ? commerce : { enabled: false }}
      onSubmit={handleSubmit}
    >
      {({
        values,
        setFieldValue,
        isValid,
        touched,
        setFieldTouched,
        submitForm,
      }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              sx={{ p: 0, m: 0 }}
              label={
                <FormattedMessage
                  id="e.commerce.menu"
                  defaultMessage="E-commerce menu"
                />
              }
              labelPlacement="start"
              control={
                <Tooltip
                  title={
                    <FormattedMessage
                      id="switch.on.to.activate.the.e-commerce.menu"
                      defaultMessage="Switch on to activate the E-Commerce menu."
                    />
                  }
                  placement="right-end"
                >
                  <Switch
                    checked={values.enabled}
                    onChange={() => {
                      setFieldValue("enabled", !values.enabled);
                      setFieldTouched("enabled", true);
                    }}
                  />
                </Tooltip>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={
                !isValid ||
                Object.keys(touched).filter((key) =>
                  Boolean((touched as any)?.[key])
                ).length === 0
              }
              onClick={submitForm}
              variant="contained"
              size="small"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
