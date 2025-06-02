import { DexkitApiProvider } from '@dexkit/core/providers';
import {
  AppPageSection,
  SectionType,
} from '@dexkit/ui/modules/wizard/types/section';
import { Box, Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import { myAppsApi } from 'src/services/whitelabel';
import { SiteContext } from '../../providers/SiteWizardProvider';
import AddCarouselForm from '../forms/AddCarouselForm';
import AddShowCaseSectionForm from '../forms/AddShowCaseSectionForm';
import AssetSectionForm from '../forms/AssetSectionForm';
import { AssetStoreSectionForm } from '../forms/AssetStoreSectionForm';
import CallToActionSectionForm from '../forms/CallToActionSectionForm';
import CodeSectionForm from '../forms/CodeSectionForm';
import CollectionSectionForm from '../forms/CollectionSectionForm';
import CollectionSectionFormAlt from '../forms/CollectionSectionFormAlt';
import { ContractSectionForm } from '../forms/ContractSectionForm';
import DexGeneratorSectionForm from '../forms/DexGeneratorSectionForm';
import ExchangeSectionSettingsForm from '../forms/ExchangeSectionSettingsForm';
import FeaturedSectionForm from '../forms/FeaturedSectionForm';
import MDSectionForm from '../forms/MDSectionForm';
import { RankingSectionForm } from '../forms/RankingSectionForm';
import { SwapConfigSectionForm } from '../forms/SwapConfigSectionForm';
import { TokenTradeSectionForm } from '../forms/TokenTradeSectionForm';
import { UserContractForm } from '../forms/UserContractForm';
import VideoSectionForm from '../forms/VideoSectionForm';
import WalletSectionForm from '../forms/WalletSectionForm';

const ApiKeyIntegrationDialog = dynamic(
  () => import('../dialogs/ApiKeyIntegrationDialog'),
);

interface Props {
  sectionType: SectionType | undefined;
  section: AppPageSection | undefined;
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onClose: () => void;
}

export function SectionFormRender({
  section,
  sectionType,
  onSave,
  onChange,
  onClose,
}: Props) {
  const { siteId } = useContext(SiteContext);

  const [showSetApiKey, setShowSetApiKey] = useState(false);

  const handleCloseApiKey = () => {
    setShowSetApiKey(false);
  };

  const handleSetZrxApiKey = () => {
    setShowSetApiKey(true);
  };

  if (sectionType === 'video') {
    return (
      <VideoSectionForm
        onSave={onSave}
        onCancel={onClose}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'call-to-action') {
    return (
      <CallToActionSectionForm
        onSave={onSave}
        onCancel={onClose}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'featured') {
    return (
      <FeaturedSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'collections') {
    return (
      <CollectionSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'swap') {
    return (
      <>
        {showSetApiKey && (
          <ApiKeyIntegrationDialog
            DialogProps={{
              open: showSetApiKey,
              onClose: handleCloseApiKey,
              fullWidth: true,
              maxWidth: 'sm',
            }}
            siteId={siteId}
          />
        )}
        <Box>
          <Grid container spacing={2}>
            {/*<Grid item xs={12}>
              <Container>
                <Alert
                  severity="info"
                  action={
                    <Button
                      onClick={handleSetZrxApiKey}
                      variant="outlined"
                      size="small"
                    >
                      <FormattedMessage id="set.up" defaultMessage="Set up" />
                    </Button>
                  }
                >
                  <FormattedMessage
                    id="setup.your.zrx.configure.0x.text"
                    defaultMessage="Setup your 0x API key for access to our services."
                  />
                </Alert>
              </Container>
            </Grid>*/}
            <Grid item xs={12}>
              <SwapConfigSectionForm
                onCancel={onClose}
                onSave={onSave}
                onChange={onChange}
                section={section?.type === sectionType ? section : undefined}
              />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  } else if (sectionType === 'asset-store') {
    return (
      <AssetStoreSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'markdown') {
    return (
      <MDSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'wallet') {
    return (
      <WalletSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'contract') {
    return (
      <ContractSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'user-contract-form') {
    return (
      <UserContractForm
        onCancel={onClose}
        saveOnChange
        onSave={(formId, hideFormInfo) => {
          if (formId) {
            onSave({ type: 'user-contract-form', formId, hideFormInfo });
          }
        }}
        showSaveButton
        onChange={(formId, hideFormInfo) => {
          if (formId) {
            onChange({ type: 'user-contract-form', formId, hideFormInfo });
          }
        }}
        hideFormInfo={
          section?.type === 'user-contract-form'
            ? section.hideFormInfo
            : undefined
        }
        formId={
          section?.type === 'user-contract-form' ? section.formId : undefined
        }
      />
    );
  } else if (sectionType === 'exchange') {
    return (
      <ExchangeSectionSettingsForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === 'exchange' ? section : undefined}
      />
    );
  } else if (sectionType === 'code-page-section') {
    return (
      <Box p={2}>
        <CodeSectionForm
          onCancel={onClose}
          onSave={onSave}
          onChange={onChange}
          section={section?.type === 'code-page-section' ? section : undefined}
        />
      </Box>
    );
  } else if (sectionType === 'dex-generator-section') {
    return (
      <Box p={2}>
        <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
          <DexGeneratorSectionForm
            onCancel={onClose}
            onSave={onSave}
            onChange={onChange}
            section={
              section?.type === 'dex-generator-section' ? section : undefined
            }
            showSaveButton
          />
        </DexkitApiProvider.Provider>
      </Box>
    );
  } else if (sectionType === 'collection') {
    return (
      <Box p={2}>
        <CollectionSectionFormAlt
          onCancel={onClose}
          onSave={onSave}
          onChange={onChange}
          section={section?.type === 'collection' ? section : undefined}
          showSaveButton
        />
      </Box>
    );
  } else if (sectionType === 'asset-section') {
    return (
      <Box p={2}>
        <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
          <AssetSectionForm
            onCancel={onClose}
            onSave={onSave}
            onChange={onChange}
            section={section?.type === 'asset-section' ? section : undefined}
            showSaveButton
          />
        </DexkitApiProvider.Provider>
      </Box>
    );
  } else if (sectionType === 'ranking') {
    return (
      <RankingSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        saveOnChange={true}
        showSaveButton={true}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'token-trade') {
    return (
      <TokenTradeSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'carousel') {
    return (
      <AddCarouselForm
        onChange={(data) => onChange({ type: 'carousel', settings: data })}
        onCancel={onClose}
        onSave={(data) => onSave({ type: 'carousel', settings: data })}
        data={section?.type === sectionType ? section.settings : undefined}
        saveOnChange
      />
    );
  } else if (sectionType === 'showcase') {
    return (
      <AddShowCaseSectionForm
        onChange={(data) => onChange({ type: 'showcase', settings: data })}
        onCancel={onClose}
        onSave={(data) => onSave({ type: 'showcase', settings: data })}
        data={section?.type === sectionType ? section.settings : undefined}
        saveOnChange
      />
    );
  }

  return null;
}
