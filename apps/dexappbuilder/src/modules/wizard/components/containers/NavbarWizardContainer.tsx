import { AppConfig, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  MenuSettings,
  SearchbarConfig,
} from '@dexkit/ui/modules/wizard/types/config';

import { FormControl, MenuItem } from '@mui/material';
import { Field, Formik } from 'formik';
import { Select } from 'formik-mui';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import MenuSection from '../sections/MenuSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

function PagesMenuContainer({ config, onSave, onChange, onHasChanges }: Props) {
  const [menu, setMenu] = useState<MenuTree[]>(config.menuTree || []);

  const handleSave = () => {
    const newConfig = { ...config, menuTree: menu };
    onSave(newConfig);
  };

  useEffect(() => {
    const newConfig = { ...config, menuTree: menu };
    onChange(newConfig);
  }, [menu]);

  const hasChanged = useMemo(() => {
    if (config.menuTree && config.menuTree !== menu) {
      return true;
    } else {
      return false;
    }
  }, [menu, config.menuTree]);

  useMemo(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  return (
    <Grid container spacing={2}>
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

function NavbarSearchContainer({
  config,
  onSave,
  onChange,
  onHasChanges,
}: Props) {
  const [searchConfig, setSearchConfig] = useState<SearchbarConfig>(
    config?.searchbar || {
      enabled: false,
      hideCollections: false,
      hideTokens: false,
    },
  );

  const handleSave = () => {
    const newConfig = { ...config, searchbar: searchConfig };
    onSave(newConfig);
  };

  useEffect(() => {
    const newConfig = { ...config, searchbar: searchConfig };
    onChange(newConfig);
  }, [searchConfig]);

  const hasChanged = useMemo(() => {
    let diff = config?.searchbar
      ? config?.searchbar
      : {
          enabled: false,
          hideCollections: false,
          hideTokens: false,
        };

    if (diff !== searchConfig) {
      return true;
    } else {
      return false;
    }
  }, [searchConfig, config.searchbar]);

  useMemo(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  const handleEnableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setSearchConfig({
        ...searchConfig,
        enabled: event.target.checked,
        hideCollections: false,
        hideTokens: false,
      });
    } else {
      setSearchConfig({
        ...searchConfig,
        enabled: event.target.checked,
      });
    }
  };

  const handleHideCollectionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchConfig({
      ...searchConfig,
      hideCollections: event.target.checked,
    });
  };

  const handleHideTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchConfig({
      ...searchConfig,
      hideTokens: event.target.checked,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={searchConfig?.enabled}
                onChange={handleEnableChange}
              />
            }
            label={
              <FormattedMessage
                id={'enable.searchbar'}
                defaultMessage={'Enable searchbar'}
              />
            }
          />
          <FormControlLabel
            disabled={!searchConfig?.enabled}
            control={
              <Checkbox
                onChange={handleHideCollectionChange}
                checked={searchConfig?.hideCollections}
              />
            }
            label={
              <FormattedMessage
                id={'hide.collections.on.search'}
                defaultMessage={'Hide collections on search'}
              />
            }
          />
          <FormControlLabel
            disabled={!searchConfig?.enabled}
            control={
              <Checkbox
                onChange={handleHideTokenChange}
                checked={searchConfig?.hideTokens}
              />
            }
            label={
              <FormattedMessage
                id={'hide.tokens.on.search'}
                defaultMessage={'Hide tokens on search'}
              />
            }
          />
        </FormGroup>
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

const formSchema = z.object({
  layout: z
    .object({
      type: z.string(),
      variant: z.string().optional(),
    })
    .optional(),
});

export function NavbarLayoutContainer({
  config,
  onSave,
  onChange,
  onHasChanges,
}: Props) {
  const handleSubmit = async (values: MenuSettings) => {
    onSave({ ...config, menuSettings: values });
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={
        config.menuSettings
          ? {
              ...config.menuSettings,
              layout: {
                type: config.menuSettings.layout?.type || 'navbar',
                variant: config.menuSettings.layout?.variant || 'default',
              },
            }
          : {
              layout: {
                type: 'navbar',
                variant: 'default',
              },
            }
      }
      validate={(values: MenuSettings) => {
        onHasChanges(true);
        onChange({ ...config, menuSettings: values });
      }}
      validationSchema={toFormikValidationSchema(formSchema)}
    >
      {({ submitForm, values, isValid, isSubmitting }) => (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Field
                component={Select}
                name="layout.type"
                label={
                  <FormattedMessage id="menu.type" defaultMessage="Menu Type" />
                }
                fullWidth
              >
                <MenuItem value="navbar">
                  <FormattedMessage id="navbar" defaultMessage="Navbar" />
                </MenuItem>
                <MenuItem value="sidebar">
                  <FormattedMessage id="sideBar" defaultMessage="Sidebar" />
                </MenuItem>
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Field
                fullWidth
                component={Select}
                name="layout.variant"
                label={
                  <FormattedMessage id="variant" defaultMessage="Variant" />
                }
              >
                <MenuItem value="default">
                  <FormattedMessage id="default" defaultMessage="Default" />
                </MenuItem>
                {values.layout?.type === 'sidebar' && (
                  <MenuItem value="mini">
                    <FormattedMessage id="mini" defaultMessage="Mini" />
                  </MenuItem>
                )}
                {values.layout?.type === 'navbar' && (
                  <MenuItem value="alt">
                    <FormattedMessage id="alt" defaultMessage="Alt" />
                  </MenuItem>
                )}
              </Field>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  disabled={!isValid || isSubmitting}
                  onClick={submitForm}
                  variant="contained"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}

export default function NavbarWizardContainer(props: Props) {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="navbar" defaultMessage="Navbar" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="navbar.wizard.description"
              defaultMessage="Organize your app navbar. You can edit menus and searchbar"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label={<FormattedMessage id="menu" defaultMessage={'Menu'} />}
                value="1"
              />
              <Tab
                label={
                  <FormattedMessage
                    id="searchbar"
                    defaultMessage={'Searchbar'}
                  />
                }
                value="2"
              />
              <Tab
                label={<FormattedMessage id="layout" defaultMessage="Layout" />}
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <PagesMenuContainer {...props} />
          </TabPanel>
          <TabPanel value="2">
            <NavbarSearchContainer {...props} />
          </TabPanel>
          <TabPanel value="3">
            <NavbarLayoutContainer {...props} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
}
