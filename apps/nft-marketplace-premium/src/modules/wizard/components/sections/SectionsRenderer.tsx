import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppPageSection } from '../../types/section';

import { SectionRender } from '../section-config/SectionRender';

interface Props {
  sections: AppPageSection[];
}

export function SectionsRenderer({ sections }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sectionsToRender = sections.map((section, key) => {
    if (isMobile && section.hideMobile) {
      return null;
    }
    if (!isMobile && section.hideDesktop) {
      return null;
    }
    return <SectionRender key={key} section={section} />;
  });

  return <>{sectionsToRender}</>;
}
