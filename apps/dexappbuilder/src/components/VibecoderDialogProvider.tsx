import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useConnectWalletDialog } from '../hooks/app';
import { useAppConfig } from '../hooks/app/useAppConfig';
import { useSiteId } from '../hooks/app/useSiteId';
import { useVibecoderDialog } from '../hooks/app/useVibecoderDialog';
import { QUERY_ADMIN_WHITELABEL_CONFIG_NAME, useSendConfigMutation } from '../hooks/whitelabel';
import VibecoderDialog from '../modules/wizard/components/dialogs/VibecoderDialog';

export default function VibecoderDialogProvider() {
  const vibecoderDialog = useVibecoderDialog();
  const connectWalletDialog = useConnectWalletDialog();
  const { account } = useWeb3React();
  const router = useRouter();
  const appConfig = useAppConfig();
  const siteId = useSiteId();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const site = router.query.site as string | undefined;
  const slug = site || router.query.slug as string | undefined;

  const sendConfigMutation = useSendConfigMutation({ slug });

  useEffect(() => {
    const handleOpenVibecoder = () => {
      if (!account) {
        connectWalletDialog.setOpen(true);
        return;
      }

      vibecoderDialog.setOpen(true);
    };

    window.addEventListener('openVibecoder', handleOpenVibecoder);

    return () => {
      window.removeEventListener('openVibecoder', handleOpenVibecoder);
    };
  }, [account, vibecoderDialog, connectWalletDialog]);

  const handleClose = () => {
    vibecoderDialog.setOpen(false);
  };

  const handleSaveConfig = async (partialConfig: Partial<AppConfig>) => {
    console.log('[VibecoderDialogProvider] handleSaveConfig called', {
      partialConfig,
      siteId,
      slug,
      pathname: router.pathname,
      hasAppConfig: !!appConfig
    });

    if (!siteId && !slug && router.pathname === '/') {
      enqueueSnackbar(
        <FormattedMessage
          id="vibecoder.save.redirect"
          defaultMessage="Please create an app first to save changes. Redirecting to app builder..."
        />,
        { variant: 'info' }
      );
      setTimeout(() => {
        router.push('/admin/create');
      }, 2000);
      vibecoderDialog.setOpen(false);
      return;
    }

    if (!appConfig) {
      enqueueSnackbar(
        <FormattedMessage
          id="vibecoder.save.error.no.config"
          defaultMessage="Unable to save changes. No app configuration found."
        />,
        { variant: 'error' }
      );
      return;
    }

    const hasPages = !!partialConfig.pages;
    const hasCompletePageStructure = partialConfig.pages &&
      Object.keys(partialConfig.pages).some(key => {
        const page = partialConfig.pages![key];
        return page.sections && Array.isArray(page.sections) && page.sections.length > 0;
      });

    const onlyHasPages = partialConfig.pages &&
      Object.keys(partialConfig).filter(key => key !== 'pages').length === 0;

    const isFullReplacement = hasPages && hasCompletePageStructure && onlyHasPages;

    console.log('[VibecoderDialogProvider] Replacement detection', {
      hasPages,
      hasCompletePageStructure,
      onlyHasPages,
      isFullReplacement,
      partialConfigKeys: Object.keys(partialConfig),
      pagesKeys: partialConfig.pages ? Object.keys(partialConfig.pages) : []
    });

    const mergedConfig: AppConfig = {
      ...appConfig,
      ...partialConfig,
      pages: partialConfig.pages ? (isFullReplacement
        ? partialConfig.pages
        : {
          ...appConfig.pages,
          ...Object.keys(partialConfig.pages).reduce((acc, key) => {
            const partialPage = partialConfig.pages![key];
            const existingPage = appConfig.pages?.[key];
            acc[key] = {
              ...existingPage,
              ...partialPage,
              sections: partialPage.sections || existingPage?.sections,
            };
            return acc;
          }, {} as typeof appConfig.pages),
        }
      ) : appConfig.pages,
    };

    console.log('[VibecoderDialogProvider] Merged config', {
      isFullReplacement,
      originalPagesCount: Object.keys(appConfig.pages || {}).length,
      newPagesCount: Object.keys(mergedConfig.pages || {}).length,
      mergedConfigPages: Object.keys(mergedConfig.pages || {})
    });

    try {
      console.log('[VibecoderDialogProvider] Calling sendConfigMutation...', { slug, siteId });
      const result = await sendConfigMutation.mutateAsync(
        { config: mergedConfig },
        {
          onSuccess: async () => {
            console.log('[VibecoderDialogProvider] sendConfigMutation success');
            await queryClient.invalidateQueries({ queryKey: [QUERY_ADMIN_WHITELABEL_CONFIG_NAME] });
            await queryClient.refetchQueries({ queryKey: [QUERY_ADMIN_WHITELABEL_CONFIG_NAME] });

            enqueueSnackbar(
              <FormattedMessage
                id="vibecoder.save.success"
                defaultMessage="Changes saved successfully! Refreshing page..."
              />,
              { variant: 'success' }
            );

            vibecoderDialog.setOpen(false);

            setTimeout(() => {
              router.reload();
            }, 500);
          },
          onError: (error: any) => {
            console.error('[VibecoderDialogProvider] sendConfigMutation error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
            enqueueSnackbar(
              <FormattedMessage
                id="vibecoder.save.error"
                defaultMessage={`Failed to save changes: ${errorMessage}`}
              />,
              { variant: 'error' }
            );
          },
        }
      );

      console.log('[VibecoderDialogProvider] sendConfigMutation result:', result);

      if (!sendConfigMutation.isPending && !sendConfigMutation.isError) {
        console.log('[VibecoderDialogProvider] Handling success outside onSuccess callback');
        await queryClient.invalidateQueries({ queryKey: [QUERY_ADMIN_WHITELABEL_CONFIG_NAME] });
        await queryClient.refetchQueries({ queryKey: [QUERY_ADMIN_WHITELABEL_CONFIG_NAME] });

        enqueueSnackbar(
          <FormattedMessage
            id="vibecoder.save.success"
            defaultMessage="Changes saved successfully! Refreshing page..."
          />,
          { variant: 'success' }
        );

        vibecoderDialog.setOpen(false);

        setTimeout(() => {
          router.reload();
        }, 500);
      }
    } catch (error: any) {
      console.error('[VibecoderDialogProvider] Error in handleSaveConfig catch block:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      enqueueSnackbar(
        <FormattedMessage
          id="vibecoder.save.error"
          defaultMessage={`Failed to save changes: ${errorMessage}`}
        />,
        { variant: 'error' }
      );
    }
  };

  if (!vibecoderDialog.isOpen) {
    return null;
  }

  return (
    <VibecoderDialog
      dialogProps={{
        open: vibecoderDialog.isOpen,
        onClose: handleClose,
      }}
      appConfig={appConfig}
      site={siteId?.toString() || site}
      onSaveConfig={handleSaveConfig}
    />
  );
}

