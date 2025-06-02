import { AppConfig, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import MenuSection from '../sections/MenuSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

export default function FooterMenuWizardContainer({
  config,
  onSave,
  onChange,
  onHasChanges,
}: Props) {
  const [menu, setMenu] = useState<MenuTree[]>(config.footerMenuTree || []);

  const handleSave = () => {
    const newConfig = { ...config, footerMenuTree: menu };
    onSave(newConfig);
  };

  useEffect(() => {
    const newConfig = { ...config, footerMenuTree: menu };
    onChange(newConfig);
  }, [menu]);

  const hasChanged = useMemo(() => {
    if (config.footerMenuTree && config.footerMenuTree !== menu) {
      return true;
    } else {
      return false;
    }
  }, [menu, config.footerMenuTree]);

  useMemo(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="footer.menu" defaultMessage="Footer Menu" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="footer.wizard.description"
              defaultMessage="Create and edit your app's footer menu"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <MenuSection menu={menu} onSetMenu={setMenu} pages={config.pages} />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanged}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
