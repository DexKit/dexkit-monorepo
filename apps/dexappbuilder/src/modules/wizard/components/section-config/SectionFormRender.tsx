import { DexkitApiProvider } from '@dexkit/core/providers';
import { useEditWidgetId } from '@dexkit/ui/hooks/app/useEditWidgetId';
import {
  AppPageSection,
  ReferralPageSection,
  SectionType,
} from '@dexkit/ui/modules/wizard/types/section';
import { SiteContext } from '@dexkit/ui/providers/SiteProvider';
import { Box, Button, Grid, Stack } from '@mui/material';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AccordionForm } from 'src/modules/components/accordion/forms/AccordionForm';
import { MultiCardForm } from 'src/modules/components/cards/forms/MultiCardForm';
import { StepperForm } from 'src/modules/components/stepper/forms/StepperForm';
import { MultiStepperConfig } from 'src/modules/components/stepper/types/stepper';
import TabsForm from 'src/modules/components/tabs/forms/TabsForm';
import { TabsFormValues } from 'src/modules/components/tabs/types/tabs';
import { myAppsApi } from 'src/services/whitelabel';
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
import DexGeneratorReferralForm from '../forms/DexGeneratorSectionForm/DexGeneratorReferralForm';
import ExchangeSectionSettingsForm from '../forms/ExchangeSectionSettingsForm';
import FeaturedSectionForm from '../forms/FeaturedSectionForm';
import MDSectionForm from '../forms/MDSectionForm';
import { RankingSectionForm } from '../forms/RankingSectionForm';
import { SwapConfigSectionForm } from '../forms/SwapConfigSectionForm';
import { TokenTradeSectionForm } from '../forms/TokenTradeSectionForm';
import { UserContractForm } from '../forms/UserContractForm';
import VideoSectionForm from '../forms/VideoSectionForm';
import WalletSectionForm from '../forms/WalletSectionForm';
import { WidgetForm } from '../forms/WidgetForm';
import CommerceSectionForm from '../sections/CommerceSectionForm';

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
  const widgetId = useEditWidgetId();

  const [showSetApiKey, setShowSetApiKey] = useState(false);

  const [referralSection, setReferralSection] = useState<ReferralPageSection>(
    section?.type === 'referral'
      ? section
      : {
        type: 'referral',
        title: '',
        subtitle: '',
        config: {
          showStats: true,
        },
      },
  );

  useEffect(() => {
    if (section?.type === 'referral') {
      setReferralSection(section);
    }
  }, [section]);

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
            {/*<Grid size={12}>
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
            <Grid size={12}>
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
  } else if (sectionType === 'commerce') {
    return (
      <CommerceSectionForm
        onChange={(data) =>
          onChange({ type: 'commerce', settings: { content: data } })
        }
        onSubmit={(data) =>
          onSave({ type: 'commerce', settings: { content: data } })
        }
        initialValues={
          section?.type === sectionType ? section.settings.content : undefined
        }
        saveOnChange
      />
    );
  } else if (sectionType === 'referral') {
    return (
      <Box p={2}>
        <DexGeneratorReferralForm
          onChange={(updatedSection) => {
            setReferralSection(updatedSection);
            onChange(updatedSection);
          }}
          section={referralSection}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button onClick={onClose}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onSave(referralSection);
            }}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Box>
    );
  } else if (sectionType === 'widget') {
    return (
      <WidgetForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
        saveOnChange={true}
        editWidgetId={widgetId}
        showSaveButton
      />
    );
  } else if (sectionType === 'card') {
    const defaultConfig = {
      cards: [{
        id: 'card-1',
        title: 'New Card',
        description: '',
        image: '',
        actions: [{ label: '', href: '' }],
        layout: {
          x: 0,
          y: 0,
          w: 4,
          h: 2,
          minW: 2,
          maxW: 6,
          minH: 2,
          maxH: 4,
        },
      }],
      gridSettings: {
        cols: 12,
        rowHeight: 150,
        margin: [10, 10] as [number, number],
        containerPadding: [10, 10] as [number, number],
        compactType: null,
        allowOverlap: false,
        preventCollision: false,
        isDraggable: true,
        isResizable: true,
      },
      responsive: {
        breakpoints: {
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480,
          xxs: 0,
        },
        cols: {
          lg: 12,
          md: 10,
          sm: 6,
          xs: 4,
          xxs: 2,
        },
      },
    };

    return (
      <MultiCardForm
        initialValues={section?.type === 'card' ? section.settings : defaultConfig}
        onSubmit={(values) => {
          onSave({
            type: 'card',
            settings: values,
          });
        }}
        onChange={(values) => {
          onChange({
            type: 'card',
            settings: values,
          });
        }}
      />
    );
  } else if (sectionType === 'accordion') {
    const defaultConfig = {
      accordions: [{
        id: 'accordion-1',
        title: 'Accordion Item 1',
        content: 'Enter your content here...',
        summary: '',
        expanded: false,
        disabled: false,
        actions: [],
        titleVariant: 'h6' as const,
        contentVariant: 'body1' as const,
        expandIcon: 'ExpandMore',
      }],
      settings: {
        variant: 'elevation' as const,
        square: false,
        disableGutters: false,
        allowMultiple: false,
        unmountOnExit: false,
        headingComponent: 'h3' as const,
        transitionDuration: 'auto' as const,
        spacing: 1,
        fullWidth: true,
        elevation: 1,
        borderRadius: 4,
        actionsPlacement: 'details' as const,
        actionsAlignment: 'left' as const,
        defaultExpandIcon: 'ExpandMore',
        iconPosition: 'end' as const,
        hideExpandIcon: false,
        defaultTitleVariant: 'h6' as const,
        defaultContentVariant: 'body1' as const,
        disableRipple: false,
        focusRipple: true,
        defaultExpanded: [],
      },
    };

    return (
      <AccordionForm
        initialValues={section?.type === 'accordion' ? section.settings : defaultConfig}
        onSubmit={(values) => {
          onSave({
            type: 'accordion',
            settings: values,
          });
        }}
        onChange={(values) => {
          onChange({
            type: 'accordion',
            settings: values,
          });
        }}
      />
    );
  } else if (sectionType === 'stepper') {
    const defaultConfig: MultiStepperConfig = {
      steps: [{
        id: 'step-1',
        label: 'Step 1',
        content: 'Enter your step content here...',
        description: '',
        completed: false,
        optional: false,
        error: false,
        disabled: false,
        iconColor: '',
        actions: [],
      }],
      settings: {
        orientation: 'horizontal' as const,
        variant: 'elevation' as const,
        linear: true,
        alternativeLabel: false,
        elevation: 1,
        borderRadius: 4,
        square: false,
        nonLinear: false,
        allowStepSkipping: false,
        allowStepReset: false,
        mobileStepper: false,
        mobileStepperVariant: 'dots' as const,
        mobileStepperPosition: 'bottom' as const,
        mobileStepperLinearProgress: false,
        fullWidth: true,
        spacing: 2,
        padding: 24,
        showBackButton: true,
        showNextButton: true,
        showSkipButton: false,
        showResetButton: false,
        backButtonText: 'Back',
        nextButtonText: 'Next',
        skipButtonText: 'Skip',
        resetButtonText: 'Reset',
        finishButtonText: 'Finish',
        completedStepIcon: 'Check',
        errorStepIcon: 'Warning',
        hideStepIcons: false,
        customStepIcons: {},
        unmountOnExit: false,
        transitionDuration: 'auto' as const,
        validateOnNext: false,
      },
      activeStep: 0,
      completedSteps: [],
      skippedSteps: [],
    };

    // Convert StepperPageSection.settings to MultiStepperConfig format
    const getInitialValues = (): MultiStepperConfig => {
      if (section?.type === 'stepper') {
        const { steps, ...settingsWithoutSteps } = section.settings;
        return {
          steps: steps || defaultConfig.steps,
          settings: settingsWithoutSteps,
          activeStep: 0,
          completedSteps: [],
          skippedSteps: [],
        };
      }
      return defaultConfig;
    };

    return (
      <StepperForm
        initialValues={getInitialValues()}
        onSubmit={(values) => {
          onSave({
            type: 'stepper',
            settings: {
              steps: values.steps,
              ...values.settings,
            },
          });
        }}
        onChange={(values) => {
          onChange({
            type: 'stepper',
            settings: {
              steps: values.steps,
              ...values.settings,
            },
          });
        }}
      />
    );
  } else if (sectionType === 'tabs') {
    const defaultConfig: TabsFormValues = {
      tabs: [{
        label: 'Tab 1',
        content: 'Enter your tab content here...',
        icon: '',
        iconPosition: 'top',
        disabled: false,
        wrapped: false,
        tempId: crypto.randomUUID(),
      }, {
        label: 'Tab 2',
        content: 'Enter your second tab content here...',
        icon: '',
        iconPosition: 'top',
        disabled: false,
        wrapped: false,
        tempId: crypto.randomUUID(),
      }],
      orientation: 'horizontal',
      variant: 'standard',
      indicatorColor: 'primary',
      textColor: 'primary',
      centered: false,
      allowScrollButtonsMobile: false,
      scrollButtons: 'auto',
      selectionFollowsFocus: false,
      visibleScrollbar: false,
      fullWidth: false,
      borderRadius: 4,
      elevation: 0,
      padding: 16,
    };

    const getInitialValues = (): TabsFormValues => {
      if (section?.type === 'tabs') {
        const { tabs, ...restSettings } = section.settings;
        return {
          ...defaultConfig,
          ...restSettings,
          tabs: tabs?.map(tab => ({
            label: tab.label,
            content: tab.content,
            icon: tab.icon,
            iconPosition: tab.iconPosition,
            disabled: tab.disabled,
            wrapped: tab.wrapped,
            sx: tab.sx,
            tabProps: tab.tabProps,
            tempId: tab.id,
          })) || defaultConfig.tabs,
        };
      }
      return defaultConfig;
    };

    return (
      <TabsForm
        initialValues={getInitialValues()}
        onSubmit={(values: TabsFormValues) => {
          const settings = {
            id: crypto.randomUUID(),
            ...values,
            tabs: values.tabs.map((tab, index) => ({
              id: tab.tempId || `tab-${index + 1}`,
              label: tab.label,
              content: tab.content,
              icon: tab.icon,
              iconPosition: tab.iconPosition,
              disabled: tab.disabled,
              wrapped: tab.wrapped,
              sx: tab.sx,
              tabProps: tab.tabProps,
            })),
          };

          onSave({
            type: 'tabs',
            settings,
          });
        }}
        onChange={(values: TabsFormValues) => {
          const settings = {
            id: crypto.randomUUID(),
            ...values,
            tabs: values.tabs.map((tab, index) => ({
              id: tab.tempId || `tab-${index + 1}`,
              label: tab.label,
              content: tab.content,
              icon: tab.icon,
              iconPosition: tab.iconPosition,
              disabled: tab.disabled,
              wrapped: tab.wrapped,
              sx: tab.sx,
              tabProps: tab.tabProps,
            })),
          };

          onChange({
            type: 'tabs',
            settings,
          });
        }}
        onCancel={onClose}
      />
    );
  }

  return null;
}
