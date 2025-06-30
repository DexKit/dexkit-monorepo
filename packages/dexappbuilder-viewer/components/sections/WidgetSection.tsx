import { useWidgetConfigQuery } from "@dexkit/ui/modules/wizard/hooks/widget";
import { WidgetPageSection } from "@dexkit/ui/modules/wizard/types/section";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { SectionsRenderer } from "../SectionsRenderer";

interface Props {
  section: WidgetPageSection;
}

export function WidgetSection({ section }: Props) {
  const widgetQuery = useWidgetConfigQuery({ id: section.config.widgetId });
  const sections = widgetQuery.data?.configParsed.page.sections;
  const isLoading = widgetQuery.isLoading;

  return (
    <>
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress size={64} />
        </Box>
      )}
      {sections && <SectionsRenderer sections={sections} />}
    </>
  );
}

export default WidgetSection;
