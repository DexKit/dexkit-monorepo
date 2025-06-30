import LazyComponent from "@dexkit/ui/components/LazyComponent";
import { AppPageSection } from "@dexkit/ui/modules/wizard/types/section";
//import LoadPlugin from "./LoadPlugin";
import { SectionToRender } from "./SectionRender";

interface Props {
  section: AppPageSection;
  useLazy?: boolean;
}

export function SectionRender({ section, useLazy }: Props) {
  if (!section?.type) {
    return <></>;
  }
  const sectionToRender = () => {
    if (section.type === "plugin") {
      // return <LoadPlugin data={section.data} path={section.pluginPath} />;
    } else {
      return SectionToRender({ section });
    }
  };
  const getSection = sectionToRender();
  if (getSection) {
    if (useLazy) {
      return <LazyComponent>{getSection}</LazyComponent>;
    } else {
      return <>{getSection}</>;
    }
  }

  return <></>;
}
