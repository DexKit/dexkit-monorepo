import { AppDialogTitle } from '@dexkit/ui';
import { PageSectionsLayout } from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { RadioGroup, Select } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface EditPageSectionsLayoutDialogProps {
  DialogProps: DialogProps;
  onConfirm: (layout: PageSectionsLayout) => void;
  layout?: PageSectionsLayout;
}

export default function EditPageSectionsLayoutDialog({
  DialogProps,
  onConfirm,
  layout,
}: EditPageSectionsLayoutDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleSubmit = async (values: PageSectionsLayout) => {
    onConfirm(values);
    handleClose();
  };

  const renderTabsLayout = ({ isSubmitting }: { isSubmitting: boolean }) => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1">
            <FormattedMessage id="desktop" defaultMessage="Desktop" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Field component={RadioGroup} row name="layout.desktop.position">
            <FormControlLabel
              value="top"
              control={<Radio disabled={isSubmitting} />}
              label={<FormattedMessage id="top" defaultMessage="Top" />}
              disabled={isSubmitting}
            />
            <FormControlLabel
              value="side"
              control={<Radio disabled={isSubmitting} />}
              label={<FormattedMessage id="side" defaultMessage="Side" />}
              disabled={isSubmitting}
            />
            <FormControlLabel
              value="bottom"
              control={<Radio disabled={isSubmitting} />}
              label={<FormattedMessage id="bottom" defaultMessage="Bottom" />}
              disabled={isSubmitting}
            />
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <FormattedMessage id="Mobile" defaultMessage="Mobile" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Field component={RadioGroup} row name="layout.mobile.position">
            <FormControlLabel
              value="top"
              control={<Radio disabled={isSubmitting} />}
              label={<FormattedMessage id="top" defaultMessage="Top" />}
              disabled={isSubmitting}
            />
            <FormControlLabel
              value="bottom"
              control={<Radio disabled={isSubmitting} />}
              label={<FormattedMessage id="bottom" defaultMessage="Bottom" />}
              disabled={isSubmitting}
            />
          </Field>
        </Grid>
      </Grid>
    );
  };

  return (
    <Formik
      initialValues={
        layout
          ? layout
          : {
              type: 'list',
            }
      }
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid, values, isSubmitting }) => (
        <Dialog {...DialogProps}>
          <AppDialogTitle
            title={
              <FormattedMessage
                id="edit.page.layout"
                defaultMessage="Edit page layout"
              />
            }
            onClose={handleClose}
            sx={{ px: 4, py: 2 }}
          />
          <DialogContent dividers sx={{ p: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Field
                    fullWidth
                    label={<FormattedMessage id="type" defaultMessage="type" />}
                    component={Select}
                    name="type"
                    notched
                  >
                    <MenuItem value="list">
                      <FormattedMessage id="list" defaultMessage="List" />
                    </MenuItem>
                    <MenuItem value="tabs">
                      <FormattedMessage id="tabs" defaultMessage="Tabs" />
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              {values.type === 'tabs' ? (
                <Grid item xs={12}>
                  {renderTabsLayout({ isSubmitting })}
                </Grid>
              ) : undefined}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 2 }}>
            <Button onClick={handleClose}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              disabled={!isValid}
              onClick={submitForm}
              variant="contained"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
