import { CustomEditorSection } from "@dexkit/ui/modules/wizard/types/section";
import { NoSsr } from "@mui/material";
import PageEditor from "../page-editor/PageEditor";

interface Props {
  section: CustomEditorSection;
}

export function CustomSection({ section }: Props) {
  return (
    <NoSsr>
      <PageEditor readOnly={true} value={section.data} />
    </NoSsr>
  );
}

export default CustomSection;
