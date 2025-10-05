import { Link, Typography, TypographyProps } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface AppExpandableTypographyProps {
  value: string;
  TypographyProps: TypographyProps;
}

export function AppExpandableTypography({
  value,
  TypographyProps,
}: AppExpandableTypographyProps) {
  const [expanded, setExpanded] = useState(false);

  if (!value) {
    return <></>;
  }

  return (
    <span>
      <Typography {...TypographyProps}>
        {expanded
          ? value
          : `${value.slice(0, 100)}${value.length > 100 ? '...' : ''}`}
      </Typography>
      {value.length > 100 && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          type="button"
          component="button"
          variant={TypographyProps.variant}
          sx={{ fontSize: 'inherit' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <FormattedMessage id="view.less" defaultMessage="view less" />
          ) : (
            <FormattedMessage id="view.more" defaultMessage="view more" />
          )}
        </Link>
      )}
    </span>
  );
}
