import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';

import { FormattedMessage } from 'react-intl';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';

import TabContext from '@mui/lab/TabContext';

import TabPanel from '@mui/lab/TabPanel';

import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  GatedCondition,
} from '@dexkit/ui/modules/wizard/types/config';
import { useState } from 'react';
import PreviewGatedConditionsDialog from '../dialogs/PreviewGatedConditionsDialog';
import PageGatedConditionsHeader from './PageGatedConditionsHeader';
import PageGatedConditionsTab from './PageGatedConditionsTab';
import PageGatedLayoutTab from './PageGatedLayoutTab';

export interface PageGatedContentProps {
  page: AppPage;
  onSaveGatedConditions: (
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => void;
  onClose: () => void;
}

export default function PageGatedContent({
  page,
  onSaveGatedConditions,
  onClose,
}: PageGatedContentProps) {
  const [tab, setTab] = useState('conditions');

  const [showPreview, setShowPreview] = useState(false);

  const [checkedEnableProtectedPage, setCheckedEnableProtectedPage] = useState(
    page.enableGatedConditions !== undefined
      ? page.enableGatedConditions
      : true,
  );

  const handleClose = () => {
    setShowPreview(false);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <>
      {showPreview && (
        <PreviewGatedConditionsDialog
          dialogProps={{ open: showPreview, onClose: handleClose }}
          conditions={page.gatedConditions}
          gatedPageLayout={page.gatedPageLayout}
        />
      )}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageGatedConditionsHeader
              onClone={() => {}}
              onEditTitle={() => {}}
              onPreview={handlePreview}
              page={page}
              onClose={onClose}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold">
              <FormattedMessage
                id="gated.conditions"
                defaultMessage="Gated Conditions"
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TabContext value={tab}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={checkedEnableProtectedPage}
                          onChange={() => {
                            setCheckedEnableProtectedPage(
                              !checkedEnableProtectedPage,
                            );

                            onSaveGatedConditions(
                              page.gatedConditions,
                              page.gatedPageLayout,
                              !checkedEnableProtectedPage,
                            );
                          }}
                        />
                      }
                      label={
                        <FormattedMessage
                          id={'protect.page'}
                          defaultMessage={'Protect page'}
                        ></FormattedMessage>
                      }
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                    <Tab
                      value="conditions"
                      label={
                        <FormattedMessage
                          id="conditions"
                          defaultMessage="conditions"
                        />
                      }
                    />
                    <Tab
                      value="layout"
                      label={
                        <FormattedMessage id="layout" defaultMessage="Layout" />
                      }
                    />
                  </Tabs>
                </Grid>
                <Grid item xs={12}>
                  <TabPanel sx={{ p: 0, m: 0 }} value="conditions">
                    <PageGatedConditionsTab
                      onSaveGatedConditions={onSaveGatedConditions}
                      conditions={page.gatedConditions ?? []}
                    />
                  </TabPanel>
                  <TabPanel sx={{ p: 0, m: 0 }} value="layout">
                    <PageGatedLayoutTab
                      onSaveGatedLayout={(layout) =>
                        onSaveGatedConditions(undefined, layout)
                      }
                      layout={page.gatedPageLayout}
                    />
                  </TabPanel>
                </Grid>
              </Grid>
            </TabContext>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
