import { Link, Typography, TypographyProps, useTheme } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface AppExpandableTypographyProps {
  value: string;
  TypographyProps: TypographyProps;
  asInlineElement?: boolean;
}

export function AppExpandableTypography({
  value,
  TypographyProps,
  asInlineElement = false,
}: AppExpandableTypographyProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!value) {
    return <></>;
  }

  const textContent = expanded
    ? value
    : `${value.slice(0, 100)}${value.length > 100 ? '...' : ''}`;

  const linkElement = value.length > 100 && (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      type="button"
      component="button"
      variant={TypographyProps.variant}
      sx={{
        fontSize: 'inherit',
        color: 'primary.main'
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        <FormattedMessage id="view.less" defaultMessage="view less" />
      ) : (
        <FormattedMessage id="view.more" defaultMessage="view more" />
      )}
    </Link>
  );

  if (asInlineElement) {
    return (
      <>
        {textContent}
        {linkElement}
      </>
    );
  }

  return (
    <span>
      <Typography {...TypographyProps}>
        {textContent}
      </Typography>
      {linkElement}
    </span>
  );
}
