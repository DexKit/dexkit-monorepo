import { useIsMobile } from '@dexkit/core';
import ComputerIcon from '@mui/icons-material/Computer';
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import { ToggleButton } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';

type PreviewPlatform = 'mobile' | 'desktop';

interface Props {
  type?: PreviewPlatform;
  setType?: (newType: PreviewPlatform) => void;
}

export function PreviewPlatformType({ type, setType }: Props) {
  const [alignment, setAlignment] = useState(type || 'desktop');
  const isMobile = useIsMobile();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: PreviewPlatform
  ) => {
    setAlignment(newAlignment);
    if (setType) {
      setType(newAlignment || 'desktop');
    }
  };

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        size={isMobile ? "small" : "medium"}
      >
        <ToggleButton value="desktop">
          {' '}
          <ComputerIcon fontSize={isMobile ? "small" : "medium"} />
        </ToggleButton>
        <ToggleButton value="mobile">
          {' '}
          <StayCurrentPortraitIcon fontSize={isMobile ? "small" : "medium"} />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
