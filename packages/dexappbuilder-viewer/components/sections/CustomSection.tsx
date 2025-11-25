import { CustomEditorSection } from "@dexkit/ui/modules/wizard/types/section";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PageEditor from "../page-editor/PageEditor";

interface Props {
  section: CustomEditorSection;
}

export function CustomSection({ section }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        ...(isMobile && {
          "& .react-page-editable": {
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            maxWidth: "100% !important",
            overflowX: "hidden !important",
          },
          "& .react-page-row": {
            marginLeft: "0 !important",
            marginRight: "0 !important",
            width: "100% !important",
            maxWidth: "100% !important",
          },
          "& .react-page-cell": {
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            flexBasis: "100% !important",
            width: "100% !important",
            minWidth: "100% !important",
            maxWidth: "100% !important",
          },
          "& [class*='react-page-cell-xs-'], & [class*='react-page-cell-sm-'], & [class*='react-page-cell-md-'], & [class*='react-page-cell-lg-']": {
            flexBasis: "100% !important",
            width: "100% !important",
            minWidth: "100% !important",
            maxWidth: "100% !important",
          },
          "& .react-page-cell-inner": {
            width: "100% !important",
            maxWidth: "100% !important",
            overflowX: "hidden !important",
          },
          "& .react-page-cell-inner > *": {
            maxWidth: "100% !important",
            boxSizing: "border-box !important",
          },
          "& img, & video, & iframe, & canvas, & svg": {
            maxWidth: "100% !important",
            height: "auto !important",
          },
          "& table": {
            width: "100% !important",
            display: "block !important",
            overflowX: "auto !important",
          },
          "& p, & span, & div, & h1, & h2, & h3, & h4, & h5, & h6": {
            wordWrap: "break-word !important",
            overflowWrap: "break-word !important",
            maxWidth: "100% !important",
          },
        }),
      }}
    >
      <PageEditor readOnly={true} value={section.data} />
    </Box>
  );
}

export default CustomSection;
