import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import ComputerIcon from '@mui/icons-material/Computer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ToggleButton } from '@mui/material';
import { useState } from 'react';

type PreviewPlatform = 'mobile' | 'desktop';

interface Props {
  type?: PreviewPlatform;
  setType?: (newType: PreviewPlatform) => void;
}

export function PreviewPlatformType({ type, setType }: Props) {
  const [alignment, setAlignment] = useState(type || 'desktop');

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
      >
        <ToggleButton value="desktop">
          {' '}
          <ComputerIcon />
        </ToggleButton>
        <ToggleButton value="mobile">
          {' '}
          <StayCurrentPortraitIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
