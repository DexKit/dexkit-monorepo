import { AppConfig, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import MenuSection from '../sections/MenuSection';
import FooterVariantsWizardContainer from './FooterVariantsWizardContainer';
import SocialWizardContainer from './SocialWizardContainer';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

function FooterMenuContainer({ config, onSave, onChange, onHasChanges }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <MenuSection menu={menu} onSetMenu={setMenu} pages={config.pages} />
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanged}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? "0.875rem" : undefined,
              py: isMobile ? 0.75 : undefined,
              px: isMobile ? 2 : undefined,
            }}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default function FooterMenuWizardContainer(props: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              fontWeight: 600,
              mb: 0.5
            }}
          >
            <FormattedMessage id="footer" defaultMessage="Footer" />
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
            <FormattedMessage
              id="footer.wizard.description"
              defaultMessage="Configure your app's footer, including menu, design variants, and social media"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="footer configuration tabs">
              <Tab
                label={<FormattedMessage id="menu" defaultMessage={'Menu'} />}
                value="1"
              />
              <Tab
                label={
                  <FormattedMessage
                    id="variants"
                    defaultMessage={'Variants'}
                  />
                }
                value="2"
              />
              <Tab
                label={<FormattedMessage id="social.media" defaultMessage="Social Media" />}
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <FooterMenuContainer {...props} />
          </TabPanel>
          <TabPanel value="2">
            <FooterVariantsWizardContainer {...props} />
          </TabPanel>
          <TabPanel value="3">
            <SocialWizardContainer {...props} isTabContext={true} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
}