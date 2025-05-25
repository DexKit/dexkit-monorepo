import InfoIcon from '@mui/icons-material/Info';
import { InputAdornment, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import { HELP_FIELD_TEXT } from '../constants';

interface Props {
  field:
  | 'email'
  | 'name'
  | 'domain'
  | 'favicon.url'
  | 'logo.url'
  | 'custom.primary.color'
  | 'custom.secondary.color'
  | 'custom.background.default.color'
  | 'custom.text.primary.color';
}

export function TooltipInfo(props: Props) {
  const { field } = props;
  const theme = useTheme();

  return (
    <Tooltip
      title={
        <FormattedMessage
          id={`wizard.field.${field}`}
          defaultMessage={HELP_FIELD_TEXT[field || 'email'] || ''}
          values={{ br: <br /> }}
        />
      }
    >
      <InfoIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
    </Tooltip>
  );
}

export default function InputInfoAdornment(props: Props) {
  const { field } = props;
  const theme = useTheme();

  return (
    <InputAdornment position="end" sx={{ mr: theme.spacing(0.5) }}>
      <TooltipInfo field={field} />
    </InputAdornment>
  );
}
