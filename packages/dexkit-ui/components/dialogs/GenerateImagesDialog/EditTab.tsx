import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from "@mui/material";

import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { useEditImage, useGenerateImageContext } from "../../../hooks/ai";
import MaskEditor from "./MaskEditor";
import VariantsGrid from "./VariantsGrid";

const FormSchema = Yup.object({
  prompt: Yup.string().max(1000).required(),
  numImages: Yup.number().min(1).max(10).required(),
  mask: Yup.string().required(),
});

export interface EditTabProps {
  imageUrl: string;
  size?: { width: number; height: number };
  onMenuOption: (opt: string, { url }: { url: string }) => void;
}

export default function EditTab({
  imageUrl,
  size,
  onMenuOption,
}: EditTabProps) {
  const editImage = useEditImage();

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { addGeneratedImages } = useGenerateImageContext();

  const handleSubmit = async (values: {
    prompt: string;
    numImages: number;
    mask: string;
  }) => {
    try {
      let result = await editImage.mutateAsync({
        imageUrl,
        maskData: values.mask,
        numImages: values.numImages,
        prompt: values.prompt,
      });

      if (result) {
        addGeneratedImages(result);
      }

      enqueueSnackbar(
        formatMessage({
          defaultMessage: "Images generated",
          id: "images.generated",
        }),
        { variant: "success" }
      );
    } catch (err) {
      enqueueSnackbar(
        formatMessage({
          defaultMessage: "Error while generating images",
          id: "error.while.generating.images",
        }),
        { variant: "error" }
      );
    }
  };
  const gridSize = useMemo(() => {
    if (editImage.data) {
      if (editImage.data?.length === 1) {
        return 6;
      } else if (editImage.data.length === 2) {
        return 6;
      }
    }

    return 4;
  }, [editImage.data]);

  const renderResults = (values: any) => {
    return (
      <VariantsGrid
        amount={values.numImages || 0}
        gridSize={gridSize}
        images={editImage.data || []}
        isLoading={editImage.isLoading}
        onMenuOption={onMenuOption}
      />
    );
  };

  return (
    <Formik
      initialValues={{ prompt: "", numImages: 1, mask: "" }}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >
      {({
        setFieldValue,
        values,
        isValid,
        isSubmitting,
        errors,
        submitForm,
      }: any) => (
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={2}>
                <Stack justifyContent="center" alignItems="center">
                  <Box>
                    <MaskEditor
                      imageUrl={imageUrl}
                      size={size}
                      onChange={(value: string) => setFieldValue("mask", value)}
                      key={imageUrl}
                    />
                  </Box>
                </Stack>

                <TextField
                  label={
                    <FormattedMessage id="prompt" defaultMessage="Prompt" />
                  }
                  placeholder={formatMessage({
                    id: "change.cat.head",
                    defaultMessage: "ex. Change cat head",
                  })}
                  rows={3}
                  multiline
                  value={values.prompt}
                  onChange={(e: any) => setFieldValue("prompt", e.target.value)}
                  error={Boolean(errors.prompt)}
                  helperText={
                    Boolean(errors.prompt) ? errors.prompt : undefined
                  }
                  disabled={isSubmitting}
                />
                <TextField
                  type="number"
                  label={
                    <FormattedMessage
                      id="num.of.variants"
                      defaultMessage="Num. of variants"
                    />
                  }
                  value={values.numImages === 0 ? "" : values.numImages}
                  onChange={(e: any) => {
                    let value = parseInt(e.target.value);

                    setFieldValue("numImages", value);
                  }}
                  error={values.numImages === 0 || Boolean(errors.numImages)}
                  helperText={
                    Boolean(errors.numImages) ? errors.numImages : undefined
                  }
                  disabled={isSubmitting}
                />
                <Button
                  onClick={submitForm}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : undefined
                  }
                  disabled={!isValid || isSubmitting}
                  variant="contained"
                >
                  <FormattedMessage id="edit" defaultMessage="Edit" />
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {renderResults(values)}
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
}
